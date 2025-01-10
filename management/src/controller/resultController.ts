import { Request, Response } from "express";
import { ScrapeResultStore } from "../models/resultModel";

const store = new ScrapeResultStore();

// Get all scrape results without pagination
export const getAllScrapeResults = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const results = await store.index();
    res.status(200).json(results);
  } catch (error) {
    console.error("Error fetching scrape results:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Create a new scrape result
export const createScrapeResult = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const newResult = await store.create(req.body);
    res.status(201).json(newResult);
  } catch (error) {
    console.error("Error creating scrape result:", error);
    res.status(500).json({ error: "Failed to create scrape result" });
  }
};

// Get a specific scrape result by ID
export const getScrapeResultById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const result = await store.show(id);
    if (!result) {
      res.status(404).json({ error: "Scrape result not found" });
      return;
    }
    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching scrape result:", error);
    res.status(500).json({ error: "Failed to fetch scrape result" });
  }
};

// Update a scrape result by ID
export const updateScrapeResult = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const updatedResult = await store.update(id, req.body);

    if (!updatedResult) {
      res.status(404).json({ error: "Scrape result not found" });
      return;
    }
    res.status(200).json(updatedResult);
  } catch (error) {
    console.error("Error updating scrape result:", error);
    res.status(500).json({ error: "Failed to update scrape result" });
  }
};

// Delete a scrape result by ID
export const deleteScrapeResult = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const deletedResult = await store.delete(id);
    if (!deletedResult) {
      res.status(404).json({ error: "Scrape result not found" });
      return;
    }
    res.status(200).json({ message: "Scrape result deleted successfully" });
  } catch (error) {
    console.error("Error deleting scrape result:", error);
    res.status(500).json({ error: "Failed to delete scrape result" });
  }
};
