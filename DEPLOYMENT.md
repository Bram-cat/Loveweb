# 🚀 Lovelock Payment Website - Deployment Guide

## 📋 Quick Start

The Lovelock payment website is now ready! Here's how to deploy it:

## 🌟 What's Ready

✅ **Beautiful cosmic-themed website** matching your Lovelock app design
✅ **shadcn/ui components** for modern, accessible interface
✅ **Clerk authentication** configured
✅ **Stripe payment integration** (premium $4.99, unlimited $12.99)
✅ **Supabase database** setup ready
✅ **Mobile app integration** with deep linking
✅ **Responsive design** works on all devices

## 🔧 Current Status

- **Local Development**: Working perfectly
- **Scrolling**: Fixed - pages now scroll properly
- **Authentication**: Clerk integration working
- **UI Components**: Beautiful shadcn/ui implementation
- **Environment Variables**: Configured and ready

## 🌐 Deploy to GitHub & Vercel

### Step 1: Create GitHub Repository

1. **Go to GitHub.com** and create a new repository named `lovelock-web`
2. **Copy the remote URL** (e.g., `https://github.com/yourusername/lovelock-web.git`)

### Step 2: Push to GitHub

```bash
cd C:\Users\vsbha\OneDrive\Desktop\lovelockweb
git remote add origin https://github.com/yourusername/lovelock-web.git
git branch -M main
git push -u origin main
```

### Step 3: Deploy to Vercel

1. **Go to vercel.com** and sign in
2. **Import project** from GitHub
3. **Select** your `lovelock-web` repository
4. **Configure environment variables** in Vercel dashboard:

```bash
# Copy these from your .env file
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
# ... (all other variables from .env)
```

5. **Deploy** and get your Vercel URL

### Step 4: Set Up Custom Domain

1. **In Vercel dashboard**, go to your project
2. **Go to Settings > Domains**
3. **Add custom domain**: `lovelock.it.com`
4. **Configure DNS records** as shown in Vercel

### Step 5: Configure Stripe Webhooks

1. **In Stripe Dashboard**, go to Webhooks
2. **Add endpoint**: `https://lovelock.it.com/api/stripe-webhook`
3. **Select events**:
   - `checkout.session.completed`
   - `customer.subscription.*`
   - `invoice.payment_*`
4. **Copy webhook secret** and update environment variables

## 📱 Mobile App Integration

### Update Your Mobile App

In your Lovelock mobile app, update the payment redirect URLs:

```typescript
// When user taps "Pay" button
const paymentUrl = `https://lovelock.it.com/pay?plan=${selectedPlan}&user=${encodeURIComponent(JSON.stringify(userInfo))}`
window.open(paymentUrl, '_system')
```

### Deep Link Handling

The website will redirect back to your app using:
```
lovelock://payment-success
```

Make sure your mobile app handles this URL scheme.

## 🗄️ Database Setup

Run the SQL commands in `supabase-functions.sql` in your Supabase SQL editor:

1. **Go to Supabase Dashboard**
2. **Open SQL Editor**
3. **Paste and run** the contents of `supabase-functions.sql`
4. **Verify tables** are created: `user_subscriptions`, `usage_tracking`

## 🧪 Testing Checklist

- [ ] Website loads at your domain
- [ ] Authentication flow works
- [ ] Pricing page displays correctly
- [ ] Payment flow completes
- [ ] Success page redirects to app
- [ ] Dashboard shows subscription info
- [ ] Mobile app can redirect to website
- [ ] Website can redirect back to app

## 🔍 Troubleshooting

### Common Issues:

**"Clerk not configured"**
- Check environment variables are set in Vercel
- Verify Clerk publishable key is correct

**"Stripe webhook failed"**
- Check webhook URL is accessible
- Verify webhook secret matches Stripe dashboard

**"Database connection error"**
- Verify Supabase keys are correct
- Check RLS policies are enabled

**"App redirect not working"**
- Test deep link URL scheme in mobile app
- Check URL scheme is registered in app config

## 📞 Support

If you encounter issues:

1. **Check Vercel logs** for deployment errors
2. **Verify environment variables** are set correctly
3. **Test locally first** with `npm run dev`
4. **Check browser console** for client-side errors

## 🎉 Success!

Once deployed, your website will be live at `https://lovelock.it.com` with:

- Beautiful payment interface
- Secure Clerk authentication
- Stripe payment processing
- Mobile app integration
- Subscription management

Your Lovelock payment system is ready to handle payments! 🌟