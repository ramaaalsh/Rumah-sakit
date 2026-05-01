-- CreateTable
CREATE TABLE `AkunPegawai` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `pegawaiId` INTEGER NOT NULL,

    UNIQUE INDEX `AkunPegawai_username_key`(`username`),
    UNIQUE INDEX `AkunPegawai_pegawaiId_key`(`pegawaiId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Fasilitas` (
    `id_fasilitas` INTEGER NOT NULL AUTO_INCREMENT,
    `nama_fasilitas` VARCHAR(191) NOT NULL,
    `deskripsi` TEXT NULL,
    `icon` VARCHAR(191) NULL,

    PRIMARY KEY (`id_fasilitas`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `JadwalDokter` (
    `id_jadwal` INTEGER NOT NULL AUTO_INCREMENT,
    `hari` VARCHAR(191) NOT NULL,
    `jam_mulai` VARCHAR(191) NOT NULL,
    `jam_selesai` VARCHAR(191) NOT NULL,
    `dokterId` INTEGER NOT NULL,

    PRIMARY KEY (`id_jadwal`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `AkunPegawai` ADD CONSTRAINT `AkunPegawai_pegawaiId_fkey` FOREIGN KEY (`pegawaiId`) REFERENCES `Pegawai`(`id_pegawai`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `JadwalDokter` ADD CONSTRAINT `JadwalDokter_dokterId_fkey` FOREIGN KEY (`dokterId`) REFERENCES `Pegawai`(`id_pegawai`) ON DELETE RESTRICT ON UPDATE CASCADE;
