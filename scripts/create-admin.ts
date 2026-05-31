import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@cochunho.vn';
  const plainPassword = 'admin123'; // Mật khẩu mới >= 6 ký tự
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
      companyName: 'Quản Trị Hệ Thống',
      phone: '0337998639',
      role: 'ADMIN',
      isApproved: true,
    },
  });
  
  console.log(`Successfully created/updated ADMIN account!`);
  console.log(`Email: ${admin.email}`);
  console.log(`Password: ${plainPassword}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
