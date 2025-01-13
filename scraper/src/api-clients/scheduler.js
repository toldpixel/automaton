import axios from "axios";
import dotenv from "dotenv";
dotenv.config();
export async function checkIfJobIsCancelled(jobId) {
  try {
    console.log(jobId);
    const key = jobId.split(":")[1];
    const response = await axios.get(
      `${process.env.SCHEDULER_API_URL}/api/jobs/repeatable`
    );
    console.log(response.data);
    if (response.data.data.length > 0) {
      const found = response.data.data.find((job) => job.key === key);
      if (found) {
        console.error(`Job ${key} was not cancelled!`);
        return false;
      }
    }
    console.log("no jobs in queue found!: ", jobId);
    return true;
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
}
