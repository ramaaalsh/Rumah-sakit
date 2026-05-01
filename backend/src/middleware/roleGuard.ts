import { Request, Response, NextFunction } from 'express';

export const requireRole = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = req.user;

    if (!user) {
      res.status(401).json({ error: 'Akses ditolak, silakan login terlebih dahulu' });
      return;
    }

    if (!allowedRoles.includes(user.role)) {
      res.status(403).json({ error: `Akses ditolak. Membutuhkan role: ${allowedRoles.join(', ')}` });
      return;
    }

    next();
  };
};
