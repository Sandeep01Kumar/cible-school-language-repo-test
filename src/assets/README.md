# `src/assets/` — CIBLE School of Language brand assets

Bundled, **import-time** brand assets for the CIBLE School of Language website. These files are imported by React components (`import logo from '../../assets/logo.svg'`) and processed by Vite's asset pipeline (hashed/emitted, or inlined as a data URI when under ~4 KB).

> **Not the same as `public/`.** Runtime static files served from the site root — `favicon.svg`, `og-image.jpg`, `robots.txt`, `sitemap.xml`, `site.webmanifest` — live in `public/` and are owned separately. Do **not** move those here, and do **not** import files from here through absolute `/` URLs. The social share image is `public/og-image.jpg` (referenced as `/og-image.jpg`), **not** an asset in this folder.

All artwork here is authored as lightweight, optimized **SVG** (crisp at any size, tiny, responsive) on the CIBLE brand palette. Every image ships with `role="img"`, a `<title>`, and an `aria-label`; in addition, **the consuming component must supply a meaningful `alt` (or `aria-label`) via its `<img>`** describing the specific content (course name, faculty name/role). Purely decorative usage should pass `alt=""`.

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

| File | viewBox / size | Imported by | Notes |
| --- | --- | --- | --- |
| `logo.svg` | 300×72 | `layout/Navbar.jsx`, `layout/Footer.jsx` | Color wordmark (blue C-mark + orange dot). |
| `logo-white.svg` | 300×72 | `layout/Footer.jsx` (dark sections) | Reversed/white variant for dark backgrounds. |
| `hero.svg` | 640×480 | `common/Hero.jsx`, `pages/Home.jsx` | Home hero illustration. **Replaces the old `hero.png`.** |
| `course-english.svg` | 400×300 | `common/CourseCard.jsx`, course pages | English category. |
| `course-personality.svg` | 400×300 | `common/CourseCard.jsx`, course pages | Personality / public-speaking category. |
| `course-science.svg` | 400×300 | `common/CourseCard.jsx`, `pages/ScienceCoaching.jsx` | Science (PCM/PCB) category. |
| `course-computer.svg` | 400×300 | `common/CourseCard.jsx`, `pages/ComputerCourses.jsx` | Computer / digital-literacy category. |
| `course-career.svg` | 400×300 | `common/CourseCard.jsx`, `pages/Career.jsx` | Career-guidance category. |
| `faculty-1.svg` … `faculty-6.svg` | 160×160 | `common/FacultyCard.jsx`, `pages/Faculty.jsx` | Representative circular portrait avatars. |

### Import path examples

```js
// from src/components/common/Hero.jsx  or  src/components/layout/Navbar.jsx
import logo from '../../assets/logo.svg'
import heroImg from '../../assets/hero.svg'
import courseEnglish from '../../assets/course-english.svg'
import faculty1 from '../../assets/faculty-1.svg'

// from src/pages/Home.jsx
import heroImg from '../assets/hero.svg'
```

Vite returns a URL string from these imports; use it directly as `<img src={heroImg} alt="…" />`.

## Course → catalog mapping

The five course illustrations cover the ten catalog courses (`src/data/courses.js`) by category — one image reused per category (no per-course duplication):

| Illustration | Catalog courses |
| --- | --- |
| `course-english.svg` | Spoken English, English Communication |
| `course-personality.svg` | Personality Development, Public Speaking, Interview Preparation |
| `course-science.svg` | PCM Coaching, PCB Coaching |
| `course-computer.svg` | Basic Computer, Digital Literacy |
| `course-career.svg` | Career Guidance |

## Faculty avatar roles

Representative avatars mapped to roles in `src/data/faculty.js` (distinct palette/hairstyle per person for visual variety):

| Avatar | Suggested role |
| --- | --- |
| `faculty-1.svg` | Director |
| `faculty-2.svg` | English faculty |
| `faculty-3.svg` | Science (PCM) faculty |
| `faculty-4.svg` | Science (PCB) faculty |
| `faculty-5.svg` | Computer faculty |
| `faculty-6.svg` | Career counselor |

## ⚠️ Placeholder media — swap before production (AAP §0.7.2)

These are **production-quality representative** brand illustrations, **not** genuine institute media. Replace the following with authentic, client-supplied assets before go-live, **keeping the same filenames** so no component imports need to change:

- `hero.svg` — swap for a real campus/classroom hero (photo or bespoke illustration).
- `course-*.svg` — swap for real course/classroom imagery if desired.
- `faculty-*.svg` — **replace with real faculty photographs** and update names/roles in `src/data/faculty.js`.
- `logo.svg` / `logo-white.svg` — replace with the official CIBLE logo files if an authoritative version exists.

## Removed boilerplate

The Vite/React starter assets were deleted during the rebuild (nothing imports them after the `App.jsx` route-table rewrite):

- `react.svg`, `vite.svg` — framework logos (referenced only by the old boilerplate `App.jsx`).
- `hero.png` — placeholder raster, superseded by `hero.svg`.
