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

app.use(bodyParser.json());
app.use(express.json());
app.use(cors());
app.use(router);

(async () => {
  // Initialize the scraper
  const sc = new ScrapeController();
  try {
    await sc.initialize();
    await sc.start();
  } catch (error) {
    console.error(error);
  }

  // Start server and listen
  try {
    app.listen(PORT, host, function () {
      console.log(`starting app on port: ${PORT}`);
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();

/**/
