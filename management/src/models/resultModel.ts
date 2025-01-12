import { DeleteResult, Document, model, Schema } from "mongoose";
import { ScrapeResultModel } from "../config/db";
import { ScrapeResult } from "../types/result";

// Store Class for ScrapeResult
export class ScrapeResultStore {
  // Get all scrape results
  async index(): Promise<ScrapeResult[]> {
    try {
      const allResults = await ScrapeResultModel.find();
      return allResults as ScrapeResult[];
    } catch (error) {
      console.error("Error fetching scrape results:", error);
      throw new Error("Failed to retrieve scrape results");
    }
  }

  // Get all Scrape results according to requested Ids
  async getListOfResults(listOfResultIds: string[]): Promise<ScrapeResult[]> {
    try {
      const results = await ScrapeResultModel.find({
        id: { $in: listOfResultIds },
      });

      return results as ScrapeResult[];
    } catch (error) {
      console.error("Error fetching scrape results:", error);
      throw new Error("Failed to retrieve scrape results");
    }
  }

  // Create a new scrape result
  async create(result: ScrapeResult): Promise<ScrapeResult> {
    try {
      const newResult = await ScrapeResultModel.create(result);
      return newResult.toObject() as ScrapeResult;
    } catch (error) {
      console.error("Error creating scrape result:", error);
      throw new Error("Failed to create scrape result");
    }
  }

  // Get a scrape result by ID
  async show(id: string): Promise<ScrapeResult | null> {
    try {
      const result = await ScrapeResultModel.findById(id);
      if (!result) {
        throw new Error("Scrape result not found");
      }
      return result.toObject() as ScrapeResult;
    } catch (error) {
      console.error("Error fetching scrape result by ID:", error);
      throw new Error("Failed to retrieve scrape result");
    }
  }

  // Update a scrape result by ID
  async update(
    id: string,
    updatedResult: Partial<ScrapeResult>
  ): Promise<ScrapeResult | null> {
    try {
      const result = await ScrapeResultModel.findByIdAndUpdate(
        id,
        updatedResult,
        {
          new: true, // Return the updated document
          runValidators: true, // Ensure validators are run
        }
      );
      if (!result) {
        throw new Error("Scrape result not found");
      }
      return result.toObject() as ScrapeResult;
    } catch (error) {
      console.error("Error updating scrape result:", error);
      throw new Error("Failed to update scrape result");
    }
  }

  // Delete a scrape result by ID
  async delete(id: string): Promise<ScrapeResult | null> {
    try {
      const result = await ScrapeResultModel.findByIdAndDelete(id);
      if (!result) {
        throw new Error("Scrape result not found");
      }
      return result.toObject() as ScrapeResult;
    } catch (error) {
      console.error("Error deleting scrape result:", error);
      throw new Error("Failed to delete scrape result");
    }
  }

  async deleteSelected(list: string[]): Promise<DeleteResult | number> {
    try {
      const result = await ScrapeResultModel.deleteMany({
        id: { $in: list },
      });

      if (result.deletedCount === 0) {
        console.error("Nothing deletes from selected");
        return 0;
      }

      return result;
    } catch (error) {
      console.error("Error deleting scrape result:", error);
      throw new Error("Failed to delete scrape result");
    }
  }
}
