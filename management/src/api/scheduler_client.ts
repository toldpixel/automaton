import { Website } from "@prisma/client";
import axios from "axios";
const SCHEDULER_API_URL = process.env.SCHEDULER_API_URL;

//
export async function postJobToScheduler(job: Website) {
  const response = await axios.post(`${SCHEDULER_API_URL}/jobs`, {});
  return response.data;
}
