-- CreateTable
CREATE TABLE `todo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `todoText` VARCHAR(191) NOT NULL,
    `completed` BOOLEAN NOT NULL,
    `userIp` INTEGER NOT NULL,

    UNIQUE INDEX `todo_userIp_key`(`userIp`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `todo` ADD CONSTRAINT `todo_userIp_fkey` FOREIGN KEY (`userIp`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
