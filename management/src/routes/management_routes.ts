import express from "express";
import {
  getWebsites,
  addWebsite,
  getWebsiteById,
  updateWebsite,
  deleteWebsite,
} from "../controller/managementController";

export const router = express.Router();

router.get("/api/websites", getWebsites);
router.post("/api/websites", addWebsite);
router.get("/api/websites/:id", getWebsiteById);
router.put("/api/websites/:id", updateWebsite);
router.delete("/api/websites/:id", deleteWebsite);
