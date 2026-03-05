-- CreateTable
CREATE TABLE "service" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "service_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feature" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "service_id" INTEGER NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "feature_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "service_uuid_key" ON "service"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "service_code_key" ON "service"("code");

-- CreateIndex
CREATE UNIQUE INDEX "feature_uuid_key" ON "feature"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "feature_service_id_code_key" ON "feature"("service_id", "code");

-- AddForeignKey
ALTER TABLE "feature" ADD CONSTRAINT "feature_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AlterTable
ALTER TABLE "permission" ADD COLUMN "service_id" INTEGER,
ADD COLUMN "feature_id" INTEGER;

-- Backfill catalog from existing permission rows
INSERT INTO "service" ("uuid", "code", "name")
SELECT md5(random()::text || clock_timestamp()::text), p."service", p."service"
FROM (
  SELECT DISTINCT "service"
  FROM "permission"
  WHERE "service" IS NOT NULL
) p
ON CONFLICT ("code") DO NOTHING;

INSERT INTO "feature" ("uuid", "service_id", "code", "name")
SELECT md5(random()::text || clock_timestamp()::text), s."id", p."feature", p."feature"
FROM (
  SELECT DISTINCT "service", "feature"
  FROM "permission"
  WHERE "service" IS NOT NULL AND "feature" IS NOT NULL
) p
JOIN "service" s ON s."code" = p."service"
ON CONFLICT ("service_id", "code") DO NOTHING;

UPDATE "permission" p
SET
  "service_id" = s."id",
  "feature_id" = f."id"
FROM "service" s, "feature" f
WHERE s."code" = p."service"
  AND f."service_id" = s."id"
  AND f."code" = p."feature";

ALTER TABLE "permission"
ALTER COLUMN "service_id" SET NOT NULL,
ALTER COLUMN "feature_id" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "permission_service_id_feature_id_key" ON "permission"("service_id", "feature_id");

-- AddForeignKey
ALTER TABLE "permission" ADD CONSTRAINT "permission_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "permission" ADD CONSTRAINT "permission_feature_id_fkey" FOREIGN KEY ("feature_id") REFERENCES "feature"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Drop legacy columns
ALTER TABLE "permission" DROP COLUMN "service",
DROP COLUMN "feature";
