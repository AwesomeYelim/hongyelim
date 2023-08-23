/*
  Warnings:

  - The primary key for the `comment` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `created_at` on the `comment` table. All the data in the column will be lost.
  - You are about to drop the column `post_id` on the `comment` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `comment` table. All the data in the column will be lost.
  - The primary key for the `post` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `created_at` on the `post` table. All the data in the column will be lost.
  - You are about to drop the column `like` on the `post` table. All the data in the column will be lost.
  - You are about to drop the column `like_count` on the `post` table. All the data in the column will be lost.
  - The primary key for the `user` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[email,age]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Made the column `authorId` on table `post` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `age` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `comment` DROP FOREIGN KEY `comment_post_id_fkey`;

-- DropForeignKey
ALTER TABLE `comment` DROP FOREIGN KEY `comment_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `post` DROP FOREIGN KEY `Post_authorId_fkey`;

-- AlterTable
ALTER TABLE `comment` DROP PRIMARY KEY,
    DROP COLUMN `created_at`,
    DROP COLUMN `post_id`,
    DROP COLUMN `user_id`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `postId` VARCHAR(191) NULL,
    ADD COLUMN `userId` VARCHAR(191) NULL,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `post` DROP PRIMARY KEY,
    DROP COLUMN `created_at`,
    DROP COLUMN `like`,
    DROP COLUMN `like_count`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `favoriteById` VARCHAR(191) NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    MODIFY `id` VARCHAR(191) NOT NULL,
    MODIFY `tags` VARCHAR(191) NULL,
    MODIFY `authorId` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `user` DROP PRIMARY KEY,
    ADD COLUMN `age` INTEGER NOT NULL,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- CreateTable
CREATE TABLE `Category` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Category_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_CategoryToPost` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_CategoryToPost_AB_unique`(`A`, `B`),
    INDEX `_CategoryToPost_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `Comment_postId_idx` ON `Comment`(`postId`);

-- CreateIndex
CREATE INDEX `Comment_userId_idx` ON `Comment`(`userId`);

-- CreateIndex
CREATE INDEX `User_createdAt_idx` ON `User`(`createdAt`);

-- CreateIndex
CREATE UNIQUE INDEX `User_email_age_key` ON `User`(`email`, `age`);

-- AddForeignKey
ALTER TABLE `Post` ADD CONSTRAINT `Post_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Post` ADD CONSTRAINT `Post_favoriteById_fkey` FOREIGN KEY (`favoriteById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comment` ADD CONSTRAINT `Comment_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comment` ADD CONSTRAINT `Comment_postId_fkey` FOREIGN KEY (`postId`) REFERENCES `Post`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CategoryToPost` ADD CONSTRAINT `_CategoryToPost_A_fkey` FOREIGN KEY (`A`) REFERENCES `Category`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CategoryToPost` ADD CONSTRAINT `_CategoryToPost_B_fkey` FOREIGN KEY (`B`) REFERENCES `Post`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
