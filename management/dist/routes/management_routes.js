"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
exports.router = express_1.default.Router();
exports.router.get("/api/websites", getWebsites);
/*router.post("/api/websites", addWebsite);
router.get("/api/websites/:id", getWebsiteById);
router.put("/api/websites/:id", updateWebsite);
router.delete("/api/websites/:id", deleteWebsite);*/
