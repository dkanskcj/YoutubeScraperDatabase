/*
  Warnings:

  - You are about to drop the column `thumbNail` on the `Video` table. All the data in the column will be lost.
  - Added the required column `url` to the `Video` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Video" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "videoLength" TEXT,
    "hashTag" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" DATETIME
);
INSERT INTO "new_Video" ("category", "createdAt", "deletedAt", "hashTag", "id", "title", "updatedAt", "videoLength") SELECT "category", "createdAt", "deletedAt", "hashTag", "id", "title", "updatedAt", "videoLength" FROM "Video";
DROP TABLE "Video";
ALTER TABLE "new_Video" RENAME TO "Video";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
