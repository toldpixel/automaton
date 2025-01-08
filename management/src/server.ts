import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { router } from "./routes/management_routes";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const app = express();
const port = 3000;
const host = "127.0.0.1";

app.use(bodyParser.json());
app.use(express.json());
app.use(cors());
app.use(router);

(async () => {
  try {
    await prisma.$connect();
    console.log("Prisma connected successfully!");
    app.listen(port, host, function () {
      console.log(`starting app on port: ${port}`);
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
