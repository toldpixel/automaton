import { Response, Request } from "express";
import { SchedulerModel } from "../models/schedulerModel";
import { JobInformation } from "../types/job";

const store = new SchedulerModel();

export const getJobs = async (_req: Request, res: Response) => {
  try {
    const allJobs = await store.index();
    res.status(200).json(allJobs);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
};

export const enqueueJob = async (
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
};
