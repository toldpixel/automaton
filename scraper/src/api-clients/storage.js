import { ScrapeResultModel } from "../config/db.js";

export async function saveResultToDB(scrapeResult, jobData) {
  try {
    const newResult = {
      id: jobData.id,
      url: jobData.url,
      selectors: jobData.selectors,
      createdAt: jobData.createdAt,
      metadataId: jobData.metadataId,
      Metadata: {
        id: jobData.Metadata.id,
        priority: jobData.Metadata.priority,
        scheduleFrequency: jobData.Metadata.scheduleFrequency,
        addedAt: jobData.Metadata.addedAt,
      },
      result: scrapeResult,
    };
    const savedResult = await ScrapeResultModel.create(newResult);
    return savedResult;
  } catch (error) {
    console.error("Error saving Data to MongoDB", error);
    throw new Error("Error saving Data to MongoDB");
  }
}
