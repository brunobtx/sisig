/*
  Warnings:

  - You are about to drop the column `age_range` on the `Class` table. All the data in the column will be lost.
  - Added the required column `idade_fn` to the `Class` table without a default value. This is not possible if the table is not empty.
  - Added the required column `idade_in` to the `Class` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Class" DROP COLUMN "age_range",
ADD COLUMN     "bo_situacao" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "idade_fn" INTEGER NOT NULL,
ADD COLUMN     "idade_in" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Teacher" ADD COLUMN     "bo_situacao" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
