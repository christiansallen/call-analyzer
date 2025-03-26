import { db } from "./db";
import { users } from "./drizzle/schema";
import { eq } from "drizzle-orm";

export async function createUserIfNotExists(email: string) {
  // Check if user exists
  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existingUser.length > 0) {
    // User already exists, return existing user
    return existingUser[0];
  }

  // Create new user
  const [newUser] = await db
    .insert(users)
    .values({
      email,
    })
    .returning();

  return newUser;
}
