/*
  Warnings:

  - Added the required column `abstract` to the `ProjectPost` table without a default value. This is not possible if the table is not empty.
  - Added the required column `body` to the `ProjectPost` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `ProjectPost` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ProjectPost" ADD COLUMN     "abstract" TEXT NOT NULL,
ADD COLUMN     "body" TEXT NOT NULL,
ADD COLUMN     "editedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "publishedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "title" TEXT NOT NULL;
