import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export const getAllPembayaran = async (req: Request, res: Response) => {
  const data = await prisma.pembayaran.findMany({
    include: { pasien: true, detail_obat: { include: { obat: true } } }});
  res.json(data);
};

export const getPembayaranById = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id as string);
  const data = await prisma.pembayaran.findUnique({
    where: { id_pembayaran: id },
    include: { pasien: true, detail_obat: { include: { obat: true } } }
  });

  if (!data) {
    res.status(404).json({ error: 'Pembayaran tidak ditemukan' });
    return;
  }
  res.json(data);
};

export const createPembayaran = async (req: Request, res: Response) => {
  const data = await prisma.pembayaran.create({
    data: req.body,
    include: { pasien: true, detail_obat: { include: { obat: true } } }
  });
  res.status(201).json(data);
};

export const updatePembayaran = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id as string);
  const data = await prisma.pembayaran.update({
    where: { id_pembayaran: id },
    data: req.body,
    include: { pasien: true, detail_obat: { include: { obat: true } } }
  });
  res.json(data);
};

export const deletePembayaran = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id as string);
  await prisma.pembayaran.delete({
    where: { id_pembayaran: id }
  });
  res.json({ message: 'Pembayaran berhasil dihapus' });
};
