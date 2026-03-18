-- AlterTable
ALTER TABLE "academic_year" ADD COLUMN "id_organization" INTEGER;

-- AlterTable
ALTER TABLE "class" ADD COLUMN "id_organization" INTEGER;

-- AlterTable
ALTER TABLE "turma" ADD COLUMN "id_organization" INTEGER;

-- CreateTable
CREATE TABLE "user_organization_access" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "id_user" INTEGER NOT NULL,
    "id_organization" INTEGER NOT NULL,
    "scope" TEXT NOT NULL DEFAULT 'organization',
    "is_default" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_organization_access_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_organization_access_uuid_key" ON "user_organization_access"("uuid");

-- CreateIndex
CREATE INDEX "user_organization_access_id_user_idx" ON "user_organization_access"("id_user");

-- CreateIndex
CREATE INDEX "user_organization_access_id_organization_idx" ON "user_organization_access"("id_organization");

-- CreateIndex
CREATE UNIQUE INDEX "user_organization_access_id_user_id_organization_scope_key"
ON "user_organization_access"("id_user", "id_organization", "scope");

-- CreateIndex
CREATE INDEX "academic_year_id_organization_idx" ON "academic_year"("id_organization");

-- CreateIndex
CREATE INDEX "class_id_organization_idx" ON "class"("id_organization");

-- CreateIndex
CREATE INDEX "turma_id_organization_idx" ON "turma"("id_organization");

-- AddForeignKey
ALTER TABLE "class"
ADD CONSTRAINT "class_id_organization_fkey"
FOREIGN KEY ("id_organization") REFERENCES "organization"("id")
ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "turma"
ADD CONSTRAINT "turma_id_organization_fkey"
FOREIGN KEY ("id_organization") REFERENCES "organization"("id")
ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "academic_year"
ADD CONSTRAINT "academic_year_id_organization_fkey"
FOREIGN KEY ("id_organization") REFERENCES "organization"("id")
ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_organization_access"
ADD CONSTRAINT "user_organization_access_id_user_fkey"
FOREIGN KEY ("id_user") REFERENCES "user"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_organization_access"
ADD CONSTRAINT "user_organization_access_id_organization_fkey"
FOREIGN KEY ("id_organization") REFERENCES "organization"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;

-- Backfill organization links using existing relations first and a safe default
-- organization only when there is exactly one active leaf org or one active org.
WITH active_leaf_organizations AS (
  SELECT o."id"
  FROM "organization" o
  WHERE o."bo_situacao" = true
    AND NOT EXISTS (
      SELECT 1
      FROM "organization" child
      WHERE child."id_parent" = o."id"
        AND child."bo_situacao" = true
    )
),
chosen_default_organization AS (
  SELECT "id"
  FROM active_leaf_organizations
  WHERE (SELECT COUNT(*) FROM active_leaf_organizations) = 1

  UNION ALL

  SELECT o."id"
  FROM "organization" o
  WHERE o."bo_situacao" = true
    AND (SELECT COUNT(*) FROM active_leaf_organizations) = 0
    AND (SELECT COUNT(*) FROM "organization" WHERE "bo_situacao" = true) = 1
)
UPDATE "person" p
SET "id_organization" = cdo."id"
FROM chosen_default_organization cdo
WHERE p."id_organization" IS NULL;

UPDATE "academic_year" ay
SET "id_organization" = p."id_organization"
FROM "person" p
WHERE ay."id_organization" IS NULL
  AND p."id" = ay."id_person_create"
  AND p."id_organization" IS NOT NULL;

WITH active_leaf_organizations AS (
  SELECT o."id"
  FROM "organization" o
  WHERE o."bo_situacao" = true
    AND NOT EXISTS (
      SELECT 1
      FROM "organization" child
      WHERE child."id_parent" = o."id"
        AND child."bo_situacao" = true
    )
),
chosen_default_organization AS (
  SELECT "id"
  FROM active_leaf_organizations
  WHERE (SELECT COUNT(*) FROM active_leaf_organizations) = 1

  UNION ALL

  SELECT o."id"
  FROM "organization" o
  WHERE o."bo_situacao" = true
    AND (SELECT COUNT(*) FROM active_leaf_organizations) = 0
    AND (SELECT COUNT(*) FROM "organization" WHERE "bo_situacao" = true) = 1
)
UPDATE "academic_year" ay
SET "id_organization" = cdo."id"
FROM chosen_default_organization cdo
WHERE ay."id_organization" IS NULL;

