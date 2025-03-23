/*
  Warnings:

  - You are about to drop the `Admin` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[adminId]` on the table `Organizer` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `adminId` to the `Organizer` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Admin" DROP CONSTRAINT "Admin_orgId_fkey";

-- DropForeignKey
ALTER TABLE "Admin" DROP CONSTRAINT "Admin_userId_fkey";

-- DropIndex
DROP INDEX "Event_name_key";

-- AlterTable
ALTER TABLE "Organizer" ADD COLUMN     "adminId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "Admin";

-- CreateIndex
CREATE UNIQUE INDEX "Organizer_adminId_key" ON "Organizer"("adminId");

-- AddForeignKey
ALTER TABLE "Organizer" ADD CONSTRAINT "Organizer_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
