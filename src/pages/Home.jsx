import { FaChalkboardTeacher, FaUserGraduate, FaClock, FaCertificate, FaHeadset, FaMapMarkerAlt } from 'react-icons/fa'
import Seo from '../components/seo/Seo.jsx'
import StructuredData from '../components/seo/StructuredData.jsx'
import Container from '../components/ui/Container.jsx'
import SectionHeading from '../components/ui/SectionHeading.jsx'
import Button from '../components/ui/Button.jsx'
import Hero from '../components/common/Hero.jsx'
import Statistics from '../components/common/Statistics.jsx'
import CourseGrid from '../components/common/CourseGrid.jsx'
import FeatureCard from '../components/common/FeatureCard.jsx'
import TestimonialSlider from '../components/common/TestimonialSlider.jsx'
import FacultyCard from '../components/common/FacultyCard.jsx'
import CTASection from '../components/common/CTASection.jsx'
import { courses } from '../data/courses.js'
import { faculty } from '../data/faculty.js'

/**
 * Home — the CIBLE School of Language landing page (index route `/`).
 *
 * Lazy-loaded by `src/App.jsx` (`const Home = lazy(() => import('./pages/Home.jsx'))`)
 * and rendered at `<Route index element={<Home />} />` INSIDE the shared
 * `<Layout>`. Layout already owns the page chrome — the `<Navbar>`, the `<main>`
 * landmark, the `<Footer>` (which globally renders the Newsletter), the floating
 * WhatsApp / Call widgets, the mobile sticky bottom CTA, and `ScrollToTop`.
 * Therefore this page renders ONLY the page CONTENT: it never emits a
 * `<main>`/`<header>`/`<footer>`, never re-renders the nav/footer or the
 * floating/sticky conversion widgets, and never duplicates the Newsletter.
 *
 * Composition (conversion-first section order, AAP §0.6.3 "Home composition"):
 *   Hero → Statistics → featured Courses → "Why choose us" → Testimonials →
 *   Faculty preview → admission CTASection.
 * Every section is assembled from the single canonical component set — nothing is
 * hand-rolled or duplicated — and all page-specific content is sourced from the
 * `src/data/*` single source of truth.
 *
 * Accessibility (WCAG AA): the page carries EXACTLY ONE `<h1>`, provided by
 * `<Hero>`; every subsequent section is titled by a `<SectionHeading>` which
 * defaults to `<h2>`, keeping a logical, gap-free heading outline. Content bands
 * are semantic `<section>` elements (via `Container as="section"` or a
 * `<section>` wrapping a `<Container>`), and the two "View all …" actions use the
 * polymorphic `<Button to="…">` so they render real react-router `<Link>`s.
 *
 * Styling: 100% token-driven (Tailwind v4 `@theme` tokens from `src/index.css`)
 * with zero hardcoded values — spacing stays on the 8px scale (`py-16 md:py-20`,
 * `gap-6`, `mt-10`) and alternating `bg-surface` bands give the page vertical
 * rhythm. This page is stateless and hook-free (all animation/state lives inside
 * the composed components), so it emits its own lean, code-split route chunk.
 *
 * @returns {import('react').ReactElement} The composed Home page content.
 */

// Representative "why choose us" highlights — refine with genuine institute
// differentiators (AAP §0.7.2). Each `icon` is a react-icons COMPONENT REFERENCE
// (not a rendered element); `FeatureCard` renders it internally as decorative.
const features = [
  {
    icon: FaChalkboardTeacher,
    title: 'Expert Faculty',
    description: 'Learn from experienced, dedicated teachers focused on real results.',
  },
  {
    icon: FaUserGraduate,
    title: 'Proven Results',
    description: 'A track record of confident speakers and successful students.',
  },
  {
    icon: FaClock,
    title: 'Flexible Batches',
    description: 'Morning and evening batches designed around your schedule.',
  },
  {
    icon: FaCertificate,
    title: 'Recognized Certification',
    description: 'Course completion certificates that add value to your profile.',
  },
  {
    icon: FaHeadset,
    title: 'Personal Mentoring',
    description: 'One-on-one guidance and doubt-clearing for every learner.',
  },
  {
    icon: FaMapMarkerAlt,
    title: 'Convenient Location',
    description: 'Easily reachable campus on SH75, Saharghat, Madhubani.',
  },
]

function Home() {
  return (
    <>
      <Seo
        canonical="/"
        description="CIBLE School of Language, Madhubani — Spoken English, communication, science (PCM/PCB) and computer courses. Learn English, build confidence, shape your future. Admissions open."
      />
      <StructuredData organization localBusiness />

      <Hero />

      <Statistics />

      {/* Featured courses — the six most sought-after programs, linking out to the full catalog. */}
      <Container as="section" className="py-16 md:py-20">
        <SectionHeading
          eyebrow="Courses"
          title="Popular Courses"
          subtitle="Explore our most sought-after programs designed to build fluency, confidence and career readiness."
        />
        <div className="mt-10">
          <CourseGrid items={courses.slice(0, 6)} />
        </div>
        <div className="mt-10 flex justify-center">
          <Button to="/courses" variant="outline" size="lg">View all courses</Button>
        </div>
      </Container>

      {/* Why choose us — representative differentiators on a subtle neutral band. */}
      <section className="bg-surface py-16 md:py-20">
        <Container>
          <SectionHeading
            eyebrow="Why CIBLE"
            title="Why Choose CIBLE School of Language"
            subtitle="Everything you need to learn effectively and reach your goals."
          />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <FeatureCard key={f.title} icon={f.icon} title={f.title} description={f.description} />
            ))}
          </div>
        </Container>
      </section>

      {/* Testimonials — student/parent success stories via the shared carousel. */}
      <Container as="section" className="py-16 md:py-20">
        <SectionHeading
          eyebrow="Success Stories"
          title="What Our Students Say"
          subtitle="Real experiences from learners who transformed their confidence with CIBLE."
        />
        <div className="mt-10">
          <TestimonialSlider />
        </div>
      </Container>

      {/* Faculty preview — first three mentors, linking out to the full roster. */}
      <section className="bg-surface py-16 md:py-20">
        <Container>
          <SectionHeading
            eyebrow="Our Team"
            title="Meet Our Faculty"
            subtitle="Experienced mentors dedicated to your growth."
          />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {faculty.slice(0, 3).map((member) => (
              <FacultyCard key={member.name} member={member} />
            ))}
          </div>
          <div className="mt-10 flex justify-center">
            <Button to="/faculty" variant="outline" size="lg">View all faculty</Button>
          </div>
        </Container>
      </section>

      <CTASection />
    </>
  )
}

export default Home
