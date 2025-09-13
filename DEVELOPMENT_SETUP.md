# Development Setup Guide

## Current Issues & Solutions

### 1. Clerk Authentication Error
**Problem:** Production Clerk keys only work for `lovelock.it.com` domain.

**Solution:** Create development keys for localhost:

1. Go to [Clerk Dashboard](https://dashboard.clerk.com/)
2. Navigate to your Lovelock project
3. Go to **API Keys** section
4. Create **Development Instance** for localhost
5. Copy the development keys:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...`
   - `CLERK_SECRET_KEY=sk_test_...`

### 2. Stripe Configuration Error
**Problem:** Stripe secret key not loading properly.

**Solution:** Get Stripe test keys:

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Switch to **Test Mode** (toggle in sidebar)
3. Go to **Developers** → **API Keys**
4. Copy test keys:
   - `STRIPE_SECRET_KEY=sk_test_...`
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...`

## Setup Steps

### 1. Create Development Environment File
Copy `.env.local` to `.env` and update with your keys:

```bash
cp .env.local .env
```

### 2. Update Environment Variables
Edit `.env` file with your development keys:

```env
# Clerk Development Keys
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
CLERK_SECRET_KEY=sk_test_your_key_here

# Stripe Test Keys
STRIPE_SECRET_KEY=sk_test_your_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
```

### 3. Restart Development Server
```bash
npm run dev
```

## Production Deployment Options

### Option A: Deploy to Your Domain
1. **Deploy to Vercel/Netlify**
2. **Configure custom domain** to point to `lovelock.it.com`
3. **Use production environment variables**

### Option B: Update Clerk Domain Settings
1. **Clerk Dashboard** → **Domain Settings**
2. **Add localhost:3000** to allowed domains
3. **Keep existing production keys**

## Recommended Approach
Use **development keys for localhost** and **production keys for deployed version**. This is the standard practice and most secure approach.

## Need Help?
If you need assistance setting up the keys or deploying to your domain, I can guide you through the specific steps.