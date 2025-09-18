# Stripe Billing Portal Setup Guide

## 🚨 Current Issue
The billing portal is not configured for test mode. You're using live Stripe keys but the billing portal configuration is missing.

## 🛠️ Solution Steps

### 1. Get Your Stripe Test Keys

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Toggle to **Test mode** (switch in top left)
3. Go to **Developers > API keys**
4. Copy your test keys:
   - `pk_test_...` (Publishable key)
   - `sk_test_...` (Secret key)

### 2. Configure Billing Portal for Test Mode

1. In Stripe Dashboard (Test mode)
2. Go to **Settings > Billing > Customer portal**
3. Click **Activate test link**
4. Configure your portal settings:
   - ✅ Allow customers to update payment methods
   - ✅ Allow customers to update billing information
   - ✅ Allow customers to view invoice history
   - ✅ Allow customers to cancel subscriptions
5. **Save configuration**

### 3. Create Test Products and Prices

1. Go to **Products** in Stripe Dashboard (Test mode)
2. Create your products:
   - Premium Plan
   - Unlimited Plan
3. For each product, create prices:
   - Monthly: $X.XX/month
   - Yearly: $XX.XX/year
4. Copy the price IDs (they start with `price_`)

### 4. Set Up Test Webhook

1. Go to **Developers > Webhooks** (Test mode)
2. Click **Add endpoint**
3. URL: `https://your-domain.com/api/stripe-webhook` or `http://localhost:3000/api/stripe-webhook`
4. Select events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Copy the webhook secret (`whsec_...`)

### 5. Update Environment Variables

Update `.env.test` with your actual test values:

\`\`\`env
# Stripe TEST Configuration
STRIPE_SECRET_KEY=sk_test_YOUR_ACTUAL_TEST_SECRET_KEY
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_ACTUAL_TEST_PUBLISHABLE_KEY
STRIPE_WEBHOOK_SECRET=whsec_YOUR_ACTUAL_TEST_WEBHOOK_SECRET

# Test Price IDs
STRIPE_PREMIUM_MONTHLY_PRICE_ID=price_YOUR_ACTUAL_PREMIUM_MONTHLY_PRICE_ID
STRIPE_UNLIMITED_MONTHLY_PRICE_ID=price_YOUR_ACTUAL_UNLIMITED_MONTHLY_PRICE_ID
STRIPE_PREMIUM_YEARLY_PRICE_ID=price_YOUR_ACTUAL_PREMIUM_YEARLY_PRICE_ID
STRIPE_UNLIMITED_YEARLY_PRICE_ID=price_YOUR_ACTUAL_UNLIMITED_YEARLY_PRICE_ID
\`\`\`

### 6. Switch to Test Mode

Run the switch script:

\`\`\`bash
node scripts/switch-stripe-mode.js test
\`\`\`

### 7. Test the Setup

1. Restart your development server
2. Try creating a test subscription
3. Try accessing the billing portal
4. Verify webhook events are received

## 🔄 Switching Between Modes

### Switch to Test Mode
\`\`\`bash
node scripts/switch-stripe-mode.js test
\`\`\`

### Switch to Live Mode
\`\`\`bash
node scripts/switch-stripe-mode.js live
\`\`\`

## 🧪 Testing Payment Flows

Use Stripe's test card numbers:
- **Success**: `4242424242424242`
- **Decline**: `4000000000000002`
- **3D Secure**: `4000002760003184`

## ⚠️ Important Notes

1. **Test mode billing portal must be explicitly configured** - it's separate from live mode
2. **Webhook endpoints** need to be set up for both test and live modes
3. **Price IDs** are different between test and live modes
4. **Always test thoroughly** before switching to live mode

## 🚀 Going Live

1. Configure billing portal in **live mode**
2. Create live products and prices
3. Set up live webhook endpoint
4. Update production environment variables
5. Switch to live mode: `node scripts/switch-stripe-mode.js live`

## 📞 Support

If you're still having issues:
1. Check Stripe Dashboard logs
2. Check your application logs
3. Verify all environment variables are set correctly
4. Ensure billing portal is configured for the correct mode