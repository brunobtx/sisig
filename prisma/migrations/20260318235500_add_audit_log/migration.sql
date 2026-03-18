CREATE TABLE "audit_log" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "request_id" TEXT,
    "action_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actor_user_uuid" TEXT,
    "actor_role" TEXT,
    "active_organization_id" INTEGER,
    "target_organization_id" INTEGER,
    "module" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "entity_type" TEXT,
    "entity_id" TEXT,
    "entity_uuid" TEXT,
    "route" TEXT NOT NULL,
    "method" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "summary" TEXT,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "before_data" JSONB,
    "after_data" JSONB,
    "metadata" JSONB,

    CONSTRAINT "audit_log_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "audit_log_uuid_key" ON "audit_log"("uuid");
CREATE INDEX "audit_log_request_id_idx" ON "audit_log"("request_id");
CREATE INDEX "audit_log_action_at_idx" ON "audit_log"("action_at");
CREATE INDEX "audit_log_module_idx" ON "audit_log"("module");
CREATE INDEX "audit_log_action_idx" ON "audit_log"("action");
CREATE INDEX "audit_log_status_idx" ON "audit_log"("status");
CREATE INDEX "audit_log_actor_user_uuid_idx" ON "audit_log"("actor_user_uuid");
CREATE INDEX "audit_log_active_organization_id_idx" ON "audit_log"("active_organization_id");
CREATE INDEX "audit_log_target_organization_id_idx" ON "audit_log"("target_organization_id");
CREATE INDEX "audit_log_entity_type_entity_uuid_idx" ON "audit_log"("entity_type", "entity_uuid");
