import { db } from "../db";

export async function createOrUpdateUser(userId: string, email: string) {
  return await db.user.upsert({
    where: { id: userId },
    create: {
      id: userId,
      email: email,
    },
    update: {
      email: email,
    },
  });
}