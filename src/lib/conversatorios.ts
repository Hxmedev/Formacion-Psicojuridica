import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function GetConversatorios() {
  return prisma.conversatorio.findMany({ orderBy: { year: 'desc' } });
}

export async function CreateConversatorio(data: any) {
  return prisma.conversatorio.create({ data });
}

export async function UpdateConversatorio(slug: string, data: any) {
  return prisma.conversatorio.update({ where: { slug }, data });
}

export async function DeleteConversatorio(slug: string) {
  return prisma.conversatorio.delete({ where: { slug } });
}
