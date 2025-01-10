import { JobInformation } from "../types/job";
import { Queue, RepeatableJob } from "bullmq";
import validate from "cron-validate";
import dotenv from "dotenv";

dotenv.config();

function isValidCron(cron: string): boolean {
  const result = validate(cron, { preset: "default" });
  return result.isValid();
}

// Redis might not be ready on time, depends_on doesnt
// know if redis is ready - retry
// check health in docker compose
//TODO use IORedis from 'ioredis' for retries
const MAX_RETRIES = 5;
let retries = 0;
async function createQueue() {
  while (retries < MAX_RETRIES) {
    try {
      const queue = new Queue("myqueue", {
        connection: {
          host: process.env.REDIS_HOST,
          port: 6379,
        },
      });
      console.log("Service connected to redis");
      return queue;
    } catch (error) {
      retries++;
      console.error(`Redis retry connecting (${retries}/${MAX_RETRIES}`);
      await new Promise((resolve) => setTimeout(resolve, 2000)); // waits 2 sec.
    }
  }
  throw new Error("Failed to connect to Redis");
}

let job_queue: Queue;
(async () => {
  job_queue = await createQueue();
  console.log("Connected to Redis. Queue initialized.");
})();

//Make sure job queue is ready
async function getJobQueue(): Promise<Queue> {
  if (!job_queue) {
    job_queue = await createQueue();
  }
  return job_queue;
}

const logQueueStates = async (queue: Queue) => {
  console.log("Waiting:", await queue.getWaiting());
  console.log("Active:", await queue.getActive());
  console.log("Completed:", await queue.getCompleted());
  console.log("Failed:", await queue.getFailed());
};

// Adds a job to the queue, the jobs are repeated
// cronOptions are set through job.metadata.scheduleFrequency
// cron-validate to make sure its a cron string we get
async function addRepeatableJob(
  job: JobInformation,
  cronOptions: string,
  opts: any
) {
  console.log(`Adding job with Id: ${job.id} for URL: ${job.url}`);

  if (!isValidCron(cronOptions)) {
    throw new Error(`Invalid cron string: ${cronOptions}`);
  }

  const queue = await getJobQueue();

  try {
    const addedJob = await queue.upsertJobScheduler(
      job.id,
      { pattern: cronOptions },
      {
        name: "cron-job",
        data: job,
        opts: {
          priority: opts.priorityLevel,
          attempts: 3,
          removeOnComplete: true, //!set to remove jobs from the queue once completed DEBUG
          removeOnFail: false, //!
        },
      }
    );
    console.log(`Repeating job added with jobid: ${addedJob.id}`);
  } catch (error) {
    console.error(`Failed adding repeating job ${job.id}`, error);
    throw error;
  }
}

async function addNonRepeatableJob(job: JobInformation, opts: any) {
  console.log(
    `Adding non-repeatable job with Id: ${job.id} for URL: ${job.url}`
  );

  const queue = await getJobQueue();

  try {
    const addedJob = await queue.add(job.id, job, opts);
    await logQueueStates(job_queue);
    console.log(`Non-repeatable job added with jobId: ${addedJob.id}`);
  } catch (error) {
    console.error(`Failed adding non-repeatable job ${job.id}`, error);
    throw error;
  }
}

// Simple Model for Controller, returns null or throws when error
// ChatGPT Boilerplate / Bullmq Docs
export class SchedulerModel {
  async index(): Promise<RepeatableJob[]> {
    try {
      const repeatableJobs = await job_queue.getJobSchedulers();
      console.log("Repeatable Jobs:", repeatableJobs);
      return repeatableJobs;
    } catch (error) {
      console.error("Error fetching repeatable jobs:", error);
      throw error;
    }
  }

