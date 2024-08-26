// utils/auth.ts
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } });
}

export async function comparePassword(plainPassword: string, hashedPassword: string) {
  return bcrypt.compare(plainPassword, hashedPassword);
}

export async function createUser(email: string, plainPassword: string, name?: string) {
  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  return prisma.user.create({
    data: {
      email,
      password: hashedPassword as any, // This should match your schema
      name,
    },
  });
}
