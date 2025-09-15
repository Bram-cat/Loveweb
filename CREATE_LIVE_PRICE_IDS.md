# Create Live Stripe Price IDs

## The Issue
You are using **live Stripe keys** (`sk_live_...`) but the price ID `price_1S7Q4zGNqirbVSGkHxQN02xl` is being rejected by Stripe. This usually means:

1. The price ID is from **test mode** but you're using **live keys**
2. The price ID doesn't exist in your live Stripe account
3. The price ID has been deleted or archived

## Solution: Create Live Price IDs

### Step 1: Go to Your Live Stripe Dashboard
1. Visit [https://dashboard.stripe.com](https://dashboard.stripe.com)
2. **Make sure you're in LIVE mode** (toggle in the top-left should show "Live")
3. Navigate to **Products** in the sidebar

### Step 2: Create Premium Monthly Product
1. Click **"+ Add product"**
2. **Product Details:**
   - Name: `Premium Monthly`
   - Description: `Premium subscription plan with enhanced features`
3. **Pricing:**
   - Price: `$4.99`
   - Billing period: `Monthly`
   - Currency: `USD`
4. Click **"Save product"**
5. **Copy the Price ID** (starts with `price_`) - This is your new `STRIPE_PREMIUM_MONTHLY_PRICE_ID`

### Step 3: Create Premium Yearly Product
1. Click **"+ Add product"**
2. **Product Details:**
   - Name: `Premium Yearly`
   - Description: `Premium yearly subscription plan with enhanced features`
3. **Pricing:**
   - Price: `$49.99`
   - Billing period: `Yearly`
   - Currency: `USD`
4. Click **"Save product"**
5. **Copy the Price ID** - This is your new `STRIPE_PREMIUM_YEARLY_PRICE_ID`

### Step 4: Create Unlimited Monthly Product
1. Click **"+ Add product"**
2. **Product Details:**
   - Name: `Unlimited Monthly`
   - Description: `Unlimited subscription plan with all features`
3. **Pricing:**
   - Price: `$12.99`
   - Billing period: `Monthly`
   - Currency: `USD`
4. Click **"Save product"**
5. **Copy the Price ID** - This is your new `STRIPE_UNLIMITED_MONTHLY_PRICE_ID`

### Step 5: Create Unlimited Yearly Product
1. Click **"+ Add product"**
2. **Product Details:**
   - Name: `Unlimited Yearly`
   - Description: `Unlimited yearly subscription plan with all features`
3. **Pricing:**
   - Price: `$129.99`
   - Billing period: `Yearly`
   - Currency: `USD`
4. Click **"Save product"**
5. **Copy the Price ID** - This is your new `STRIPE_UNLIMITED_YEARLY_PRICE_ID`

### Step 6: Update Vercel Environment Variables
Go to your Vercel Dashboard and update these environment variables with your new LIVE price IDs:

```
STRIPE_PREMIUM_MONTHLY_PRICE_ID=price_NEW_LIVE_ID_HERE
STRIPE_PREMIUM_YEARLY_PRICE_ID=price_NEW_LIVE_ID_HERE
STRIPE_UNLIMITED_MONTHLY_PRICE_ID=price_NEW_LIVE_ID_HERE
STRIPE_UNLIMITED_YEARLY_PRICE_ID=price_NEW_LIVE_ID_HERE
```

### Step 7: Force Vercel Redeploy
After updating the environment variables, trigger a new deployment:

```bash
git commit --allow-empty -m "Update live Stripe price IDs"
git push origin main
```

## Quick Verification
After deployment, check these URLs:
- `https://lovelock.it.com/api/debug/validate-price-ids` - Should show all price IDs as valid
- `https://lovelock.it.com/pricing` - Premium button should now work

## Alternative: Test Mode
If you prefer to use test mode for now:
1. Replace your `STRIPE_SECRET_KEY` with your test key (`sk_test_...`)
2. Use test mode price IDs in your environment variables
3. Redeploy

**Note:** Test mode won't charge real money, but live mode will process actual payments.