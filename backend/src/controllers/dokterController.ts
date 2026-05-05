import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export const getPasienSaya = async (req: Request, res: Response) => {
  try {
    const dokterId = req.user?.id;

    if (!dokterId) {
      res.status(401).json({ error: 'User tidak teridentifikasi' });
      return;
    }

    const data = await prisma.pemeriksaan.findMany({
      where: { dokterId },
      include: {
        pendaftaran: {
          include: {
            pasien: {
              include: {
                no_telp: true
              }
            }
          }
        },
        penyakit: true,
        jenis_rawat: {
          include: {
            kamar: true,
            tindakan: true,
            resep: {
              include: {
                obat: true
              }
            }
          }
        }
      },
      orderBy: {
        tanggal_pemeriksaan: 'desc'
      }
    });

    const formattedData = data;

    res.json(formattedData);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getDataPendukung = async (req: Request, res: Response) => {
  try {
    const [penyakit, obat, kamar] = await Promise.all([
      prisma.penyakit.findMany(),
      prisma.obat.findMany(),
      prisma.kamar.findMany({
        include: {
          rawat_inap: {
            where: { tanggal_keluar: null }
          }
        }
      })
    ]);

    const availableKamar = kamar.map(k => ({
      ...k,
      isAvailable: k.rawat_inap.length === 0
    }));

    res.json({ penyakit, obat, kamar: availableKamar });
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil data pendukung' });
  }
};

export const inputTindakanMedis = async (req: Request, res: Response) => {
  const { id_pemeriksaan } = req.params;
  const { 
    keluhan, 
    diagnosa, 
    penyakitIds, 
    tipe_rawat, 
    kamarId, 
    no_antrian, 
    tindakan, 
    resep 
  } = req.body;

  try {
    await prisma.$transaction(async (tx) => {
      // 1. Update Pemeriksaan
      await tx.pemeriksaan.update({
        where: { id_pemeriksaan: Number(id_pemeriksaan) },
        data: {
          keluhan: String(keluhan),
          diagnosa: String(diagnosa),
          penyakit: {
            set: (penyakitIds || []).map((id: number) => ({ id_penyakit: Number(id) }))
          }
        }
      });

      // 2. Create or Update JenisRawat
      let jenisRawat = await tx.jenisRawat.findFirst({
        where: { pemeriksaanId: Number(id_pemeriksaan) }
      });

      const jrData: any = {
        tipe_rawat,
        no_antrian: tipe_rawat === 'RAWAT_JALAN' ? String(no_antrian) : null,
        tanggal_masuk: tipe_rawat === 'RAWAT_INAP' ? new Date() : null,
      };

      if (tipe_rawat === 'RAWAT_INAP' && kamarId) {
        jrData.kamar = { connect: { id_kamar: Number(kamarId) } };
      } else if (jenisRawat) {
        jrData.kamar = { disconnect: true };
      }

      if (jenisRawat) {
        jenisRawat = await tx.jenisRawat.update({
          where: { id_jenis_rawat: jenisRawat.id_jenis_rawat },
          data: jrData
        });
      } else {
        jrData.pemeriksaan = { connect: { id_pemeriksaan: Number(id_pemeriksaan) } };
        jenisRawat = await tx.jenisRawat.create({
          data: jrData
        });
      }

      // 3. Add Tindakan
      if (tindakan && tindakan.length > 0) {
        for (const t of tindakan) {
          await tx.tindakan.create({
            data: {
              nama_tindakan: String(t.nama),
              biaya_tindakan: Number(t.biaya || 0),
              jenis_rawat: { connect: { id_jenis_rawat: jenisRawat!.id_jenis_rawat } }
            }
          });
        }
      }

      // 4. Add Resep & Obat
      if (resep && resep.length > 0) {
        await tx.resep.create({
          data: {
            tanggal_resep: new Date(),
            jenis_rawat: { connect: { id_jenis_rawat: jenisRawat!.id_jenis_rawat } },
            obat: {
              connect: resep.map((r: any) => ({ id_obat: Number(r.obatId) }))
            }
          }
        });

        // Kurangi stok obat
        for (const item of resep) {
          await tx.obat.update({
            where: { id_obat: Number(item.obatId) },
            data: { stok: { decrement: Number(item.jumlah) } }
          });
        }
      }
    });

    res.json({ message: 'Data medis berhasil disimpan' });
  } catch (error) {
    console.error('inputTindakanMedis error:', error);
    res.status(500).json({ message: 'Gagal menyimpan data medis' });
  }
};
