-- AlterTable
ALTER TABLE "user" ADD COLUMN     "custom_permissions" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'viewer';
