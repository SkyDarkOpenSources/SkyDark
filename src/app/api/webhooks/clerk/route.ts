import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import createUser from '../../../../../lib/actions/user.action'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const SIGNING_SECRET = process.env.SIGNING_SECRET

  if (!SIGNING_SECRET) {
    throw new Error('Error: Please add SIGNING_SECRET from Clerk Dashboard to .env or .env.local')
  }

  // Create new Svix instance with secret
  const wh = new Webhook(SIGNING_SECRET)

  // Get headers - NO AWAIT NEEDED
  const headerPayload = await headers()
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return NextResponse.json(
      { error: 'Error: Missing Svix headers' },
      { status: 400 }
    )
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
    return NextResponse.json(
      { error: 'Error: Verification error' },
      { status: 400 }
    )
  }

  // Handle user.created event
  if (evt.type === "user.created") {
    const { id, first_name, last_name, email_addresses } = evt.data

    const user = {
      clerkId: id,
      firstName: first_name || '', // Fallback for optional fields
      lastName: last_name || '',  // Fallback for optional fields
      email: email_addresses[0]?.email_address || '',
    }

    try {
      await createUser(user)
      return NextResponse.json({ success: true })
    } catch (error) {
      console.error('Error creating user:', error)
      return NextResponse.json(
        { error: 'Error creating user in database' },
        { status: 500 }
      )
    }
  }

  return NextResponse.json({ message: 'Webhook received' }, { status: 200 })
}