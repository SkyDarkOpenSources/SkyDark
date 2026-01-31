# Stripe Integration Setup Guide

## Environment Variables

Add these to your `.env.local` file:

```env
# Stripe API Keys (get from https://dashboard.stripe.com/apikeys)
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_public_key_here

# Webhook secret (get from https://dashboard.stripe.com/webhooks)
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# App URL for payment redirects
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Setup Steps

### 1. Get Stripe Keys
1. Go to https://dashboard.stripe.com/apikeys
2. Copy your **Secret Key** → `STRIPE_SECRET_KEY`
3. Copy your **Publishable Key** → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`

### 2. Set Up Webhook
1. Go to https://dashboard.stripe.com/webhooks
2. Click "Add endpoint"
3. Set URL to: `https://yourdomain.com/api/webhooks/stripe`
4. Select events to listen to:
   - `checkout.session.completed`
   - `customer.subscription.deleted` (optional for cancellation)
5. Copy the **Signing Secret** → `STRIPE_WEBHOOK_SECRET`

### 3. Test Locally
For local development, use Stripe CLI to forward webhook events:
```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```
Copy the webhook signing secret and add to `.env.local`

### 4. Test Payment
1. Start the app: `npm run dev`
2. Go to `/premium` page
3. Click "Start Free Trial" on Pro plan
4. You'll be redirected to `/premium-payment`
5. Use Stripe test card: `4242 4242 4242 4242`
6. Use any future expiry date and any CVC
7. After payment, you'll be marked as Pro

## Test Cards

- **Visa**: 4242 4242 4242 4242
- **Failed payment**: 4000 0000 0000 0002
- **Expiry**: Any future date
- **CVC**: Any 3 digits

## Flow

1. User clicks "Start Free Trial" on Pro plan
2. Redirected to `/premium-payment` page
3. Stripe embedded checkout loads
4. User enters payment details
5. After successful payment:
   - Stripe sends webhook to `/api/webhooks/stripe`
   - User added to `pro_members` table
   - User redirected to success page
   - Profile shows Pro badge

## Optional: Email Receipts

To enable email receipts, you can integrate with:
- **Resend** (recommended for Next.js): `npm install resend`
- **SendGrid**: `npm install @sendgrid/mail`
- **Mailgun**: `npm install mailgun.js`

Then uncomment and implement the email sending in:
- `lib/email.ts`
- `src/app/api/stripe/verify-payment/route.ts`

Example with Resend:
```typescript
// lib/email.ts
import { Resend } from 'resend';
const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendReceiptEmail(email: string, session: Stripe.Checkout.Session) {
  await resend.emails.send({
    from: 'noreply@skydark.com',
    to: email,
    subject: 'Welcome to SkyDark Pro!',
    html: generateReceiptHtml(session),
  });
}
```

Then add `RESEND_API_KEY=your_key_here` to `.env.local`
