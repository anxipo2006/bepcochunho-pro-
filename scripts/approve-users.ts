import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.user.updateMany({
    data: {
      isApproved: true,
      role: 'ADMIN', // Set role to ADMIN for testing all features
    },
  });
  console.log('Successfully approved all users and set them to ADMIN role.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
