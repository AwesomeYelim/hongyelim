/*
  Warnings:

  - You are about to drop the `todo` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `todo` DROP FOREIGN KEY `todo_userID_fkey`;

-- DropTable
DROP TABLE `todo`;
