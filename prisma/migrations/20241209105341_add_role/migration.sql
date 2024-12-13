-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN', 'GUEST', 'MODERATOR');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'GUEST';
