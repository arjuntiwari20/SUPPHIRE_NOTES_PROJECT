/*
  Warnings:

  - You are about to drop the column `bookmarkcount` on the `Note` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Note" DROP COLUMN "bookmarkcount",
ADD COLUMN     "Bookmarkcount" INTEGER NOT NULL DEFAULT 0;
