# Vercel Environment Variable Deployment Notes

## Issue: Environment Variables Not Loading

If you're seeing "Missing required environment variables" errors even after setting them in Vercel:

### 1. **Redeploy After Adding Environment Variables**
Vercel requires a new deployment after environment variables are added:

```bash
# Force a new deployment
git commit --allow-empty -m "Force Vercel redeploy for environment variables"
git push origin main
```

Or in Vercel Dashboard:
1. Go to your project
2. Click "Deployments" tab
3. Click "Redeploy" on the latest deployment

### 2. **Check Environment Variable Availability**
Visit these debug endpoints on your live site:

- `/api/debug/env` - Check which environment variables are available
- `/api/price-ids-fallback` - Use fallback price IDs if env vars fail

### 3. **Verify Variable Names**
Make sure the environment variable names in Vercel exactly match:

```
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
STRIPE_PREMIUM_MONTHLY_PRICE_ID
STRIPE_PREMIUM_YEARLY_PRICE_ID
STRIPE_UNLIMITED_MONTHLY_PRICE_ID
STRIPE_UNLIMITED_YEARLY_PRICE_ID
NEXT_PUBLIC_DOMAIN
```

### 4. **Common Vercel Issues**
- ⚠️ Environment variables are case-sensitive
- ⚠️ No spaces before/after variable names or values
- ⚠️ Variables must be set for the correct environment (Production)
- ⚠️ New deployment required after adding variables

### 5. **Temporary Fallback**
If environment variables continue to fail, the app will automatically use the fallback API with hardcoded price IDs to keep the payment system functional while you resolve the environment variable issue.

### 6. **Troubleshooting Steps**
1. Check `/api/debug/env` on your live site
2. Verify all environment variables are set in Vercel Dashboard
3. Ensure they're set for "Production" environment
4. Force a new deployment
5. Check browser console for detailed error messages

The fallback system ensures your payment flow works even if environment variables aren't loading properly.