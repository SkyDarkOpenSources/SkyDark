import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import createUser from '../../../../../lib/actions/user.action'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const SIGNING_SECRET = process.env.SIGNING_SECRET

  if (!SIGNING_SECRET) {
    throw new Error('Error: Please add SIGNING_SECRET from Clerk Dashboard to .env or .env')
  }

  // Create new Svix instance with secret
  const wh = new Webhook(SIGNING_SECRET)

  // Get headers
  const headerPayload = await headers()
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error: Missing Svix headers', {
      status: 400,
    })
  }

  // Get body
  const payload = await req.json()
  const body = JSON.stringify(payload)

  let evt: WebhookEvent

  // Verify payload with headers
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Error: Could not verify webhook:', err)
    return new Response('Error: Verification error', {
      status: 400,
    })
  }

  // Do something with payload
  // For this guide, log payload to console
  
  const eventType = evt.type

  if (eventType === "user.created") {
    const { id, first_name, last_name, email_addresses } = evt.data

    const user = {
      clerkId: id,
      firstName: first_name!,
      lastName: last_name!,
      email: email_addresses[0].email_address,
    }
    // call a server action
    await createUser(user);
    return NextResponse.json({ success: true });
  }


  return new Response('Webhook received', { status: 200 })
}