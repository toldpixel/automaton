import express from "express";
import { router as resultRoutes } from "./result_routes";
import { router as managementRoutes } from "./management_routes";

export const index_routes = express.Router();

index_routes.use(resultRoutes);
index_routes.use(managementRoutes);
