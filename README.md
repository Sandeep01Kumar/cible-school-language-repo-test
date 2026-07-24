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
- [License & Notes](#license--notes)

## Tech Stack

The project is built entirely on the client with a modern React toolchain. Exact
dependency versions are pinned in [`package.json`](./package.json), which is the
source of truth.

- **React 19 + Vite** — modern ESM React SPA with fast HMR in development and an
  optimized production build.
- **React Router** — client-side routing across 17 content pages plus a 404
  *Not Found* route.
- **Tailwind CSS v4** — CSS-first design system wired through the
  `@tailwindcss/vite` plugin. The brand palette is blue (primary), orange
  (secondary), and green (accent) on a white background, built on an 8px spacing
  scale with rounded cards and soft shadows.
- **react-helmet-async** — per-page SEO head management (title, description,
  canonical, Open Graph, and Twitter cards).
- **react-hook-form** — accessible, validated Admission, Contact, and Newsletter
  forms with loading, error, empty, and success states.
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

- **Node.js** (current LTS release) and **npm**.

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

## Project Structure

The codebase follows a reuse-first structure: content lives in `src/data`, styling
tokens live in `src/index.css`, and a single canonical set of primitives is composed
across every page.

```text
public/            robots.txt, sitemap.xml, site.webmanifest, og-image.jpg, favicon.svg
src/
  assets/          logo, hero & course/faculty imagery
  data/            siteConfig, navigation, courses, faculty, testimonials, faq, events, blog, stats
  lib/             cn.js, validators.js, schema.js (JSON-LD builders)
  hooks/           useScrollReveal.js
  components/
    layout/        Layout, Navbar, Footer, ScrollToTop
    ui/            Button, Card, Container, SectionHeading, Badge, Input, Textarea, Select, Accordion, Breadcrumbs, Spinner
    common/        Hero, Statistics, CourseCard, FacultyCard, ReviewCard, Gallery, Timeline, FAQ, Newsletter, GoogleMap, CTASection, TestimonialSlider, CourseGrid, BlogCard, EventCard, FeatureCard
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
8. **Gallery** — a photo gallery of the institute and its activities.
9. **Success Stories** — student results and testimonials.
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
`public/robots.txt` and `public/sitemap.xml` files complete the SEO surface.

## License & Notes

- Some imagery and editorial copy in this repository are **representative
  placeholders** intended to be replaced with genuine, institute-supplied assets
  (real photographs, verified faculty biographies, and actual student records)
  before launch.
- The domain `https://www.cibleschool.com` is used as a **placeholder** throughout
  the SEO metadata and structured data and should be swapped for the final
  production domain at launch.
- This is a private project (`"private": true` in `package.json`) developed for
  CIBLE School of Language.
