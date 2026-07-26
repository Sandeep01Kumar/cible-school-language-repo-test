import { useEffect, useState, useTransition, Suspense } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { MotionConfig } from 'framer-motion'
import Layout from './components/layout/Layout.jsx'
import RouteProgress from './components/layout/RouteProgress.jsx'
import Spinner from './components/ui/Spinner.jsx'
import { lazyWithRetry } from './lib/routeLoading.js'

/*
 * Route-level code splitting (AAP performance rule): every page below is loaded
 * with `lazyWithRetry` (a hardened `React.lazy` — see src/lib/routeLoading.js),
 * so each route resolves to its OWN async chunk AND a failed or stale chunk
 * import is retried then recovered rather than hard-crashing the app (M18).
 * Only the always-present shell (`Layout`), the pending-navigation
 * `RouteProgress` and the tiny loading `Spinner` are imported eagerly (above).
 * The consts are module-local — the file's single component (`App`) is the only
 * export, which keeps the enforced `react/only-export-components` rule green.
 */
const Home = lazyWithRetry(() => import('./pages/Home.jsx'))
const About = lazyWithRetry(() => import('./pages/About.jsx'))
const Courses = lazyWithRetry(() => import('./pages/Courses.jsx'))
const SpokenEnglish = lazyWithRetry(() => import('./pages/SpokenEnglish.jsx'))
const ScienceCoaching = lazyWithRetry(() => import('./pages/ScienceCoaching.jsx'))
const ComputerCourses = lazyWithRetry(() => import('./pages/ComputerCourses.jsx'))
const Faculty = lazyWithRetry(() => import('./pages/Faculty.jsx'))
const Gallery = lazyWithRetry(() => import('./pages/Gallery.jsx'))
const SuccessStories = lazyWithRetry(() => import('./pages/SuccessStories.jsx'))
const Blog = lazyWithRetry(() => import('./pages/Blog.jsx'))
const Events = lazyWithRetry(() => import('./pages/Events.jsx'))
const Admission = lazyWithRetry(() => import('./pages/Admission.jsx'))
const Career = lazyWithRetry(() => import('./pages/Career.jsx'))
const Faq = lazyWithRetry(() => import('./pages/Faq.jsx'))
const Contact = lazyWithRetry(() => import('./pages/Contact.jsx'))
const PrivacyPolicy = lazyWithRetry(() => import('./pages/PrivacyPolicy.jsx'))
const Terms = lazyWithRetry(() => import('./pages/Terms.jsx'))
const NotFound = lazyWithRetry(() => import('./pages/NotFound.jsx'))

/**
 * App — the client-side route table for the CIBLE School of Language SPA
 * (AAP §0.5.1 / §0.6.1 Group 2). This component owns ONLY routing: the
 * `<BrowserRouter>` and `<HelmetProvider>` live one level up in `src/main.jsx`,
 * so App must never create another router or head-manager context — it simply
 * declares the `<Routes>` those providers drive.
 *
 * Pending-navigation feedback (M18 / m01) — controlled-location transition:
 * `react-router` wraps navigations in a React transition, so clicking a link to
 * an un-cached page changes the URL immediately but keeps the OLD page visible
 * (no Suspense fallback flash) until the new chunk loads — which previously left
 * the visitor with no pending signal. App therefore renders a CONTROLLED
 * `<Routes location={displayLocation}>`: `location` is the live router location
 * (updates the instant a link is clicked) while `displayLocation` is the
 * location currently committed to the screen. Each change advances
 * `displayLocation` inside `startTransition`, so `isPending` is true for exactly
 * the window between "navigation started" and "new page committed". That drives
 * `<RouteProgress>` (a visible top bar + a polite "Loading page…" announcement),
 * and because child components read `displayLocation` via `useLocation`, the
 * `Layout` page-title announcement and `ScrollToTop` fire on the COMMITTED route
 * (m01), never mid-transition.
 *
 * Resilience (M18): pages load through `lazyWithRetry`, and `Layout` wraps the
 * routed `<Outlet/>` in an `ErrorBoundary`, so a rejected/stale chunk or a page
 * render error is retried, reloaded once, or shown as an accessible recovery UI
 * with the shell (nav/footer/quick-contact) still intact — never a blank crash.
 *
 * The single top-level `<Suspense>` renders the `Spinner` fallback for the very
 * first page load (Layout additionally wraps its `<Outlet/>` in an in-shell
 * Suspense boundary so the nav + footer stay visible during subsequent loads).
 *
 * Motion policy: a `<MotionConfig reducedMotion="user">` wraps the whole route
 * tree so every framer-motion element honors prefers-reduced-motion (WCAG 2.3.3).
 *
 * Shared shell: a pathless parent `<Route element={<Layout/>}>` wraps every
 * page, so the persistent Navbar, Footer, floating Call/WhatsApp widgets and
 * mobile sticky CTA mount once and never unmount between navigations — keeping
 * the primary admissions actions reachable on every page.
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
  // Controlled-location transition state (see JSDoc). All hooks are declared
  // unconditionally at the top level (oxlint `react/rules-of-hooks`).
  const location = useLocation()
  const [displayLocation, setDisplayLocation] = useState(location)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    // Advance the displayed location only when the URL actually changed
    // (compare by history key, stable per entry). Wrapping the update in a
    // transition keeps the previous page on screen while the next chunk loads
    // and exposes `isPending` for the RouteProgress indicator. Setting
    // displayLocation to the new location makes this a no-op on the next run.
    if (location.key === displayLocation.key) return
    startTransition(() => setDisplayLocation(location))
  }, [location, displayLocation])

  return (
    <Suspense fallback={<Spinner />}>
      {/* Pending-navigation indicator (visible bar + polite announcement). */}
      <RouteProgress active={isPending} />

      {/*
       * Global reduced-motion contract (AAP §0.6.3 / WCAG 2.3.3).
       * `reducedMotion="user"` makes EVERY framer-motion element in the tree
       * honor the OS/browser "reduce motion" setting: transform and layout
       * animations are disabled for those users. Individual components also gate
       * their enter animation with `initial={reduce ? false : 'hidden'}`; this
       * MotionConfig is the site-wide safety net for any element without a local
       * gate.
       */}
      <MotionConfig reducedMotion="user">
        {/* Controlled location: routes match the COMMITTED displayLocation, so
            the visible page changes only once its chunk has resolved (m01). */}
        <Routes location={displayLocation}>
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
