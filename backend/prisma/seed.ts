import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Hash passwords
  const hashedPassword = await bcrypt.hash('password123', 10);

  // Create Teacher
  const teacher = await prisma.user.upsert({
    where: { username: 'teacher1' },
    update: {},
    create: {
      username: 'teacher1',
      password: hashedPassword,
      role: Role.TEACHER,
    },
  });

  // Create Student
  const student = await prisma.user.upsert({
    where: { username: 'student1' },
    update: {},
    create: {
      username: 'student1',
      password: hashedPassword,
      role: Role.STUDENT,
    },
  });

  // Create a second student
  const student2 = await prisma.user.upsert({
    where: { username: 'student2' },
    update: {},
    create: {
      username: 'student2',
      password: hashedPassword,
      role: Role.STUDENT,
    },
  });

  console.log('Seed data created:');
  console.log({ teacher, student, student2 });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
