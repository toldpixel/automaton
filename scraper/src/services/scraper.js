import { chromium } from "playwright";

// general control of the scraper init, start, open page, close page, set url
export class ScrapeController {
  constructor() {
    this.browser = null;
    this.scraper = null;
    this.pageCount = 0;
    this.pages = [];
  }

  //initialize puppeteer and the scraper
  async initialize() {
    this.browser = await chromium.launch({
      headless: true,
    });
    this.scraper = new Scraper(this.browser);
  }

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
  async start() {
    try {
      if (!this.browser) {
        throw new Error("Browser not initilized!");
      }

      const selectors = {};
      const url = "https://www.vultr.com/pricing/#cloud-gpu";
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
      const data = await this.scraper.extractData();
      console.log("Scraped data: ", data);
    } catch (error) {
      console.error(error);
    } finally {
      await this.closePage(newPage.id);
      console.log("Page closed: " + newPage.id);
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

  async extractData() {
    console.log("...scraping");
    try {
      if (!this.page) {
        throw new Error("Page is not set, set Page first!");
      }

      const selector = `#cloud-gpu > div:nth-child(5)`;

      await this.page.waitForSelector(selector);

      const extractedText = await this.page.locator(selector).textContent();

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
