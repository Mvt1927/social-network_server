/*
  Warnings:

  - Made the column `messageId` on table `posts` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "comments" DROP CONSTRAINT "comments_replyCommentId_fkey";

-- AlterTable
ALTER TABLE "posts" ALTER COLUMN "messageId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_replyCommentId_fkey" FOREIGN KEY ("replyCommentId") REFERENCES "comments"("id") ON DELETE NO ACTION ON UPDATE CASCADE;