UPDATE "turma" t
SET "id_organization" = ay."id_organization"
FROM "academic_year" ay
WHERE t."id_organization" IS NULL
  AND ay."id" = t."id_academic_year"
  AND ay."id_organization" IS NOT NULL;

UPDATE "class" c
SET "id_organization" = t."id_organization"
FROM "turma" t
WHERE c."id_organization" IS NULL
  AND t."id_class" = c."id"
  AND t."id_organization" IS NOT NULL;

WITH active_leaf_organizations AS (
  SELECT o."id"
  FROM "organization" o
  WHERE o."bo_situacao" = true
    AND NOT EXISTS (
      SELECT 1
      FROM "organization" child
      WHERE child."id_parent" = o."id"
        AND child."bo_situacao" = true
    )
),
chosen_default_organization AS (
  SELECT "id"
  FROM active_leaf_organizations
  WHERE (SELECT COUNT(*) FROM active_leaf_organizations) = 1

  UNION ALL

  SELECT o."id"
  FROM "organization" o
  WHERE o."bo_situacao" = true
    AND (SELECT COUNT(*) FROM active_leaf_organizations) = 0
    AND (SELECT COUNT(*) FROM "organization" WHERE "bo_situacao" = true) = 1
)
UPDATE "class" c
SET "id_organization" = cdo."id"
FROM chosen_default_organization cdo
WHERE c."id_organization" IS NULL;

UPDATE "turma" t
SET "id_organization" = c."id_organization"
FROM "class" c
WHERE t."id_organization" IS NULL
  AND c."id" = t."id_class"
  AND c."id_organization" IS NOT NULL;

WITH active_leaf_organizations AS (
  SELECT o."id"
  FROM "organization" o
  WHERE o."bo_situacao" = true
    AND NOT EXISTS (
      SELECT 1
      FROM "organization" child
      WHERE child."id_parent" = o."id"
        AND child."bo_situacao" = true
    )
),
chosen_default_organization AS (
  SELECT "id"
  FROM active_leaf_organizations
  WHERE (SELECT COUNT(*) FROM active_leaf_organizations) = 1

  UNION ALL

  SELECT o."id"
  FROM "organization" o
  WHERE o."bo_situacao" = true
    AND (SELECT COUNT(*) FROM active_leaf_organizations) = 0
    AND (SELECT COUNT(*) FROM "organization" WHERE "bo_situacao" = true) = 1
)
UPDATE "turma" t
SET "id_organization" = cdo."id"
FROM chosen_default_organization cdo
WHERE t."id_organization" IS NULL;

INSERT INTO "user_organization_access" (
  "uuid",
  "id_user",
  "id_organization",
  "scope",
  "is_default",
  "created_at",
  "updated_at"
)
SELECT
  md5(random()::text || clock_timestamp()::text || u."id"::text || p."id_organization"::text),
  u."id",
  p."id_organization",
  'organization',
  false,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
FROM "user" u
INNER JOIN "person" p
  ON p."id" = u."id_person"
LEFT JOIN "user_organization_access" uoa
  ON uoa."id_user" = u."id"
 AND uoa."id_organization" = p."id_organization"
 AND uoa."scope" = 'organization'
WHERE p."id_organization" IS NOT NULL
  AND uoa."id" IS NULL;

WITH ranked_accesses AS (
  SELECT
    uoa."id",
    ROW_NUMBER() OVER (
      PARTITION BY uoa."id_user"
      ORDER BY
        CASE WHEN uoa."is_default" THEN 0 ELSE 1 END,
        uoa."created_at" ASC,
        uoa."id" ASC
    ) AS row_number
  FROM "user_organization_access" uoa
)
UPDATE "user_organization_access" uoa
SET
  "is_default" = (ranked_accesses.row_number = 1),
  "updated_at" = CURRENT_TIMESTAMP
FROM ranked_accesses
WHERE ranked_accesses."id" = uoa."id";
