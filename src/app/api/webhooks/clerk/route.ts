// api/webhooks/clerk/route.ts
import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { db } from '../../../../../database/index'
import { users } from '../../../../../database/schema'
import { eq, and, isNotNull } from 'drizzle-orm'

export async function POST(req: Request) {
  const SIGNING_SECRET = process.env.SIGNING_SECRET

  if (!SIGNING_SECRET) {
    throw new Error('Error: Please add SIGNING_SECRET from Clerk Dashboard to .env or .env.local')
  }

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

  // Create new Svix instance with secret
  const wh = new Webhook(SIGNING_SECRET)

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

  const eventType = evt.type

    try {
    if (eventType === "user.created") {
      const { id, first_name, last_name, email_addresses } = evt.data

      // Ensure we have required data
      if (!id || !email_addresses?.[0]?.email_address) {
        return NextResponse.json(
          { success: false, error: 'Missing required user data' },
          { status: 400 }
        )
      }

      // Check if user already exists
      const [existingUser] = await db
        .select()
        .from(users)
        .where(
          and(
            eq(users.clerkId, id),
            isNotNull(users.clerkId)
          )
        )
        .limit(1)

      if (!existingUser) {
        await db.insert(users).values({
          clerkId: id,
          firstName: first_name || '',
          lastName: last_name || '',
          email: email_addresses[0].email_address,
        })
      }
      return NextResponse.json({ success: true })
    }

    if (eventType === "user.deleted") {
      const { id } = evt.data
      if (!id) {
        return NextResponse.json(
          { success: false, error: 'Missing user ID' },
          { status: 400 }
        )
      }
      
      await db.delete(users).where(eq(users.clerkId, id))
      return NextResponse.json({ success: true })
    }
  } catch (error) {
    console.error('Error handling webhook event:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }

  return NextResponse.json({ success: true, message: 'Webhook received' })
}