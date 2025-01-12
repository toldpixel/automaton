import { Prisma, PrismaClient, Website } from "@prisma/client";
import { ScrapeResult } from "../types/result";

//Prisma ORM for DB requests and types
const prisma = new PrismaClient();

export class ManagementModel {
  // Handler gets all Websites
  async index(): Promise<Website[]> {
    try {
      const allWebsites = await prisma.website.findMany();
      return allWebsites;
    } catch (error) {
      console.error("Error fetching Websites", error);
      throw error;
    }
  }

  // Create a new Website
  async create(newWebsite: Prisma.WebsiteCreateInput): Promise<Website> {
    try {
      const createdWebsite = await prisma.website.create({
        data: newWebsite,
      });
      return createdWebsite;
    } catch (error) {
      console.error("Error fetching Websites", error);
      throw error;
    }
  }

  // Show single Website
  async show(id: string): Promise<Website | null> {
    try {
      const website = await prisma.website.findUnique({
        where: {
          id: id,
        },
      });
      if (!website) {
        throw new Error(`Website with id ${id} not found`);
      }
      return website;
    } catch (error) {
      console.error(`Error fetching Website with id ${id}`, error);
      throw error;
    }
  }

  // Update a Website
  async update(
    id: string,
    updateData: Prisma.WebsiteUpdateInput
  ): Promise<Website> {
    try {
      const updatedWebsite = await prisma.website.update({
        where: {
          id: id,
        },
        data: updateData,
      });
      return updatedWebsite;
    } catch (error) {
      console.error(`Error updating Website with id ${id}`, error);
      throw error;
    }
  }

  // Delete a Website
  async delete(id: string): Promise<Website> {
    try {
      const deletedWebsite = await prisma.website.delete({
        where: {
          id: id,
        },
      });
      return deletedWebsite;
    } catch (error) {
      console.error(`Error deleting Website with id ${id}`, error);
      throw error;
    }
  }
}
