import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
  return new PrismaClient()
}

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>
}

// Ensure old cached Prisma client is cleared when hot-reloading after schema changes
if (process.env.NODE_ENV !== 'production' && globalThis.prismaGlobal) {
  try {
    globalThis.prismaGlobal.$disconnect();
  } catch (e) {}
  globalThis.prismaGlobal = undefined;
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma
