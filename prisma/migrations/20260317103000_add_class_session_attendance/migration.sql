DO $$ BEGIN
  IF EXISTS (
    SELECT 1
    FROM "class_session"
    GROUP BY "id_turma", "nr_lesson"
    HAVING COUNT(*) > 1
  ) THEN
    RAISE EXCEPTION 'Não é possível migrar: existem aulas duplicadas por turma e número da aula.';
  END IF;
END $$;

ALTER TABLE "class_session"
ADD COLUMN "trimester" INTEGER NOT NULL DEFAULT 1;

ALTER TABLE "class_session"
ALTER COLUMN "trimester" DROP DEFAULT;

ALTER TABLE "class_session"
DROP CONSTRAINT "class_session_id_teacher_fkey";

ALTER TABLE "class_session"
ADD CONSTRAINT "class_session_id_teacher_fkey"
FOREIGN KEY ("id_teacher") REFERENCES "teacher"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE UNIQUE INDEX "class_session_id_turma_nr_lesson_key"
ON "class_session"("id_turma", "nr_lesson");

CREATE TABLE "class_session_attendance" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "id_class_session" INTEGER NOT NULL,
    "id_student" INTEGER NOT NULL,
    "is_present" BOOLEAN NOT NULL,
    "notes" VARCHAR(500),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "class_session_attendance_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "class_session_attendance_uuid_key"
ON "class_session_attendance"("uuid");

CREATE UNIQUE INDEX "class_session_attendance_id_class_session_id_student_key"
ON "class_session_attendance"("id_class_session", "id_student");

CREATE INDEX "class_session_attendance_id_class_session_idx"
ON "class_session_attendance"("id_class_session");

CREATE INDEX "class_session_attendance_id_student_idx"
ON "class_session_attendance"("id_student");

ALTER TABLE "class_session_attendance"
ADD CONSTRAINT "class_session_attendance_id_class_session_fkey"
FOREIGN KEY ("id_class_session") REFERENCES "class_session"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "class_session_attendance"
ADD CONSTRAINT "class_session_attendance_id_student_fkey"
FOREIGN KEY ("id_student") REFERENCES "student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
