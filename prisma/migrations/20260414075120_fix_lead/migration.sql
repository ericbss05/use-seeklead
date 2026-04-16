/*
  Warnings:

  - A unique constraint covering the columns `[linkedinUrl]` on the table `AccountTracked` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,urlProfile]` on the table `Lead` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "AccountTracked_linkedinUrl_key" ON "AccountTracked"("linkedinUrl");

-- CreateIndex
CREATE UNIQUE INDEX "Lead_userId_urlProfile_key" ON "Lead"("userId", "urlProfile");
