/**
 * Events — CIBLE School of Language "Events & Workshops" page (route `/events`).
 *
 * Lists CIBLE's upcoming events, workshops and seminars as a responsive grid of
 * the single canonical {@link EventCard}. It is lazy-loaded by the application
 * route table in `src/App.jsx`
 * (`const Events = lazy(() => import('./pages/Events.jsx'))`,
 * `<Route path="events" element={<Events />} />`) and rendered inside the shared
 * `<Layout>`, so this module renders ONLY page content — the persistent Navbar,
 * Footer and floating conversion widgets are owned by the layout shell.
 *
 * Composition (reuse-first, zero duplication — every element is a shared
 * primitive/composite, never hand-rolled markup):
 * - <Seo>            → per-page <title>/description/canonical plus Open Graph and
 *                      Twitter tags (unique title "Events").
 * - <StructuredData> → BreadcrumbList JSON-LD built from the SAME `crumbs` array
 *                      that feeds the visible <Breadcrumbs>, keeping the
 *                      structured data and the on-screen trail in agreement.
 * - Page header      → <Container as="section"> wrapping <Breadcrumbs> and the
 *                      page's single <h1> (SectionHeading rendered `as="h1"`).
 * - Events grid      → <Container as="section"> with a responsive 1/2/3-column
 *                      grid of <EventCard>, keyed by the unique `event.title`.
 *                      Each card renders its own semantic markup (<article> +
 *                      <h3>) and an admission-first "Register" CTA to `/contact`.
 * - <CTASection>     → the reusable admission call-to-action that closes every
 *                      page (admissions-priority ruleset).
 *
 * Data comes exclusively from `src/data/events.js` (the single source of truth),
 * so the page stays fully presentational — no local state and no hooks.
 *
 * Styling is entirely token-driven (Tailwind v4 `@theme` tokens in
 * `src/index.css`) on the 8px spacing scale — `py-12`/`py-16`, `pb-16`/`pb-20`,
 * `gap-6` — with static classNames and no hardcoded values.
 *
 * Accessibility (WCAG AA): exactly ONE <h1> per page (the header); the grid is a
 * list of self-contained <article> landmarks whose titles are <h3>s, preceded by
 * a visually-hidden `<h2 class="sr-only">` ("Upcoming events") so the outline
 * steps h1 -> h2 -> h3 with no skipped level (QA Issue 9); the trail is a
 * `<nav aria-label="Breadcrumb">`.
 *
 * @returns {import('react').ReactElement} The rendered Events page content.
 */
import Seo from '../components/seo/Seo.jsx'
import StructuredData from '../components/seo/StructuredData.jsx'
import Container from '../components/ui/Container.jsx'
import SectionHeading from '../components/ui/SectionHeading.jsx'
import Breadcrumbs from '../components/ui/Breadcrumbs.jsx'
import EventCard from '../components/common/EventCard.jsx'
import CTASection from '../components/common/CTASection.jsx'
import events from '../data/events.js'

// Breadcrumb trail for this page. Module-local (never exported) and shared by
// both the visible <Breadcrumbs> and the BreadcrumbList JSON-LD via
// <StructuredData> so the two stay in lockstep. Shape: { name, path }.
const crumbs = [
  { name: 'Home', path: '/' },
  { name: 'Events', path: '/events' },
]

function Events() {
  return (
    <>
      <Seo
        title="Events"
        canonical="/events"
        description="Upcoming events, workshops and seminars at CIBLE School of Language — spoken English bootcamps, exam prep sessions and career guidance events in Madhubani, Bihar."
      />
      <StructuredData breadcrumbs={crumbs} />

      {/* Page header */}
      <Container as="section" className="py-12 md:py-16">
        <Breadcrumbs items={crumbs} className="mb-6" />
        <SectionHeading
          as="h1"
          align="left"
          eyebrow="What's On"
          title="Events & Workshops"
          subtitle="Join our upcoming sessions to learn, practise and get ahead with CIBLE."
        />
      </Container>

      {/* Events grid */}
      <Container as="section" className="pb-16 md:pb-20">
        {/* Visually-hidden section heading so each EventCard's <h3> title nests
            under an <h2>, keeping the outline h1 -> h2 -> h3 with no skipped
            level for assistive tech (QA Issue 9). */}
        <h2 className="sr-only">Upcoming events</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <EventCard key={event.title} event={event} />
          ))}
        </div>
      </Container>

      <CTASection />
    </>
  )
}

export default Events
