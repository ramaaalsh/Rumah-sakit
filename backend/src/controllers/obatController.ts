import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export const getAllObat = async (req: Request, res: Response) => {
  const data = await prisma.obat.findMany({});
  res.json(data);
};

export const getObatById = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id as string);
  const data = await prisma.obat.findUnique({
    where: { id_obat: id },
  });

  if (!data) {
    res.status(404).json({ error: 'Obat tidak ditemukan' });
    return;
  }
  res.json(data);
};

export const createObat = async (req: Request, res: Response) => {
  const data = await prisma.obat.create({
    data: req.body,
  });
  res.status(201).json(data);
};

export const updateObat = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id as string);
  const data = await prisma.obat.update({
    where: { id_obat: id },
    data: req.body,
  });
  res.json(data);
};

export const deleteObat = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id as string);
  await prisma.obat.delete({
    where: { id_obat: id }
  });
  res.json({ message: 'Obat berhasil dihapus' });
};
