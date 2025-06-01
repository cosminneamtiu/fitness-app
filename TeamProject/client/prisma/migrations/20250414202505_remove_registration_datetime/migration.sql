/*
  Warnings:

  - You are about to drop the column `date` on the `Registration` table. All the data in the column will be lost.
  - You are about to drop the column `time` on the `Registration` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Registration" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "classId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Registration_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Registration_classId_fkey" FOREIGN KEY ("classId") REFERENCES "FitnessClass" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Registration" ("classId", "createdAt", "id", "userId") SELECT "classId", "createdAt", "id", "userId" FROM "Registration";
DROP TABLE "Registration";
ALTER TABLE "new_Registration" RENAME TO "Registration";
CREATE UNIQUE INDEX "Registration_userId_classId_key" ON "Registration"("userId", "classId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
