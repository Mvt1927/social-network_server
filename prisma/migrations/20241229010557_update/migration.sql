/*
  Warnings:

  - A unique constraint covering the columns `[authorId,postId]` on the table `reactions` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "reactions_authorId_postId_key" ON "reactions"("authorId", "postId");
