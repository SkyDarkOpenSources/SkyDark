import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { createUser, deleteUser, updateUser } from '../../../../../lib/actions/user.action';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const SIGNING_SECRET = process.env.SIGNING_SECRET;

  if (!SIGNING_SECRET) {
    console.error('Missing SIGNING_SECRET environment variable');
    throw new Error('Error: Please add SIGNING_SECRET from Clerk Dashboard to .env or .env.local');
  }

  // Create new Svix instance with secret
  const wh = new Webhook(SIGNING_SECRET);

  // Get headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    console.error('Missing Svix headers');
    return new Response('Error: Missing Svix headers', {
      status: 400,
    });
  }

  // Get body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  let evt: WebhookEvent;

  // Verify payload with headers
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error: Could not verify webhook:', err);
    return new Response('Error: Verification error', {
      status: 400,
    });
  }

  const eventType = evt.type;
  console.log('Received webhook event:', eventType);

  // Handle user creation
  if (eventType === "user.created") {
    const { id, first_name, last_name, email_addresses } = evt.data;

    if (!id || !email_addresses || email_addresses.length === 0) {
      console.error('Missing required user data:', { id, email_addresses });
      return NextResponse.json({ 
        success: false, 
        error: "Missing required user data" 
      }, { status: 400 });
    }

    const user = {
      clerkId: id,
      firstName: first_name || '',
      lastName: last_name || '',
      email: email_addresses[0].email_address,
    };

    try {
      const result = await createUser(user);
      console.log('User creation result:', result);
      
      if (result.success) {
        return NextResponse.json({ success: true, user: result.user });
      } else {
        return NextResponse.json({ success: false, error: result.error }, { status: 500 });
      }
    } catch (error) {
      console.error('Error creating user:', error);
      return NextResponse.json({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }, { status: 500 });
    }
  }

  // Handle user updates
  if (eventType === "user.updated") {
    const { id, first_name, last_name, email_addresses } = evt.data;

    if (!id) {
      console.error('Missing user ID for update');
      return NextResponse.json({ 
        success: false, 
        error: "No user ID provided" 
      }, { status: 400 });
    }

    const updateData: any = {};
    
    if (first_name !== undefined) updateData.firstName = first_name;
    if (last_name !== undefined) updateData.lastName = last_name;
    if (email_addresses && email_addresses.length > 0) {
      updateData.email = email_addresses[0].email_address;
    }

    try {
      const result = await updateUser(id, updateData);
      console.log('User update result:', result);
      
      if (result.success) {
        return NextResponse.json({ success: true, user: result.user });
      } else {
        return NextResponse.json({ success: false, error: result.error }, { status: 500 });
      }
    } catch (error) {
      console.error('Error updating user:', error);
      return NextResponse.json({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }, { status: 500 });
    }
  }

  // Handle user deletion
  if (eventType === "user.deleted") {
    const { id } = evt.data;

    if (!id) {
      console.error('Missing user ID for deletion');
      return NextResponse.json({ 
        success: false, 
        error: "No user ID provided" 
      }, { status: 400 });
    }

    try {
      const result = await deleteUser(id);
      console.log('User deletion result:', result);
      
      if (result.success) {
        return NextResponse.json({ success: true, user: result.user });
      } else {
        return NextResponse.json({ success: false, error: result.error }, { status: 500 });
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      return NextResponse.json({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }, { status: 500 });
    }
  }

  console.log('Unhandled webhook event:', eventType);
  return new Response('Webhook received', { status: 200 });
}