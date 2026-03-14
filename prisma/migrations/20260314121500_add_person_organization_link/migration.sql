-- AlterTable
ALTER TABLE "person" ADD COLUMN "id_organization" INTEGER;

-- CreateIndex
CREATE INDEX "person_id_organization_idx" ON "person"("id_organization");

-- AddForeignKey
ALTER TABLE "person"
ADD CONSTRAINT "person_id_organization_fkey"
FOREIGN KEY ("id_organization")
REFERENCES "organization"("id")
ON DELETE SET NULL
ON UPDATE CASCADE;
