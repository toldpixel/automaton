import { JobInformation } from "../types/job";
import { Queue } from "bullmq";
import validate from "cron-validate";

function isValidCron(cron: string): boolean {
  const result = validate(cron, { preset: "default" });
  return result.isValid();
}

// Redis might not be ready on time, depends_on doesnt
// know if redis is ready - retry
// check health in docker compose
const MAX_RETRIES = 5;
let retries = 0;
async function createQueue() {
  while (retries < MAX_RETRIES) {
    try {
      const queue = new Queue("myqueue", {
        connection: {
          host: "redis",
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
})();

// Adds a job to the queue, the jobs are repeated
// cronOptions are set through job.metadata.scheduleFrequency
// cron-validate to make sure its a cron string we get
async function addJob(job: JobInformation, cronOptions: string) {
  console.log(`Adding job with Id: ${job.id} for URL: ${job.url}`);

  if (!isValidCron(cronOptions)) {
    throw new Error(`Invalid cron string: ${cronOptions}`);
  }

  let priorityLevel;
  switch (job.metadata.priority) {
    case "high":
      priorityLevel = 1;
      break;
    case "medium":
      priorityLevel = 2;
      break;
    case "low":
      priorityLevel = 3;
      break;
    default:
      priorityLevel = 5;
  }

  try {
    await job_queue.upsertJobScheduler(
      job.id,
      { pattern: cronOptions },
      {
        name: "cron-job",
        data: job,
        opts: {
          priority: priorityLevel,
          attempts: 3,
          removeOnComplete: true, // remove the job when complete
        },
      }
    );
    console.log(`Repeating job added with jobid: ${job.id}`);
  } catch (error) {
    console.error(`Failed adding repeating job ${job.id}`, error);
    throw error;
  }
}

export class SchedulerModel {
  async index() {}

  async create(job: JobInformation) {
    try {
      const cronOptions = job.metadata.scheduleFrequency; //add only valid cron string
      await addJob(job, cronOptions);
      console.log("Job successful added to queue!");
      return job;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}
