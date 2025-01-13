import { Response, Request } from "express";
import { ManagementModel } from "../models/managementModel";
import { Prisma, PrismaClient, Website } from "@prisma/client";
import {
  deleteJobsFromScheduler,
  postJobToScheduler,
} from "../api/scheduler_client";

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
    const { url, selectors, Metadata } = req.body;
    if (!url || !selectors || !Metadata) {
      res.status(500).json({ error: "Missing url or selector" });
      return;
    }

    // Create our metadata first
    const createdMetadata = await prisma.metadata.create({
      data: {
        priority: Metadata.priority,
        scheduleFrequency: Metadata.scheduleFrequency,
        addedAt: new Date(Metadata.addedAt),
      },
    });

    // Prisma associate the new created existing Metadata entry with id
    const newWebsite: Prisma.WebsiteCreateInput = {
      url: url,
      selectors: selectors,
      Metadata: {
        connect: {
          id: createdMetadata.id,
        },
      },
    };

    const createdWebsite = await store.create(newWebsite);

    // Fetch with Metadata from prisma
    const fullWebsite = await prisma.website.findUnique({
      where: { id: createdWebsite.id },
      include: {
        Metadata: true,
      },
    });

    if (!fullWebsite) {
      throw new Error("Failed to get full Website after object creation!");
    }

    // Send the job to scheduler, make sure its the correct type - good bye
    const schedulerResponse = await postJobToScheduler(fullWebsite);
    if (!schedulerResponse) {
      console.error("Scheduler sends error response null!");
      throw new Error("Scheduler sends error response null!");
    }

    res.status(201).json(createdWebsite);
  } catch (error) {
    console.error("Error adding Website:", error);
    res.status(500).json({ error: `Failed to add Website: ${error}` });
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

export const deleteSelected = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { list } = req.body;
    if (!Array.isArray(list) || list.length === 0) {
      res.status(400).json({ error: "No valid IDs provided" });
      return;
    }
    const deletedWebsite = await deleteJobsFromScheduler(list);
    if (!deletedWebsite) {
      res.status(404).json({ error: "Website not found" });
      return;
    }
    res.status(200).json({ message: "Website deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete website" });
  }
};
