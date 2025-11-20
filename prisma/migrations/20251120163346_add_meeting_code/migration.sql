/*
  Warnings:

  - A unique constraint covering the columns `[meetingCode]` on the table `Interview` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Interview" ADD COLUMN     "invitedEmails" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "invitedUserIds" INTEGER[] DEFAULT ARRAY[]::INTEGER[],
ADD COLUMN     "meetingCode" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Interview_meetingCode_key" ON "Interview"("meetingCode");
