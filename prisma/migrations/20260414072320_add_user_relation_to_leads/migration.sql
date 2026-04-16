/*
  Warnings:

  - A unique constraint covering the columns `[postUrl]` on the table `PostTracked` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `Lead` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Lead" DROP CONSTRAINT "Lead_postTrackedId_fkey";

-- AlterTable
ALTER TABLE "Lead" ADD COLUMN     "userId" TEXT NOT NULL,
ALTER COLUMN "postTrackedId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "PostTracked" ADD COLUMN     "postUrl" TEXT;

-- CreateIndex
CREATE INDEX "Lead_userId_idx" ON "Lead"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "PostTracked_postUrl_key" ON "PostTracked"("postUrl");

-- AddForeignKey
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_postTrackedId_fkey" FOREIGN KEY ("postTrackedId") REFERENCES "PostTracked"("id") ON DELETE SET NULL ON UPDATE CASCADE;
