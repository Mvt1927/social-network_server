-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_userId_fkey";

-- CreateTable
CREATE TABLE "Friends" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "friend_id" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Friends_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Friends_user_id_friend_id_key" ON "Friends"("user_id", "friend_id");

-- CreateIndex
CREATE UNIQUE INDEX "Friends_friend_id_user_id_key" ON "Friends"("friend_id", "user_id");

-- AddForeignKey
ALTER TABLE "Friends" ADD CONSTRAINT "Friends_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Friends" ADD CONSTRAINT "Friends_friend_id_fkey" FOREIGN KEY ("friend_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
