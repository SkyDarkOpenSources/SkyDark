// lib/email.ts
import Stripe from 'stripe';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendReceiptEmail(
  email: string,
  session: Stripe.Checkout.Session
) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'SkyDark <onboarding@resend.dev>',
      to: email,
      subject: 'Welcome to SkyDark Pro!',
      html: generateReceiptHtml(session),
    });

    if (error) {
      console.error('Resend error:', error);
      return { success: false, error };
    }

    console.log(`Receipt email sent to ${email}`, data);
    return { success: true, data };
  } catch (error) {
    console.error('Email sending error:', error);
    return { success: false, error };
  }
}

function generateReceiptHtml(session: Stripe.Checkout.Session): string {
  return `
    <html>
      <body style="font-family: sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; rounded: 8px;">
          <h1 style="color: #000; text-align: center;">Welcome to SkyDark Pro!</h1>
          <p>Hi there,</p>
          <p>Thank you for upgrading your account to <strong>SkyDark Pro</strong>! Your premium features are now active and ready to use.</p>
          
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h2 style="font-size: 18px; margin-top: 0;">Subscription Details</h2>
            <p style="margin: 5px 0;"><strong>Order ID:</strong> ${session.id}</p>
            <p style="margin: 5px 0;"><strong>Plan:</strong> SkyDark Pro Monthly</p>
            <p style="margin: 5px 0;"><strong>Amount:</strong> $9.99/month</p>
            <p style="margin: 5px 0;"><strong>Status:</strong> Active</p>
          </div>

          <p>You now have access to:</p>
          <ul>
            <li>Advanced Member Management</li>
            <li>In-depth Analytics</li>
            <li>Custom Branding options</li>
            <li>Priority Support</li>
          </ul>

          <p style="text-align: center; margin-top: 30px;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="background-color: #000; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Go to Dashboard</a>
          </p>

          <p style="margin-top: 40px; font-size: 12px; color: #888; text-align: center;">
            If you have any questions, simply reply to this email or contact our support team.
          </p>
        </div>
      </body>
    </html>
  `;
}

