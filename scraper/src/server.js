//import { ScrapeController } from "./services/scraper.js";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import { router } from "./routes/scraper_routes.js";
import { ScrapeController } from "./controller/scraperController.js";

dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || "3000", 10);
const host = "0.0.0.0"; //enable access from outside the container
const scrapeController = new ScrapeController();

app.use(bodyParser.json());
app.use(express.json());
app.use(cors());
app.use(router);

(async () => {
  try {
    // Launch scraper
    await scrapeController.initialize();

    // Start server and listen
    app.listen(PORT, host, function () {
      console.log(`starting app on port: ${PORT}`);
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
