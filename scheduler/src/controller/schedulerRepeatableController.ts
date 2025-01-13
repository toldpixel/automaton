import { Response, Request } from "express";
import { SchedulerModel } from "../models/schedulerModel";
import { JobInformation } from "../types/job";

const schedulerModel = new SchedulerModel();

// ChatGPT Boilerplate

/**
 * Get all repeatable jobs
 */
export const getAllRepeatableJobs = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const repeatableJobs = await schedulerModel.index();
    res.status(200).json({ success: true, data: repeatableJobs });
  } catch (error) {
    console.error("Error fetching repeatable jobs:", error);
    res.status(500).json({ success: false, error: error });
  }
};

/**
 * Create a new job
 */
export const createRepeatableJob = async (
  req: Request,
  res: Response
): Promise<void> => {
  const job: JobInformation = req.body;

  if (!job || !job.Metadata || !job.Metadata.scheduleFrequency) {
    res.status(400).json({
      success: false,
      error:
        "Invalid job data. Ensure metadata and scheduleFrequency are provided.",
    });
    return;
  }

  try {
    const createdJob = await schedulerModel.create(job);
    if (!createdJob) {
      res.status(400).json({ success: false, error: "Failed to create job." });
      return;
    }
    res.status(201).json({ success: true, data: createdJob });
  } catch (error) {
    console.error("Error creating job:", error);
    res.status(500).json({ success: false, error: error });
  }
};

/**
 * Remove repeatable job by key
 */
export const removeRepeatableJob = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { key } = req.params;
  console.log(key);
  try {
    const removed = await schedulerModel.removeRepeatableJob(key);
    if (!removed) {
      res.status(404).json({
        success: false,
        error: "Repeatable job not found or already removed.",
      });
      return;
    }
    res.status(200).json({
      success: true,
      message: `Repeatable job with key ${key} removed successfully.`,
    });
  } catch (error) {
    console.error(`Error removing repeatable job with key ${key}:`, error);
    res.status(500).json({ success: false, error: error });
  }
};

/**
 * Debug works
 */
/*export const enqueueJob = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id, url, selectors, metadataId, createdAt, Metadata } = req.body;
    if (!url || !selectors || !Metadata || !metadataId || !createdAt) {
      res.status(500).json({ error: "Job incomplete" });
      return;
    }

    const newJob: JobInformation = {
      id: id,
      url: url,
      selectors: selectors,
      metadataId: metadataId,
      createdAt: createdAt,
      metadata: Metadata,
    };

    const createdStorage = await store.create(newJob);
    res.status(201).json(createdStorage);
  } catch (error) {
    console.error("Error adding Website:", error);
    res.status(500).json({ error: "Failed to add Website" });
  }
};*/
