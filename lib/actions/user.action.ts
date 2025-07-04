'use server';

import { db } from "../../database/index";
import { users } from "../../database/schema";
import { eq } from 'drizzle-orm';

interface CreateUserParams {
  clerkId: string;
  email: string;
  firstName: string;
  lastName: string;
  profileImageUrl?: string;
}

export async function createUser(params: CreateUserParams) {
  const { clerkId, email, firstName, lastName, profileImageUrl } = params;

  try {
    const existingUser = await db.select().from(users).where(eq(users.clerkId, clerkId));
    
    if (existingUser.length > 0) {
      return { success: true, user: existingUser[0] };
    }

    const newUser = await db.insert(users).values({
      clerkId,
      email,
      firstName,
      lastName,
      profileImageUrl: profileImageUrl || null,
    }).returning();

    return { success: true, user: newUser[0] };
  } catch (error) {
    console.error('Error creating user:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function updateUser(clerkId: string, params: Partial<CreateUserParams>) {
  try {
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

    return { success: true, user: updatedUser[0] };
  } catch (error) {
    console.error('Error updating user:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function deleteUser(clerkId: string) {
  try {
    const deletedUser = await db.delete(users)
      .where(eq(users.clerkId, clerkId))
      .returning();

    return { 
      success: true, 
      user: deletedUser.length > 0 ? deletedUser[0] : null,
      message: deletedUser.length > 0 ? 'User deleted' : 'User not found' 
    };
  } catch (error) {
    console.error('Error deleting user:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function syncAllClerkUsers(clerkUsers: CreateUserParams[]) {
  try {
    const results = await Promise.all(
      clerkUsers.map(user => createUser(user))
    );
    
    const successfulSyncs = results.filter(r => r.success);
    const failedSyncs = results.filter(r => !r.success);
    
    return {
      success: true,
      syncedCount: successfulSyncs.length,
      failedCount: failedSyncs.length,
      errors: failedSyncs.map(f => f.error)
    };
  } catch (error) {
    console.error('Error syncing users:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}