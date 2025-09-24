# Linktree Clone — Full Starter (Improved)

This repository is a more complete starter for a Linktree-style multi-user site using Supabase and Vercel.
It includes:

- Next.js app (pages + api style)
- Supabase client, auth examples
- Profile creation with unique vanity slug
- Links CRUD with ordering (drag-and-drop)
- Avatar upload (Supabase Storage)
- Click logging endpoint which records analytics
- Stripe checkout placeholders (tipping / purchases)
- SQL migrations and RLS guidance

## Quick start

1. `npm install`
2. Create a Supabase project. Set environment vars in `.env.local`:
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
   - SUPABASE_SERVICE_ROLE_KEY (server only)
   - NEXT_PUBLIC_SITE_URL (e.g. https://yourdomain.com)
   - STRIPE_SECRET_KEY
   - STRIPE_WEBHOOK_SECRET
3. Run the SQL in `migrations.sql` in Supabase SQL editor.
4. Start dev server: `npm run dev`

## What to improve / production steps

- Add Supabase Row Level Security (RLS) policies to enforce ownership (see migrations.sql comments).
- Configure Stripe webhook endpoint and secret.
- Add stronger validation + email verification before allowing slug claims.
- Add tests and CI.
- Move secrets to Vercel environment variables and deploy.

