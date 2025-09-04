-- AlterTable
ALTER TABLE "class" ADD COLUMN     "academicYearId" INTEGER;

-- CreateTable
CREATE TABLE "lesson" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "id_class" INTEGER NOT NULL,
    "dt_lesson" TIMESTAMP(3) NOT NULL,
    "nr_lesson" INTEGER NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" VARCHAR(500),
    "id_period" INTEGER NOT NULL,
    "id_person_create" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lesson_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "academic_year" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "id_person_create" INTEGER NOT NULL,

    CONSTRAINT "academic_year_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "academic_period" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "dt_start" TIMESTAMP(3) NOT NULL,
    "dt_end" TIMESTAMP(3) NOT NULL,
    "id_academy_year" INTEGER NOT NULL,
    "id_person_create" INTEGER NOT NULL,

    CONSTRAINT "academic_period_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "lesson_uuid_key" ON "lesson"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "academic_year_uuid_key" ON "academic_year"("uuid");

-- AddForeignKey
ALTER TABLE "class" ADD CONSTRAINT "class_academicYearId_fkey" FOREIGN KEY ("academicYearId") REFERENCES "academic_year"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lesson" ADD CONSTRAINT "lesson_id_class_fkey" FOREIGN KEY ("id_class") REFERENCES "class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lesson" ADD CONSTRAINT "lesson_id_period_fkey" FOREIGN KEY ("id_period") REFERENCES "academic_period"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lesson" ADD CONSTRAINT "lesson_id_person_create_fkey" FOREIGN KEY ("id_person_create") REFERENCES "person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "academic_period" ADD CONSTRAINT "academic_period_id_academy_year_fkey" FOREIGN KEY ("id_academy_year") REFERENCES "academic_year"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
