import { Website } from "@prisma/client";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const SCHEDULER_API_URL = process.env.SCHEDULER_API_URL;

// enqueue (push based) to scheduler_service
export async function postJobToScheduler(
  job: Website
): Promise<Website | null> {
  try {
    console.log(job, SCHEDULER_API_URL);
    const response = await axios.post(`${SCHEDULER_API_URL}/api/jobs`, job);
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}
