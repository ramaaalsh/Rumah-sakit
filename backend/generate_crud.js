const fs = require('fs');
const path = require('path');

const entities = [
  { name: 'Pendaftaran', includes: '{ pasien: { include: { no_telp: true } }, admin: true }' },
  { name: 'Pemeriksaan', includes: '{ pendaftaran: { include: { pasien: true } }, dokter: true, penyakit: true }' },
  { name: 'Penyakit', includes: '{ tindakan: true }' },
  { name: 'Tindakan', includes: '{ jenis_rawat: true, penyakit: true }' },
  { name: 'JenisRawat', includes: '{ kamar: true, tindakan: true, resep: true }' },
  { name: 'Kamar', includes: 'null' },
  { name: 'Obat', includes: 'null' },
  { name: 'Resep', includes: '{ obat: true, jenis_rawat: true }' },
  { name: 'DetailObat', includes: 'null' },
  { name: 'Pembayaran', includes: '{ pasien: true, detail_obat: { include: { obat: true } } }' },
  { name: 'Fasilitas', includes: 'null' },
  { name: 'JadwalDokter', includes: '{ dokter: true }' }
];

const controllersDir = path.join(__dirname, 'src', 'controllers');
const routesDir = path.join(__dirname, 'src', 'routes');

if (!fs.existsSync(controllersDir)) fs.mkdirSync(controllersDir, { recursive: true });
if (!fs.existsSync(routesDir)) fs.mkdirSync(routesDir, { recursive: true });

entities.forEach(entity => {
  const lowerName = entity.name.charAt(0).toLowerCase() + entity.name.slice(1);
  const idField = `id_${lowerName.replace(/([A-Z])/g, "_$1").toLowerCase()}`;
  
  // Custom logic for ID field names based on Prisma schema
  let idParam = `id_${lowerName.toLowerCase()}`;
  if (entity.name === 'JadwalDokter') idParam = 'id_jadwal';
  if (entity.name === 'JenisRawat') idParam = 'id_jenis_rawat';
  if (entity.name === 'DetailObat') idParam = 'id_detail';

  const includeStr = entity.includes !== 'null' ? `\n    include: ${entity.includes}` : '';

  const controllerTemplate = `import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export const getAll${entity.name} = async (req: Request, res: Response) => {
  const data = await prisma.${lowerName}.findMany({${includeStr}});
  res.json(data);
};

export const get${entity.name}ById = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const data = await prisma.${lowerName}.findUnique({
    where: { ${idParam}: id },${includeStr}
  });

  if (!data) {
    res.status(404).json({ error: '${entity.name} tidak ditemukan' });
    return;
  }
  res.json(data);
};

export const create${entity.name} = async (req: Request, res: Response) => {
  const data = await prisma.${lowerName}.create({
    data: req.body,${includeStr}
  });
  res.status(201).json(data);
};

export const update${entity.name} = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const data = await prisma.${lowerName}.update({
    where: { ${idParam}: id },
    data: req.body,${includeStr}
  });
  res.json(data);
};

export const delete${entity.name} = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  await prisma.${lowerName}.delete({
    where: { ${idParam}: id }
  });
  res.json({ message: '${entity.name} berhasil dihapus' });
};
`;

  fs.writeFileSync(path.join(controllersDir, `${lowerName}Controller.ts`), controllerTemplate);

  const isPublicGet = ['Fasilitas', 'JadwalDokter'].includes(entity.name);
  const publicRouteStr = isPublicGet ? `\nrouter.get('/', getAll${entity.name});\nrouter.get('/:id', get${entity.name}ById);\n` : '';
  const protectedRouteStr = isPublicGet ? `\nrouter.use(authenticateJWT);\nrouter.use(requireRole(['ADMIN', 'DOKTER', 'PERAWAT']));\n\nrouter.post('/', create${entity.name});\nrouter.put('/:id', update${entity.name});\nrouter.delete('/:id', delete${entity.name});` : `\nrouter.use(authenticateJWT);\nrouter.use(requireRole(['ADMIN', 'DOKTER', 'PERAWAT']));\n\nrouter.get('/', getAll${entity.name});\nrouter.get('/:id', get${entity.name}ById);\nrouter.post('/', create${entity.name});\nrouter.put('/:id', update${entity.name});\nrouter.delete('/:id', delete${entity.name});`;

  const routeTemplate = `import express from 'express';
import { getAll${entity.name}, get${entity.name}ById, create${entity.name}, update${entity.name}, delete${entity.name} } from '../controllers/${lowerName}Controller';
import { authenticateJWT } from '../middleware/auth';
import { requireRole } from '../middleware/roleGuard';

const router = express.Router();
${publicRouteStr}${protectedRouteStr}

export default router;
`;

  fs.writeFileSync(path.join(routesDir, `${lowerName}.ts`), routeTemplate);
});

console.log('CRUD generation complete.');
