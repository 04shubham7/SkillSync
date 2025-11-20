-- CreateTable
CREATE TABLE "Comment" (
    "id" SERIAL NOT NULL,
    "interviewId" INTEGER NOT NULL,
    "interviewerId" INTEGER,
    "content" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Comment_interviewId_idx" ON "Comment"("interviewId");
