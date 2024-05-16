/*
  Warnings:

  - You are about to drop the column `bugzillaLink` on the `msas` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `msas` DROP COLUMN `bugzillaLink`,
    ADD COLUMN `bugLink` VARCHAR(191) NULL;
