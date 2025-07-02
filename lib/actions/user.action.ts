'use server';

import { db } from "../../database/index";
import { users } from "../../database/schema";

// Define the type for your user creation parameters
type CreateUserParams = {
  clerkId: string;
  email: string;
  firstName: string;
  lastName: string;
};

export default async function createUser(params: CreateUserParams) {
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
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}