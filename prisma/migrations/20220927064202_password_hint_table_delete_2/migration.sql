/*
  Warnings:

  - Made the column `passwordHintAnswer` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `passwordHintTitle` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "passwordHintTitle" TEXT NOT NULL,
    "passwordHintAnswer" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" DATETIME
);
INSERT INTO "new_User" ("createdAt", "deletedAt", "id", "name", "password", "passwordHintAnswer", "passwordHintTitle", "updatedAt") SELECT "createdAt", "deletedAt", "id", "name", "password", "passwordHintAnswer", "passwordHintTitle", "updatedAt" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
