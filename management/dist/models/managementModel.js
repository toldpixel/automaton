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
exports.ManagementModel = void 0;
const client_1 = require("@prisma/client");
//Prisma ORM for DB requests and types
const prisma = new client_1.PrismaClient();
class ManagementModel {
    // Handler gets all Websites
    index() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const allWebsites = yield prisma.website.findMany();
                return allWebsites;
            }
            catch (error) {
                console.error("Error fetching Websites", error);
                throw error;
            }
        });
    }
    // Create a new Website
    create(newWebsite) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const createdWebsite = yield prisma.website.create({
                    data: newWebsite,
                });
                return createdWebsite;
            }
            catch (error) {
                console.error("Error fetching Websites", error);
                throw error;
            }
        });
    }
    // Show single Website
    show(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const website = yield prisma.website.findUnique({
                    where: {
                        id: id,
                    },
                });
                if (!website) {
                    throw new Error(`Website with id ${id} not found`);
                }
                return website;
            }
            catch (error) {
                console.error(`Error fetching Website with id ${id}`, error);
                throw error;
            }
        });
    }
    // Update a Website
    update(id, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedWebsite = yield prisma.website.update({
                    where: {
                        id: id,
                    },
                    data: updateData,
                });
                return updatedWebsite;
            }
            catch (error) {
                console.error(`Error updating Website with id ${id}`, error);
                throw error;
            }
        });
    }
    // Delete a Website
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const deletedWebsite = yield prisma.website.delete({
                    where: {
                        id: id,
                    },
                });
                return deletedWebsite;
            }
            catch (error) {
                console.error(`Error deleting Website with id ${id}`, error);
                throw error;
            }
        });
    }
}
exports.ManagementModel = ManagementModel;
