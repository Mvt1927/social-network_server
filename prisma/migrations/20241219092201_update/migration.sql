-- DropForeignKey
ALTER TABLE "chats" DROP CONSTRAINT "chats_messageId_fkey";

-- DropForeignKey
ALTER TABLE "chats" DROP CONSTRAINT "chats_receiverId_fkey";

-- DropForeignKey
ALTER TABLE "comments" DROP CONSTRAINT "comments_replyCommentId_fkey";

-- DropForeignKey
ALTER TABLE "medias" DROP CONSTRAINT "medias_messageId_fkey";

-- DropForeignKey
ALTER TABLE "posts" DROP CONSTRAINT "posts_messageId_fkey";

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "messages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_replyCommentId_fkey" FOREIGN KEY ("replyCommentId") REFERENCES "comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chats" ADD CONSTRAINT "chats_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chats" ADD CONSTRAINT "chats_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "messages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medias" ADD CONSTRAINT "medias_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "messages"("id") ON DELETE CASCADE ON UPDATE CASCADE;
