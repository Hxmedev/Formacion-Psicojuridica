-- CreateTable
CREATE TABLE "Conversatorio" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "coordinator" TEXT,
    "date" TEXT,
    "time" TEXT,
    "linkToRegister" TEXT,
    "organization" TEXT,
    "imageUrl" TEXT,

    CONSTRAINT "Conversatorio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Speaker" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "conversatorioId" INTEGER NOT NULL,

    CONSTRAINT "Speaker_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Curso" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "availability" TEXT NOT NULL,
    "imageUrl" TEXT,

    CONSTRAINT "Curso_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Docente" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Docente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CursoToDocente" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_CursoToDocente_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Conversatorio_slug_key" ON "Conversatorio"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Curso_slug_key" ON "Curso"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Docente_name_key" ON "Docente"("name");

-- CreateIndex
CREATE INDEX "_CursoToDocente_B_index" ON "_CursoToDocente"("B");

-- AddForeignKey
ALTER TABLE "Speaker" ADD CONSTRAINT "Speaker_conversatorioId_fkey" FOREIGN KEY ("conversatorioId") REFERENCES "Conversatorio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CursoToDocente" ADD CONSTRAINT "_CursoToDocente_A_fkey" FOREIGN KEY ("A") REFERENCES "Curso"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CursoToDocente" ADD CONSTRAINT "_CursoToDocente_B_fkey" FOREIGN KEY ("B") REFERENCES "Docente"("id") ON DELETE CASCADE ON UPDATE CASCADE;
