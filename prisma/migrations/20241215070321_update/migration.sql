/*
  Warnings:

  - You are about to drop the column `text` on the `messages` table. All the data in the column will be lost.
  - You are about to drop the `Group` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Reaction` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `content` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('IMAGE', 'VIDEO', 'AUDIO', 'DOCUMENT', 'OTHER');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('REACTION', 'FRIEND_REQUEST', 'FOLLOW', 'COMMENT', 'GROUP_CHAT_SEND_MESSAGE', 'CHAT_SEND_MESSAGE', 'COMMENT_REPLY');

-- DropForeignKey
ALTER TABLE "Group" DROP CONSTRAINT "Group_authorId_fkey";

-- DropForeignKey
ALTER TABLE "GroupChat" DROP CONSTRAINT "GroupChat_groupId_fkey";

-- DropForeignKey
ALTER TABLE "GroupMembers" DROP CONSTRAINT "GroupMembers_groupId_fkey";

-- DropForeignKey
ALTER TABLE "Reaction" DROP CONSTRAINT "Reaction_ChatId_fkey";

-- DropForeignKey
ALTER TABLE "Reaction" DROP CONSTRAINT "Reaction_GroupChatId_fkey";

-- DropForeignKey
ALTER TABLE "Reaction" DROP CONSTRAINT "Reaction_authorId_fkey";

-- DropForeignKey
ALTER TABLE "Reaction" DROP CONSTRAINT "Reaction_commentId_fkey";

-- DropForeignKey
ALTER TABLE "Reaction" DROP CONSTRAINT "Reaction_postId_fkey";

-- DropForeignKey
ALTER TABLE "content" DROP CONSTRAINT "content_messageId_fkey";

-- DropForeignKey
ALTER TABLE "posts" DROP CONSTRAINT "posts_messageId_fkey";

-- AlterTable
ALTER TABLE "messages" DROP COLUMN "text",
ADD COLUMN     "content" TEXT;

-- AlterTable
ALTER TABLE "posts" ALTER COLUMN "messageId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "avatarUrl" TEXT,
ADD COLUMN     "bio" TEXT;

-- DropTable
DROP TABLE "Group";

-- DropTable
DROP TABLE "Reaction";

-- DropTable
DROP TABLE "content";

-- DropEnum
DROP TYPE "fileTypes";

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bookmarks" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bookmarks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "follows" (
    "id" TEXT NOT NULL,
    "followerId" TEXT NOT NULL,
    "followingId" TEXT NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "follows_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "recipientId" TEXT NOT NULL,
    "issuerId" TEXT NOT NULL,
    "postId" TEXT,
    "type" "NotificationType" NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "friendId" TEXT,
    "commentId" TEXT,
    "groupChatId" TEXT,
    "chatId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "groups" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "authorId" TEXT,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "medias" (
    "id" TEXT NOT NULL,
    "url" TEXT,
    "type" "MediaType",
    "messageId" TEXT,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "medias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reactions" (
    "id" TEXT NOT NULL,
    "type" "ReactionType" NOT NULL,
    "authorId" TEXT NOT NULL,
    "postId" TEXT,
    "commentId" TEXT,
    "chatId" TEXT,
    "groupChatId" TEXT,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reactions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "bookmarks_userId_postId_key" ON "bookmarks"("userId", "postId");

-- CreateIndex
CREATE UNIQUE INDEX "follows_followerId_followingId_key" ON "follows"("followerId", "followingId");

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookmarks" ADD CONSTRAINT "bookmarks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookmarks" ADD CONSTRAINT "bookmarks_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "follows" ADD CONSTRAINT "follows_followerId_fkey" FOREIGN KEY ("followerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "follows" ADD CONSTRAINT "follows_followingId_fkey" FOREIGN KEY ("followingId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "messages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_issuerId_fkey" FOREIGN KEY ("issuerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_friendId_fkey" FOREIGN KEY ("friendId") REFERENCES "friends"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_groupChatId_fkey" FOREIGN KEY ("groupChatId") REFERENCES "GroupChat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "chats"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "groups" ADD CONSTRAINT "groups_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupMembers" ADD CONSTRAINT "GroupMembers_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupChat" ADD CONSTRAINT "GroupChat_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medias" ADD CONSTRAINT "medias_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "messages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reactions" ADD CONSTRAINT "reactions_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reactions" ADD CONSTRAINT "reactions_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reactions" ADD CONSTRAINT "reactions_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "comments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reactions" ADD CONSTRAINT "reactions_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "chats"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reactions" ADD CONSTRAINT "reactions_groupChatId_fkey" FOREIGN KEY ("groupChatId") REFERENCES "GroupChat"("id") ON DELETE SET NULL ON UPDATE CASCADE;
