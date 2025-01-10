import { chromium } from "playwright";
import { Worker, Job } from "bullmq";
import dotenv from "dotenv";
//import { workerHandler } from "../jobs/job-handler.js";
dotenv.config();
// general control of the scraper init, start, open page, close page, set url
export class ScrapeController {
  constructor() {
    this.browser = null; // playwright browser
    this.scraper = null;
    this.worker = null; // bullmq worker
    this.pageCount = 0;
    this.pages = [];
  }

  //initialize puppeteer, bullmq worker and the scraper
  async initialize() {
    this.startWorker();
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
      await this.scrapeURL(url, selectors);
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
      const data = await this.scraper.extractData(selectors); // pass selectors
      console.log("Scraped data: ", data);
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
          const result = await this.startScrape(
            job.data.url,
            job.data.selectors
          );
          return result;
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
    });

    this.worker.on("failed", (job, err) => {
      console.error(`Job ${job.id} failed with error:`, err.message);
    });

    this.worker.on("progress", (job, progress) => {
      // Do something with the return value.
      console.log(job.data, progress);
    });
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

      await this.page.waitForSelector(selectors);

      const extractedText = await this.page.locator(selectors).textContent();

      return cleanWhitespace(extractedText);
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
