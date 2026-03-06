import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();
const ALL_ACTIONS = ['create', 'read', 'update', 'delete', 'export'] as const;
const ADMIN_PERMISSION_MODULES = ['people', 'users', 'members', 'events', 'school', 'finance', 'settings', 'organization'] as const;

async function syncSerialSequence(tableName: string): Promise<void> {
  await prisma.$executeRawUnsafe(`
    SELECT setval(
      pg_get_serial_sequence('"${tableName}"', 'id'),
      COALESCE((SELECT MAX(id) + 1 FROM "${tableName}"), 1),
      false
    );
  `);
}

async function syncAllSeedSequences(): Promise<void> {
  const tables = [
    'person',
    'user',
    'organization',
    'service',
    'feature',
    'permission',
    'permission_group',
    'permission_group_permission',
    'user_permission_group',
  ];

  for (const table of tables) {
    await syncSerialSequence(table);
  }
}

async function main() {
  await syncAllSeedSequences();

  const seedName = process.env.SEED_USER_NAME ?? 'Administrador';
  const seedEmail = process.env.SEED_USER_EMAIL ?? 'admin@sisig.local';
  const seedCpf = process.env.SEED_USER_CPF ?? '52998224725';
  const seedPhone = process.env.SEED_USER_PHONE ?? '11999999999';
  const seedSexo = process.env.SEED_USER_SEXO ?? 'M';
  const seedPassword = process.env.SEED_USER_PASSWORD ?? '123456';
  const seedBirthDate = process.env.SEED_USER_BIRTH_DATE ?? '1990-01-01';
  const seedAdminGroupName = process.env.SEED_ADMIN_GROUP_NAME ?? 'admin_full_access';
  const seedAdminGroupDescription =
    process.env.SEED_ADMIN_GROUP_DESCRIPTION ?? 'Grupo administrador com acesso total ao sistema';

  let person = await prisma.person.findUnique({ where: { email: seedEmail } });

  if (!person) {
    person = await prisma.person.findUnique({ where: { cpf: seedCpf } });
  }

  if (!person) {
    person = await prisma.person.create({
      data: {
        name: seedName,
        cpf: seedCpf,
        phone: seedPhone,
        dt_nasc: new Date(seedBirthDate),
        sexo: seedSexo,
        situacao: true,
        email: seedEmail,
      },
    });
  } else {
    person = await prisma.person.update({
      where: { id: person.id },
      data: {
        name: seedName,
        phone: seedPhone,
        dt_nasc: new Date(seedBirthDate),
        sexo: seedSexo,
        situacao: true,
        email: seedEmail,
        cpf: seedCpf,
      },
    });
  }

  const passwordHash = await hash(seedPassword, 8);
  const existingUser = await prisma.user.findUnique({
    where: { id_person: person.id },
  });

  if (!existingUser) {
    const data: any = {
      id_person: person.id,
      password: passwordHash,
      role: 'admin',
    };

    await prisma.user.create({
      data,
    });
  } else {
    const data: any = {
      password: passwordHash,
      role: 'admin',
    };

    await prisma.user.update({
      where: { id: existingUser.id },
      data,
    });
  }

  const adminUser = await prisma.user.findUnique({
    where: { id_person: person.id },
    select: { id: true },
  });

  if (!adminUser) {
    throw new Error('Não foi possível criar/atualizar o usuário admin para aplicar permissões.');
  }

  const permissionKeys = ADMIN_PERMISSION_MODULES.reduce<string[]>((acc, moduleName) => {
    for (const action of ALL_ACTIONS) {
      acc.push(`${moduleName}:${action}`);
    }

    return acc;
  }, []);

  const permissionIds: number[] = [];

  for (const key of permissionKeys) {
    const [serviceCode, featureCode] = key.split(':');

    const service = await (prisma as any).service.upsert({
      where: { code: serviceCode },
      create: {
        code: serviceCode,
        name: serviceCode,
      },
      update: {
        name: serviceCode,
      },
      select: { id: true },
    });

    const feature = await (prisma as any).feature.upsert({
      where: {
        service_id_code: {
          service_id: service.id,
          code: featureCode,
        },
      },
      create: {
        service_id: service.id,
        code: featureCode,
        name: featureCode,
      },
      update: {
        name: featureCode,
      },
      select: { id: true },
    });

    const permission = await (prisma as any).permission.upsert({
      where: { key },
      create: {
        key,
        service_id: service.id,
        feature_id: feature.id,
      },
      update: {
        service_id: service.id,
        feature_id: feature.id,
      },
      select: { id: true },
    });

    permissionIds.push(permission.id);
  }

  const adminGroup = await (prisma as any).permissionGroup.upsert({
    where: { name: seedAdminGroupName },
    create: {
      name: seedAdminGroupName,
      description: seedAdminGroupDescription,
      is_active: true,
    },
    update: {
      description: seedAdminGroupDescription,
      is_active: true,
    },
    select: { id: true },
  });

  await (prisma as any).permissionGroupPermission.deleteMany({
    where: { permission_group_id: adminGroup.id },
  });

  await (prisma as any).permissionGroupPermission.createMany({
    data: Array.from(new Set(permissionIds)).map((permissionId) => ({
      permission_group_id: adminGroup.id,
      permission_id: permissionId,
    })),
    skipDuplicates: true,
  });

  await (prisma as any).userPermissionGroup.upsert({
    where: {
      user_id_permission_group_id: {
        user_id: adminUser.id,
        permission_group_id: adminGroup.id,
      },
    },
    create: {
      user_id: adminUser.id,
      permission_group_id: adminGroup.id,
    },
    update: {},
  });

  console.log('Seed concluido com sucesso.');
  console.log(`Usuario: ${seedEmail}`);
  console.log(`Senha: ${seedPassword}`);
  console.log(`Grupo admin: ${seedAdminGroupName}`);
}

async function run() {
  try {
    await main();
  } catch (error) {
    console.error('Erro ao executar seed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

run();
