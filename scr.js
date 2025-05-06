// testPrisma.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testConnection() {
  try {
    const conversatorios = await prisma.conversatorio.findMany();
    console.log(conversatorios);
  } catch (error) {
    console.error('Error al conectar con la base de datos:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
