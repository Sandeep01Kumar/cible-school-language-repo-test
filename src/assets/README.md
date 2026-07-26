# `src/assets/` — CIBLE School of Language brand assets

Bundled, **import-time** brand assets for the CIBLE School of Language website. These files are imported by React components (`import logo from '../../assets/logo.svg'`) and processed by Vite's asset pipeline (hashed/emitted, or inlined as a data URI when under ~4 KB).

> **Not the same as `public/`.** Runtime static files served from the site root — `favicon.svg`, `og-image.jpg`, `logo.svg` (a **separate** copy served at `/logo.svg` for JSON-LD `Organization.logo`), `robots.txt`, `sitemap.xml`, `site.webmanifest` — live in `public/` and are owned separately. Do **not** move those here, and do **not** import files from here through absolute `/` URLs. The social share image is `public/og-image.jpg` (referenced as `/og-image.jpg`), **not** an asset in this folder. Note that `public/logo.svg` (root-served, used by structured data) and `src/assets/logo.svg` (import-time, used by the `<Navbar>`) are intentionally two copies for two different pipelines.

All artwork here is authored as lightweight, optimized **SVG** (crisp at any size, tiny, responsive) on the CIBLE brand palette. Every image ships with `role="img"`, a `<title>`, and an `aria-label`; in addition, **the consuming component must supply a meaningful `alt` (or `aria-label`) via its `<img>`** describing the specific content (course name). Purely decorative usage should pass `alt=""`.

## Brand palette (reference)

| Token | Hex |
| --- | --- |
| Primary (blue) | `#2563eb` |
| Primary-700 | `#1d4ed8` |
| Secondary (orange) | `#f97316` |
| Accent (green) | `#16a34a` |
| Background | `#ffffff` |
| Text | `#0f172a` / `#475569` |

## Inventory & import contract

The **Imported by** column lists the exact modules that `import` each file today (verified against the source). If you add a new consumer, update this table.

| File | viewBox / size | Imported by | Notes |
| --- | --- | --- | --- |
| `logo.svg` | 300×72 | `layout/Navbar.jsx` | Color wordmark (blue C-mark + orange dot). |
| `logo-white.svg` | 300×72 | `layout/Footer.jsx` | Reversed/white variant for the dark footer. |
| `hero.svg` | 640×480 | `common/Hero.jsx`, `pages/Gallery.jsx` | Home hero **illustration** (labelled as an illustration, not a photo of real students). **Replaces the old `hero.png`.** |
| `course-english.svg` | 400×300 | `common/CourseCard.jsx`, `pages/Gallery.jsx` | English category. |
| `course-personality.svg` | 400×300 | `common/CourseCard.jsx`, `pages/Gallery.jsx` | Personality / public-speaking / interview courses. |
| `course-science.svg` | 400×300 | `common/CourseCard.jsx`, `pages/Gallery.jsx` | Science (PCM/PCB) category. |
| `course-computer.svg` | 400×300 | `common/CourseCard.jsx`, `pages/Gallery.jsx` | Computer / digital-literacy category. |
| `course-career.svg` | 400×300 | `common/CourseCard.jsx`, `pages/Gallery.jsx` | Career-guidance category. |

> **Faculty images are intentionally not bundled here.** `src/data/faculty.js` sets `image: null` for every member and `common/FacultyCard.jsx` renders a graceful **initials-avatar** fallback (initials on a brand-blue circle), so there are no broken images and no orphaned imports. Genuine faculty photographs are supplied by the client and dropped into `public/faculty/<slug>.jpg` (served from `public/`, **not** imported here); set the corresponding `image` field in `faculty.js` at that time. See [Faculty imagery](#faculty-imagery) below.

### Import path examples

```js
// from src/components/common/Hero.jsx  or  src/components/layout/Navbar.jsx
import logo from '../../assets/logo.svg'
import heroImg from '../../assets/hero.svg'
import courseEnglish from '../../assets/course-english.svg'

// from src/pages/Gallery.jsx (one directory shallower)
import heroImg from '../assets/hero.svg'
import courseEnglish from '../assets/course-english.svg'
```

Vite returns a URL string from these imports; use it directly as `<img src={heroImg} alt="…" />`.

## Course → catalog mapping

The five course illustrations cover the ten catalog courses (`src/data/courses.js`). `common/CourseCard.jsx` resolves the illustration **by course slug first** (`IMAGE_BY_SLUG`), then falls back to the category illustration (`IMAGE_BY_CATEGORY`) — one image reused across related courses, with no per-course duplication:

| Illustration | Catalog courses |
| --- | --- |
| `course-english.svg` | Spoken English, English Communication |
| `course-personality.svg` | Personality Development, Public Speaking, Interview Preparation |
| `course-science.svg` | PCM Coaching, PCB Coaching |
| `course-computer.svg` | Basic Computer, Digital Literacy |
| `course-career.svg` | Career Guidance |

## Faculty imagery

There are **no bundled faculty image files.** Faculty avatars are rendered by `common/FacultyCard.jsx` directly from `src/data/faculty.js`:

- While `member.image` is `null` (the current default for all members), the card renders an **initials-avatar** — up to two uppercase initials derived from the name, on a brand-blue circle, exposed to assistive tech as a single labelled image. This keeps the UI free of broken images and free of imports for files that do not exist yet.
- When the client supplies a real photograph, place it at `public/faculty/<slug>.jpg` (root-served) and set the member's `image` field to that path (e.g. `image: '/faculty/rajeev-ranjan-jha.jpg'`). No component import changes are required.

Because these avatars are representative until real photos arrive, the Faculty page (and the site-wide footer notice) carry a visible representative-content disclosure.

## ⚠️ Placeholder media — swap before production (AAP §0.7.2)

These are **production-quality representative** brand illustrations, **not** genuine institute media. Replace the following with authentic, client-supplied assets before go-live, **keeping the same filenames** so no component imports need to change:

- `hero.svg` — an on-brand illustration explicitly labelled as an illustration; swap for a real campus/classroom hero (photo or bespoke illustration) once genuine media and any required consent are available.
- `course-*.svg` — swap for real course/classroom imagery if desired.
- `logo.svg` / `logo-white.svg` (and `public/logo.svg`) — replace with the official CIBLE logo files if an authoritative version exists.
- Faculty photos — add real photographs at `public/faculty/<slug>.jpg` and set the `image` fields in `src/data/faculty.js` (see [Faculty imagery](#faculty-imagery)).

## Removed boilerplate

The Vite/React starter assets were deleted during the rebuild (nothing imports them after the `App.jsx` route-table rewrite):

- `react.svg`, `vite.svg` — framework logos (referenced only by the old boilerplate `App.jsx`).
- `hero.png` — placeholder raster, superseded by `hero.svg`.
