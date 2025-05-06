import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const cursos = await prisma.curso.findMany({
      include: {
        docentes: true, // Incluye los docentes directamente
      },
    });
    
    return new Response(JSON.stringify(cursos), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error en GET /api/cursos/get:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Error al obtener cursos',
        details: error instanceof Error ? error.message : String(error)
      }), 
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );
  }
}