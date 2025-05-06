// scripts/seed.ts

import { PrismaClient } from '@prisma/client';
import { conversatorios } from '../src/data/conversatorios.ts';  // Asegúrate de que estas importaciones sean correctas
import { cursos } from '../src/data/cursos.ts';

const prisma = new PrismaClient();

// Limpieza de datos previa para evitar conflictos
await prisma.speaker.deleteMany();
await prisma.conversatorio.deleteMany();
await prisma.docente.deleteMany(); // Añadido
await prisma.curso.deleteMany();   // Asegura limpiar antes de crear

// SEED DE CONVERSATORIOS
async function seedConversatorios() {
  for (const item of conversatorios) {
    const { speakers = [], ...conversatorioData } = item;

    const created = await prisma.conversatorio.create({
      data: {
        ...conversatorioData,
        speakers: {
          create: speakers.map(name => ({ name })),
        },
      },
    });

    console.log(`Conversatorio creado: ${created.title}`);
  }
}

// SEED DE CURSOS CON DOCENTES
async function seedCursos() {
  for (const curso of cursos) {
    const { docentes = [], ...cursoData } = curso;

    const created = await prisma.curso.create({
      data: {
        ...cursoData,
        docentes: {
          connectOrCreate: docentes.map((name: string) => ({
            where: { name },
            create: { name },
          })),
        },
      },
    });

    console.log(`Curso creado: ${created.title}`);
  }
}

// EJECUCIÓN PRINCIPAL
async function main() {
  console.log("Iniciando la creación de datos...");
  await seedConversatorios();
  await seedCursos();
  console.log("Datos creados exitosamente.");
}

main()
  .catch((e) => {
    console.error('Error al hacer seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
