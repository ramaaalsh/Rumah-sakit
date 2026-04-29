-- CreateTable
CREATE TABLE `Pegawai` (
    `id_pegawai` INTEGER NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(191) NOT NULL,
    `alamat` VARCHAR(191) NULL,
    `no_telp` VARCHAR(191) NULL,
    `role` ENUM('ADMIN', 'DOKTER', 'PERAWAT') NOT NULL,
    `pimpinan_id` INTEGER NULL,

    PRIMARY KEY (`id_pegawai`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Admin` (
    `id_pegawai` INTEGER NOT NULL,

    PRIMARY KEY (`id_pegawai`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Dokter` (
    `id_pegawai` INTEGER NOT NULL,
    `spesialisasi` VARCHAR(191) NULL,

    PRIMARY KEY (`id_pegawai`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Perawat` (
    `id_pegawai` INTEGER NOT NULL,
    `tipe_perawat` VARCHAR(191) NULL,
    `unit_bagian` VARCHAR(191) NULL,

    PRIMARY KEY (`id_pegawai`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Pasien` (
    `id_pasien` INTEGER NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(191) NOT NULL,
    `alamat` VARCHAR(191) NULL,
    `no_telp` VARCHAR(191) NULL,
    `tanggal_lahir` DATETIME(3) NULL,
    `jenis_kelamin` VARCHAR(191) NULL,

    PRIMARY KEY (`id_pasien`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Pendaftaran` (
    `id_pendaftaran` INTEGER NOT NULL AUTO_INCREMENT,
    `tanggal_daftar` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `keterangan_daftar` VARCHAR(191) NULL,
    `id_pasien` INTEGER NOT NULL,
    `id_pegawai` INTEGER NOT NULL,

    PRIMARY KEY (`id_pendaftaran`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Pemeriksaan` (
    `id_pemeriksaan` INTEGER NOT NULL AUTO_INCREMENT,
    `tanggal_pemeriksaan` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `diagnosa` VARCHAR(191) NULL,
    `keluhan` VARCHAR(191) NULL,
    `id_pendaftaran` INTEGER NOT NULL,
    `id_dokter` INTEGER NOT NULL,

    PRIMARY KEY (`id_pemeriksaan`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Penyakit` (
    `id_penyakit` INTEGER NOT NULL AUTO_INCREMENT,
    `nama_penyakit` VARCHAR(191) NOT NULL,
    `keterangan_penyakit` VARCHAR(191) NULL,

    PRIMARY KEY (`id_penyakit`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PemeriksaanPenyakit` (
    `id_pemeriksaan` INTEGER NOT NULL,
    `id_penyakit` INTEGER NOT NULL,

    PRIMARY KEY (`id_pemeriksaan`, `id_penyakit`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Tindakan` (
    `id_tindakan` INTEGER NOT NULL AUTO_INCREMENT,
    `nama_tindakan` VARCHAR(191) NOT NULL,
    `biaya_tindakan` DECIMAL(10, 2) NOT NULL,

    PRIMARY KEY (`id_tindakan`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PenyakitTindakan` (
    `id_penyakit` INTEGER NOT NULL,
    `id_tindakan` INTEGER NOT NULL,

    PRIMARY KEY (`id_penyakit`, `id_tindakan`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `JenisRawat` (
    `id_jenis_rawat` INTEGER NOT NULL AUTO_INCREMENT,
    `tipe` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id_jenis_rawat`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RawatInap` (
    `id_jenis_rawat` INTEGER NOT NULL,
    `tanggal_masuk` DATETIME(3) NOT NULL,
    `tanggal_keluar` DATETIME(3) NULL,
    `id_kamar` INTEGER NOT NULL,

    PRIMARY KEY (`id_jenis_rawat`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RawatJalan` (
    `id_jenis_rawat` INTEGER NOT NULL,
    `no_antrian` INTEGER NOT NULL,
    `status_kontrol` VARCHAR(191) NULL,

    PRIMARY KEY (`id_jenis_rawat`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Kamar` (
    `id_kamar` INTEGER NOT NULL AUTO_INCREMENT,
    `no_kamar` VARCHAR(191) NOT NULL,
    `kelas` VARCHAR(191) NOT NULL,
    `tarif` DECIMAL(10, 2) NOT NULL,

    PRIMARY KEY (`id_kamar`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Obat` (
    `id_obat` INTEGER NOT NULL AUTO_INCREMENT,
    `nama_obat` VARCHAR(191) NOT NULL,
    `harga` DECIMAL(10, 2) NOT NULL,
    `stok` INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY (`id_obat`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Resep` (
    `id_resep` INTEGER NOT NULL AUTO_INCREMENT,
    `tanggal_resep` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `id_pemeriksaan` INTEGER NOT NULL,
    `id_jenis_rawat` INTEGER NOT NULL,

    PRIMARY KEY (`id_resep`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DetailObat` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `harga_satuan` DECIMAL(10, 2) NOT NULL,
    `jumlah` INTEGER NOT NULL,
    `dosis` VARCHAR(191) NULL,
    `jenis_obat` VARCHAR(191) NULL,
    `id_resep` INTEGER NOT NULL,
    `id_obat` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Pembayaran` (
    `id_pembayaran` INTEGER NOT NULL AUTO_INCREMENT,
    `jumlah` DECIMAL(10, 2) NOT NULL,
    `tgl_pembayaran` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `metode_pembayaran` VARCHAR(191) NOT NULL,
    `id_pasien` INTEGER NOT NULL,

    PRIMARY KEY (`id_pembayaran`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Pegawai` ADD CONSTRAINT `Pegawai_pimpinan_id_fkey` FOREIGN KEY (`pimpinan_id`) REFERENCES `Pegawai`(`id_pegawai`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Admin` ADD CONSTRAINT `Admin_id_pegawai_fkey` FOREIGN KEY (`id_pegawai`) REFERENCES `Pegawai`(`id_pegawai`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Dokter` ADD CONSTRAINT `Dokter_id_pegawai_fkey` FOREIGN KEY (`id_pegawai`) REFERENCES `Pegawai`(`id_pegawai`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Perawat` ADD CONSTRAINT `Perawat_id_pegawai_fkey` FOREIGN KEY (`id_pegawai`) REFERENCES `Pegawai`(`id_pegawai`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pendaftaran` ADD CONSTRAINT `Pendaftaran_id_pasien_fkey` FOREIGN KEY (`id_pasien`) REFERENCES `Pasien`(`id_pasien`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pendaftaran` ADD CONSTRAINT `Pendaftaran_id_pegawai_fkey` FOREIGN KEY (`id_pegawai`) REFERENCES `Pegawai`(`id_pegawai`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pemeriksaan` ADD CONSTRAINT `Pemeriksaan_id_pendaftaran_fkey` FOREIGN KEY (`id_pendaftaran`) REFERENCES `Pendaftaran`(`id_pendaftaran`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pemeriksaan` ADD CONSTRAINT `Pemeriksaan_id_dokter_fkey` FOREIGN KEY (`id_dokter`) REFERENCES `Dokter`(`id_pegawai`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PemeriksaanPenyakit` ADD CONSTRAINT `PemeriksaanPenyakit_id_pemeriksaan_fkey` FOREIGN KEY (`id_pemeriksaan`) REFERENCES `Pemeriksaan`(`id_pemeriksaan`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PemeriksaanPenyakit` ADD CONSTRAINT `PemeriksaanPenyakit_id_penyakit_fkey` FOREIGN KEY (`id_penyakit`) REFERENCES `Penyakit`(`id_penyakit`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PenyakitTindakan` ADD CONSTRAINT `PenyakitTindakan_id_penyakit_fkey` FOREIGN KEY (`id_penyakit`) REFERENCES `Penyakit`(`id_penyakit`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PenyakitTindakan` ADD CONSTRAINT `PenyakitTindakan_id_tindakan_fkey` FOREIGN KEY (`id_tindakan`) REFERENCES `Tindakan`(`id_tindakan`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RawatInap` ADD CONSTRAINT `RawatInap_id_jenis_rawat_fkey` FOREIGN KEY (`id_jenis_rawat`) REFERENCES `JenisRawat`(`id_jenis_rawat`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RawatInap` ADD CONSTRAINT `RawatInap_id_kamar_fkey` FOREIGN KEY (`id_kamar`) REFERENCES `Kamar`(`id_kamar`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RawatJalan` ADD CONSTRAINT `RawatJalan_id_jenis_rawat_fkey` FOREIGN KEY (`id_jenis_rawat`) REFERENCES `JenisRawat`(`id_jenis_rawat`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Resep` ADD CONSTRAINT `Resep_id_pemeriksaan_fkey` FOREIGN KEY (`id_pemeriksaan`) REFERENCES `Pemeriksaan`(`id_pemeriksaan`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Resep` ADD CONSTRAINT `Resep_id_jenis_rawat_fkey` FOREIGN KEY (`id_jenis_rawat`) REFERENCES `JenisRawat`(`id_jenis_rawat`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DetailObat` ADD CONSTRAINT `DetailObat_id_resep_fkey` FOREIGN KEY (`id_resep`) REFERENCES `Resep`(`id_resep`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DetailObat` ADD CONSTRAINT `DetailObat_id_obat_fkey` FOREIGN KEY (`id_obat`) REFERENCES `Obat`(`id_obat`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pembayaran` ADD CONSTRAINT `Pembayaran_id_pasien_fkey` FOREIGN KEY (`id_pasien`) REFERENCES `Pasien`(`id_pasien`) ON DELETE RESTRICT ON UPDATE CASCADE;
