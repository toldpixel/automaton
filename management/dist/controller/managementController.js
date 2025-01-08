"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteWebsite = exports.updateWebsite = exports.getWebsiteById = exports.addWebsite = exports.getWebsites = void 0;
const managementModel_1 = require("../models/managementModel");
const store = new managementModel_1.ManagementModel();
const getWebsites = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allWebsites = yield store.index();
        res.status(200).json(allWebsites);
    }
    catch (error) {
        console.error(error);
        res.status(500).json(error);
    }
});
exports.getWebsites = getWebsites;
const addWebsite = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { url, selectors } = req.body;
        if (!url || !selectors) {
            res.status(500).json({ error: "Missing url or selector" });
        }
        const newWebsite = {
            url: url,
            selectors: selectors,
        };
        const createdStorage = yield store.create(newWebsite);
        res.status(201).json(createdStorage);
    }
    catch (error) {
        console.error("Error adding Website:", error);
        res.status(500).json({ error: "Failed to add Website" });
    }
});
exports.addWebsite = addWebsite;
const getWebsiteById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const website = yield store.show(id);
        if (!website) {
            res.status(404).json({ error: "Website id not found" });
        }
        res.status(200).json(website);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch website " });
    }
});
exports.getWebsiteById = getWebsiteById;
const updateWebsite = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const updatedWebsite = req.body;
        const website = yield store.update(id, updatedWebsite);
        if (!website) {
            res.status(404).json({ error: "Website not found" });
        }
        res.status(200).json(website);
    }
    catch (error) {
        console.error("Error updating website:", error);
        res.status(500).json({ error: "Failed to update website" });
    }
});
exports.updateWebsite = updateWebsite;
const deleteWebsite = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const deletedWebsite = yield store.delete(id);
        if (!deletedWebsite) {
            res.status(404).json({ error: "Website not found" });
        }
        res.status(200).json({ message: "Website deleted successfully" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to delete website" });
    }
});
exports.deleteWebsite = deleteWebsite;
