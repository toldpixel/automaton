import { Prisma } from "@prisma/client";
import axios from "axios";
import dotenv from "dotenv";
import { response } from "express";
dotenv.config();

const SCHEDULER_API_URL = process.env.SCHEDULER_API_URL;

//Prisma custom type with included Metadata
type WebsiteMetadata = Prisma.WebsiteGetPayload<{
  include: { Metadata: true };
}>;
// enqueue (push based) to scheduler_service
// decides if user chooses a repeatable scrape job or non repeatable
// and sends job to the scheduler
export async function postJobToScheduler(
  job: WebsiteMetadata
): Promise<WebsiteMetadata | null> {
  try {
    let response = null;
    console.log(job, SCHEDULER_API_URL);
    if (job.Metadata?.scheduleFrequency) {
      response = await axios.post(
        `${SCHEDULER_API_URL}/api/jobs/repeatable`,
        job
      );
    } else {
      response = await axios.post(
        `${SCHEDULER_API_URL}/api/jobs/non-repeatable`,
        job
      );
    }
    if (!response) {
      throw new Error("Scheduler sends error response null!");
    }
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function deleteJobsFromScheduler(listOfIds: string[]): Promise<{
  success: boolean;
  message: string;
} | null> {
  try {
    for (const key of listOfIds) {
      console.log(`Deleting job with ID: ${key}`);
      const response = await axios.delete(
        `${SCHEDULER_API_URL}/api/jobs/repeatable/${key}`
      );
      console.log(`Deleted job with ID: ${key}`, response.data);
    }
    return {
      success: true,
      message: `Repeatable job with key ${listOfIds} removed successfully.`,
    };
  } catch (error) {
    console.error(`Error deleting jobs from scheduler: ${error}`);
    return null;
  }
}
