//import { ScrapeController } from "./services/scraper.js";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import { createServer } from "http";
import { ScrapeController } from "./controller/scraperController.js";
import { dbConnect } from "./config/db.js";
import { Server } from "socket.io";
dotenv.config();
const app = express();
const server = createServer(app);
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const PORT = parseInt(process.env.PORT, 10);
const host = "0.0.0.0"; //enable access from outside the container
const scrapeController = new ScrapeController();

(async () => {
  try {
    // Launch scraper
    //await scrapeController.initialize(io); // pass socket
    await scrapeController.initialize(io);

    //initialize once
    //establish a socket communication first
    io.on("connection", async (socket) => {
      console.log("a user connected...");
      socket.emit("worker-ready", { status: "Worker is ready" });

      socket.on("disconnect", () => {
        console.log(`Socket.IO connection ${socket.id} disconnected`);
      });
      scrapeController.handleSocketEvents(socket);
    });

    // Launch database connection
    await dbConnect();

    // Start server and listen
    server.listen(PORT, host, function () {
      console.log(`starting app on port: ${PORT}`);
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
