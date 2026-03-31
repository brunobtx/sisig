-- Bootstrap manual de administrador inicial para ambientes vazios.
-- Ajuste os valores no bloco DECLARE antes de rodar em producao.
-- Senha inicial padrao deste arquivo: Admin@123456

CREATE OR REPLACE FUNCTION public._tmp_text_uuid()
RETURNS text
LANGUAGE SQL
AS $$
  SELECT lower(
    substr(hash_value, 1, 8) || '-' ||
    substr(hash_value, 9, 4) || '-' ||
    substr(hash_value, 13, 4) || '-' ||
    substr(hash_value, 17, 4) || '-' ||
    substr(hash_value, 21, 12)
  )
  FROM (
    SELECT md5(random()::text || clock_timestamp()::text || random()::text) AS hash_value
  ) AS generated;
$$;

DO $$
DECLARE
  v_admin_name text := 'Administrador';
  v_admin_email text := 'admin@sisig.local';
  v_admin_cpf text := '52998224725';
  v_admin_phone text := '11999999999';
  v_admin_sexo text := 'M';
  v_admin_birth_date date := DATE '1990-01-01';
  v_admin_password_hash text := '$2a$08$WORlBU4hQRKWMBCom3B8MOz8t5opkTvPnC1XkEEk4SE88U0HGYmMC';
  v_organization_name text := 'Organizacao Principal';
  v_organization_type text := 'headquarters';
  v_group_name text := 'admin_full_access';
  v_group_description text := 'Grupo administrador com acesso total ao sistema';
  v_permission_keys text[] := ARRAY[
    'members:create',
    'members:read',
    'organization:create',
    'organization:delete',
    'organization:read',
    'organization:update',
    'people:create',
    'people:delete',
    'people:read',
    'people:update',
    'school:create',
    'school:read',
    'school:update',
    'settings:read',
    'settings:update',
    'users:create',
    'users:read',
    'users:update'
  ];
  v_org_id integer;
  v_person_id integer;
  v_user_id integer;
  v_group_id integer;
  v_service_id integer;
  v_feature_id integer;
  v_permission_id integer;
  v_permission_key text;
  v_service_code text;
  v_feature_code text;
