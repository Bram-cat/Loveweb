# Payment Testing Guide for Lovelock Web

This guide helps you test the subscription payment system without processing real payments.

## 🚀 Quick Setup

### 1. Environment Configuration

You have two options for testing:

**Option A: Use existing environment (Live mode)**
- Your current `.env` file uses live Stripe keys
- Real payments will be processed
- Only recommended for production testing with small amounts

**Option B: Use test environment (Recommended)**
- Copy `.env.test` to `.env.local`
- Replace the placeholder test keys with your actual Stripe test keys
- No real payments will be processed

```bash
# Copy test environment
cp .env.test .env.local

# Edit .env.local with your test keys from Stripe Dashboard
```

### 2. Get Your Stripe Test Keys

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Toggle to "Test mode" (top right switch)
3. Go to Developers → API keys
4. Copy your test keys to `.env.local`:
   - `STRIPE_SECRET_KEY=sk_test_...`
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...`

### 3. Create Test Products and Prices

1. In Stripe Dashboard (test mode), go to Products
2. Create products for "Premium" and "Unlimited" tiers
3. Add monthly and yearly prices
4. Update `.env.local` with the test price IDs:
   ```
   STRIPE_PREMIUM_MONTHLY_PRICE_ID=price_test_xxx
   STRIPE_UNLIMITED_MONTHLY_PRICE_ID=price_test_xxx
   STRIPE_PREMIUM_YEARLY_PRICE_ID=price_test_xxx
   STRIPE_UNLIMITED_YEARLY_PRICE_ID=price_test_xxx
   ```

## 🧪 Testing Methods

### Method 1: Manual API Testing

Use the test endpoints to simulate payments:

```bash
# Test premium subscription
curl -X POST http://localhost:3000/api/test-payment \
  -H "Content-Type: application/json" \
  -d '{"clerkId": "your_test_user_id", "tier": "premium", "interval": "month"}'

# Test unlimited subscription
curl -X POST http://localhost:3000/api/test-payment \
  -H "Content-Type: application/json" \
  -d '{"clerkId": "your_test_user_id", "tier": "unlimited", "interval": "year"}'

# Test cancellation
curl -X DELETE "http://localhost:3000/api/test-payment?clerkId=your_test_user_id"
```

### Method 2: UI Testing

1. Add the `SubscriptionStatus` component to your dashboard:
   ```tsx
   import { SubscriptionStatus } from '@/components/subscription-status'

   export default function Dashboard() {
     return (
       <div>
         <h1>Dashboard</h1>
         <SubscriptionStatus />
       </div>
     )
   }
   ```

2. The component includes test buttons in development mode
3. Click the test buttons to simulate payments

### Method 3: Automated Testing

Run the test script:

```bash
node scripts/test-payments.js
```

## 📊 Database Verification

Check your Supabase database to verify the changes:

```sql
-- Check user subscriptions
SELECT * FROM user_subscriptions WHERE clerk_id = 'your_test_user_id';

-- Check usage tracking
SELECT * FROM usage_tracking WHERE clerk_id = 'your_test_user_id';
```

## 🔄 Subscription Monitoring

The system includes automatic subscription monitoring:

### Manual Trigger
```bash
curl -X POST http://localhost:3000/api/subscription/monitor \
  -H "Authorization: Bearer dev_token_123"
```

### Test Mode Trigger
```bash
curl http://localhost:3000/api/subscription/monitor?test=true
```

### Production Setup
Set up a cron job or scheduled task to call the monitor endpoint:
```bash
# Example cron job (daily at 2 AM)
0 2 * * * curl -X POST https://yourdomain.com/api/subscription/monitor -H "Authorization: Bearer your_cron_token"
```

## 🎯 Testing Scenarios

### Scenario 1: New User Flow
1. User signs up (Clerk handles this)
2. System creates free subscription automatically
3. User upgrades to premium/unlimited
4. Verify limits are updated

### Scenario 2: Subscription Expiration
1. Create a subscription with past end date
2. Run the monitor endpoint
3. Verify user is downgraded to free tier

### Scenario 3: Usage Tracking
1. User performs actions (numerology, love match, etc.)
2. Check usage is incremented
3. Verify limits are enforced

## 🛠️ API Endpoints

### Test Endpoints (Development Only)
- `POST /api/test-payment` - Simulate successful payment
- `DELETE /api/test-payment?clerkId=xxx` - Simulate cancellation

### Production Endpoints
- `GET /api/subscription/status` - Get user subscription status
- `POST /api/subscription/monitor` - Monitor and handle expirations
- `POST /api/stripe-webhook` - Handle real Stripe webhooks

### Utility Endpoints
- `GET /api/price-ids` - Get available price IDs
- `POST /api/create-checkout-session` - Create real checkout session

## 🔧 Troubleshooting

### Common Issues

**1. Database Connection Error**
- Verify Supabase URL and keys in environment variables
- Check if tables are created (run `supabase-functions.sql`)

**2. Clerk User Not Found**
- Make sure you're using a valid Clerk user ID
- User must be signed in for protected endpoints

**3. Stripe Configuration**
- Verify test/live key modes match
- Check price IDs exist in Stripe Dashboard

**4. Environment Variables**
- Restart development server after changing `.env` files
- Use `.env.local` for local overrides

### Debugging Tips

1. Check browser console for client-side errors
2. Check server logs for API errors
3. Use Stripe Dashboard logs to see webhook deliveries
4. Verify Supabase RLS policies allow your operations

## 🚀 Production Deployment

Before going live:

1. ✅ Replace all test keys with live keys
2. ✅ Set up real webhook endpoints in Stripe
3. ✅ Configure proper cron job for monitoring
4. ✅ Test with small real payments first
5. ✅ Set up proper authentication for cron endpoints
6. ✅ Monitor error logs and set up alerts

## 📝 Environment Variables Checklist

```bash
# Required for all environments
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Required for subscription tiers
STRIPE_PREMIUM_MONTHLY_PRICE_ID=
STRIPE_UNLIMITED_MONTHLY_PRICE_ID=
STRIPE_PREMIUM_YEARLY_PRICE_ID=
STRIPE_UNLIMITED_YEARLY_PRICE_ID=

# Optional for monitoring
CRON_SECRET_TOKEN=
```

## 🎉 Success Indicators

You'll know everything is working when:

- ✅ Free users are automatically created
- ✅ Test payments update database correctly
- ✅ Usage limits are enforced properly
- ✅ Expired subscriptions are downgraded automatically
- ✅ UI shows correct subscription status
- ✅ Webhook events are processed successfully

Happy testing! 🚀