import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { router } from "./routes/scheduler_routes";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || "3000", 10);
const host = "0.0.0.0"; //enable access from outside the container

app.use(bodyParser.json());
app.use(express.json());
app.use(cors());
app.use(router);

(async () => {
  try {
    app.listen(PORT, host, function () {
      console.log(`starting app on port: ${PORT}`);
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
