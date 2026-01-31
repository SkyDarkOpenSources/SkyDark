// File: app/api/users/search/route.ts
import { NextRequest, NextResponse } from "next/server";
import { currentUser, clerkClient } from "@clerk/nextjs/server";
import type { User, EmailAddress } from "@clerk/nextjs/server";
import { isProMember } from "../../../../../lib/actions/pro.action";

interface UserResult {
  id: string;
  username: string;
  emailAddress: string;
  imageUrl?: string;
  createdAt: number;
  isPro: boolean;
}

interface ClerkUserWithEmail extends User {
  emailAddresses: EmailAddress[];
  primaryEmailAddressId: string | null;
}

export async function GET(request: NextRequest) {
  try {
    // Get current user to ensure authentication
    const user = await currentUser();
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get search query
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (!query || query.trim().length < 1) {
      return NextResponse.json([]);
    }

    // Fetch users from Clerk
    const clerk = await clerkClient();
    const allUsers: ClerkUserWithEmail[] = [];
    let hasNextPage = true;
    let offset = 0;
    const limit = 100;

    // Fetch users in batches (Clerk has pagination)
    while (hasNextPage && allUsers.length < 500) { // Limit to 500 users max
      try {
        const usersResponse = await clerk.users.getUserList({
          limit: limit,
          offset: offset,
        });

        if (usersResponse.data && usersResponse.data.length > 0) {
          allUsers.push(...(usersResponse.data as ClerkUserWithEmail[]));
          offset += limit;
          
          // Check if we have more users (if we got less than limit, we're done)
          hasNextPage = usersResponse.data.length === limit;
        } else {
          hasNextPage = false;
        }
      } catch (fetchError) {
        console.error("Error fetching users batch:", fetchError);
        hasNextPage = false;
      }
    }

    // Filter users based on search query and exclude current user
    const searchTerm = query.toLowerCase();
    const filteredUsers = allUsers
      .filter((clerkUser: ClerkUserWithEmail) => clerkUser.id !== user.id) // Exclude current user
      .filter((clerkUser: ClerkUserWithEmail) => {
        // Search in multiple fields
        const username = (clerkUser.username || '').toLowerCase();
        
        // Get email address
        const primaryEmail = clerkUser.emailAddresses?.find(
          (email: EmailAddress) => email.id === clerkUser.primaryEmailAddressId
        );
        const emailAddress = (primaryEmail?.emailAddress || '').toLowerCase();
        
        // Check if search term matches any field
        return (
          username.includes(searchTerm) ||
          emailAddress.includes(searchTerm)
        );
      })
      .slice(0, 20); // Limit results to 20 for UI performance

    // Transform the user data to match frontend interface
    const limited = filteredUsers.slice(0, 20);
    const mapped = await Promise.all(limited.map(async (clerkUser: ClerkUserWithEmail) => {
      // Get primary email address
      const primaryEmail = clerkUser.emailAddresses?.find(
        (email: EmailAddress) => email.id === clerkUser.primaryEmailAddressId
      );
      
      // Fallback to first email if no primary email
      const emailAddress = primaryEmail?.emailAddress || 
        clerkUser.emailAddresses?.[0]?.emailAddress || 
        'No email';

      // Construct full name with fallbacks
      let username = clerkUser.username;
      if (!username) {
        const first = clerkUser.firstName || '';
        const last = clerkUser.lastName || '';
        username = `${first} ${last}`.trim();
      }
      if (!username) {
        username = emailAddress.split('@')[0]; // Use email username as fallback
      }
      if (!username) {
        username = 'Unknown User';
      }

      const pro = await isProMember(emailAddress);

      return {
        id: clerkUser.id,
        username: clerkUser.username || username,
        emailAddress: emailAddress,
        imageUrl: clerkUser.imageUrl || undefined,
        createdAt: clerkUser.createdAt,
        isPro: !!pro,
      } as UserResult;
    }));

    const searchResults: UserResult[] = mapped;

    console.log(`Found ${allUsers.length} total users, returning ${searchResults.length} filtered results for query: "${query}"`);

    return NextResponse.json(searchResults);

  } catch (error) {
    console.error("User search error:", error);
    
    // Log detailed error information
    if (error instanceof Error) {
      console.error("Error name:", error.name);
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
    
    return NextResponse.json(
      { error: "Search failed", details: "Unable to fetch users from database" }, 
      { status: 500 }
    );
  }
}