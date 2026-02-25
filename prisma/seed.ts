import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const seedName = process.env.SEED_USER_NAME ?? 'Administrador';
  const seedEmail = process.env.SEED_USER_EMAIL ?? 'admin@sisig.local';
  const seedCpf = process.env.SEED_USER_CPF ?? '52998224725';
  const seedPhone = process.env.SEED_USER_PHONE ?? '11999999999';
  const seedSexo = process.env.SEED_USER_SEXO ?? 'M';
  const seedPassword = process.env.SEED_USER_PASSWORD ?? '123456';
  const seedBirthDate = process.env.SEED_USER_BIRTH_DATE ?? '1990-01-01';

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
      custom_permissions: [],
    };

    await prisma.user.create({
      data,
    });
  } else {
    const data: any = {
      password: passwordHash,
      role: 'admin',
      custom_permissions: [],
    };

    await prisma.user.update({
      where: { id: existingUser.id },
      data,
    });
  }

  console.log('Seed concluido com sucesso.');
  console.log(`Usuario: ${seedEmail}`);
  console.log(`Senha: ${seedPassword}`);
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
