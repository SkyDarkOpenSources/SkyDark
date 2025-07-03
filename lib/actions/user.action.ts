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
    console.log('Creating user with params:', params);
    
    // Check if user already exists
    const existingUser = await db.select().from(users).where(eq(users.clerkId, clerkId));
    
    if (existingUser.length > 0) {
      console.log('User already exists:', existingUser[0]);
      return { success: true, user: existingUser[0] };
    }

    const newUser = await db.insert(users).values({
      clerkId,
      email,
      firstName,
      lastName,
    }).returning();

    console.log('User created successfully:', newUser[0]);
    return { success: true, user: newUser[0] };
  } catch (error) {
    console.error('Error creating user:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function updateUser(clerkId: string, params: Partial<CreateUserParams>) {
  try {
    console.log('Updating user with clerkId:', clerkId, 'params:', params);
    
    const updatedUser = await db.update(users)
      .set({
        ...params,
        updatedAt: new Date(),
      })
      .where(eq(users.clerkId, clerkId))
      .returning();

    if (updatedUser.length === 0) {
      throw new Error('User not found');
    }

    console.log('User updated successfully:', updatedUser[0]);
    return { success: true, user: updatedUser[0] };
  } catch (error) {
    console.error('Error updating user:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function deleteUser(clerkId: string) {
  try {
    console.log('Deleting user with clerkId:', clerkId);
    
    const deletedUser = await db.delete(users)
      .where(eq(users.clerkId, clerkId))
      .returning();

    if (deletedUser.length === 0) {
      console.log('No user found with clerkId:', clerkId);
      return { success: true, message: 'User not found or already deleted' };
    }

    console.log('User deleted successfully:', deletedUser[0]);
    return { success: true, user: deletedUser[0] };
  } catch (error) {
    console.error('Error deleting user:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function getUserByClerkId(clerkId: string) {
  try {
    const user = await db.select().from(users).where(eq(users.clerkId, clerkId));
    
    if (user.length === 0) {
      return { success: false, error: 'User not found' };
    }

    return { success: true, user: user[0] };
  } catch (error) {
    console.error('Error fetching user:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function getUserByEmail(email: string) {
  try {
    const user = await db.select().from(users).where(eq(users.email, email));
    
    if (user.length === 0) {
      return { success: false, error: 'User not found' };
    }

    return { success: true, user: user[0] };
  } catch (error) {
    console.error('Error fetching user by email:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}