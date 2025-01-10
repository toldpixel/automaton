import { Response, Request } from "express";
import { SchedulerModel } from "../models/schedulerModel";
import { JobInformation } from "../types/job";

const schedulerModel = new SchedulerModel();

/**
 * Create a new non-repeatable job
 */
export const createNonRepeatableJob = async (
  req: Request,
  res: Response
): Promise<void> => {
  const job: JobInformation = req.body;

  if (!job || !job.Metadata) {
    res.status(400).json({
      success: false,
      error: "Invalid job data. Ensure metadata is provided.",
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
    console.error("Error creating non-repeatable job:", error);
    res.status(500).json({ success: false, error: error });
  }
};

/**
 * Get a non-repeatable job by ID
 */
export const getNonRepeatableJobById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  try {
    const job = await schedulerModel.getJobById(id);
    if (!job) {
      res.status(404).json({ success: false, error: "Job not found." });
      return;
    }
    res.status(200).json({ success: true, data: job });
  } catch (error) {
    console.error(`Error fetching non-repeatable job with ID ${id}:`, error);
    res.status(500).json({ success: false, error: error });
  }
};

/**
 * Delete a non-repeatable job by ID
 */
export const deleteNonRepeatableJobById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  try {
    const deleted = await schedulerModel.deleteJobById(id);
    if (!deleted) {
      res.status(404).json({
        success: false,
        error: "Job not found or already removed.",
      });
      return;
    }
    res.status(200).json({
      success: true,
      message: `Non-repeatable job with ID ${id} deleted successfully.`,
    });
  } catch (error) {
    console.error(`Error removing non-repeatable job with ID ${id}:`, error);
    res.status(500).json({ success: false, error: error });
  }
};

/**
 * List all waiting non-repeatable jobs
 */
export const listWaitingNonRepeatableJobs = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const jobs = await schedulerModel.listWaitingJobs();
    res.status(200).json({ success: true, data: jobs });
  } catch (error) {
    console.error("Error fetching waiting non-repeatable jobs:", error);
    res.status(500).json({ success: false, error: error });
  }
};

/**
 * List all active non-repeatable jobs
 */
export const listActiveNonRepeatableJobs = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const jobs = await schedulerModel.listActiveJobs();
    res.status(200).json({ success: true, data: jobs });
  } catch (error) {
    console.error("Error fetching active non-repeatable jobs:", error);
    res.status(500).json({ success: false, error: error });
  }
};

/**
 *
 *  List all prioritized jobs
 */

export const listPrioritizedJobs = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const jobs = await schedulerModel.listPrioritizedJobs();
    res.status(200).json({ success: true, data: jobs });
  } catch (error) {
    console.error("Error fetching active non-repeatable jobs:", error);
    res.status(500).json({ success: false, error: error });
  }
};

/**
 * List all completed non-repeatable jobs
 */
export const listCompletedNonRepeatableJobs = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const jobs = await schedulerModel.listCompletedJobs();
    res.status(200).json({ success: true, data: jobs });
  } catch (error) {
    console.error("Error fetching completed non-repeatable jobs:", error);
    res.status(500).json({ success: false, error: error });
  }
};

/**
 * List all failed non-repeatable jobs
 */
export const listFailedNonRepeatableJobs = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const jobs = await schedulerModel.listFailedJobs();
    res.status(200).json({ success: true, data: jobs });
  } catch (error) {
    console.error("Error fetching failed non-repeatable jobs:", error);
    res.status(500).json({ success: false, error: error });
  }
};
