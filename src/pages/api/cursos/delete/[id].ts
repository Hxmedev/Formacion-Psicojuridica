import { PrismaClient } from '@prisma/client';
import { unlink } from 'fs/promises';
import { join } from 'path';

const prisma = new PrismaClient();

export async function DELETE({ params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);
    if (isNaN(id)) {
      return new Response(
        JSON.stringify({ error: 'ID inválido' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Obtener el curso con la imagen asociada
    const curso = await prisma.curso.findUnique({
      where: { id },
      select: { imageUrl: true }
    });

    // Si existe una imagen, eliminarla del sistema
    if (curso?.imageUrl) {
      try {
        const imagePath = join(process.cwd(), 'public', curso.imageUrl);
        await unlink(imagePath); // Eliminar imagen del sistema de archivos
      } catch (err) {
        console.error('Error al eliminar imagen:', err);
      }
    }

    // Eliminar el curso de la base de datos
    await prisma.curso.delete({
      where: { id }
    });

    return new Response(
      JSON.stringify({ success: true }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error en DELETE /api/cursos/delete:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Error al eliminar el curso',
        details: error instanceof Error ? error.message : String(error)
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
