import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export const getDataPasien = async (req: Request, res: Response) => {
  try {
    const data = await prisma.jenisRawat.findMany({
      include: {
        tindakan: {
          include: {
            penyakit: true
          }
        },
        resep: {
          include: {
            obat: true
          }
        },
        kamar: true,
        pemeriksaan: {
          include: {
            pendaftaran: {
              include: {
                pasien: true
              }
            },
            dokter: true
          }
        }
      },
      orderBy: {
        id_jenis_rawat: 'desc'
      }
    });

    res.json(data);
  } catch (error) {
    console.error('getDataPasien error:', error);
    res.status(500).json({ error: 'Terjadi kesalahan pada server' });
  }
};

export const getStatusKamar = async (req: Request, res: Response) => {
  try {
    const data = await prisma.kamar.findMany({
      include: {
        rawat_inap: {
          where: {
            tipe_rawat: 'RAWAT_INAP',
            tanggal_keluar: null
          },
          include: {
            pemeriksaan: {
              include: {
                pendaftaran: {
                  include: {
                    pasien: true
                  }
                }
              }
            }
          }
        }
      }
    });

    const formattedData = data.map(kamar => {
      const terpakai = kamar.rawat_inap.length > 0;
      const pasienNama = terpakai ? kamar.rawat_inap[0].pemeriksaan?.pendaftaran?.pasien?.nama || 'Pasien Anonim' : null;
      
      return {
        ...kamar,
        status: terpakai ? 'TERPAKAI' : 'TERSEDIA',
        pasienNama
      };
    });

    res.json(formattedData);
  } catch (error) {
    console.error('getStatusKamar error:', error);
    res.status(500).json({ error: 'Terjadi kesalahan pada server' });
  }
};
export const checkoutPasien = async (req: Request, res: Response) => {
  const { id_jenis_rawat } = req.params;
  console.log('Attempting checkout for ID:', id_jenis_rawat);

  try {
    const id = Number(id_jenis_rawat);
    if (isNaN(id)) {
      res.status(400).json({ error: 'ID tidak valid' });
      return;
    }

    const check = await prisma.jenisRawat.findUnique({
      where: { id_jenis_rawat: id }
    });

    if (!check) {
      res.status(404).json({ error: 'Data rawat tidak ditemukan' });
      return;
    }

    const updated = await prisma.jenisRawat.update({
      where: { id_jenis_rawat: id },
      data: {
        tanggal_keluar: new Date()
      }
    });

    console.log('Checkout success for ID:', id);
    res.json({ message: 'Pasien berhasil checkout', data: updated });
  } catch (error) {
    console.error('checkoutPasien detail error:', error);
    res.status(500).json({ error: 'Gagal melakukan checkout. Cek koneksi database.' });
  }
};
