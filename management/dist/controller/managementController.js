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
exports.getWebsites = void 0;
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
/*export const createStorage = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      name,
      description,
      address,
      phone,
      email,
      website,
      units,
      services,
      features,
      hours,
      ratings,
    } = req.body;

    if (!name || !address || !phone || !email || !units) {
      res.status(400).json({
        error: "Name, address, phone, email, and units are required",
      });
      return;
    }

    const newStorage: Storage = {
      name,
      description,
      address,
      phone,
      email,
      website,
      units,
      services,
      features,
      hours,
      ratings,
    };
    const createdStorage = await store.create(newStorage);
    res.status(201).json(createdStorage);
  } catch (error) {
    console.error("Error creating storage:", error);
    res.status(500).json({ error: "Failed to create storage" });
  }
};

export const getStorageById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const storage = await store.show(id);
    if (!storage) {
      res.status(404).json({ error: "Storage not found" });
      return;
    }
    res.status(200).json(storage);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch storage" });
  }
};

export const updateStorage = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const updatedStorage = req.body;
    const storage = await store.update(id, updatedStorage);
    if (!storage) {
      res.status(404).json({ error: "Storage not found" });
      return;
    }
    res.status(200).json(storage);
  } catch (error) {
    console.error("Error updating storage:", error);
    res.status(500).json({ error: "Failed to update storage" });
  }
};

export const deleteStorage = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const deletedStorage = await store.delete(id);
    if (!deletedStorage) {
      res.status(404).json({ error: "Storage not found" });
      return;
    }
    res.status(200).json({ message: "Storage deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete storage" });
  }
};*/
