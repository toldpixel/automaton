import dotenv from "dotenv";
import { Worker, Job } from "bullmq";
dotenv.config();

export const workerHandler = new Worker(
  "myqueue",
  async (job) => {
    try {
      console.log(`Processing job ${job.id} with data:`, job.data);
      //const result = await scrapeWebsite(job.data.url);
      const result = true;
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
workerHandler.on("ready", () => {
  console.log("Worker connected to Redis and ready to process jobs.");
});

workerHandler.on("failed", (job, err) => {
  console.error(`Job ${job.id} failed with error:`, err.message);
});

workerHandler.on("progress", (job, progress) => {
  // Do something with the return value.
  console.log(job.data, progress);
});
