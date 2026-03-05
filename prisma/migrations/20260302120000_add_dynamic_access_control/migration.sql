-- CreateTable
CREATE TABLE "permission" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "service" TEXT NOT NULL,
    "feature" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "permission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permission_group" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "permission_group_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permission_group_permission" (
    "id" SERIAL NOT NULL,
    "permission_group_id" INTEGER NOT NULL,
    "permission_id" INTEGER NOT NULL,

    CONSTRAINT "permission_group_permission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_permission_group" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "permission_group_id" INTEGER NOT NULL,

    CONSTRAINT "user_permission_group_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "permission_uuid_key" ON "permission"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "permission_key_key" ON "permission"("key");

-- CreateIndex
CREATE UNIQUE INDEX "permission_group_uuid_key" ON "permission_group"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "permission_group_name_key" ON "permission_group"("name");

-- CreateIndex
CREATE UNIQUE INDEX "permission_group_permission_permission_group_id_permission_i_key" ON "permission_group_permission"("permission_group_id", "permission_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_permission_group_user_id_permission_group_id_key" ON "user_permission_group"("user_id", "permission_group_id");

-- AddForeignKey
ALTER TABLE "permission_group_permission" ADD CONSTRAINT "permission_group_permission_permission_group_id_fkey" FOREIGN KEY ("permission_group_id") REFERENCES "permission_group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "permission_group_permission" ADD CONSTRAINT "permission_group_permission_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "permission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_permission_group" ADD CONSTRAINT "user_permission_group_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_permission_group" ADD CONSTRAINT "user_permission_group_permission_group_id_fkey" FOREIGN KEY ("permission_group_id") REFERENCES "permission_group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
