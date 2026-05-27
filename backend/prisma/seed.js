require('dotenv').config();
const { PrismaClient } = require('../src/generated/prisma');
const { PrismaPg } = require('@prisma/adapter-pg');
const bcrypt = require('bcryptjs');

const adapter = new PrismaPg(process.env.DATABASE_URL);
const prisma = new PrismaClient({ adapter });

async function main() {
  const existing = await prisma.user.findUnique({
    where: { email: 'admin@project1.com' },
  });

  if (existing) {
    console.log('Admin user already exists — skipping.');
    return;
  }

  const hashed = await bcrypt.hash('Admin123!', 12);

  const admin = await prisma.user.create({
    data: {
      email: 'admin@project1.com',
      password: hashed,
      name: 'Admin',
      role: 'ADMIN',
    },
  });

  console.log(`Admin user created: ${admin.email}`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());