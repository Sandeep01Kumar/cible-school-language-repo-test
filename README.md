# CIBLE School of Language

> **Learn English. Build Confidence. Shape Your Future.**

CIBLE School of Language is a premium, conversion-first marketing and admissions
website for an institute based in Madhubani, Bihar. It showcases the school's
**Spoken English**, **Science (PCM/PCB) coaching**, and **Computer courses**, and is
engineered as a fast, accessible, and SEO-optimized React single-page application
(SPA) in which every page, component, and call-to-action is designed to drive
student admissions and inquiries.

## Table of Contents

- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Pages](#pages)
- [Contact & Brand](#contact--brand)
- [Accessibility & SEO](#accessibility--seo)
- [Performance & Core Web Vitals](#performance--core-web-vitals)
- [Deployment & Hosting](#deployment--hosting)
- [Security](#security)
- [Launch Readiness (client-supplied configuration)](#launch-readiness-client-supplied-configuration)
- [Limitations](#limitations)
- [License & Notes](#license--notes)

## Tech Stack

The project is built entirely on the client with a modern React toolchain. All
dependency versions are declared as caret (`^`) ranges in
[`package.json`](./package.json) and locked in `package-lock.json`, which together
are the source of truth. The major versions below reflect what is actually declared
and installed; patch/minor levels may float within each caret range.

- **React 19 + Vite 8** — a modern ESM React SPA with fast HMR in development and an
  optimized production build. Vite 8 uses the Rolldown bundler under the hood.
- **React Router v7 (`react-router-dom`)** — client-side routing across 17 content
  pages plus a catch-all 404 *Not Found* route, configured declaratively with
  `<BrowserRouter>` (no server/data-router or React Server Components mode; see
  [Security](#security)).
- **Tailwind CSS v4** — CSS-first design system wired through the
  `@tailwindcss/vite` plugin (no `tailwind.config.js`; tokens are defined in an
  `@theme` block in `src/index.css`). The brand palette is blue (primary), orange
  (secondary), and green (accent) on a white background, built on an 8px spacing
  scale with rounded cards and soft shadows.
- **react-helmet-async** — per-page SEO head management (title, description,
  canonical, Open Graph, and Twitter cards).
- **react-hook-form** — accessible, validated Admission, Contact, and Newsletter
  forms. Because the site has no backend (see [Limitations](#limitations)),
  submission is a **client-side draft handoff**, not a server post, so the forms
  expose a small set of *honest* states rather than a manufactured
  "loading → success" cycle. The Admission and Contact forms use **idle** (ready
  for input, showing inline validation errors on invalid submit), **opened** (a
  prefilled WhatsApp/email draft was opened and is awaiting the user's own Send),
  **blocked** (the browser blocked the draft window/tab — recoverable, with a
  direct link to reopen it), and **error** (an unexpected failure building the
  draft); the Newsletter uses the same model without the **blocked** state
  (**idle** / **opened** / **error**). There is deliberately **no** fake
  "submitting"/"success" state, because nothing is sent to or stored on a server —
  the UI never claims a message was delivered.
- **framer-motion** + **react-intersection-observer** — subtle fade / slide /
  reveal animations triggered on scroll (respecting `prefers-reduced-motion`).
- **react-countup** — animated statistics counters.
- **swiper** — testimonial and gallery carousels.
- **react-icons** — professional, consistent iconography.
- **clsx** + **tailwind-merge** — the `cn()` helper for safe, conflict-free
  Tailwind class composition.
- **oxlint** — fast linter used as the code-quality gate.

## Getting Started

### Prerequisites

- **Node.js** and **npm**. Vite 8 requires Node.js **20.19+** or **22.12+**
  (the project is developed and validated on Node 22.x). No other global tooling is
  required — all dependencies install locally into `node_modules`.

### Install & run

```bash
# 1. Install dependencies
npm install

# 2. Start the Vite development server (default: http://localhost:5173)
npm run dev

# 3. Create an optimized production build in dist/
npm run build

# 4. Preview the production build locally
npm run preview

# 5. Run the linter (oxlint) quality gate
npm run lint
```

### Available scripts

Each command below maps directly to a script defined in `package.json`.

| Command           | Underlying command | Description                                              |
| ----------------- | ------------------ | -------------------------------------------------------- |
| `npm run dev`     | `vite`             | Start the development server with hot module replacement |
| `npm run build`   | `vite build`       | Produce an optimized production build in `dist/`         |
| `npm run preview` | `vite preview`     | Serve and preview the production build locally           |
| `npm run lint`    | `oxlint`           | Run the Oxlint quality gate                              |

> There is **no `test` script and no automated test suite** in this repository
> (`npm test` is not defined). Quality is gated by `npm run lint` (Oxlint) and a
> clean `npm run build`. See [Limitations](#limitations).

## Project Structure

The codebase follows a reuse-first structure: content lives in `src/data`, styling
tokens live in `src/index.css`, and a single canonical set of primitives is composed
across every page.

```text
public/            robots.txt, sitemap.xml, site.webmanifest, og-image.jpg, favicon.svg, logo.svg
src/
  assets/          logo.svg, logo-white.svg, hero.svg, course-*.svg (english/science/computer/personality/career) + assets/README.md
  data/            siteConfig, navigation, courses, faculty, testimonials, faq, events, blog, stats
  lib/             cn.js, validators.js, schema.js (JSON-LD builders), dates.js (date formatting), routeLoading.js (lazy-with-retry chunk loader)
  hooks/           useScrollReveal.js
  components/
    layout/        Layout, Navbar, Footer, ScrollToTop, ErrorBoundary, RouteProgress
    ui/            Button, Card, Container, SectionHeading, Badge, Input, Textarea, Select, Accordion, Breadcrumbs, Spinner
    common/        Hero, Statistics, CourseCard, FacultyCard, ReviewCard, Gallery, Timeline, FAQ, Newsletter, GoogleMap, CTASection, TestimonialSlider, CourseGrid, BlogCard, EventCard, FeatureCard, RepresentativeNote
    cta/           FloatingWhatsApp, FloatingCall, StickyBottomCTA
    forms/         AdmissionForm, ContactForm
    seo/           Seo, StructuredData
  pages/           Home, About, Courses, SpokenEnglish, ScienceCoaching, ComputerCourses, Faculty, Gallery, SuccessStories, Blog, Events, Admission, Career, Faq, Contact, PrivacyPolicy, Terms, NotFound
  App.jsx          route table (React.lazy + Suspense) under <Layout>
  main.jsx         bootstrap (HelmetProvider + BrowserRouter)
  index.css        @import "tailwindcss" + @theme brand tokens
index.html         document shell (SEO defaults, Inter font)
vite.config.js     react() + tailwindcss() plugins
```

## Pages

The application ships 17 content pages plus a catch-all 404, all lazy-loaded under a
shared layout shell (navbar, footer, floating WhatsApp/Call widgets, and a mobile
sticky CTA bar):

1. **Home** — hero, featured courses, animated statistics, testimonials, faculty
   preview, and an admission call-to-action.
2. **About** — the institute's story, mission, values, and milestones.
3. **Courses** — the full course catalog.
4. **Spoken English** — the flagship Spoken English program.
5. **Science Coaching** — PCM and PCB coaching for science students.
6. **Computer Courses** — Basic Computer, Digital Literacy, and related programs.
7. **Faculty** — faculty profiles and expertise.
8. **Gallery** — a visual gallery built from on-brand **representative
   illustrations** (not photographs of the actual institute yet — see
   [Limitations](#limitations)).
9. **Success Stories** — **representative** student testimonials and outcomes shown
   for demonstration; these are not verified student records.
10. **Blog** — articles, learning tips, and updates.
11. **Events** — upcoming events, workshops, and seminars.
12. **Admission** — the admission form and enrollment process.
13. **Career** — career and hiring opportunities at the institute.
14. **FAQ** — frequently asked questions.
15. **Contact** — contact form, Google Map, and contact details.
16. **Privacy Policy** — the site's privacy policy.
17. **Terms** — the site's terms of service.
18. **404 — Not Found** — a friendly catch-all for unmatched routes.

## Contact & Brand

- **Phone:** +91 98993 15093
- **Email:** info2cible@gmail.com
- **Address:** State Highway 75 (SH75), Mukhiapatti, Saharghat, Madhubani, Bihar – 847305

### Color system

| Role       | Color |
| ---------- | ----- |
| Primary    | Blue  |
| Secondary  | Orange |
| Accent     | Green |
| Background | White |

The palette is applied consistently across all pages and components via Tailwind
`@theme` tokens defined in `src/index.css`, with high contrast throughout and subtle
neutral sections for visual rhythm.

## Accessibility & SEO

The site targets **WCAG AA** accessibility: semantic HTML landmarks
(`header` / `nav` / `main` / `footer`), ARIA labels, full keyboard navigation,
visible focus states, a logical heading hierarchy, descriptive alt text, and
AA-contrast color pairings across the blue / orange / green palette on white. For
discoverability, every page emits a unique meta title and description together with
Open Graph and Twitter card metadata, and injects JSON-LD structured data
(**Organization**, **LocalBusiness**, **Course**, and **Breadcrumb**). Static
`public/robots.txt` and `public/sitemap.xml` files complete the SEO surface. All of
this metadata is set **client-side** (via `react-helmet-async` and runtime JSON-LD
injection); see [Deployment & Hosting](#deployment--hosting) for how this affects
crawlers that do not execute JavaScript.

## Performance & Core Web Vitals

Performance is engineered with the techniques available to a **client-rendered**
SPA, and the results split cleanly by device class: desktop Core Web Vitals are
excellent, while **mobile Largest Contentful Paint (LCP)** carries the residual cost
of client-side rendering under mobile CPU/network throttling. What the build does
in-scope:

- **Route-level code splitting.** Every one of the 17 pages (plus the 404) is a
  `React.lazy` chunk loaded on demand behind a `<Suspense>` fallback, so a visitor
  downloads only the route they open, not the whole site.
- **Above-the-fold LCP is not gated behind JavaScript animation.** The hero — the
  LCP element on most routes — renders its `<h1>`, lead paragraph, and CTAs
  immediately as plain semantic elements (no scroll-reveal wrapper that would hold
  the heading at `opacity: 0`), and the hero illustration is a small SVG marked
  `loading="eager"`, `fetchpriority="high"`, `decoding="async"` with explicit
  `width`/`height` to reserve space (no layout shift).
- **Font delivery.** The Inter web font is `preconnect`-ed and `preload`-ed in
  `index.html` and requested with `display=swap`, so text paints in a fallback face
  immediately and never blocks the LCP heading on the web font.
- **Subtle, reduced-motion-aware animation.** Reveals use `framer-motion` +
  `react-intersection-observer` and honor `prefers-reduced-motion` globally via a
  root `<MotionConfig reducedMotion="user">`.
- **Layout stability (CLS).** Media reserve their box (the hero image and the
  `aspect-video` map), and the router takes **manual** scroll restoration so a warm
  reload cannot race late content into a layout shift.
- **Dependency hygiene.** A previously-declared but entirely unused `aos`
  scroll-animation package (zero imports) was removed and the lockfile regenerated,
  trimming the install/maintenance surface. Scroll reveals are already covered by
  `framer-motion` + `react-intersection-observer`, so no capability is lost.

**Mobile LCP disposition (acceptance note).** Under Lighthouse *mobile* throttling,
LCP for this client-rendered app lands in roughly the 3.0–3.6s range across routes
(desktop passes at 99–100), because the browser must download, parse, and execute the
React bundle before the hero paints — the inherent cost of client-side rendering. The
in-scope levers above are all applied; pushing mobile LCP below the 2.5s "good"
threshold requires **server-side rendering / prerendering (SSG)** and **host/edge
delivery tuning** (Brotli/gzip compression, HTTP/2 or HTTP/3, a CDN, and the immutable
asset caching described under
[Response headers](#response-headers-host--edge-configuration)). Those are **out of
scope for this client-only static front-end** (the app is deliberately client-rendered
with no SSR/SSG layer) and are documented here, and under
[Deployment & Hosting](#deployment--hosting) and [Limitations](#limitations), as the
deploy-time path to acceptance-grade mobile LCP.

## Deployment & Hosting

This is a **client-rendered single-page application (SPA)**. `npm run build` emits a
static bundle to `dist/` (an `index.html` shell plus hashed JS/CSS/asset files) that
can be served by any static host or CDN. Two hosting characteristics follow directly
from the client-only architecture and **must be understood/configured at deploy time**:

- **History fallback / rewrite rule (required).** Routing is handled in the browser by
  React Router's `<BrowserRouter>`, which uses the HTML5 History API. The host must be
  configured to **rewrite all unmatched request paths to `/index.html`** so that deep
  links and hard refreshes on routes such as `/courses` or `/contact` load the app
  instead of returning the host's own 404. Typical configuration:
  - Netlify: a `/* /index.html 200` redirect (e.g. in `netlify.toml` or `_redirects`).
  - Vercel: a catch-all rewrite to `/index.html`.
  - Nginx: `try_files $uri /index.html;`.
  - Apache: a `mod_rewrite` fallback to `index.html`.

  Without this rewrite, only the root `/` path will load reliably.

- **Soft-404 (no true HTTP 404 status) — requires host/edge configuration.** Because
  the SPA history fallback (above) serves the same `index.html` for *every* path,
  unmatched routes render the in-app **NotFound** page but the HTTP response status is
  still **200**, not a real `404` — a *soft* 404. The **client-side behavior is already
  correct**: `NotFound` emits `<meta name="robots" content="noindex, follow">`, sets **no
  canonical**, and injects **no JSON-LD**, so search engines skip indexing while still
  following the recovery links. What a static bundle **cannot** do by itself is return
  the `404` *status code*; that is a deploy-time responsibility of the host/edge because
  the fallback rewrite that makes deep links work is the very thing that forces a `200`.
  Choose one of these host recipes to serve the branded NotFound content **with a genuine
  `404` status** while keeping real routes at `200`:
  - **Prerender / SSG at build time.** Add a prerender step (e.g. a Vite prerender/SSG
    plugin) that emits one static HTML file per known route *and* a real `404.html`.
    Static hosts that honor a custom 404 document (**GitHub Pages**, **AWS S3 static
    website hosting**, **Firebase Hosting**) then serve `404.html` with a `404` status for
    any unmatched path — no rewrite-to-`index.html` needed for those unknowns.
  - **Edge / serverless function** (**Netlify Edge Functions**, **Vercel Edge
    Middleware**, **Cloudflare Workers/Pages Functions**). Match the request path against
    the canonical route list (kept in `src/data/navigation.js` and `public/sitemap.xml`):
    serve `index.html` with `200` for a known route, and return the NotFound document with
    an explicit `404` status for anything else. This preserves deep-link support while
    giving unknown paths a true `404`.
  - **Custom 404 document** on hosts that support one: point the host's "not found" handler
    at a `404.html` (or the prerendered NotFound HTML) so unmatched paths receive a `404`
    status instead of the `200` history-fallback.

  Until one of the above is configured at the host, the app degrades gracefully (correct
  noindex NotFound at a `200`); wiring a true `404` status is **out of scope for this
  static front-end build** and is documented here as a deployment requirement.

- **No server-side rendering or prerendering.** The app is **client-rendered only**.
  The shipped `index.html` contains an empty `#root` element hydrated by JavaScript at
  runtime; there is no SSR, SSG, or build-time prerendering. Crawlers that execute
  JavaScript see the fully rendered content plus the per-page `react-helmet-async`
  metadata and JSON-LD; crawlers that do **not** execute JavaScript see only the static
  defaults in `index.html`. Adding no-JS SEO or social-preview crawling would require a
  prerender/SSR layer (out of scope for this build).

## Security

- **Dependency advisories (`react-router-dom`).** The project pins `react-router-dom`
  at the latest published v7 (`^7.18.1`), the most secure version available for a
  **declarative client SPA**: it resolves the client-relevant advisories
  (open-redirect / XSS classes) that affect older 7.x releases. One residual advisory,
  **GHSA-qwww-vcr4-c8h2** — a CSRF issue in React Router's **React Server Components /
  server-action** mode — has no published version that fixes it without regressing to a
  release that reintroduces the worse client-side advisories. It is **not reachable in
  this application**, which uses only declarative `<BrowserRouter>` routing with no RSC,
  no server actions, and no data-router loaders/actions. It is therefore documented as
  an accepted, non-exploitable ecosystem constraint rather than a code defect;
  re-evaluate when a fixed React Router release is published.
- **Structured-data serialization.** JSON-LD injected into `<script>` tags via Helmet
  is validated (plain objects only) and escaped (`<` → `\u003c`, `>` → `\u003e`,
  `&` → `\u0026`, and U+2028/U+2029) to prevent script-context breakout (CWE-79).
- **Form handoff.** Forms do not post to any server (see [Limitations](#limitations));
  they open a WhatsApp or email **draft** on the user's device. The user's details are
  only transmitted if they choose to send that draft, and each form discloses this
  third-party handoff adjacent to the submit action and links to the Privacy Policy.

### Response headers (host / edge configuration)

The SPA ships no server, so HTTP response headers are **not set by application code** —
they are configured on the static host / CDN / edge that serves `dist/`. The following
hardening headers are **recommended for production** and are tuned to the exact
third-party origins this site actually uses (Google Fonts, plus a Google Maps embed on
the Contact page). Apply them at the edge and verify with a tool such as Mozilla
Observatory or `curl -I` (the CSP is shown wrapped for readability; send it as a single
header value):

A ready-to-use [`public/_headers`](./public/_headers) file is included and copied into
`dist/` by the build. On hosts that read it (**Netlify**, **Cloudflare Pages**) it
applies the unambiguously-safe hardening headers below **plus the clickjacking control**
(`X-Frame-Options: SAMEORIGIN` and CSP `frame-ancestors 'self'`) that closes the
cross-origin framing gap, and it is inert on hosts that don't consume it (configure the
equivalent there). The **full resource-restricting CSP** (`script-src` / `style-src` /
`img-src` / `font-src` / `frame-src`) is intentionally left as documentation below rather
than shipped in `_headers`, because a mis-scoped resource CSP can break the web font, the
Maps embed, or the runtime inline styles set by Framer Motion / Swiper — enable it at the
edge once validated against your deployed build (merging its `frame-ancestors` directive
into the single CSP header).

```
Content-Security-Policy: default-src 'self';
  script-src 'self';
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com;
  img-src 'self' data:;
  frame-src https://www.google.com;
  connect-src 'self';
  base-uri 'self';
  object-src 'none';
  frame-ancestors 'self'
X-Content-Type-Options: nosniff
X-Frame-Options: SAMEORIGIN
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=()
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
```

CSP notes specific to this app:

- `style-src` includes `'unsafe-inline'` because Framer Motion and Swiper set inline
  `style` attributes at runtime for animations/transforms; this relaxation applies to
  **styles only**, never scripts. To run a strict inline-style CSP, drive those effects
  with classes/CSS variables and then drop `'unsafe-inline'`.
- `style-src` / `font-src` allow `https://fonts.googleapis.com` / `https://fonts.gstatic.com`
  for the Inter web font loaded in `index.html`; self-hosting Inter lets you tighten both
  back to `'self'` and remove the font preconnects.
- `frame-src https://www.google.com` is required **only** for the Contact page's Google
  Maps `<iframe>`; remove it if the map embed is removed.
- No `script-src` allowance is needed for the JSON-LD injected via `react-helmet-async`:
  `<script type="application/ld+json">` is a non-executed data block, so CSP does not
  gate it.
- `frame-ancestors 'self'` is the modern clickjacking control; `X-Frame-Options: SAMEORIGIN`
  is retained alongside it for legacy browsers.

Caching & CORS:

- **Immutable static assets.** `npm run build` emits content-hashed files under
  `dist/assets/*` (the hash changes whenever content changes), so serve them with
  `Cache-Control: public, max-age=31536000, immutable`. Serve the non-hashed `index.html`
  with `Cache-Control: no-cache` (or a short `max-age` + `must-revalidate`) so a new deploy
  is picked up on the next visit rather than being pinned to a stale shell.
- **CORS.** The app makes no cross-origin data requests, so it needs no permissive CORS.
  Do **not** emit `Access-Control-Allow-Origin: *` on the HTML document; if a CDN needs CORS
  for the hashed asset/font files, scope it narrowly and limit methods to `GET, HEAD`.
- **Genuine 404 status.** As noted under [Deployment & Hosting](#deployment--hosting),
  unmatched paths currently return a *soft* 404 (HTTP 200 with the in-app NotFound page);
  returning a true `404` status requires host/edge configuration that recognises unknown
  paths ahead of the SPA history-fallback rewrite.

## Launch Readiness (client-supplied configuration)

Several values in this build are **representative placeholders** that the institute
must supply and confirm before going live. This is by design: the codebase cannot
invent an authentic production domain, legal entity, verified social identity, precise
map pin, or confirmed opening hours (see the AAP scope note on genuine, client-supplied
details). They are **centralized in a single file**,
[`src/data/siteConfig.js`](./src/data/siteConfig.js), and every consumer (the `<Seo>`
component's canonical/Open Graph tags, the JSON-LD builders in `src/lib/schema.js`, the
`Navbar`/`Footer`, the `GoogleMap`, and the forms) reads from there — so updating that
one file propagates everywhere at runtime.

Complete the following checklist before launch:

- [ ] **Production domain (`siteConfig.siteUrl`).** Currently the placeholder
  `https://www.cibleschool.com`. It is the canonical base URL and drives the canonical
  link, Open Graph `og:url`, and all JSON-LD URLs. Two static files **cannot** import JS
  and therefore inline the literal domain — keep them **byte-for-byte identical** to
  `siteUrl` when you change it: [`public/sitemap.xml`](./public/sitemap.xml) and
  [`public/robots.txt`](./public/robots.txt) (its `Sitemap:` line).
- [ ] **Legal entity & contact identity.** Confirm the registered institute name,
  address, phone, and email in `siteConfig` match the authoritative legal/contact
  details (these feed the LocalBusiness JSON-LD and the visible contact surfaces).
- [ ] **Social profiles (`siteConfig.social` + `siteConfig.socialVerified`).** The
  handles are representative. Replace them with the official profile URLs, then flip
  `socialVerified` to `true` — until then, `src/lib/schema.js` deliberately **omits** the
  `sameAs` block so no unverified account is published as the institute's identity.
- [ ] **Map pin & hours (`siteConfig.mapEmbedUrl` / `mapLink` / `hours`).** The map
  currently uses a text-query embed centered on the SH75 address; replace it with the
  precise **"Share → Embed a map"** URL from the official Google listing, and confirm the
  opening hours.
- [ ] **Representative content (`siteConfig.representativeContent`).** While `true`, the
  app surfaces honest "representative content" disclosures (a footer band plus
  point-of-claim notices). Once all imagery, copy, faculty bios, and student stories are
  client-verified, set it to `false` to retire every notice at once.
- [ ] **Brand & social assets.** Replace the representative artwork in
  [`src/assets/`](./src/assets/) (logo, hero, course illustrations) and the social share
  image [`public/og-image.jpg`](./public/og-image.jpg) with final, licensed assets.

## Limitations

This repository is a front-end website. The following are **intentionally not part of
this build** and are documented so integrators are not surprised:

- **No backend, API, or database.** There is no server component and no persistent data
  store. Admission, Contact, and Newsletter forms perform a **client-side handoff** by
  opening a prefilled WhatsApp chat (`https://wa.me/…`) or a `mailto:` email draft;
  nothing is submitted to or stored on a server, and the UI states say so truthfully
  ("draft opened — not yet sent").
- **No automated tests.** There is no unit/integration/e2e test suite and no `test`
  script; the gates are `npm run lint` (Oxlint) and a clean `npm run build`.
- **No offline / service worker.** `site.webmanifest` supplies installability metadata
  (name, icons, theme color) only. There is **no service worker**, so the app does not
  work offline and does not cache beyond normal browser HTTP caching.
- **No prerender / SSR and no true HTTP-404.** See
  [Deployment & Hosting](#deployment--hosting).
- **iOS safe-area not verified on hardware.** `viewport-fit=cover` plus
  `env(safe-area-inset-*)` padding is implemented for the fixed mobile CTA, but it has
  not been verified on a physical notched iOS device or the iOS Simulator in this
  environment; verify on representative iOS hardware before launch.
- **Representative content and assets.** See [License & Notes](#license--notes).

## License & Notes

- Some imagery and editorial copy in this repository are **representative
  placeholders** intended to be replaced with genuine, institute-supplied assets
  (real photographs, verified faculty biographies, and actual student records)
  before launch. This is disclosed **visibly in the running app** — a site-wide
  "Demo content notice" band in the footer, plus point-of-claim notices on the
  Faculty, Success Stories, About, Career, Events, Blog, and Courses pages — and is
  gated by the `representativeContent` flag in `src/data/siteConfig.js` (set it to
  `false` once the content is client-verified to retire every notice at once).
- **Unverified social profiles are hidden by default.** Social links and the
  `sameAs` entries in the JSON-LD are gated behind `socialVerified` in
  `src/data/siteConfig.js` (currently `false`), so no unconfirmed identity is
  published; enable it once the official profile URLs are verified.
- The domain `https://www.cibleschool.com`, the map location/hours, and the contact
  details are **representative** and drive the SEO metadata, structured data,
  `sitemap.xml`, and `robots.txt`; swap them for the final, verified production
  values at launch.
- This is a private project (`"private": true` in `package.json`) developed for
  CIBLE School of Language.
