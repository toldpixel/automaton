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
        addedAt: new Date().toLocaleString("en-US", {
          month: "2-digit",
          day: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        }),
      },
      result: scrapeResult,
    };

    //! For scheduler repeatable jobs should not add new jobs on same id but update the old job
    const filter = { "Metadata.id": jobData.Metadata.id }; // Check if Metadata.id matches
    const options = { upsert: true, new: true }; // upsert: create if not found; new: return updated document

    // Find an existing document with the same Metadata.id and update it or create a new one
    const savedResult = await ScrapeResultModel.findOneAndUpdate(
      filter, // Filter to match existing document
      newResult, // Data to update or insert
      options // Options to control behavior
    );

    return savedResult;
  } catch (error) {
    console.error("Error saving Data to MongoDB", error);
    throw new Error("Error saving Data to MongoDB");
  }
}
