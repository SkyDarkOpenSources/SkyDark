'use server';

import { db } from "../../database/index";
import { users } from "../../database/schema";
import { eq } from 'drizzle-orm';

interface CreateUserParams {
  clerkId: string;
  email: string;
  firstName: string;
  lastName: string;
}

export async function createUser(params: CreateUserParams) {
  const { clerkId, email, firstName, lastName } = params;

  try {
    await db.insert(users).values({
      clerkId,
      email,
      firstName,
      lastName,
    });
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