import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        nama: string;
        role: string;
      };
    }
  }
}

export const authenticateJWT = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];
    const secret = process.env.JWT_SECRET || 'rahasia123';

    jwt.verify(token, secret, (err, user) => {
      if (err) {
        res.status(401).json({ error: 'Token tidak valid atau sudah kadaluarsa' });
        return;
      }
      
      req.user = user as { id: number; nama: string; role: string };
      next();
    });
  } else {
    res.status(401).json({ error: 'Authorization header tidak ditemukan' });
  }
};
