import { Response, Request } from "express";
import { ManagementModel } from "../models/managementModel";
import { Prisma, PrismaClient, Website } from "@prisma/client";

const store = new ManagementModel();
const prisma = new PrismaClient();

export const getWebsites = async (_req: Request, res: Response) => {
  try {
    const allWebsites = await store.index();
    res.status(200).json(allWebsites);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
};

export const addWebsite = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { url, selectors, metadata } = req.body;
    if (!url || !selectors || !metadata) {
      res.status(500).json({ error: "Missing url or selector" });
      return;
    }

    // Create our metadata first
    const createdMetadata = await prisma.metadata.create({
      data: {
        priority: metadata.priority,
        scheduleFrequency: metadata.scheduleFrequency,
        addedAt: new Date(metadata.addedAt),
      },
    });

    // Prisma associate the existing Metadata entry with id
    const newWebsite: Prisma.WebsiteCreateInput = {
      url: url,
      selectors: selectors,
      Metadata: {
        connect: {
          id: createdMetadata.id,
        },
      },
    };

    const createdStorage = await store.create(newWebsite);
    res.status(201).json(createdStorage);
  } catch (error) {
    console.error("Error adding Website:", error);
    res.status(500).json({ error: "Failed to add Website" });
  }
};

export const getWebsiteById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const website = await store.show(id);
    if (!website) {
      res.status(404).json({ error: "Website id not found" });
      return;
    }
    res.status(200).json(website);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch website " });
  }
};

export const updateWebsite = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const updatedWebsite = req.body;
    const website = await store.update(id, updatedWebsite);
    if (!website) {
      res.status(404).json({ error: "Website not found" });
    }
    res.status(200).json(website);
  } catch (error) {
    console.error("Error updating website:", error);
    res.status(500).json({ error: "Failed to update website" });
  }
};

export const deleteWebsite = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const deletedWebsite = await store.delete(id);
    if (!deletedWebsite) {
      res.status(404).json({ error: "Website not found" });
    }
    res.status(200).json({ message: "Website deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete website" });
  }
};
