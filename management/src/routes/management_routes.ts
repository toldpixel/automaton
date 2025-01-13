import express from "express";
import {
  getWebsites,
  addWebsite,
  getWebsiteById,
  updateWebsite,
  deleteWebsite,
  deleteSelected,
} from "../controller/managementController";

export const router = express.Router();

// connects management with frontend, frontend adds a website and it gets pushed to the scheduler Bullmq queue
router.get("/api/websites", getWebsites);
router.post("/api/websites", addWebsite); // adds new websites to the queue
router.post("/api/websites/delete", deleteSelected);
router.get("/api/websites/:id", getWebsiteById);
router.put("/api/websites/:id", updateWebsite);
router.delete("/api/websites/:id", deleteWebsite);
