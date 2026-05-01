import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export const getAllPendaftaran = async (req: Request, res: Response) => {
  const data = await prisma.pendaftaran.findMany({
    include: { pasien: { include: { no_telp: true } }, admin: true }});
  res.json(data);
};

export const getPendaftaranById = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id as string);
  const data = await prisma.pendaftaran.findUnique({
    where: { id_pendaftaran: id },
    include: { pasien: { include: { no_telp: true } }, admin: true }
  });

  if (!data) {
    res.status(404).json({ error: 'Pendaftaran tidak ditemukan' });
    return;
  }
  res.json(data);
};

export const createPendaftaran = async (req: Request, res: Response) => {
  const data = await prisma.pendaftaran.create({
    data: req.body,
    include: { pasien: { include: { no_telp: true } }, admin: true }
  });
  res.status(201).json(data);
};

export const updatePendaftaran = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id as string);
  const data = await prisma.pendaftaran.update({
    where: { id_pendaftaran: id },
    data: req.body,
    include: { pasien: { include: { no_telp: true } }, admin: true }
  });
  res.json(data);
};

export const deletePendaftaran = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id as string);
  await prisma.pendaftaran.delete({
    where: { id_pendaftaran: id }
  });
  res.json({ message: 'Pendaftaran berhasil dihapus' });
};
