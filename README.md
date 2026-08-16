# XYPHORIA

A professional publication platform for tools, bots, scripts, and source code — powered by GitHub as its storage and database layer.

## Stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS + Framer Motion
- React Three Fiber / Three.js for the 3D hero
- GitHub REST API as the database and file storage
- Session auth (signed JWT cookie) + bcrypt password hashing

## 1. Create the database repository

Create a **private** GitHub repository to act as your database and file storage (e.g. `xyphoria-database`). You don't need to create any files inside it — on first request, the app automatically bootstraps `data/tools.json`, `data/categories.json`, `data/settings.json`, `data/statistics.json`, and `data/activity.json`, and will even create the repository itself via the GitHub API if it doesn't exist yet (as long as the token has `repo` scope and belongs to the target account).

## 2. Generate a GitHub token

Create a fine-grained or classic Personal Access Token with `repo` scope (contents read/write). **Never commit this token or paste it into chat/code.** It only ever lives in your server environment variables.

## 3. Generate the owner password hash

```bash
node -e "require('bcryptjs').hash(process.argv[1], 12).then(console.log)" "your-strong-password"
```

Copy the output into `OWNER_PASSWORD_HASH`.

## 4. Configure environment variables

Copy `.env.example` to `.env.local` and fill in real values:

```
GITHUB_TOKEN=your_token_here
GITHUB_OWNER=your_github_username
GITHUB_REPOSITORY=xyphoria-database
GITHUB_BRANCH=main

OWNER_USERNAME=your_owner_username
OWNER_PASSWORD_HASH=bcrypt_hash_from_step_3

SESSION_SECRET=a_long_random_string_at_least_32_chars
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Generate `SESSION_SECRET` with:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## 5. Install and run locally

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`. Log in at `/login` with `OWNER_USERNAME` and the plain-text password you hashed in step 3, then go to `/dashboard`.

## 6. Production build

```bash
npm run build
npm run start
```

## 7. Deployment

Deploy to any Node-capable host (Vercel, Railway, Fly.io, a VPS with PM2, etc). Set the same environment variables in your hosting provider's dashboard — never in source control.

## Architecture notes

- `lib/github/client.ts` — low-level GitHub REST API wrapper (server-only, token never leaves the server).
- `lib/github/database.ts` — reads/writes the JSON "tables" in the database repository.
- `lib/github/storage.ts` — uploads/deletes tool files under `tools/<category>/<slug>/`.
- `lib/services/*` — domain logic (tools, categories) combining GitHub storage with in-memory caching and activity logging.
- `lib/cache.ts` — stale-while-revalidate in-memory cache so pages don't hit the GitHub API on every request.
- `lib/auth/*` — session cookie issuance/verification and bcrypt password hashing.
- Every `/api/admin/*` route re-checks the session server-side; there is no client-only "hide the button" admin mode.

## Extending the dashboard

The following admin API endpoints are fully implemented and ready to use, with UI screens intentionally left as a next step (they follow the exact same fetch + component pattern as the Tools and Categories pages already built):

- `GET/DELETE /api/admin/files` — file manager (list all uploaded files across tools, delete by path)
- `GET /api/admin/analytics` — downloads-per-day and tools-per-category aggregates for richer charts
- `GET /api/admin/activity` — full activity log (login, upload, update, delete, settings changes)

To add a screen for any of these, copy the pattern in `app/dashboard/tools/page.tsx`: fetch on mount, render in a table or list, wire up any mutation actions to the existing endpoint.

## Security

- GitHub token, session secret, and password hash are read only from `process.env` on the server; nothing is ever sent to the client bundle.
- Uploads are validated by extension allowlist, size limit, and filename path-traversal checks before being written to GitHub.
- Downloads are counted through a server-side redirect endpoint, not a raw public link, so the counter can't be bumped by simply linking the raw file elsewhere.
- Rate limiting is applied to login, upload, and download endpoints.
- Security headers (`X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`) are set globally in `next.config.mjs`.