BEGIN
  SELECT o.id
  INTO v_org_id
  FROM "organization" o
  WHERE o."bo_situacao" = true
    AND NOT EXISTS (
      SELECT 1
      FROM "organization" child
      WHERE child."id_parent" = o."id"
        AND child."bo_situacao" = true
    )
  ORDER BY o."id"
  LIMIT 1;

  IF v_org_id IS NULL THEN
    SELECT o."id"
    INTO v_org_id
    FROM "organization" o
    WHERE o."bo_situacao" = true
    ORDER BY o."id"
    LIMIT 1;
  END IF;

  IF v_org_id IS NULL THEN
    INSERT INTO "organization" (
      "uuid",
      "name",
      "type",
      "bo_situacao",
      "created_at",
      "updated_at"
    )
    VALUES (
      public._tmp_text_uuid(),
      v_organization_name,
      v_organization_type,
      true,
      NOW(),
      NOW()
    )
    RETURNING "id" INTO v_org_id;
  END IF;

  SELECT p."id"
  INTO v_person_id
  FROM "person" p
  WHERE p."email" = v_admin_email
  LIMIT 1;

  IF v_person_id IS NULL THEN
    SELECT p."id"
    INTO v_person_id
    FROM "person" p
    WHERE p."cpf" = v_admin_cpf
    LIMIT 1;
  END IF;

  IF v_person_id IS NULL THEN
    INSERT INTO "person" (
      "uuid",
      "name",
      "cpf",
      "phone",
      "dt_nasc",
      "sexo",
      "situacao",
      "email",
      "id_organization",
      "created_at"
    )
    VALUES (
      public._tmp_text_uuid(),
      v_admin_name,
      v_admin_cpf,
      v_admin_phone,
      v_admin_birth_date,
      v_admin_sexo,
      true,
      v_admin_email,
      v_org_id,
      NOW()
    )
    RETURNING "id" INTO v_person_id;
  ELSE
    UPDATE "person"
    SET
      "name" = v_admin_name,
      "cpf" = v_admin_cpf,
      "phone" = v_admin_phone,
      "dt_nasc" = v_admin_birth_date,
      "sexo" = v_admin_sexo,
      "situacao" = true,
      "email" = v_admin_email,
      "id_organization" = COALESCE("id_organization", v_org_id),
      "updated_at" = NOW()
    WHERE "id" = v_person_id;
  END IF;

  SELECT u."id"
  INTO v_user_id
  FROM "user" u
  WHERE u."id_person" = v_person_id
  LIMIT 1;

  IF v_user_id IS NULL THEN
    INSERT INTO "user" (
      "uuid",
      "password",
      "id_person",
      "role",
      "created_at",
      "updated_at"
    )
    VALUES (
      public._tmp_text_uuid(),
      v_admin_password_hash,
      v_person_id,
      'admin',
      NOW(),
      NOW()
    )
    RETURNING "id" INTO v_user_id;
  ELSE
    UPDATE "user"
    SET
      "role" = 'admin',
      "updated_at" = NOW()
    WHERE "id" = v_user_id;
  END IF;

  SELECT pg."id"
  INTO v_group_id
  FROM "permission_group" pg
  WHERE pg."name" = v_group_name
  LIMIT 1;

  IF v_group_id IS NULL THEN
    INSERT INTO "permission_group" (
      "uuid",
      "name",
      "description",
      "is_active",
      "created_at",
      "updated_at"
    )
    VALUES (
      public._tmp_text_uuid(),
      v_group_name,
      v_group_description,
      true,
      NOW(),
      NOW()
    )
    RETURNING "id" INTO v_group_id;
  ELSE
    UPDATE "permission_group"
    SET
      "description" = v_group_description,
      "is_active" = true,
      "updated_at" = NOW()
    WHERE "id" = v_group_id;
  END IF;

  FOREACH v_permission_key IN ARRAY v_permission_keys
  LOOP
    v_service_code := split_part(v_permission_key, ':', 1);
    v_feature_code := split_part(v_permission_key, ':', 2);

    SELECT s."id"
    INTO v_service_id
    FROM "service" s
    WHERE s."code" = v_service_code
    LIMIT 1;

    IF v_service_id IS NULL THEN
      INSERT INTO "service" (
        "uuid",
        "code",
        "name",
        "created_at"
      )
      VALUES (
        public._tmp_text_uuid(),
        v_service_code,
        v_service_code,
        NOW()
      )
      RETURNING "id" INTO v_service_id;
    END IF;

    SELECT f."id"
    INTO v_feature_id
    FROM "feature" f
    WHERE f."service_id" = v_service_id
      AND f."code" = v_feature_code
    LIMIT 1;

    IF v_feature_id IS NULL THEN
      INSERT INTO "feature" (
        "uuid",
        "service_id",
        "code",
        "name",
        "created_at"
      )
      VALUES (
        public._tmp_text_uuid(),
        v_service_id,
        v_feature_code,
        v_feature_code,
        NOW()
      )
      RETURNING "id" INTO v_feature_id;
    END IF;

    SELECT p."id"
    INTO v_permission_id
    FROM "permission" p
    WHERE p."key" = v_permission_key
    LIMIT 1;

    IF v_permission_id IS NULL THEN
      INSERT INTO "permission" (
        "uuid",
        "key",
        "service_id",
        "feature_id",
        "created_at"
      )
      VALUES (
        public._tmp_text_uuid(),
        v_permission_key,
        v_service_id,
        v_feature_id,
        NOW()
      )
      RETURNING "id" INTO v_permission_id;
    ELSE
      UPDATE "permission"
      SET
        "service_id" = v_service_id,
        "feature_id" = v_feature_id
      WHERE "id" = v_permission_id;
    END IF;

    INSERT INTO "permission_group_permission" (
      "permission_group_id",
      "permission_id"
    )
    VALUES (
      v_group_id,
      v_permission_id
    )
    ON CONFLICT ("permission_group_id", "permission_id") DO NOTHING;
  END LOOP;

  INSERT INTO "user_permission_group" (
    "user_id",
    "permission_group_id"
  )
  VALUES (
    v_user_id,
    v_group_id
  )
  ON CONFLICT ("user_id", "permission_group_id") DO NOTHING;

  UPDATE "user_organization_access"
  SET "is_default" = false,
      "updated_at" = NOW()
  WHERE "id_user" = v_user_id;

  INSERT INTO "user_organization_access" (
    "uuid",
    "id_user",
    "id_organization",
    "scope",
    "is_default",
    "created_at",
    "updated_at"
  )
  VALUES (
    public._tmp_text_uuid(),
    v_user_id,
    v_org_id,
    'all',
    true,
    NOW(),
    NOW()
  )
  ON CONFLICT ("id_user", "id_organization", "scope")
  DO UPDATE SET
    "is_default" = EXCLUDED."is_default",
    "updated_at" = NOW();

  RAISE NOTICE 'Bootstrap concluido com sucesso.';
  RAISE NOTICE 'Email do admin: %', v_admin_email;
  RAISE NOTICE 'Senha inicial: Admin@123456';
END $$;

DROP FUNCTION IF EXISTS public._tmp_text_uuid();
