import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export const getAllFasilitas = async (req: Request, res: Response) => {
  const data = await prisma.fasilitas.findMany({});
  res.json(data);
};

export const getFasilitasById = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id as string);
  const data = await prisma.fasilitas.findUnique({
    where: { id_fasilitas: id },
  });

  if (!data) {
    res.status(404).json({ error: 'Fasilitas tidak ditemukan' });
    return;
  }
  res.json(data);
};

export const createFasilitas = async (req: Request, res: Response) => {
  const data = await prisma.fasilitas.create({
    data: req.body,
  });
  res.status(201).json(data);
};

export const updateFasilitas = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id as string);
  const data = await prisma.fasilitas.update({
    where: { id_fasilitas: id },
    data: req.body,
  });
  res.json(data);
};

export const deleteFasilitas = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id as string);
  await prisma.fasilitas.delete({
    where: { id_fasilitas: id }
  });
  res.json({ message: 'Fasilitas berhasil dihapus' });
};
