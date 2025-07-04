import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { createUser, deleteUser, updateUser } from '../../../../../lib/actions/user.action';
import { NextResponse } from 'next/server';

interface UserUpdateData {
  firstName?: string;
  lastName?: string;
  email?: string;
  profileImageUrl?: string;
}

export async function POST(req: Request) {
  const SIGNING_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!SIGNING_SECRET) {
    throw new Error('Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local');
  }

  // Get the headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new NextResponse('Error occurred -- no svix headers', {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Webhook instance
  const wh = new Webhook(SIGNING_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new NextResponse('Error verifying webhook', {
      status: 400,
    });
  }

  // Get the event type
  const eventType = evt.type;

  // Handle user creation
  if (eventType === 'user.created') {
    const { id, first_name, last_name, email_addresses, image_url, username } = evt.data;

    // Validate required data
    if (!id || !email_addresses || email_addresses.length === 0) {
      return new NextResponse('Missing required user data', {
        status: 400,
      });
    }

    // Create user in database
    try {
      const result = await createUser({
        clerkId: id,
        firstName: first_name || '',
        lastName: last_name || '',
        email: email_addresses[0].email_address,
        profileImageUrl: image_url,
      });

      return NextResponse.json(
        { message: 'User created successfully', user: result.user },
        { status: 201 }
      );
    } catch (error) {
      console.error('Error creating user:', error);
      return new NextResponse('Error creating user in database', {
        status: 500,
      });
    }
  }

  // Handle user updates
  if (eventType === 'user.updated') {
    const { id, first_name, last_name, email_addresses, image_url, username } = evt.data;

    if (!id) {
      return new NextResponse('Missing user ID', {
        status: 400,
      });
    }

    const updateData: UserUpdateData = {};
    if (first_name) updateData.firstName = first_name;
    if (last_name) updateData.lastName = last_name;
    if (email_addresses?.[0]?.email_address) updateData.email = email_addresses[0].email_address;
    if (image_url) updateData.profileImageUrl = image_url;

    try {
      const result = await updateUser(id, updateData);
      
      return NextResponse.json(
        { message: 'User updated successfully', user: result.user },
        { status: 200 }
      );
    } catch (error) {
      console.error('Error updating user:', error);
      return new NextResponse('Error updating user in database', {
        status: 500,
      });
    }
  }

  // Handle user deletion
  if (eventType === 'user.deleted') {
    const { id } = evt.data;

    if (!id) {
      return new NextResponse('Missing user ID', {
        status: 400,
      });
    }

    try {
      const result = await deleteUser(id);
      
      return NextResponse.json(
        { message: 'User deleted successfully', user: result.user },
        { status: 200 }
      );
    } catch (error) {
      console.error('Error deleting user:', error);
      return new NextResponse('Error deleting user from database', {
        status: 500,
      });
    }
  }

  // Return a response for unhandled event types
  return new NextResponse('Webhook received', {
    status: 200,
  });
}