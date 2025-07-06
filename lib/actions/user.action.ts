// lib/actions/user.action.ts
'use server';

import { db } from "../../database/index";
import { users } from "../../database/schema";
import { eq } from "drizzle-orm";

interface CreateUserParams {
  clerkId: string;
  email: string;
  username: string;
}

export async function createUser(params: CreateUserParams) {
  const { clerkId, email, username } = params;

  try {
    // Check if user already exists
    const existingUser = await db.select().from(users).where(eq(users.clerkId, clerkId))

    if (existingUser.length === 0) {
      await db.insert(users).values({
        clerkId,
        email,
        username,
      });
    }
    return { success: true };
  } catch (error) {
    console.error('Error creating user:', error);
    return { success: false, error };
  }
}

export async function deleteUser(clerkId: string) {
  try {
    await db.delete(users).where(eq(users.clerkId, clerkId));
    return { success: true };
  } catch (error) {
    console.error('Error deleting user:', error);
    return { success: false, error };
  }
}