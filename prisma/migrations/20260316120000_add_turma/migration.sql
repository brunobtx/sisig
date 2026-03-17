-- Guard: ensure every classe has academic year before migrating
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM "class" WHERE "academicYearId" IS NULL) THEN
    RAISE EXCEPTION 'Não é possível migrar: existem classes sem academicYearId.';
  END IF;
END $$;

-- CreateTable
CREATE TABLE "turma" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "id_class" INTEGER NOT NULL,
    "id_academic_year" INTEGER NOT NULL,
    "bo_situacao" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "turma_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "turma_uuid_key" ON "turma"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "turma_id_class_id_academic_year_key" ON "turma"("id_class", "id_academic_year");

-- AddForeignKey
ALTER TABLE "turma" ADD CONSTRAINT "turma_id_class_fkey" FOREIGN KEY ("id_class") REFERENCES "class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "turma" ADD CONSTRAINT "turma_id_academic_year_fkey" FOREIGN KEY ("id_academic_year") REFERENCES "academic_year"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Migrate existing classes into turmas
INSERT INTO "turma" ("id", "uuid", "id_class", "id_academic_year", "bo_situacao", "created_at")
SELECT "id", "uuid", "id", "academicYearId", "bo_situacao", "created_at"
FROM "class";

-- Ensure sequence is set after manual inserts
SELECT setval(pg_get_serial_sequence('turma', 'id'), COALESCE((SELECT MAX("id") FROM "turma"), 1));

-- Rename class_teacher -> turma_teacher
ALTER TABLE "class_teacher" RENAME TO "turma_teacher";
ALTER TABLE "turma_teacher" RENAME COLUMN "id_class" TO "id_turma";
ALTER TABLE "turma_teacher" DROP CONSTRAINT "class_teacher_id_class_fkey";
ALTER TABLE "turma_teacher" DROP CONSTRAINT "class_teacher_id_teacher_fkey";
DROP INDEX "class_teacher_uuid_key";
DROP INDEX "class_teacher_id_teacher_id_class_key";
CREATE UNIQUE INDEX "turma_teacher_uuid_key" ON "turma_teacher"("uuid");
CREATE UNIQUE INDEX "turma_teacher_id_teacher_id_turma_key" ON "turma_teacher"("id_teacher", "id_turma");
ALTER TABLE "turma_teacher" ADD CONSTRAINT "turma_teacher_id_teacher_fkey" FOREIGN KEY ("id_teacher") REFERENCES "teacher"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "turma_teacher" ADD CONSTRAINT "turma_teacher_id_turma_fkey" FOREIGN KEY ("id_turma") REFERENCES "turma"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Rename class_student -> turma_student
ALTER TABLE "class_student" RENAME TO "turma_student";
ALTER TABLE "turma_student" RENAME COLUMN "id_class" TO "id_turma";
ALTER TABLE "turma_student" DROP CONSTRAINT "class_student_id_class_fkey";
ALTER TABLE "turma_student" DROP CONSTRAINT "class_student_id_student_fkey";
DROP INDEX "class_student_uuid_key";
DROP INDEX "class_student_id_student_id_class_key";
CREATE UNIQUE INDEX "turma_student_uuid_key" ON "turma_student"("uuid");
CREATE UNIQUE INDEX "turma_student_id_student_id_turma_key" ON "turma_student"("id_student", "id_turma");
ALTER TABLE "turma_student" ADD CONSTRAINT "turma_student_id_student_fkey" FOREIGN KEY ("id_student") REFERENCES "student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "turma_student" ADD CONSTRAINT "turma_student_id_turma_fkey" FOREIGN KEY ("id_turma") REFERENCES "turma"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Update class_session to reference turma
ALTER TABLE "class_session" DROP CONSTRAINT "class_session_id_class_fkey";
ALTER TABLE "class_session" RENAME COLUMN "id_class" TO "id_turma";
ALTER TABLE "class_session" ADD CONSTRAINT "class_session_id_turma_fkey" FOREIGN KEY ("id_turma") REFERENCES "turma"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Update lesson to reference turma
ALTER TABLE "lesson" DROP CONSTRAINT "lesson_id_class_fkey";
ALTER TABLE "lesson" RENAME COLUMN "id_class" TO "id_turma";
ALTER TABLE "lesson" ADD CONSTRAINT "lesson_id_turma_fkey" FOREIGN KEY ("id_turma") REFERENCES "turma"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Drop academicYearId from class (now held by turma)
ALTER TABLE "class" DROP CONSTRAINT "class_academicYearId_fkey";
ALTER TABLE "class" DROP COLUMN "academicYearId";
