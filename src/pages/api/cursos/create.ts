// src/pages/api/cursos/create.ts
import { PrismaClient } from '@prisma/client';
import { Cloudinary } from '@root/lib/cloudinary';
import { v4 as uuidv4 } from 'uuid';
import { authGuard } from '@root/middleware/authGuard';

const prisma = new PrismaClient();

export async function POST({ request }: { request: Request }): Promise<Response> {
  const authResponse = await authGuard({ request });
  if (authResponse) return authResponse;

  try {
    const formData = await request.formData();

    const slug = formData.get('slug') as string;
    const title = formData.get('title') as string;
    const availability = formData.get('availability') as string;
    const docentesInput = formData.get('docentesInput') as string;
    const image = formData.get('image') as File;

    if (!slug || !title || !availability) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const docentes: string[] = docentesInput
      ? docentesInput.split('-').map(d => d.trim()).filter(d => d.length > 0)
      : [];

    let imageUrl: string | null = null;

    if (image && image.size > 0) {
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const extension = image.name.split('.').pop();
      const filename = `${uuidv4()}.${extension}`;

      const uploadBase64Result = await Cloudinary.uploader.upload(
        `data:${image.type};base64,${buffer.toString('base64')}`,
        {
          folder: 'cursos',
          public_id: filename,
          use_filename: true,
          overwrite: true,
          resource_type: 'image',
        }
      );

      imageUrl = uploadBase64Result.secure_url;
    }

    const curso = await prisma.curso.create({
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
        docentes: curso.docentes.map(d => d.name)
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );

  } catch (error: any) {
    console.error('Error creating course:', error);
    return new Response(
      JSON.stringify({
        error: 'Error creating course',
        details: error.message || error.toString()
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
