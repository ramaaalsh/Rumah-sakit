import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export const getAllResep = async (req: Request, res: Response) => {
  const data = await prisma.resep.findMany({
    include: { obat: true, jenis_rawat: true }});
  res.json(data);
};

export const getResepById = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id as string);
  const data = await prisma.resep.findUnique({
    where: { id_resep: id },
    include: { obat: true, jenis_rawat: true }
  });

  if (!data) {
    res.status(404).json({ error: 'Resep tidak ditemukan' });
    return;
  }
  res.json(data);
};

export const createResep = async (req: Request, res: Response) => {
  const data = await prisma.resep.create({
    data: req.body,
    include: { obat: true, jenis_rawat: true }
  });
  res.status(201).json(data);
};

export const updateResep = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id as string);
  const data = await prisma.resep.update({
    where: { id_resep: id },
    data: req.body,
    include: { obat: true, jenis_rawat: true }
  });
  res.json(data);
};

export const deleteResep = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id as string);
  await prisma.resep.delete({
    where: { id_resep: id }
  });
  res.json({ message: 'Resep berhasil dihapus' });
};
