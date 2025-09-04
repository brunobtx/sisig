-- CreateTable
CREATE TABLE "class_session" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "id_class" INTEGER NOT NULL,
    "dt_session" TIMESTAMP(3) NOT NULL,
    "nr_lesson" INTEGER NOT NULL,
    "topic" VARCHAR(255) NOT NULL,
    "id_teacher" INTEGER NOT NULL,
    "notes" VARCHAR(500),
    "id_person" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "class_session_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "class_session_uuid_key" ON "class_session"("uuid");

-- AddForeignKey
ALTER TABLE "class_session" ADD CONSTRAINT "class_session_id_class_fkey" FOREIGN KEY ("id_class") REFERENCES "class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "class_session" ADD CONSTRAINT "class_session_id_teacher_fkey" FOREIGN KEY ("id_teacher") REFERENCES "person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "class_session" ADD CONSTRAINT "class_session_id_person_fkey" FOREIGN KEY ("id_person") REFERENCES "person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
