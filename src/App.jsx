import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { MotionConfig } from 'framer-motion'
import Layout from './components/layout/Layout.jsx'
import Spinner from './components/ui/Spinner.jsx'

/*
 * Route-level code splitting (AAP performance rule): every page below is loaded
 * with `React.lazy`, so each route resolves to its OWN async chunk and the
 * initial bundle stays minimal. Only the always-present shell (`Layout`) and
 * the tiny loading `Spinner` are imported eagerly (above). The consts are
 * module-local — the file's single component (`App`) is the only export, which
 * keeps the enforced `react/only-export-components` lint rule green.
 */
const Home = lazy(() => import('./pages/Home.jsx'))
const About = lazy(() => import('./pages/About.jsx'))
const Courses = lazy(() => import('./pages/Courses.jsx'))
const SpokenEnglish = lazy(() => import('./pages/SpokenEnglish.jsx'))
const ScienceCoaching = lazy(() => import('./pages/ScienceCoaching.jsx'))
const ComputerCourses = lazy(() => import('./pages/ComputerCourses.jsx'))
const Faculty = lazy(() => import('./pages/Faculty.jsx'))
const Gallery = lazy(() => import('./pages/Gallery.jsx'))
const SuccessStories = lazy(() => import('./pages/SuccessStories.jsx'))
const Blog = lazy(() => import('./pages/Blog.jsx'))
const Events = lazy(() => import('./pages/Events.jsx'))
const Admission = lazy(() => import('./pages/Admission.jsx'))
const Career = lazy(() => import('./pages/Career.jsx'))
const Faq = lazy(() => import('./pages/Faq.jsx'))
const Contact = lazy(() => import('./pages/Contact.jsx'))
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy.jsx'))
const Terms = lazy(() => import('./pages/Terms.jsx'))
const NotFound = lazy(() => import('./pages/NotFound.jsx'))

/**
 * App — the client-side route table for the CIBLE School of Language SPA
 * (AAP §0.5.1 / §0.6.1 Group 2). This component intentionally owns ONLY routing:
 * the `<BrowserRouter>` and `<HelmetProvider>` live one level up in
 * `src/main.jsx`, so App must never create another router or head-manager
 * context — it simply declares the `<Routes>` those providers drive.
 *
 * The single top-level `<Suspense>` boundary renders the `Spinner` fallback
 * while a lazily-loaded page chunk is in flight (Layout additionally provides
 * an in-shell Suspense boundary around its `<Outlet/>`, so the nav + footer
 * stay visible during subsequent navigations).
 *
 * Motion policy: a `<MotionConfig reducedMotion="user">` wraps the whole route
 * tree so every framer-motion element site-wide honors the user's
 * prefers-reduced-motion setting (AAP §0.6.3 / WCAG 2.3.3).
 *
 * Shared shell: a pathless parent `<Route element={<Layout/>}>` wraps every
 * page, so the persistent Navbar, Footer, floating Call/WhatsApp widgets and
 * mobile sticky CTA are mounted once and never unmount between navigations —
 * keeping the primary admissions actions reachable on every page.
 *
 * Canonical routes (MUST stay in lock-step with `src/data/navigation.js` and
 * `public/sitemap.xml` — a mismatch breaks nav links and the sitemap):
 *   `/` (index → Home), `/about`, `/courses`, `/spoken-english`,
 *   `/science-coaching`, `/computer-courses`, `/faculty`, `/gallery`,
 *   `/success-stories`, `/blog`, `/events`, `/admission`, `/career`, `/faq`,
 *   `/contact`, `/privacy-policy`, `/terms`, and a catch-all `*` → NotFound.
 * Child paths are relative (no leading slash) under the pathless Layout route,
 * as is idiomatic for React Router v7; the `index` route renders Home at `/`.
 * Note the route segment is lowercase `faq` while the page module is `Faq.jsx`.
 *
 * @returns {import('react').ReactElement} The Suspense-wrapped route tree
 *   mounted by `src/main.jsx` inside the router + head-manager providers.
 */
function App() {
  return (
    <Suspense fallback={<Spinner />}>
      {/*
       * Global reduced-motion contract (AAP §0.6.3 "respecting
       * prefers-reduced-motion" / WCAG 2.3.3). `reducedMotion="user"` makes
       * EVERY framer-motion element in the tree honor the OS/browser
       * "reduce motion" setting: transform and layout animations are disabled
       * for those users. Individual components additionally gate their enter
       * animation with `initial={reduce ? false : 'hidden'}` so reveals mount
       * directly at their final state — this MotionConfig is the site-wide
       * safety net that also covers any motion element without a local gate.
       */}
      <MotionConfig reducedMotion="user">
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="courses" element={<Courses />} />
            <Route path="spoken-english" element={<SpokenEnglish />} />
            <Route path="science-coaching" element={<ScienceCoaching />} />
            <Route path="computer-courses" element={<ComputerCourses />} />
            <Route path="faculty" element={<Faculty />} />
            <Route path="gallery" element={<Gallery />} />
            <Route path="success-stories" element={<SuccessStories />} />
            <Route path="blog" element={<Blog />} />
            <Route path="events" element={<Events />} />
            <Route path="admission" element={<Admission />} />
            <Route path="career" element={<Career />} />
            <Route path="faq" element={<Faq />} />
            <Route path="contact" element={<Contact />} />
            <Route path="privacy-policy" element={<PrivacyPolicy />} />
            <Route path="terms" element={<Terms />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </MotionConfig>
    </Suspense>
  )
}

export default App
