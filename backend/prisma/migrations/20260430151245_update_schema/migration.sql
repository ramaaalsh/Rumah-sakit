-- CreateTable
CREATE TABLE `Pegawai` (
    `id_pegawai` INTEGER NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(191) NOT NULL,
    `role` ENUM('ADMIN', 'DOKTER', 'PERAWAT') NOT NULL,
    `jalan` VARCHAR(191) NULL,
    `kota` VARCHAR(191) NULL,
    `kode_pos` VARCHAR(191) NULL,
    `spesialisasi` VARCHAR(191) NULL,
    `tipe_perawat` VARCHAR(191) NULL,
    `unit_bagian` VARCHAR(191) NULL,
    `pimpinanId` INTEGER NULL,

    PRIMARY KEY (`id_pegawai`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PegawaiTelp` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `no_telp` VARCHAR(191) NOT NULL,
    `pegawaiId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Pasien` (
    `id_pasien` INTEGER NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(191) NOT NULL,
    `jenis_kelamin` VARCHAR(191) NOT NULL,
    `tanggal_lahir` DATETIME(3) NOT NULL,
    `jalan` VARCHAR(191) NULL,
    `kota` VARCHAR(191) NULL,
    `kode_pos` VARCHAR(191) NULL,

    PRIMARY KEY (`id_pasien`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PasienTelp` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `no_telp` VARCHAR(191) NOT NULL,
    `pasienId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Pendaftaran` (
    `id_pendaftaran` INTEGER NOT NULL AUTO_INCREMENT,
    `tanggal_daftar` DATETIME(3) NOT NULL,
    `keterangan_daftar` VARCHAR(191) NULL,
    `pasienId` INTEGER NOT NULL,
    `adminId` INTEGER NOT NULL,

    PRIMARY KEY (`id_pendaftaran`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Pemeriksaan` (
    `id_pemeriksaan` INTEGER NOT NULL AUTO_INCREMENT,
    `tanggal_pemeriksaan` DATETIME(3) NOT NULL,
    `keluhan` TEXT NOT NULL,
    `diagnosa` TEXT NOT NULL,
    `pendaftaranId` INTEGER NOT NULL,
    `dokterId` INTEGER NOT NULL,

    PRIMARY KEY (`id_pemeriksaan`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Penyakit` (
    `id_penyakit` INTEGER NOT NULL AUTO_INCREMENT,
    `nama_penyakit` VARCHAR(191) NOT NULL,
    `keterangan_penyakit` TEXT NULL,

    PRIMARY KEY (`id_penyakit`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Tindakan` (
    `id_tindakan` INTEGER NOT NULL AUTO_INCREMENT,
    `nama_tindakan` VARCHAR(191) NOT NULL,
    `biaya_tindakan` DOUBLE NOT NULL,
    `jenisRawatId` INTEGER NOT NULL,

    PRIMARY KEY (`id_tindakan`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `JenisRawat` (
    `id_jenis_rawat` INTEGER NOT NULL AUTO_INCREMENT,
    `tipe_rawat` ENUM('RAWAT_INAP', 'RAWAT_JALAN') NOT NULL,
    `tanggal_masuk` DATETIME(3) NULL,
    `tanggal_keluar` DATETIME(3) NULL,
    `kamarId` INTEGER NULL,
    `no_antrian` VARCHAR(191) NULL,
    `status_kontrol` VARCHAR(191) NULL,

    PRIMARY KEY (`id_jenis_rawat`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Kamar` (
    `id_kamar` INTEGER NOT NULL AUTO_INCREMENT,
    `no_kamar` VARCHAR(191) NOT NULL,
    `kelas` VARCHAR(191) NOT NULL,
    `tarif` DOUBLE NOT NULL,

    PRIMARY KEY (`id_kamar`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Resep` (
    `id_resep` INTEGER NOT NULL AUTO_INCREMENT,
    `tanggal_resep` DATETIME(3) NOT NULL,
    `jenisRawatId` INTEGER NOT NULL,

    PRIMARY KEY (`id_resep`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Obat` (
    `id_obat` INTEGER NOT NULL AUTO_INCREMENT,
    `nama_obat` VARCHAR(191) NOT NULL,
    `harga` DOUBLE NOT NULL,
    `stok` INTEGER NOT NULL,

    PRIMARY KEY (`id_obat`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DetailObat` (
    `id_detail` INTEGER NOT NULL AUTO_INCREMENT,
    `jumlah` INTEGER NOT NULL,
    `dosis` VARCHAR(191) NULL,
    `jenis_obat` VARCHAR(191) NULL,
    `harga_satuan` DOUBLE NOT NULL,
    `obatId` INTEGER NOT NULL,
    `pembayaranId` INTEGER NOT NULL,

    PRIMARY KEY (`id_detail`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Pembayaran` (
    `id_pembayaran` INTEGER NOT NULL AUTO_INCREMENT,
    `tgl_pembayaran` DATETIME(3) NOT NULL,
    `jumlah` DOUBLE NOT NULL,
    `metode_pembayaran` VARCHAR(191) NOT NULL,
    `pasienId` INTEGER NOT NULL,

    PRIMARY KEY (`id_pembayaran`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_PemeriksaanPenyakit` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_PemeriksaanPenyakit_AB_unique`(`A`, `B`),
    INDEX `_PemeriksaanPenyakit_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_PenyakitTindakan` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_PenyakitTindakan_AB_unique`(`A`, `B`),
    INDEX `_PenyakitTindakan_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_ResepObat` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_ResepObat_AB_unique`(`A`, `B`),
    INDEX `_ResepObat_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Pegawai` ADD CONSTRAINT `Pegawai_pimpinanId_fkey` FOREIGN KEY (`pimpinanId`) REFERENCES `Pegawai`(`id_pegawai`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PegawaiTelp` ADD CONSTRAINT `PegawaiTelp_pegawaiId_fkey` FOREIGN KEY (`pegawaiId`) REFERENCES `Pegawai`(`id_pegawai`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PasienTelp` ADD CONSTRAINT `PasienTelp_pasienId_fkey` FOREIGN KEY (`pasienId`) REFERENCES `Pasien`(`id_pasien`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pendaftaran` ADD CONSTRAINT `Pendaftaran_pasienId_fkey` FOREIGN KEY (`pasienId`) REFERENCES `Pasien`(`id_pasien`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pendaftaran` ADD CONSTRAINT `Pendaftaran_adminId_fkey` FOREIGN KEY (`adminId`) REFERENCES `Pegawai`(`id_pegawai`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pemeriksaan` ADD CONSTRAINT `Pemeriksaan_pendaftaranId_fkey` FOREIGN KEY (`pendaftaranId`) REFERENCES `Pendaftaran`(`id_pendaftaran`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pemeriksaan` ADD CONSTRAINT `Pemeriksaan_dokterId_fkey` FOREIGN KEY (`dokterId`) REFERENCES `Pegawai`(`id_pegawai`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Tindakan` ADD CONSTRAINT `Tindakan_jenisRawatId_fkey` FOREIGN KEY (`jenisRawatId`) REFERENCES `JenisRawat`(`id_jenis_rawat`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `JenisRawat` ADD CONSTRAINT `JenisRawat_kamarId_fkey` FOREIGN KEY (`kamarId`) REFERENCES `Kamar`(`id_kamar`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Resep` ADD CONSTRAINT `Resep_jenisRawatId_fkey` FOREIGN KEY (`jenisRawatId`) REFERENCES `JenisRawat`(`id_jenis_rawat`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DetailObat` ADD CONSTRAINT `DetailObat_obatId_fkey` FOREIGN KEY (`obatId`) REFERENCES `Obat`(`id_obat`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DetailObat` ADD CONSTRAINT `DetailObat_pembayaranId_fkey` FOREIGN KEY (`pembayaranId`) REFERENCES `Pembayaran`(`id_pembayaran`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pembayaran` ADD CONSTRAINT `Pembayaran_pasienId_fkey` FOREIGN KEY (`pasienId`) REFERENCES `Pasien`(`id_pasien`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_PemeriksaanPenyakit` ADD CONSTRAINT `_PemeriksaanPenyakit_A_fkey` FOREIGN KEY (`A`) REFERENCES `Pemeriksaan`(`id_pemeriksaan`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_PemeriksaanPenyakit` ADD CONSTRAINT `_PemeriksaanPenyakit_B_fkey` FOREIGN KEY (`B`) REFERENCES `Penyakit`(`id_penyakit`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_PenyakitTindakan` ADD CONSTRAINT `_PenyakitTindakan_A_fkey` FOREIGN KEY (`A`) REFERENCES `Penyakit`(`id_penyakit`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_PenyakitTindakan` ADD CONSTRAINT `_PenyakitTindakan_B_fkey` FOREIGN KEY (`B`) REFERENCES `Tindakan`(`id_tindakan`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ResepObat` ADD CONSTRAINT `_ResepObat_A_fkey` FOREIGN KEY (`A`) REFERENCES `Obat`(`id_obat`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ResepObat` ADD CONSTRAINT `_ResepObat_B_fkey` FOREIGN KEY (`B`) REFERENCES `Resep`(`id_resep`) ON DELETE CASCADE ON UPDATE CASCADE;
