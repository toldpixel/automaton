"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const managementController_1 = require("../controller/managementController");
exports.router = express_1.default.Router();
exports.router.get("/api/websites", managementController_1.getWebsites);
exports.router.post("/api/websites", managementController_1.addWebsite);
exports.router.get("/api/websites/:id", managementController_1.getWebsiteById);
exports.router.put("/api/websites/:id", managementController_1.updateWebsite);
exports.router.delete("/api/websites/:id", managementController_1.deleteWebsite);
