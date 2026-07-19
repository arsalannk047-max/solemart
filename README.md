# SoleMart — Next.js Edition

Full Next.js (App Router) rebuild of the shoe store: customer storefront + admin panel,
backed by your Supabase project (database + auth + storage). Same backend as before —
new frontend, built with React Server Components, Server Actions, and Tailwind CSS.

## 1. Install

```bash
cd solemart-next
npm install
```

## 2. Configure environment

Copy `.env.local.example` to `.env.local`:

```bash
cp .env.local.example .env.local
```

The Supabase URL and anon key are already filled in. Add the **secret key**:
`Supabase Dashboard → Project Settings → API Keys → Secret keys → reveal → copy`

Paste it as `SUPABASE_SECRET_KEY` in `.env.local`. This stays server-only.

## 3. Run it

```bash
npm run dev
```

Visit **http://localhost:3000**

## 4. Create your admin account

1. Go to `/signup` and create a normal account.
2. In Supabase SQL Editor, run (replace the email):

```sql
update profiles set is_admin = true
where id = (select id from auth.users where email = 'you@example.com');
```

3. Log in at **`/admin/login`** with that same account.

## 5. Order notifications on your phone

Every time a customer places an order, you'll get an email (readable instantly on your phone
via the Gmail app). This uses your own Gmail account to send — free, no third-party service.

1. Go to your Google Account → **Security** → turn on **2-Step Verification** (required for App Passwords).
2. Go to **myaccount.google.com/apppasswords**, create a new app password (name it "SoleMart").
3. Google gives you a 16-character code like `abcd efgh ijkl mnop` — copy it (remove spaces).
4. In `.env.local`, set:
   ```
   SMTP_USER=your-gmail@gmail.com
   SMTP_PASS=abcdefghijklmnop
   ADMIN_NOTIFY_EMAIL=your-gmail@gmail.com
   ```
5. Restart `npm run dev`. Place a test order — you should get an email within seconds.

If these env vars are left blank, orders still work fine — the app just skips sending the email
(check your terminal for a warning if that happens).

## 6. Adding new shoes

Admin panel → **Products → Add product** — fill details, upload up to 6 photos
(stored in Supabase Storage), add one row per size with its own stock count.

## Stack

- **Next.js 14** (App Router) — React Server Components + Server Actions (no separate API layer needed)
- **Tailwind CSS** — utility-first styling, custom design tokens for the SoleMart look
- **@supabase/ssr** — cookie-based auth session, shared between server and client
- Product/category/order data reads & writes go through a service-role client server-side;
  customer auth (signup/login/logout) goes through a cookie-bound anon client, matching
  Supabase's recommended Next.js pattern.

## Structure

```
app/            # routes (pages), each folder = a URL segment
  admin/        # admin panel routes, gated by lib/requireAdmin.js
actions/        # Server Actions — the "backend" (auth, checkout, product/order CRUD)
components/     # shared UI, cart context, forms
lib/            # Supabase clients, auth helpers, formatting
```

## Deploying live

- **Vercel** (easiest — same company as Next.js): import the repo, add the env vars from
  `.env.local`, deploy. Zero extra config needed.
- **Railway / Render / VPS**: `npm install && npm run build && npm start`, set the same env vars.

## Notes

- Cart lives in the browser (localStorage) until checkout, when it's sent to a Server Action
  that creates the order in Supabase.
- Checkout is Cash on Delivery only for now.
- Stock is decremented automatically by a database trigger when an order is placed.
