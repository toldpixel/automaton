import express from "express";
import {
  getAllRepeatableJobs,
  createRepeatableJob,
  removeRepeatableJob,
} from "../controller/schedulerRepeatableController";

import {
  createNonRepeatableJob,
  getNonRepeatableJobById,
  deleteNonRepeatableJobById,
  listWaitingNonRepeatableJobs,
  listActiveNonRepeatableJobs,
  listCompletedNonRepeatableJobs,
  listFailedNonRepeatableJobs,
  listPrioritizedJobs,
} from "../controller/schedulerNonRepeatableController";

export const router = express.Router();

//! Specific routes first -> dynamic routes last
// Lists all prioritized jobs
router.get("/api/jobs/prioritized", listPrioritizedJobs);

// Repeatable job routes
router.get("/api/jobs/repeatable", getAllRepeatableJobs);
router.post("/api/jobs/repeatable", createRepeatableJob);
router.delete("/api/jobs/repeatable/:key", removeRepeatableJob);

// Non-repeatable job routes
router.post("/api/jobs/non-repeatable", createNonRepeatableJob);

// Specific non-repeatable job states
router.get("/api/jobs/non-repeatable/waiting", listWaitingNonRepeatableJobs);
router.get("/api/jobs/non-repeatable/active", listActiveNonRepeatableJobs);
router.get(
  "/api/jobs/non-repeatable/completed",
  listCompletedNonRepeatableJobs
);
router.get("/api/jobs/non-repeatable/failed", listFailedNonRepeatableJobs);

// Dynamic non-repeatable job routes
router.get("/api/jobs/non-repeatable/:id", getNonRepeatableJobById);
router.delete("/api/jobs/non-repeatable/:id", deleteNonRepeatableJobById);
