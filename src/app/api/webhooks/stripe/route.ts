import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { addProMember } from '../../../../../lib/actions/pro.action';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing signature' },
        { status: 400 }
      );
    }

    // Verify webhook signature
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret
    );

    // Handle successful payment
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      
      // Get customer email from session
      if (session.customer_details?.email) {
        const email = session.customer_details.email;
        
        // Add to pro members
        await addProMember(email);
        
        console.log(`User ${email} upgraded to pro via Stripe`);
      }
    }

    // Handle subscription events
    if (event.type === 'customer.subscription.deleted') {
      // Optional: Remove user from pro members on subscription cancellation
      // const subscription = event.data.object as Stripe.Subscription;
      // if (subscription.customer_details?.email) {
      //   await removeProMember(subscription.customer_details.email);
      // }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
