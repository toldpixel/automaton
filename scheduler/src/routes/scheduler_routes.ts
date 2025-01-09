import express from "express";
import { getJobs, enqueueJob } from "../controller/schedulerController";

export const router = express.Router();

router.get("/api/jobs", getJobs);
router.post("/api/jobs", enqueueJob);