  async create(job: JobInformation) {
    // options for non-repeatable queue
    const opts: any = {
      attempts: 3,
      removeOnComplete: true, //! remove jobs from the queue once completed DEBUG
      removeOnFail: false, //!
    };

    //if priority is defined then use it
    //priorities get queued in another property in bullmq
    // cannot be queried with getWaiting
    if (job.Metadata.priority) {
      switch (job.Metadata.priority) {
        case "high":
          opts.priorityLevel = 1;
          break;
        case "medium":
          opts.priorityLevel = 2;
          break;
        case "low":
          opts.priorityLevel = 3;
          break;
        default:
          opts.priorityLevel = 5;
      }
    }
    try {
      const cronOptions = job.Metadata.scheduleFrequency; //add only valid cron string
      // create repeatable if user fills in scheduleFrequency, when empty then non-repeatable
      if (cronOptions === "") {
        await addNonRepeatableJob(job, opts);
      } else {
        await addRepeatableJob(job, cronOptions, opts);
      }
      console.log("Job successful added to queue!");
      return job;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async getJobById(jobId: string) {
    try {
      const queue = await getJobQueue();
      const job = await queue.getJob(jobId);
      if (!job) {
        console.error(`No job found with ID: ${jobId}`);
        return null;
      } else {
        console.log("Job Details:", job.toJSON());
        return job.toJSON();
      }
    } catch (error) {
      console.error(`Error fetching job with ID ${jobId}:`, error);
      throw error;
    }
  }

  async deleteJobById(jobId: string) {
    try {
      const queue = await getJobQueue();
      const job = await queue.getJob(jobId);
      if (!job) {
        console.log(`No job found with ID: ${jobId}`);
        return false;
      } else {
        await job.remove();
        console.log(`Job with ID ${jobId} removed successfully`);
        return true;
      }
    } catch (error) {
      console.error(`Error removing job with ID ${jobId}:`, error);
      throw error;
    }
  }

  async listWaitingJobs() {
    try {
      const queue = await getJobQueue();
      const jobs = await queue.getWaiting();
      if (!jobs) {
        console.log(`No job found waiting`);
        return false;
      } else {
        console.log("Waiting Jobs:", jobs);
        return jobs.map((job) => job.toJSON());
      }
    } catch (error) {
      console.error("Error fetching waiting jobs:", error);
      throw error;
    }
  }

  // will not be listed in Waiting
  async listPrioritizedJobs() {
    try {
      const queue = await getJobQueue();
      const jobs = await queue.getPrioritized();
      if (!jobs) {
        console.log(`No job found waiting`);
        return false;
      } else {
        console.log("Prioritized Jobs:", jobs);
        return jobs.map((job) => job.toJSON());
      }
    } catch (error) {
      console.error("Error fetching waiting jobs:", error);
      throw error;
    }
  }

  async listActiveJobs() {
    try {
      const queue = await getJobQueue();
      const jobs = await queue.getActive();
      if (!jobs) {
        console.log(`No job found active`);
        return false;
      } else {
        console.log("Active Jobs:", jobs);
        return jobs.map((job) => job.toJSON());
      }
    } catch (error) {
      console.error("Error fetching active jobs:", error);
      throw error;
    }
  }

  async listCompletedJobs() {
    try {
      const queue = await getJobQueue();
      const jobs = await queue.getCompleted();
      if (!jobs) {
        console.log(`No job found completed`);
        return false;
      } else {
        console.log("Completed Jobs:", jobs);
        return jobs.map((job) => job.toJSON());
      }
    } catch (error) {
      console.error("Error fetching completed jobs:", error);
      throw error;
    }
  }

  async listFailedJobs() {
    try {
      const queue = await getJobQueue();
      const jobs = await queue.getFailed();
      if (!jobs) {
        console.log(`No job found failed`);
        return false;
      } else {
        console.log("Failed Jobs:", jobs);
        return jobs.map((job) => job.toJSON());
      }
    } catch (error) {
      console.error("Error fetching failed jobs:", error);
      throw error;
    }
  }

  async removeRepeatableJob(jobKey: string) {
    try {
      const queue = await getJobQueue();
      const jobs = await queue.removeJobScheduler(jobKey);
      if (!jobs) {
        console.log(`No job found failed`);
        return false;
      } else {
        console.log(`Repeatable job with key ${jobKey} removed successfully`);
        return true;
      }
    } catch (error) {
      console.error(`Error removing repeatable job with key ${jobKey}:`, error);
      throw error;
    }
  }
}
