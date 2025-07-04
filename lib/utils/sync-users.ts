import { clerkClient } from '@clerk/nextjs/server'; // Good
import { syncAllClerkUsers } from '../actions/user.action';

interface ClerkUser {
  id: string;
  emailAddresses: { emailAddress: string }[];
  firstName: string | null;
  lastName: string | null;
  imageUrl: string;
}

export async function syncExistingUsers() {
  try {
    // 👇 Correctly get the actual Clerk client instance
    const client = await clerkClient();

    // 👇 Now access users from the actual client
    const { data: clerkUsers } = await client.users.getUserList();

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
