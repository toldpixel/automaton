import { Request, Response } from "express";
import { ScrapeResultStore } from "../models/resultModel";
import { json2csv } from "json-2-csv";

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

// Converts the requested ids to a csv with data
// uses json-2-csv
export const getDataInCSV = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const list = req.body;
    if (!Array.isArray(list) || list.length === 0) {
      res.status(400).json({ error: "At least one valid ID please!" });
    }
    const resultList = await store.getListOfResults(list);

    if (resultList.length === 0) {
      res.status(404).json({ error: "No results found for the provided IDs." });
    }

    // Flatten the results so that its all unpacked in a single object
    // for json-2-csv to convert
    const flattenedResults = resultList.flatMap((result) => {
      const { id, url, Metadata, result: scrapes } = result;

      return (
        scrapes?.map((scrape) => ({
          id,
          url,
          metadataId: Metadata?.id || "Unknown",
          priority: Metadata?.priority || "Unknown",
          gpu: scrape.gpu || "N/A",
          storage: scrape.storage || "N/A",
          network: scrape.network || "N/A",
          egress: scrape.egress || "N/A",
          price_monthly: scrape.price_monthly || "N/A",
          price_hourly: scrape.price_hourly || "N/A",
        })) || []
      );
    });

    const csvOptions = {
      keys: [
        { field: "id", title: "ID" },
        { field: "url", title: "URL" },
        { field: "metadataId", title: "Metadata ID" },
        { field: "priority", title: "Priority" },
        { field: "gpu", title: "GPU" },
        { field: "storage", title: "Storage" },
        { field: "network", title: "Network" },
        { field: "egress", title: "Egress" },
        { field: "price_monthly", title: "Price (Monthly)" },
        { field: "price_hourly", title: "Price (Hourly)" },
      ],
    };

    const csv = await json2csv(flattenedResults, csvOptions);

    res.header("Content-Type", "text/csv");
    res.attachment("scrape_results.csv");
    res.send(csv);
  } catch (error) {
    console.error("Error converting to csv:", error);
    res.status(500).json({ error: `Failed to convert to csv: ${error}` });
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
