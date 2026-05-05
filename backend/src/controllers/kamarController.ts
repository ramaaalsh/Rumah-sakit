import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export const getAllKamar = async (req: Request, res: Response) => {
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
};

export const getKamarById = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id as string);
  const data = await prisma.kamar.findUnique({
    where: { id_kamar: id },
  });

  if (!data) {
    res.status(404).json({ error: 'Kamar tidak ditemukan' });
    return;
  }
  res.json(data);
};

export const createKamar = async (req: Request, res: Response) => {
  const data = await prisma.kamar.create({
    data: req.body,
  });
  res.status(201).json(data);
};

export const updateKamar = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id as string);
  const data = await prisma.kamar.update({
    where: { id_kamar: id },
    data: req.body,
  });
  res.json(data);
};

export const deleteKamar = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id as string);
  await prisma.kamar.delete({
    where: { id_kamar: id }
  });
  res.json({ message: 'Kamar berhasil dihapus' });
};
