# Stripe Setup Guide

This guide explains how to configure Stripe for your Lovelock application.

## Required Environment Variables

Add these environment variables to your `.env.local` file (for development) or your hosting platform's environment configuration (for production):

### Stripe Configuration
```env
# Your Stripe secret key - get this from https://dashboard.stripe.com/apikeys
STRIPE_SECRET_KEY=sk_test_... # Use sk_live_... for production

# Webhook endpoint secret - get this from your webhook endpoint in Stripe Dashboard
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Price IDs (Critical)
Get these from your Stripe Dashboard > Products:

```env
# Premium Plan Price IDs
STRIPE_PREMIUM_MONTHLY_PRICE_ID=price_1S7Q4zGNqirbVSGkHxQN02xl
STRIPE_PREMIUM_YEARLY_PRICE_ID=price_1S6ZjwCWEq8iX3p2b3V15kV7

# Unlimited Plan Price IDs
STRIPE_UNLIMITED_MONTHLY_PRICE_ID=price_1S2lLrCWEq8iX3p2yN5YJwPE
STRIPE_UNLIMITED_YEARLY_PRICE_ID=price_1S6ZlBCWEq8iX3p2RuX8Gz4E
```

## How to Find Your Price IDs

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Navigate to **Products**
3. Click on your product (e.g., "Premium Monthly")
4. Copy the **Price ID** (starts with `price_`)
5. Add it to your environment variables

## Webhook Configuration

1. Go to [Stripe Webhooks](https://dashboard.stripe.com/webhooks)
2. Click "Add endpoint"
3. Set endpoint URL to: `https://yourdomain.com/api/stripe-webhook`
4. Select these events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Copy the **Signing Secret** and add it as `STRIPE_WEBHOOK_SECRET`

## Testing Your Configuration

Visit: `https://yourdomain.com/api/debug/stripe` to verify all environment variables are correctly configured.

## Deployment Notes

### For Vercel:
```bash
vercel env add STRIPE_SECRET_KEY
vercel env add STRIPE_WEBHOOK_SECRET
vercel env add STRIPE_PREMIUM_MONTHLY_PRICE_ID
vercel env add STRIPE_PREMIUM_YEARLY_PRICE_ID
vercel env add STRIPE_UNLIMITED_MONTHLY_PRICE_ID
vercel env add STRIPE_UNLIMITED_YEARLY_PRICE_ID
```

### For Netlify:
Add these in your Netlify site settings > Environment variables

### For Railway/Render:
Add these in your project's environment variables section

## Security Notes

- ✅ Never commit actual environment variables to Git
- ✅ Use `.env.example` for documentation
- ✅ Use different Stripe keys for development vs production
- ✅ Restrict API key permissions in Stripe Dashboard