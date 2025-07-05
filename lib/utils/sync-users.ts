import { clerkClient } from '@clerk/clerk-sdk-node';
import { syncAllClerkUsers } from '../actions/user.action'; // Adjust the path if needed

interface ClerkUser {
  id: string;
  emailAddresses: { emailAddress: string }[];
  firstName: string | null;
  lastName: string | null;
  imageUrl: string;
}

export async function syncExistingUsers() {
  try {
    // ✅ Correct: No destructuring, it directly returns an array
    const clerkUsers = await clerkClient.users.getUserList();

    const usersToSync = clerkUsers.map((user: ClerkUser) => ({
      clerkId: user.id,
      email: user.emailAddresses[0]?.emailAddress || '',
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      profileImageUrl: user.imageUrl,
    }));

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
