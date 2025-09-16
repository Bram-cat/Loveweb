# Subscription System Setup & Database Migration

This document explains how to properly set up the subscription system with your existing Supabase database.

## 🔧 Database Migration Required

Your current database schema needs to be updated to work with the fixed subscription system. Run the migration script to add the required columns and structure.

### Step 1: Run Database Migration

Execute the `database-migration.sql` file in your Supabase SQL editor:

1. Open your Supabase project dashboard
2. Go to **SQL Editor**
3. Copy the contents of `database-migration.sql`
4. Execute the script

This will:
- Add missing columns to `subscriptions` table: `is_premium`, `is_unlimited`, `billing_cycle`, `stripe_customer_id`
- Add missing columns to `profiles` table: `birth_time`, `birth_location`, `wants_premium`, `wants_notifications`, `agreed_to_terms`, `onboarding_completed`
- Create proper indexes for performance
- Add data validation constraints
- Set up Row Level Security policies
- Create helpful database views and triggers

### Step 2: Update Environment Variables

Ensure your `.env` file has all required variables:

```env
# Clerk Configuration
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Stripe Configuration
STRIPE_SECRET_KEY=your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# Stripe Price IDs
STRIPE_PREMIUM_MONTHLY_PRICE_ID=price_xxx
STRIPE_UNLIMITED_MONTHLY_PRICE_ID=price_xxx
STRIPE_PREMIUM_YEARLY_PRICE_ID=price_xxx
STRIPE_UNLIMITED_YEARLY_PRICE_ID=price_xxx

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Domain
NEXT_PUBLIC_DOMAIN=http://localhost:3000
```

## 🎯 What Was Fixed

### 1. Database Schema Alignment
- **Before**: Code expected `user_subscriptions` table, `usage_tracking` table
- **After**: Code now uses your existing `subscriptions`, `profiles`, and individual feature tables

### 2. Column Name Mapping
- **Before**: Code expected `clerk_id`, `tier`, `current_period_start`
- **After**: Code now uses `user_id`, `subscription_type`, `starts_at`

### 3. Subscription Tracking Fields
Added the fields you requested:
- `is_premium: boolean` - Quick flag for premium access
- `is_unlimited: boolean` - Quick flag for unlimited access
- `billing_cycle: 'monthly' | 'yearly'` - Billing frequency
- `starts_at: timestamp` - Subscription start date
- `ends_at: timestamp` - Subscription end date
- `stripe_customer_id: string` - Stripe customer reference
- `stripe_subscription_id: string` - Stripe subscription reference

### 4. Stripe Webhook Integration
- Fixed webhook handlers to process Stripe events correctly
- Added proper metadata handling for Clerk user ID mapping
- Improved error handling and logging

### 5. Usage Tracking
- Now tracks usage in your existing feature tables (`love_matches`, `numerology_readings`, `trust_assessments`)
- Counts monthly usage automatically
- Enforces limits based on subscription tier

## 🧪 Testing the System

### Test Payment Flow

1. **Start Development Server**
   ```bash
   npm run dev
   ```

2. **Test with Stripe Test Cards**
   - Card: `4242424242424242`
   - Expiry: Any future date
   - CVC: Any 3 digits

3. **Monitor Webhooks**
   - Check Stripe dashboard for webhook delivery
   - Monitor server logs for processing

4. **Verify Database Updates**
   ```sql
   -- Check if subscription was created
   SELECT * FROM subscriptions WHERE user_id = 'your_clerk_user_id';

   -- Check subscription status view
   SELECT * FROM subscription_status WHERE user_id = 'your_clerk_user_id';
   ```

### Debug Endpoints

- **Profile Debug**: `/api/debug/profile` - Check user profile and subscription
- **Subscription Status**: `/api/subscription/status` - Get current subscription info

## 🚨 Important Notes

### Webhook URL Setup
Make sure your Stripe webhook endpoint is configured:
- **URL**: `https://yourdomain.com/api/stripe-webhook`
- **Events**:
  - `customer.subscription.created`
  - `customer.subscription.updated`
  - `customer.subscription.deleted`
  - `checkout.session.completed`
  - `invoice.payment_succeeded`
  - `invoice.payment_failed`

### Frontend Integration
When creating checkout sessions, make sure to pass the Clerk user ID:

```javascript
const response = await fetch('/api/create-checkout-session', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    priceId: 'price_xxx',
    userEmail: user.emailAddresses[0].emailAddress,
    userId: user.id  // ← This is required now
  })
})
```

### Security
- All database operations use `supabaseAdmin` for elevated permissions
- Row Level Security is enabled on all tables
- Service role can access all data for webhook processing
- Users can only access their own data

## 📊 Subscription Tiers & Limits

```typescript
const USAGE_LIMITS = {
  free: {
    numerology: 3,
    loveMatch: 3,
    trustAssessment: 3
  },
  premium: {
    numerology: 50,
    loveMatch: 50,
    trustAssessment: 50
  },
  unlimited: {
    numerology: -1, // Unlimited
    loveMatch: -1,  // Unlimited
    trustAssessment: -1 // Unlimited
  }
}
```

## 🔍 Troubleshooting

### Common Issues

1. **500 Errors on Webhooks**
   - Check if database migration was run
   - Verify `SUPABASE_SERVICE_ROLE_KEY` is set
   - Check webhook logs in Stripe dashboard

2. **Subscription Not Created**
   - Verify Clerk user ID is passed to checkout
   - Check if webhook secret matches
   - Ensure price IDs are correct for your Stripe mode (test/live)

3. **Usage Limits Not Enforced**
   - Check if subscription tier is correctly set
   - Verify feature tables exist and have proper structure

### Logs to Check

- Server console for subscription processing
- Stripe webhook logs
- Supabase logs for database errors
- Browser network tab for API responses

## ✅ Verification Checklist

- [ ] Database migration script executed successfully
- [ ] All environment variables configured
- [ ] Stripe webhook endpoint configured with correct events
- [ ] Test payment completes successfully
- [ ] Subscription appears in database with correct data
- [ ] Usage tracking works for all features
- [ ] Subscription status API returns correct information
- [ ] Webhook processing shows no errors in Stripe dashboard

## 🎉 Success Indicators

You'll know everything is working when:
- ✅ Stripe webhooks show 200 responses
- ✅ Database has subscription records with all required fields
- ✅ Subscription status API returns proper tier and limits
- ✅ Usage tracking increments correctly
- ✅ Plan-based features are properly restricted/enabled

## 📞 Need Help?

If you encounter issues:
1. Check the browser console for frontend errors
2. Check server logs for backend errors
3. Check Stripe webhook logs for processing errors
4. Verify database has all required tables and columns
5. Test with a fresh user account

The system is now properly aligned with your database schema and should handle all subscription flows correctly!