import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const adminPassword = await hash('admin123secure', 12)
  await prisma.admin.upsert({
    where: { email: 'admin@elshatoury.com' },
    update: {},
    create: {
      email: 'admin@elshatoury.com',
      password: adminPassword,
    },
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 