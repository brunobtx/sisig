-- CreateTable
CREATE TABLE "organization" (
  "id" SERIAL NOT NULL,
  "uuid" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "id_parent" INTEGER,
  "bo_situacao" BOOLEAN NOT NULL DEFAULT true,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "organization_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "organization_uuid_key" ON "organization"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "organization_name_id_parent_key" ON "organization"("name", "id_parent");

-- CreateIndex
CREATE INDEX "organization_id_parent_idx" ON "organization"("id_parent");

-- AddForeignKey
ALTER TABLE "organization"
ADD CONSTRAINT "organization_id_parent_fkey"
FOREIGN KEY ("id_parent")
REFERENCES "organization"("id")
ON DELETE SET NULL
ON UPDATE CASCADE;
