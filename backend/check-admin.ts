import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkAdmin() {
  const admin = await prisma.akunPegawai.findFirst({
    where: { username: 'admin' },
    include: { pegawai: true }
  });
  console.log('Admin Account:', JSON.stringify(admin, null, 2));
}

checkAdmin()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
