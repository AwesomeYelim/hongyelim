-- CreateTable
CREATE TABLE `tags` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tagName` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_tagsTotodo` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_tagsTotodo_AB_unique`(`A`, `B`),
    INDEX `_tagsTotodo_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_tagsTotodo` ADD CONSTRAINT `_tagsTotodo_A_fkey` FOREIGN KEY (`A`) REFERENCES `tags`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_tagsTotodo` ADD CONSTRAINT `_tagsTotodo_B_fkey` FOREIGN KEY (`B`) REFERENCES `todo`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
