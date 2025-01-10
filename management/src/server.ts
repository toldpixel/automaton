import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { index_routes } from "./routes/index_routes";
import { PrismaClient } from "@prisma/client";
import { dbConnect } from "./config/db";

const prisma = new PrismaClient();

const app = express();
const PORT = parseInt(process.env.PORT || "3000", 10);
const host = "0.0.0.0"; //enable access from outside the container

app.use(bodyParser.json());
app.use(express.json());
app.use(cors());
app.use(index_routes);

(async () => {
  try {
    await prisma.$connect();
    console.log("Prisma connected successfully!");
    await dbConnect();
    console.log("Mongoose connected successfully!");
    app.listen(PORT, host, function () {
      console.log(`starting app on port: ${PORT}`);
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
