import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { createUser, deleteUser, updateUser } from '../../../../../lib/actions/user.action';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const SIGNING_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!SIGNING_SECRET) {
    throw new Error('Missing CLERK_WEBHOOK_SECRET');
  }

  const headerPayload = await headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return NextResponse.json({ error: 'Missing Svix headers' }, { status: 400 });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(SIGNING_SECRET);
  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const eventType = evt.type;

  // Handle user creation
  if (eventType === 'user.created') {
    const { id, first_name, last_name, email_addresses, image_url } = evt.data;

    if (!id || !email_addresses || email_addresses.length === 0) {
      return NextResponse.json(
        { error: 'Missing required user data' },
        { status: 400 }
      );
    }

    const result = await createUser({
      clerkId: id,
      firstName: first_name || '',
      lastName: last_name || '',
      email: email_addresses[0].email_address,
      profileImageUrl: image_url
    });

    return NextResponse.json(
      { success: result.success, user: result.user, error: result.error },
      { status: result.success ? 200 : 500 }
    );
  }

  // Handle user updates
  if (eventType === 'user.updated') {
    const { id, first_name, last_name, email_addresses, image_url } = evt.data;

    if (!id) {
      return NextResponse.json(
        { error: 'Missing user ID' },
        { status: 400 }
      );
    }

    const updateData: any = {};
    if (first_name) updateData.firstName = first_name;
    if (last_name) updateData.lastName = last_name;
    if (email_addresses?.[0]?.email_address) updateData.email = email_addresses[0].email_address;
    if (image_url) updateData.profileImageUrl = image_url;

    const result = await updateUser(id, updateData);
    
    return NextResponse.json(
      { success: result.success, user: result.user, error: result.error },
      { status: result.success ? 200 : 500 }
    );
  }

  // Handle user deletion
  if (eventType === 'user.deleted') {
    const { id } = evt.data;

    if (!id) {
      return NextResponse.json(
        { error: 'Missing user ID' },
        { status: 400 }
      );
    }

    const result = await deleteUser(id);
    
    return NextResponse.json(
      { success: result.success, user: result.user, error: result.error },
      { status: result.success ? 200 : 500 }
    );
  }

  return NextResponse.json({ success: true }, { status: 200 });
}