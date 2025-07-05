import { clerkClient } from '@clerk/clerk-sdk-node';
import { syncAllClerkUsers } from '../actions/user.action'; // Adjust the path if needed

interface ClerkUser {
  id: string;
  emailAddresses: { emailAddress: string }[];
  firstName: string | null;
  lastName: string | null;
  imageUrl: string;
}

// lib/utils/sync-users.ts
export async function syncExistingUsers() {
  try {
    const clerkUsers = await clerkClient.users.getUserList({
      limit: 100, // Add pagination if you have many users
    });

    const usersToSync = clerkUsers.map((user) => ({
      clerkId: user.id,
      email: user.emailAddresses[0]?.emailAddress || '',
      firstName: user.firstName || user.username || '', // Fallback to username
      lastName: user.lastName || '',
      profileImageUrl: user.imageUrl,
    }));

    console.log('Syncing users:', usersToSync);
    const result = await syncAllClerkUsers(usersToSync);
    
    return {
      success: result.success,
      message: `Synced ${result.syncedCount} users`,
      errors: result.errors,
    };
  } catch (error) {
    console.error('Error syncing existing users:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}