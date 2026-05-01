import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).json({ error: 'Username dan password wajib diisi' });
      return;
    }

    const akun = await prisma.akunPegawai.findUnique({
      where: { username },
      include: {
        pegawai: true,
      },
    });

    if (!akun) {
      res.status(401).json({ error: 'Username atau password salah' });
      return;
    }

    const isMatch = await bcrypt.compare(password, akun.password);

    if (!isMatch) {
      res.status(401).json({ error: 'Username atau password salah' });
      return;
    }

    const secret = process.env.JWT_SECRET || 'rahasia123';
    
    const payload = {
      id: akun.pegawai.id_pegawai,
      nama: akun.pegawai.nama,
      role: akun.pegawai.role,
    };

    const token = jwt.sign(payload, secret, { expiresIn: '1d' });

    res.json({
      message: 'Login berhasil',
      token,
      user: payload,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Terjadi kesalahan pada server' });
  }
};
