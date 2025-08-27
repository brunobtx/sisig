-- CreateTable
CREATE TABLE "person" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "dt_nasc" TIMESTAMP(3) NOT NULL,
    "sexo" TEXT NOT NULL,
    "situacao" BOOLEAN NOT NULL DEFAULT true,
    "email" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "person_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "id_person" INTEGER NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "person_uuid_key" ON "person"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "person_cpf_key" ON "person"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "person_email_key" ON "person"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_uuid_key" ON "user"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "user_id_person_key" ON "user"("id_person");

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_id_person_fkey" FOREIGN KEY ("id_person") REFERENCES "person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
