// src/pages/api/update/[id].ts
import { PrismaClient } from '@prisma/client';
import { Cloudinary } from '@root/lib/cloudinary';
import { v4 as uuidv4 } from 'uuid';
import { authGuard } from '@root/middleware/authGuard';

const prisma = new PrismaClient();

export async function PUT({ request, params }: { request: Request; params: { id: string } }): Promise<Response> {
  // ✅ Verificar autorización con authGuard
  const authResponse = await authGuard({ request });
  if (authResponse) return authResponse;

  try {
    const id = Number(params.id);
    if (isNaN(id)) {
      return new Response(
        JSON.stringify({ error: 'ID inválido' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const formData = await request.formData();

    const slug = formData.get('slug') as string;
    const title = formData.get('title') as string;
    const availability = formData.get('availability') as string;
    const docentesInput = formData.get('docentesInput') as string;
    const image = formData.get('image') as File | null;

    if (!slug || !title || !availability) {
      return new Response(
        JSON.stringify({ error: 'Faltan campos obligatorios' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const docentes = docentesInput
      ? docentesInput.split('-').map(d => d.trim()).filter(Boolean)
      : [];

    const cursoActual = await prisma.curso.findUnique({
      where: { id },
      select: { imageUrl: true }
    });

    let imageUrl = cursoActual?.imageUrl || null;

    if (image && image.size > 0) {
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const extension = image.name.split('.').pop();
      const filename = `${uuidv4()}.${extension}`;

      if (cursoActual?.imageUrl) {
        const publicId = getPublicIdFromUrl(cursoActual.imageUrl);
        if (publicId) {
          await Cloudinary.uploader.destroy(publicId).catch(err =>
            console.warn('Error al eliminar imagen anterior en Cloudinary:', err)
          );
        }
      }

      const uploadResult = await Cloudinary.uploader.upload(
        `data:${image.type};base64,${buffer.toString('base64')}`,
        {
          folder: 'cursos',
          public_id: filename,
          use_filename: true,
          overwrite: true,
          resource_type: 'image',
        }
      );

      imageUrl = uploadResult.secure_url;
    }

    const curso = await prisma.curso.update({
      where: { id },
      data: {
        slug,
        title,
        availability,
        imageUrl,
        docentes: {
          connectOrCreate: docentes.map(name => ({
            where: { name },
            create: { name },
          })),
        }
      },
      include: {
        docentes: true
      }
    });

    return new Response(
      JSON.stringify({
        ...curso,
        docentes: curso.docentes.map(d => d.name),
        imageUrl,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );

  } catch (error: any) {
    console.error('Error updating course:', error);
    return new Response(
      JSON.stringify({
        error: 'Error al actualizar el curso',
        details: error.message || error.toString()
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

function getPublicIdFromUrl(url: string): string | null {
  try {
    const matches = url.match(/\/(?:v\d+\/)?([^/.]+)\.\w+$/);
    return matches?.[1] ? `cursos/${matches[1]}` : null;
  } catch {
    return null;
  }
}
