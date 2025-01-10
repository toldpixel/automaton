import express from "express";
import {
  createScrapeResult,
  getScrapeResultById,
  updateScrapeResult,
  deleteScrapeResult,
  getAllScrapeResults,
} from "../controller/resultController";

export const router = express.Router();

// ChatGPT Boilerplate
// Route to get all scrape results without pagination
router.get("/api/results", getAllScrapeResults);

// Route to create a new scrape result
router.post("/api/results", createScrapeResult);

// Route to get a scrape result by ID
router.get("/api/results/:id", getScrapeResultById);

// Route to update a scrape result by ID
router.put("/api/results/:id", updateScrapeResult);

// Route to delete a scrape result by ID
router.delete("/api/results/:id", deleteScrapeResult);
