/*
  Warnings:

  - You are about to drop the `passwordHint` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN "passwordHintAnswer" TEXT;
ALTER TABLE "User" ADD COLUMN "passwordHintTitle" TEXT;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "passwordHint";
PRAGMA foreign_keys=on;
