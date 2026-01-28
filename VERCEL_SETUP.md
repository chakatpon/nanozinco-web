# Vercel Deployment Setup

## Environment Variables

You need to add these environment variables in your Vercel project dashboard:

1. Go to your Vercel project dashboard
2. Click on "Settings" tab
3. Click on "Environment Variables" in the left sidebar
4. Add each of the following variables:

### Required Variables

```
NEXT_PUBLIC_OTP_API_URL=https://apicall.deesmsx.com/v1
NEXT_PUBLIC_OTP_API_KEY=1e078251-fa1ae6db-c2c42da6-080562de
NEXT_PUBLIC_OTP_SECRET_KEY=7ec94fed-139b8ec8-6412f641-3e840fb0
NEXT_PUBLIC_OTP_SENDER_NAME=NANO-ZINCO
```

### Important Notes

- Make sure to add these for **Production**, **Preview**, and **Development** environments
- After adding the variables, you need to **redeploy** your application
- Click "Redeploy" button or push a new commit to trigger redeployment

## Build Settings

Verify these settings in Vercel dashboard under "Settings" > "General":

- **Framework Preset**: Next.js
- **Build Command**: `bun run build` or `npm run build`
- **Output Directory**: `.next` (default)
- **Install Command**: `bun install` or `npm install`
- **Node Version**: 20.x (or latest LTS)

## Fixing the 404 Error

The 404 error was caused by client-side routing on the home page. This has been fixed by:

1. Changing the home page to use server-side `redirect()` instead of client-side `router.push()`
2. This ensures the redirect happens on the server before the page is sent to the browser

## Deployment Steps

After fixing the code and setting environment variables:

1. Commit and push your changes:
   ```bash
   git add .
   git commit -m "Fix: Use server-side redirect for home page"
   git push origin main
   ```

2. Vercel will automatically deploy the new changes

3. Wait for deployment to complete (check Vercel dashboard)

4. Test your application at the Vercel URL

## Testing Checklist

After deployment, test these pages:

- [ ] `/` - Should redirect to `/login`
- [ ] `/login` - Phone number input page
- [ ] `/otp` - OTP verification (after requesting OTP)
- [ ] `/products` - Product catalog (after login)
- [ ] `/cart` - Shopping cart
- [ ] `/profile` - User profile

## Troubleshooting

### If you still see 404:

1. Check Vercel deployment logs for errors
2. Verify all environment variables are set correctly
3. Make sure the build completed successfully
4. Try clearing Vercel cache and redeploying

### If OTP doesn't work:

1. Double-check environment variables are correct
2. Check browser console for errors
3. Verify the OTP API credentials are valid

### Build Errors:

1. Check Vercel build logs
2. Make sure all dependencies are in package.json
3. Verify TypeScript has no errors: `bun run build` locally
