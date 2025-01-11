import { chromium } from "playwright";
import { Worker } from "bullmq";
import OpenAI from "openai";
import dotenv from "dotenv";
import { saveResultToDB } from "../api-clients/storage.js";

dotenv.config();

// use chatGPTs assistant
const openai = new OpenAI();
// general control of the scraper init, start, open page, close page, set url
export class ScrapeController {
  constructor() {
    this.io = null;
    this.browser = null; // playwright browser
    this.scraper = null;
    this.assistant = null; // chatGPT assistant
    this.assistantThread = null;
    this.worker = null; // bullmq worker
    this.pageCount = 0;
    this.pages = [];
  }

  //initialize puppeteer, bullmq worker and the scraper
  async initialize(io) {
    this.io = io;
    await this.retrieveAssistant(); // Get ChatGPT Assistant
    await this.createAssistantThread(); // Create ChatGPT Assistant Thread for sending messages
    await this.startWorker();
    this.browser = await chromium.launch({
      headless: true,
    });
    this.scraper = new Scraper(this.browser);
  }

  //TODO configure worker here
  /*async workerConfig() {
    this.worker.on("failed", (job, err) => {
      console.error(`Job ${job.id} failed with error:`, err.message);
    });
  }*/

  //tracks the open pages
  async openNewPage() {
    try {
      this.pageCount++;
      const newPage = await this.browser.newPage();
      if (!newPage) {
        throw new Error("Error creating Browser Page");
      }
      this.pages.push({ id: this.pageCount, page: newPage });
      console.log("New Browser Page created! id: ", this.pageCount);
      return { id: this.pageCount, page: newPage };
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  //close particular page
  async closePage(id) {
    try {
      const foundPage = this.pages.find((elem) => elem.id === id);
      if (!foundPage) {
        throw new Error("Page id not found!");
      }
      const indexOfPage = this.pages.findIndex((elem) => elem.id === id);
      if (indexOfPage === -1) {
        throw new Error("Index of Page not found!");
      }
      await foundPage.page.close();
      this.pages.splice(indexOfPage, 1);
      console.log("Browser Page closed id: " + foundPage.id);
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  //launch the scraper
  async startScrape(url, selectors) {
    try {
      if (!this.browser) {
        throw new Error("Browser not initilized!");
      }

      if (!url || !selectors) {
        console.error("No url or selectors set!");
        throw new Error("No url or selectors set!");
      }
      const scrapeResult = await this.scrapeURL(url, selectors); //pa
      return scrapeResult;
    } catch (error) {
      console.error(error);
    } finally {
      if (this.browser) await this.browser.close();
      console.log("Browser closed.");
    }
  }

  //scrapes the url and specified selector
  async scrapeURL(url, selectors) {
    const newPage = await this.openNewPage();
    try {
      console.log(`Navigating to ${url}`);
      await newPage.page.goto(url, { waitUntil: "domcontentloaded" }); // wait till the content is loaded
      this.scraper.setPage(newPage.page);
      const scrapedJsonData = await this.scraper.extractData(selectors); // pass selectors, and get back json format
      const assistantData = this.assistantMessage(scrapedJsonData); // pass the scraped data to ChatGPT Assistant for json
      return assistantData;
    } catch (error) {
      console.error(error);
    } finally {
      await this.closePage(newPage.id);
      console.log("Page closed: " + newPage.id);
    }
  }

  // initialize worker
  async startWorker() {
    this.worker = new Worker(
      "myqueue",
      async (job) => {
        try {
          console.log(`Processing jobID ${job.id} with data:`, job.data);
          const scrapeResult = await this.startScrape(
            job.data.url,
            job.data.selectors
          );

          const savedResult = saveResultToDB(scrapeResult, job.data);

          this.io.emit("scrape:completed", {
            jobId: job.id,
            result: scrapeResult,
          });

          return savedResult;
        } catch (error) {
          console.error(`Error processing job ${job.id}:`, error);
          throw error;
        }
      },
      {
        connection: {
          host: process.env.REDIS_HOST,
          port: 6379,
        },
      }
    );

    //Lifecycle events

    this.worker.on("ready", () => {
      console.log("Worker connected to Redis and ready to process jobs.");
      this.io.emit("worker-ready", { status: "Worker is ready" });
    });

    this.worker.on("completed", (job, returnvalue) => {
      console.log(`Job ${job.id} completed with return value:`, returnvalue);
      this.io.emit("worker-progress", {
        jobId: job.id,
        progress,
        status: "Job in progress",
      });
    });

    this.worker.on("progress", (job, progress) => {
      console.log(`Job ${job.id} progress:`, progress);
      this.io.emit("worker-progress", {
        jobId: job.id,
        progress,
        status: "Job in progress",
      });
    });

    this.worker.on("failed", (job, err) => {
      console.error(`Job ${job.id} failed with error:`, err.message);
      this.io.emit("worker-failed", {
        jobId: job.id,
        error: err.message,
        status: "Job failed",
      });
    });

    this.worker.on("error", (err) => {
      console.error("Worker encountered an error:", err);
      this.io.emit("worker-error", { error: err.message });
    });
  }

  async retrieveAssistant() {
    try {
      const retrievedAssistant = await openai.beta.assistants.retrieve(
        process.env.OPENAI_ASSISTANT_ID
      );
      if (!retrievedAssistant) {
        console.error("Couldnt retrieve assistant");
        throw new Error("Couldnt retrieve assistant");
      }
      this.assistant = retrievedAssistant;
      console.log(retrievedAssistant);
    } catch (error) {
      console.error(error);
      throw Error(error);
    }
  }

  async createAssistantThread() {
    try {
      const newThread = await openai.beta.threads.create({
        messages: [],
      });
      if (!newThread) {
        console.error("Couldnt create thread");
        throw new Error("Couldnt create thread");
      }
      this.assistantThread = newThread;
      console.log("Assistant thread created:", this.assistantThread);
    } catch (error) {
      console.error("Error creating assistant thread:", error);
      throw Error(error);
    }
  }

  async retrieveAssistantThread(threadId) {
    try {
      // Retrieve the thread using the provided thread ID
      const myThread = await openai.beta.threads.retrieve(threadId);
      if (!myThread) {
        console.error("Couldnt retrieve thread");
        throw new Error("Couldnt retrieve thread");
      }
      this.assistantThread = myThread;
      console.log(myThread);
    } catch (error) {
      console.error("Error retrieving assistant thread:", error);
      throw Error(error);
    }
  }

  async deleteAssitantThread() {
    try {
      if (this.assistantThread) {
        // Delete the thread using the provided thread ID
        const response = await this.openai.beta.threads.delete(
          this.assistantThread.id
        );
        console.log("Assistant thread deleted:", response);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error deleting assistant thread:", error);
      throw Error(error);
    }
  }

  // ChatGPT Messaging
  async assistantMessage(inputText) {
    console.log(this.assistantThread);
    console.log("Text is passed to ChatGPT Assistant");
    if (!this.assistantThread) {
      console.error("Assistant thread not created!");
      throw Error("Assistant thread not created!");
    }

    try {
      const response = await openai.beta.threads.messages.create(
        this.assistantThread.id,
        {
          role: "user",
          content: inputText,
        }
      );

      console.log("Message response: ", response);

      const run = await openai.beta.threads.runs.create(
        this.assistantThread.id,
        { assistant_id: this.assistant.id }
      );

      console.log("Runner initialized: ", run);

      // Poll for completion status
      const pollingInterval = 2000; // Check every 2 seconds
      const maxRetries = 30; // Stop polling after 30 attempts (1 minute)

      let attempt = 0;
      let runStatus = run.status;

      const assistantResponse = await polling(
        attempt,
        maxRetries,
        pollingInterval,
        runStatus,
        run
      );

      return assistantResponse;
    } catch (error) {
      console.error("Assistant failed to send message");
      throw new Error(error);
    }
  }
}

// scraping and extraction of data from url's
export class Scraper {
  constructor(browser) {
    this.page = null;
    this.browser = browser;
  }

  setPage(page) {
    this.page = page;
  }

  getPage() {
    return this.page;
  }

  async extractData(selectors) {
    console.log("...scraping");
    try {
      if (!this.page) {
        throw new Error("Page is not set, set Page first!");
      }
      // wait till the specific selector appears - deprecated (docs) still works :)
      await this.page.waitForSelector(selectors);

      const extractedHTML = await this.page.locator(selectors).innerHTML();
      const compressedHtml = extractedHTML
        .replace(/\s{2,}/g, " ")
        .replace(/\n/g, "")
        .trim();
      //cleanWhitespace(extractedText); //! only use for text scrapes textContent()
      return compressedHtml;
    } catch (error) {
      console.error(error);
      throw Error(error);
    }
  }
}

// Helper function (ChatGPT)
function cleanWhitespace(data) {
  return data
    .replace(/\n\s*\n/g, "\n") // Remove consecutive blank lines
    .replace(/^\s+/gm, "") // Remove leading whitespace on each line
    .replace(/\s+$/gm, "") // Remove trailing whitespace on each line
    .replace(/\s+/g, " "); // Replace multiple spaces with a single space
}

// Helper assistant (ChatGPT) adjusted
async function polling(attempt, maxRetries, pollingInterval, runStatus, run) {
  console.log(run);
  const result = [];
  while (attempt < maxRetries) {
    console.log(`Polling attempt ${attempt + 1}: Status - ${runStatus}`);

    if (runStatus === "completed") {
      console.log("Run completed. Retrieving messages...");

      // Retrieve messages from the thread see docs
      const messages = await openai.beta.threads.messages.list(run.thread_id);

      for (const message of messages.data.reverse()) {
        console.log(`${message.role} > ${message.content[0].text.value}`);
        if (message.role === "assistant") {
          try {
            const parsedData = JSON.parse(message.content[0].text.value);

            if (parsedData && Array.isArray(parsedData.instances)) {
              result.push(...parsedData.instances);
            } else {
              console.error(
                "Parsed data is not in the expected format:",
                parsedData
              );
            }
          } catch (error) {
            console.error("Failed to parse JSON:", error);
          }
        }
      }

      console.log("Final Result Array:", result);

      const assistantResponse = messages.data[messages.data.length - 1];
      console.log("Assistant Response: ", assistantResponse);
      return result;
    }

    // Error checking when failed
    if (
      runStatus === "failed" ||
      runStatus === "cancelled" ||
      runStatus === "expired"
    ) {
      console.error(`Run terminated with status: ${runStatus}`);
      throw new Error(`Run terminated unexpectedly with status: ${runStatus}`);
    }

    if (runStatus === "requires_action") {
      console.warn("Run requires user action. Exiting polling.");
      throw new Error(
        "Run requires action. Please check the assistant configuration."
      );
    }

    if (runStatus === "incomplete") {
      console.warn("Run incomplete. Retrying...");
    }

    // Wait before the next poll
    await new Promise((resolve) => setTimeout(resolve, pollingInterval));

    // Fetch the latest run status
    console.log(run.thread_id);
    const updatedRun = await openai.beta.threads.runs.retrieve(
      run.thread_id,
      run.id
    );
    runStatus = updatedRun.status;
    attempt++;
  }
  console.error(
    "Polling timed out. Run did not complete within the expected time."
  );
  throw new Error(
    "Run did not complete successfully within the timeout period."
  );
}
