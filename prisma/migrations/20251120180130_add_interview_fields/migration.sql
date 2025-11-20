/*
  Warnings:

  - You are about to drop the column `invitedEmails` on the `Interview` table. All the data in the column will be lost.
  - You are about to drop the column `invitedUserIds` on the `Interview` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Interview" DROP COLUMN "invitedEmails",
DROP COLUMN "invitedUserIds",
ADD COLUMN     "candidateId" TEXT,
ADD COLUMN     "endTime" BIGINT,
ADD COLUMN     "interviewerIds" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "startTime" BIGINT,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'scheduled',
ADD COLUMN     "streamCallId" TEXT;

-- CreateIndex
CREATE INDEX "Interview_candidateId_idx" ON "Interview"("candidateId");
