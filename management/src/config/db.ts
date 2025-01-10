import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const scrapeSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  gpu: {
    type: String,
  },
  storage: {
    type: String,
  },
  network: {
    type: String,
  },
  egress: {
    type: String,
  },
  price_monthly: {
    type: String,
  },
  price_hourly: {
    type: String,
  },
});

const metadataSchema = new mongoose.Schema({
  id: {
    type: String,
  },
  priority: {
    type: String,
    enum: ["high", "medium", "low", ""], // Only allow these values
  },
  scheduleFrequency: {
    type: String,
  },
  addedAt: {
    type: String,
  },
});

const finishedJobSchema = new mongoose.Schema({
  id: {
    type: String,
  },
  url: {
    type: String,
  },
  selectors: {
    type: mongoose.Schema.Types.Mixed,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  metadataId: {
    type: String,
  },
  Metadata: {
    type: metadataSchema,
  },
  result: {
    type: [scrapeSchema],
  },
});

export const ScrapeResultModel = mongoose.model("Scrape", finishedJobSchema);

export async function dbConnect() {
  try {
    const uri = `mongodb://${encodeURIComponent(
      process.env.MONGODB_USER as string
    )}:${encodeURIComponent(process.env.MONGODB_PASS as string)}@${
      process.env.MONGO_DB
    }:27017/${process.env.MONGODB_DB}?authSource=admin`;
    const conn = await mongoose.connect(uri);
    console.log("Mongoose connected to Database");
    return conn;
  } catch (error) {
    console.log("could not connect to db!");
    console.error(error);
    process.exit(1);
  }
}
