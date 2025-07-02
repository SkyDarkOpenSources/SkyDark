import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import createUser from '../../../../../lib/actions/user.action';
import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: Request) {
  const CLERK_WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!CLERK_WEBHOOK_SECRET) {
    return NextResponse.json(
      { error: 'CLERK_WEBHOOK_SECRET not configured' },
      { status: 500 }
    );
  }

  // Get headers
  const headerPayload = await headers();
  const svixId = headerPayload.get('svix-id');
  const svixTimestamp = headerPayload.get('svix-timestamp');
  const svixSignature = headerPayload.get('svix-signature');

  // Verify headers
  if (!svixId || !svixTimestamp || !svixSignature) {
    return NextResponse.json(
      { error: 'Missing required headers' },
      { status: 400 }
    );
  }

  // Get raw body
  const payload = await req.text();
  const body = payload.toString();

  try {
    // Verify the webhook signature manually
    const signedContent = `${svixId}.${svixTimestamp}.${body}`;
    const signature = crypto
      .createHmac('sha256', CLERK_WEBHOOK_SECRET)
      .update(signedContent)
      .digest('base64');

    if (signature !== svixSignature) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    // Parse the JSON body
    const evt = JSON.parse(body) as WebhookEvent;

    // Handle user creation
    if (evt.type === 'user.created') {
      const { id, first_name, last_name, email_addresses } = evt.data;

      await createUser({
        clerkId: id,
        firstName: first_name || '',
        lastName: last_name || '',
        email: email_addresses[0]?.email_address || '',
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error('Webhook processing error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}