import express from "express";
import { getStatusSettings } from "../controller/settingsController";

export const router = express.Router();

router.get("/api/scraper/state", getStatusSettings);
