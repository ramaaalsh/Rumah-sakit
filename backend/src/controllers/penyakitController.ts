import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export const getAllPenyakit = async (req: Request, res: Response) => {
  const data = await prisma.penyakit.findMany({
    include: { tindakan: true }});
  res.json(data);
};

export const getPenyakitById = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id as string);
  const data = await prisma.penyakit.findUnique({
    where: { id_penyakit: id },
    include: { tindakan: true }
  });

  if (!data) {
    res.status(404).json({ error: 'Penyakit tidak ditemukan' });
    return;
  }
  res.json(data);
};

export const createPenyakit = async (req: Request, res: Response) => {
  const data = await prisma.penyakit.create({
    data: req.body,
    include: { tindakan: true }
  });
  res.status(201).json(data);
};

export const updatePenyakit = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id as string);
  const data = await prisma.penyakit.update({
    where: { id_penyakit: id },
    data: req.body,
    include: { tindakan: true }
  });
  res.json(data);
};

export const deletePenyakit = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id as string);
  await prisma.penyakit.delete({
    where: { id_penyakit: id }
  });
  res.json({ message: 'Penyakit berhasil dihapus' });
};
