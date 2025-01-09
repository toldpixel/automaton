/*
  Warnings:

  - A unique constraint covering the columns `[metadataId]` on the table `Website` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Website" ADD COLUMN     "metadataId" UUID,
ALTER COLUMN "selectors" SET DATA TYPE TEXT;

-- CreateTable
CREATE TABLE "Metadata" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "priority" TEXT NOT NULL,
    "scheduleFrequency" TEXT NOT NULL,
    "addedAt" TIMESTAMP NOT NULL,

    CONSTRAINT "Metadata_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Website_metadataId_key" ON "Website"("metadataId");

-- AddForeignKey
ALTER TABLE "Website" ADD CONSTRAINT "Website_metadataId_fkey" FOREIGN KEY ("metadataId") REFERENCES "Metadata"("id") ON DELETE CASCADE ON UPDATE CASCADE;
