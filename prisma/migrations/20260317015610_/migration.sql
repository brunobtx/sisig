-- AlterTable
ALTER TABLE "turma_student" RENAME CONSTRAINT "class_student_pkey" TO "turma_student_pkey";

-- AlterTable
ALTER TABLE "turma_teacher" RENAME CONSTRAINT "class_teacher_pkey" TO "turma_teacher_pkey";
