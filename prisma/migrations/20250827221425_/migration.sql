/*
  Warnings:

  - You are about to drop the `Class` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ClassTeacher` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Teacher` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ClassTeacher" DROP CONSTRAINT "ClassTeacher_id_class_fkey";

-- DropForeignKey
ALTER TABLE "ClassTeacher" DROP CONSTRAINT "ClassTeacher_id_teacher_fkey";

-- DropForeignKey
ALTER TABLE "Teacher" DROP CONSTRAINT "Teacher_id_person_fkey";

-- DropTable
DROP TABLE "Class";

-- DropTable
DROP TABLE "ClassTeacher";

-- DropTable
DROP TABLE "Teacher";

-- CreateTable
CREATE TABLE "class" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "idade_in" INTEGER NOT NULL,
    "idade_fn" INTEGER NOT NULL,
    "bo_situacao" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "class_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "teacher" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "id_person" INTEGER NOT NULL,
    "bo_situacao" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "teacher_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "class_teacher" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "id_teacher" INTEGER NOT NULL,
    "id_class" INTEGER NOT NULL,

    CONSTRAINT "class_teacher_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "id_person" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "bo_situacao" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "student_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "class_student" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "id_student" INTEGER NOT NULL,
    "id_class" INTEGER NOT NULL,

    CONSTRAINT "class_student_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "class_uuid_key" ON "class"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "teacher_uuid_key" ON "teacher"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "teacher_id_person_key" ON "teacher"("id_person");

-- CreateIndex
CREATE UNIQUE INDEX "class_teacher_uuid_key" ON "class_teacher"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "class_teacher_id_teacher_id_class_key" ON "class_teacher"("id_teacher", "id_class");

-- CreateIndex
CREATE UNIQUE INDEX "student_uuid_key" ON "student"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "student_id_person_key" ON "student"("id_person");

-- CreateIndex
CREATE UNIQUE INDEX "class_student_uuid_key" ON "class_student"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "class_student_id_student_id_class_key" ON "class_student"("id_student", "id_class");

-- AddForeignKey
ALTER TABLE "teacher" ADD CONSTRAINT "teacher_id_person_fkey" FOREIGN KEY ("id_person") REFERENCES "person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "class_teacher" ADD CONSTRAINT "class_teacher_id_teacher_fkey" FOREIGN KEY ("id_teacher") REFERENCES "teacher"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "class_teacher" ADD CONSTRAINT "class_teacher_id_class_fkey" FOREIGN KEY ("id_class") REFERENCES "class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student" ADD CONSTRAINT "student_id_person_fkey" FOREIGN KEY ("id_person") REFERENCES "person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "class_student" ADD CONSTRAINT "class_student_id_student_fkey" FOREIGN KEY ("id_student") REFERENCES "student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "class_student" ADD CONSTRAINT "class_student_id_class_fkey" FOREIGN KEY ("id_class") REFERENCES "class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
