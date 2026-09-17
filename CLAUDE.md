# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev            # Next.js dev server (Turbopack) on :3000
npm run build          # Production build
npm start              # Serve the production build
npx tsc --noEmit       # Typecheck — see warning below
```

There are no tests in this repo.

### Environment variables

| Variable | Needed for | Notes |
| --- | --- | --- |
| `ADMIN_PASSWORD` | `/admin` login | Server-only. Replaced `NEXT_PUBLIC_ADMIN_PASSWORD`, which shipped the password to the browser. |
| `ADMIN_SESSION_SECRET` | `/admin` login | Signs the session cookie; changing it logs all admins out. Any long random string. |
| `BLOB_READ_WRITE_TOKEN` | live door catalogue | Injected automatically once a Blob store is connected in the Vercel dashboard. Locally: `vercel env pull .env.local`. Absent → falls back to the bundled catalogue and admin writes fail with a clear message. |
| `EMAIL_USER` / `EMAIL_PASS` | contact form | Gmail address + app password. |

All three of the first group must also be set in the Vercel project's env vars for production — `.env.local` only covers local dev.

`npm run lint` is declared as `eslint .` but ESLint is not installed as a dependency, so the script fails. Either install ESLint or ignore the script.

**`next.config.mjs` sets `typescript.ignoreBuildErrors` and `eslint.ignoreDuringBuilds`**, so `npm run build` passes even with type errors. Always run `npx tsc --noEmit` separately before considering a change done. (The `eslint` key in `next.config.mjs` is also no longer supported by Next 16 and logs a warning on every start.)

Windows note: killing the dev server can leave the `next dev` child process holding port 3000 and `.next/dev/lock`. If a restart reports "Unable to acquire lock", kill the PID named in the "Port 3000 is in use by process N" line and `rm -rf .next/dev`.

## Architecture

Next.js 16 App Router + React 19, Tailwind v4, shadcn/ui (new-york style), Vercel Blob for the door catalogue, Nodemailer for the contact form. Deployed on Vercel.

### The repo is v0.app-synced

Per `README.md`, this repository is auto-synced from a [v0.app](https://v0.app/chat/cxPfGopVDJC) project. Changes made in v0 are pushed here automatically and can overwrite hand-written work. Much of the original scaffolding is generated code.

### Router split — two contact endpoints exist, only one is live

This project mixes both routers:

- `pages/api/contact.js` (Pages Router) — **this is the live endpoint.** `app/contact/page.tsx` posts to `/api/contact`.
- `app/api/route.ts` (App Router, `POST /api`) — a near-duplicate Nodemailer handler that nothing calls.

If you change contact-form email behaviour, edit `pages/api/contact.js`. Editing `app/api/route.ts` has no effect on the form.

Both read `EMAIL_USER` / `EMAIL_PASS` (a Gmail app password) and send to `woodlanedoors@gmail.com`.

### Doors catalogue (Vercel Blob, no database)

The catalogue is **one JSON file in Vercel Blob**, not a database. `lib/doors-catalogue.ts` is the whole data layer (server-only — it holds the write token, never import it from a client component):

- `catalogue/doors.json` in Blob is the manifest: the full `Door[]`, overwritten wholesale on every edit (`addRandomSuffix: false`, `allowOverwrite: true`). Read by `head()`-ing the fixed pathname to resolve its public URL, then fetching that.
- `catalogue/images/<uuid>.<ext>` holds each uploaded photo. `Door.imagePathname` keeps the storage key so the blob can be deleted when a door is removed or its image replaced.
- Blob's CDN caches the manifest for 60s (`MANIFEST_CACHE_SECONDS`), and `app/api/doors/route.ts` sets `revalidate = 60` to match — so an admin edit reaches visitors within about a minute, not instantly.

Everything degrades gracefully when `BLOB_READ_WRITE_TOKEN` isn't set (a fresh clone, or Blob not yet connected in the Vercel dashboard): reads return `null`, `/doors` shows `lib/doors-fallback.ts` (26 bundled items from `public/`), and admin writes return a plain-English 500 that the dashboard surfaces in-form without losing the typed input. Check `isBlobConfigured()` before any write path.

`app/doors/page.tsx` fetches `/api/doors` with `AbortSignal.timeout(CATALOGUE_TIMEOUT_MS)` (3s) and falls back to the bundled catalogue when that fails *or* returns an empty array. Falling back is expected rather than exceptional, so it logs via `console.info` — `console.error` trips the Next.js dev error overlay on every page load. The timeout exists because a dead host doesn't fail fast: the old Supabase host hung for a measured ~24s before the browser gave up, which is what made this page feel broken.

**Supabase is fully removed** — `lib/supabase/`, `scripts/001_create_doors_table.sql`, `app/api/cron/route.ts` and its `vercel.json` cron trigger, the `@supabase/*` packages and the `NEXT_PUBLIC_SUPABASE_*` env vars are all gone. Don't reintroduce a database for the catalogue without a reason; Blob is the deliberate choice here.

Only `package-lock.json` remains as a lockfile. A stale `pnpm-lock.yaml` was deleted: Vercel's package-manager detection prefers it when present, and it had drifted 9 months out of date (still listing Supabase, unaware of `@vercel/blob`), so a deploy would have failed `--frozen-lockfile`. Don't add a second lockfile back.

### Admin dashboard and auth

`/admin` lets an admin add, edit and delete doors, image upload included — that's the supported way to change the catalogue now.

Auth is a **signed cookie, no session store** (`lib/admin-auth.ts`): `ADMIN_PASSWORD` is checked server-side by `app/api/admin/login/route.ts`, which sets an HttpOnly cookie carrying its own expiry plus an HMAC signature keyed by `ADMIN_SESSION_SECRET`. Both are server-only env vars — the password no longer ships in the browser bundle the way `NEXT_PUBLIC_ADMIN_PASSWORD` did. Password and signature are both compared with `timingSafeEqual` (the password is SHA-256'd first so the lengths always match).

`lib/login-throttle.ts` locks an IP out for 10 minutes after 8 failed attempts. It's an in-memory `Map`, so the limit is **per serverless instance, not global** — Vercel runs several and recycles them, so it slows an online guessing attack rather than hard-capping it. The primary defence is password entropy; a hard global limit would need shared state (Vercel KV / Upstash). Known gaps, deliberately accepted for a single-admin site: one shared password (no per-user accounts or audit trail), and no way to revoke a single session — rotating `ADMIN_SESSION_SECRET` logs everyone out, which is the only revocation lever.

**Every route under `app/api/admin/*` re-checks that cookie itself** (`requireAdmin()`); the `redirect()` in `app/admin/page.tsx` is only a UX nicety, since a page-level redirect wouldn't stop anyone calling the routes directly. `app/admin/page.tsx` is a thin Server Component doing that check and rendering `components/admin-dashboard.tsx` (the client component holding all the form/upload state) — the same shell split as `components/legal-page.tsx`.

Uploads post `multipart/form-data` with the raw `File`, capped at 4MB — comfortably under Vercel's ~4.5MB serverless request-body limit, so oversized images get a real error instead of a confusing platform rejection. The previous version base64'd images into a DB text column, which is what its "row limit exceeded" error was about.

The `/admin` pages still use the pre-redesign styling and are not wired to `Header`/`Footer`.

## Design system

Tailwind v4 is CSS-first — **there is no `tailwind.config.js`.** All tokens live in `app/globals.css` under `@theme inline`, driven by CSS variables in `:root` / `.dark`. Add a color by defining the variable and mapping it to `--color-*` in the `@theme inline` block. (`components.json` points `tailwind.config` at `""` for this reason. A stale `styles/globals.css` also exists and is not imported.)

Palette is walnut + warm sand + brass in oklch. Beyond the shadcn defaults there are `--ink` / `--ink-foreground` for full-bleed dark bands (hero, process, footer) and `--success`, plus `--shadow-soft` / `--shadow-lift`.

Component classes in `globals.css`: `.eyebrow` (uppercase section label with a brass rule), `.rule-brass`, `.grain` (woodgrain texture overlay for dark bands).

### Scroll reveal contract

`components/scroll-reveal.tsx` is mounted once in `app/layout.tsx`. It adds `js-reveal` to `<html>` on mount, then uses an IntersectionObserver to add `is-revealed` to any `.reveal` element entering the viewport.

Elements are hidden **only** under `.js-reveal`, so with JS disabled or `prefers-reduced-motion: reduce` everything renders visible. Adding `className="reveal"` to a new element is all that's needed — a MutationObserver picks up nodes added later (filtered grids, async data). Never hide a `.reveal` element with your own `opacity: 0`, or it will stay invisible when the observer doesn't run.

For above-the-fold content use the `.animate-rise` / `.animate-fade` keyframe utilities instead, which do not depend on JS.

### Doors gallery

`app/doors/page.tsx` renders a fixed-column photo grid; each tile is a `<button>` that opens `components/gallery-lightbox.tsx` at that index. The lightbox is a controlled component — the page owns `lightboxIndex`, so the grid and viewer never drift apart.

It navigates within `filteredDoors`, not the full catalogue, so arrow keys walk the active filter. Changing the filter resets the index to `null` (a held index would point at a different door after the list reorders).

The lightbox handles focus trapping, focus restore, body scroll lock, `←`/`→`/`Esc`, touch swipe, neighbour-image preloading, and a thumbnail strip. Its strip uses `[justify-content:safe_center]` rather than `justify-center` — plain centring in an `overflow-x` flex container makes the leading items unreachable.

The grid paginates client-side (`visibleCount`, `INITIAL_VISIBLE`/`VISIBLE_STEP` = 12) rather than rendering the whole filtered set at once — a "Show more" button extends it. Changing the category filter resets `visibleCount` back to `INITIAL_VISIBLE` (same effect that resets `lightboxIndex`). The lightbox itself still receives the full `filteredDoors`, not just the visible slice, so arrowing through it isn't capped by how many grid tiles have been revealed.

### Shared page shell

Pages compose `<Header />` / `<Footer />` themselves — there is no shared layout wrapper beyond `app/layout.tsx`. `Header` is a client component (scroll state + mobile sheet) that renders transparent-over-hero and switches to solid on scroll, so **every page needs a dark hero band at the top** or the white nav text will be unreadable.

`components/legal-page.tsx` is the shell for `/privacy` and `/terms`. Those pages export only data (`policySections` / `termsSections`) and hand it to `LegalPage`, which renders the hero, sticky table of contents and document body. The copy is authored as loose text using `**bold**` and `- ` bullets; `LegalPage` parses that lightweight markup — there is no markdown library.

### Logo

`components/logo.tsx` renders the real brand file, `public/images/woodlane.jpeg`, wrapped in a small white chip so it reads as an intentional badge rather than a stray white box when the header sits transparent over the dark hero image. It's used at two sizes (header 40px, footer 52px via `size="lg"`).

**It renders with `unoptimized`, deliberately.** The same source at two different `next/image`-derived widths on one page reproduces a real Next.js dev-mode bug: the second (differently-sized) request for an already-requested source silently never resolves — confirmed by forcing both instances to the same width, which fixed it, then reproducing the hang again with mismatched widths. The logo is small and fixed at exactly two call sites, so skipping the optimizer costs nothing. If you ever see an image that "loads in one place but not another" and the two instances share a `src` at different sizes, this is why.

## Images

Photography in `public/` uses descriptive kebab-case filenames (several are truncated mid-word, e.g. `glass-and-wood-balcony-sliding-doors-with-natural-.jpg` — copy paths exactly).

Every image on the site goes through `next/image` (`images.unoptimized` is **not** set — Vercel's optimizer resizes, reformats, and generates responsive srcsets for free at deploy time). This mattered concretely: before the migration, the doors page shipped 4.1MB of images per visit (26 photos at their native 1024×1024, JPEG, no resizing) against a real ~300px display size; after, it's ~0.6MB. Always add `fill` + a `sizes` string matched to the actual rendered width, not a guess — an oversized `sizes` value defeats the optimization.

For static, code-authored image paths (hero, about, CTA, page-hero backgrounds, the door-collection bento grid) use `next/image` directly — the `src` is a string literal, so it's always safe.

For `door.image_url` — admin-uploaded, not authored in code — use `<CatalogueImage>` (`components/catalogue-image.tsx`) instead of `next/image` directly. `next/image` throws a hard render error for a `src` host that isn't allow-listed in `images.remotePatterns`, so an unvetted call there would let one bad URL take down the whole doors page and lightbox. `CatalogueImage` optimizes the two sources `image_url` can actually have — root-relative `/public` paths and the Vercel Blob host (`*.public.blob.vercel-storage.com`, allow-listed in `next.config.mjs`) — and falls back to a plain unoptimized `<img>` for anything else. Its `OPTIMIZABLE_REMOTE_HOST` regex and that remotePattern must stay in sync.

### Updating site images, in practice

- **Door catalogue photos** (the doors page + gallery): use **`/admin`** — add, edit, replace an image, or delete, no code or deploy needed. Changes reach visitors within ~60s (see the cache note above). This needs Vercel Blob connected to the project; without it, the dashboard says so explicitly.
- **The bundled fallback** (`lib/doors-fallback.ts`): only shows when the live catalogue is empty or unreachable. Edit it directly (plain array; `category` must match a `DOOR_CATEGORIES` value to hit the sidebar filters) and drop files in `public/`. Portrait ~3:4 matches the grid; anything else gets cropped by `object-cover`.
- **Marketing images** (hero background, about section, CTA background, the homepage door-collection tiles, page-hero backgrounds on doors/contact/privacy/terms): **not** admin-editable — these are `src` string literals inside the component files themselves (`components/hero.tsx`, `components/about.tsx`, `components/cta.tsx`, `components/door-collection.tsx`, and the hero `<Image>` at the top of `app/doors/page.tsx` / `app/contact/page.tsx` / `components/legal-page.tsx`). Either replace the file in `public/` with a new one of the *same filename*, or change the `src` string to point at a new filename you've added to `public/`.
