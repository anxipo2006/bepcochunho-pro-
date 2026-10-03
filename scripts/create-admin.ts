import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = process.env.SEED_ADMIN_EMAIL?.trim().toLowerCase();
  const plainPassword = process.env.SEED_ADMIN_PASSWORD;
  if (!email || !plainPassword || plainPassword.length < 16) {
    throw new Error('Set SEED_ADMIN_EMAIL and a unique SEED_ADMIN_PASSWORD (at least 16 characters).');
  }
  const password = await bcrypt.hash(plainPassword, 10);

  const admin = await prisma.user.upsert({
    where: { email },
    update: {
      role: 'ADMIN',
      isApproved: true,
      password,
    },
    create: {
      email,
      password,
      companyName: 'Cơm Văn Phòng Mến',
      phone: '0337998639',
      role: 'ADMIN',
      isApproved: true,
    },
  });
  
  console.log(`Created/updated admin account: ${admin.email}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
