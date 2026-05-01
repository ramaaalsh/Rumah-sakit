import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export const getAllDetailObat = async (req: Request, res: Response) => {
  const data = await prisma.detailObat.findMany({});
  res.json(data);
};

export const getDetailObatById = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id as string);
  const data = await prisma.detailObat.findUnique({
    where: { id_detail: id },
  });

  if (!data) {
    res.status(404).json({ error: 'DetailObat tidak ditemukan' });
    return;
  }
  res.json(data);
};

export const createDetailObat = async (req: Request, res: Response) => {
  const data = await prisma.detailObat.create({
    data: req.body,
  });
  res.status(201).json(data);
};

export const updateDetailObat = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id as string);
  const data = await prisma.detailObat.update({
    where: { id_detail: id },
    data: req.body,
  });
  res.json(data);
};

export const deleteDetailObat = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id as string);
  await prisma.detailObat.delete({
    where: { id_detail: id }
  });
  res.json({ message: 'DetailObat berhasil dihapus' });
};
