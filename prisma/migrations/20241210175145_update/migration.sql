/*
  Warnings:

  - You are about to drop the column `content` on the `posts` table. All the data in the column will be lost.
  - Added the required column `messageId` to the `posts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "posts" DROP COLUMN "content",
ADD COLUMN     "messageId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "messages"("id") ON DELETE CASCADE ON UPDATE CASCADE;
