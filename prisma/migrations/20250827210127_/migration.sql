-- CreateTable
CREATE TABLE "Class" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "age_range" TEXT NOT NULL,

    CONSTRAINT "Class_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Teacher" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "id_person" INTEGER NOT NULL,

    CONSTRAINT "Teacher_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClassTeacher" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "id_teacher" INTEGER NOT NULL,
    "id_class" INTEGER NOT NULL,

    CONSTRAINT "ClassTeacher_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Class_uuid_key" ON "Class"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "Teacher_uuid_key" ON "Teacher"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "Teacher_id_person_key" ON "Teacher"("id_person");

-- CreateIndex
CREATE UNIQUE INDEX "ClassTeacher_uuid_key" ON "ClassTeacher"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "ClassTeacher_id_teacher_id_class_key" ON "ClassTeacher"("id_teacher", "id_class");

-- AddForeignKey
ALTER TABLE "Teacher" ADD CONSTRAINT "Teacher_id_person_fkey" FOREIGN KEY ("id_person") REFERENCES "person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassTeacher" ADD CONSTRAINT "ClassTeacher_id_teacher_fkey" FOREIGN KEY ("id_teacher") REFERENCES "Teacher"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassTeacher" ADD CONSTRAINT "ClassTeacher_id_class_fkey" FOREIGN KEY ("id_class") REFERENCES "Class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
