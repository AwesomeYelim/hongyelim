/*
  Warnings:

  - You are about to drop the column `userIp` on the `todo` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userID]` on the table `todo` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userID` to the `todo` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `todo` DROP FOREIGN KEY `todo_userIp_fkey`;

-- AlterTable
ALTER TABLE `todo` DROP COLUMN `userIp`,
    ADD COLUMN `userID` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `todo_userID_key` ON `todo`(`userID`);

-- AddForeignKey
ALTER TABLE `todo` ADD CONSTRAINT `todo_userID_fkey` FOREIGN KEY (`userID`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
