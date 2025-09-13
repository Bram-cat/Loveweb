# Lovelock Web - Payment & Subscription Management

A Next.js website for handling payments and subscription management for the Lovelock mobile app. Built with Clerk authentication, Stripe payments, and Supabase database.

## 🚀 Features

- **Clerk Authentication**: Seamless user authentication with social logins
- **Stripe Payments**: Secure payment processing with multiple subscription tiers
- **Supabase Database**: Real-time subscription and usage tracking
- **Responsive Design**: Beautiful UI matching the mobile app's cosmic theme
- **Mobile App Integration**: Deep linking and redirect handling from the mobile app
- **Subscription Management**: User dashboard for managing billing and usage

## 🎯 Subscription Tiers

### Free Plan
- 3 Numerology readings per month
- 2 Love Match analyses per month
- 1 Trust Assessment per month

### Premium Plan ($4.99/month)
- 25 Numerology readings per month
- 15 Love Match analyses per month
- 10 Trust Assessments per month
- Advanced AI insights
- Priority support

### Unlimited Plan ($12.99/month)
- Unlimited access to all features
- Priority support
- Early access to new features
- Export capabilities

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Framer Motion animations
- **Authentication**: Clerk
- **Payments**: Stripe
- **Database**: Supabase (PostgreSQL)
- **Icons**: Lucide React
- **Deployment**: Vercel (recommended)

## 📦 Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**

   Update `.env.local` with your keys from the Lovelock app's configuration:
   ```bash
   # Copy your existing keys from the Lovelock mobile app
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
   CLERK_SECRET_KEY=your_clerk_secret
   # ... (see .env.local for all required variables)
   ```

3. **Set up Supabase database**

   Run the SQL commands from `supabase-functions.sql` in your Supabase SQL editor.

4. **Configure Stripe webhook**

   Add webhook endpoint in Stripe Dashboard:
   - URL: `https://lovelock.it.com/api/stripe-webhook`
   - Events: `checkout.session.completed`, `customer.subscription.*`, `invoice.payment_*`

5. **Run development server**
   ```bash
   npm run dev
   ```

## 🚀 Deployment to lovelock.it.com

This website is designed to be deployed at **lovelock.it.com** domain.

### Vercel Deployment (Recommended)

1. **Connect repository to Vercel**
2. **Configure environment variables** in Vercel dashboard
3. **Set up custom domain** (lovelock.it.com)
4. **Configure DNS records** to point to Vercel

### Mobile App Integration

The website handles redirects from the Lovelock mobile app:

- Payment redirect: `https://lovelock.it.com/pay?plan=premium`
- Success redirect: `lovelock://payment-success`
- Dashboard: `https://lovelock.it.com/dashboard`

## 📄 Key Files Created

- `app/page.tsx` - Landing page with features and testimonials
- `app/pricing/page.tsx` - Pricing page with plan comparison
- `app/pay/page.tsx` - Payment redirect handler from mobile app
- `app/success/page.tsx` - Payment success page with app redirect
- `app/dashboard/page.tsx` - User subscription management dashboard
- `lib/stripe.ts` - Stripe configuration and types
- `lib/supabase.ts` - Supabase client and database types
- `lib/subscription.ts` - Subscription management service
- API routes for Stripe integration and webhooks

## 🎨 Design & Theme

The website matches the Lovelock mobile app's cosmic theme:
- **Colors**: Pink (#ec4899) and purple gradients
- **Typography**: Clean, modern fonts with text shadows
- **Animations**: Framer Motion with sparkle and float effects
- **Glass morphism**: Translucent cards with backdrop blur
- **Responsive**: Mobile-first design that works on all devices

## 🔐 Security Features

- Row Level Security (RLS) in Supabase
- Webhook signature verification for Stripe
- Authentication middleware with Clerk
- Environment variable protection
- HTTPS-only in production

## 📞 Next Steps

1. **Fill in environment variables** with your actual keys from the Lovelock app
2. **Run SQL schema** in your Supabase database
3. **Configure Stripe webhook** endpoint
4. **Deploy to Vercel** and set up lovelock.it.com domain
5. **Test payment flow** from mobile app to website

## 🤝 Integration with Mobile App

When users tap "Pay" in the mobile app, they should be redirected to:
```
https://lovelock.it.com/pay?plan=premium&user=<encoded-user-data>
```

After successful payment, users are redirected back to the app via:
```
lovelock://payment-success
```

---

Built with ❤️ for the Lovelock community. Ready to handle payments at lovelock.it.com!
