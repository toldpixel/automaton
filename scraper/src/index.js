import { ScrapeController } from "./services/scraper.js";

const sc = new ScrapeController();

try {
  await sc.initialize();
  await sc.start();
} catch (error) {
  console.error(error);
}
