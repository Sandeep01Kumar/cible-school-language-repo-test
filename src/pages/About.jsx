/**
 * About — CIBLE School of Language (route: `/about`).
 *
 * The institutional "About" page. It tells CIBLE's mission and values, walks
 * through the institute's journey via a milestone timeline, reinforces trust
 * with the animated Statistics band, previews the teaching faculty, and closes
 * with the site-wide admission CTA. It is lazy-loaded by `src/App.jsx`
 * (`const About = lazy(() => import('./pages/About.jsx'))`,
 * `<Route path="about" element={<About />} />`) and rendered INSIDE the shared
 * `<Layout>`, so it emits ONLY page content — the `<main>` landmark, Navbar,
 * Footer and the floating / sticky conversion widgets are owned by `Layout` and
 * are deliberately NOT repeated here.
 *
 * Reuse-first (zero duplication): the page is assembled entirely from the
 * canonical primitives and composite components — `Container`, `SectionHeading`,
 * `Breadcrumbs`, `Button`, `FeatureCard`, `Timeline`, `Statistics`,
 * `FacultyCard`, `CTASection` — plus the shared `src/data` modules. No bespoke
 * markup is restyled into a pseudo-component and no primitive is forked.
 *
 * SEO: a per-page `<Seo>` head (title / description / canonical / Open Graph /
 * Twitter) plus three JSON-LD blocks (Organization, LocalBusiness,
 * BreadcrumbList) emitted by `<StructuredData>`. The BreadcrumbList is built
 * from the SAME `crumbs` array that feeds the visible `<Breadcrumbs>`, keeping
 * the on-page trail and the structured data in agreement.
 *
 * Accessibility (WCAG AA): exactly ONE `<h1>` (the page header, via
 * `SectionHeading as="h1"`), a logical `h1 → h2 → h3` outline, semantic
 * `<section>` landmarks (never a second `<main>`), and AA-contrast prose via the
 * `text-muted` / `text-foreground` design tokens. Styling is 100% token-driven
 * on the 8px spacing scale — no hardcoded or arbitrary values.
 *
 * CONTENT NOTICE (AAP §0.7.2): the mission narrative and the `values` /
 * `milestones` below are REPRESENTATIVE, production-quality placeholders that
 * reflect the CIBLE program areas and the Madhubani, Bihar context — they are
 * NOT verified institute records. Genuine history, values copy and faculty
 * details are supplied by the client and swapped in later; brand and contact
 * facts are read from the single source of truth (`siteConfig`).
 */
import { FaBullseye, FaHeart, FaHandshake, FaLightbulb, FaFlag, FaAward, FaUsers } from 'react-icons/fa'
import Seo from '../components/seo/Seo.jsx'
import StructuredData from '../components/seo/StructuredData.jsx'
import Container from '../components/ui/Container.jsx'
import SectionHeading from '../components/ui/SectionHeading.jsx'
import Breadcrumbs from '../components/ui/Breadcrumbs.jsx'
import Button from '../components/ui/Button.jsx'
import Statistics from '../components/common/Statistics.jsx'
import Timeline from '../components/common/Timeline.jsx'
import FeatureCard from '../components/common/FeatureCard.jsx'
import FacultyCard from '../components/common/FacultyCard.jsx'
import RepresentativeNote from '../components/common/RepresentativeNote.jsx'
import CTASection from '../components/common/CTASection.jsx'
import { faculty } from '../data/faculty.js'
import { siteConfig } from '../data/siteConfig.js'

// Breadcrumb trail for this page. The SAME array is passed to the visible
// <Breadcrumbs> and to <StructuredData breadcrumbs={...}> so the on-page trail
// and the BreadcrumbList JSON-LD stay in agreement (shared { name, path } shape).
const crumbs = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
]

// Representative institutional values — refine with genuine institute copy (AAP §0.7.2).
// Each `icon` is a react-icons component REFERENCE consumed by <FeatureCard>.
const values = [
  { icon: FaBullseye, title: 'Our Mission', description: 'Empower every student to speak English confidently and shape a brighter future.' },
  { icon: FaHeart, title: 'Student First', description: 'Personalised attention and a supportive learning environment for all.' },
  { icon: FaHandshake, title: 'Integrity', description: 'Honest guidance and transparent, results-focused teaching.' },
  { icon: FaLightbulb, title: 'Practical Learning', description: 'Real-world practice over rote learning — speak from day one.' },
]

// Representative milestones — replace with genuine institute history (AAP §0.7.2).
// Shape { title, description, icon } is consumed by <Timeline> (renders an <ol>).
const milestones = [
  { icon: FaFlag, title: 'Founded', description: 'CIBLE School of Language opens its doors in Madhubani, Bihar.' },
  { icon: FaUsers, title: 'Growing Community', description: 'A thriving, ever-growing community of learners across our spoken English and coaching tracks.' },
  { icon: FaAward, title: 'Recognized Results', description: 'A reputation for confident speakers and strong academic outcomes.' },
]

function About() {
  return (
    <>
      <Seo
        title="About Us"
        canonical="/about"
        description="Learn about CIBLE School of Language in Madhubani, Bihar — our mission, values, journey and dedicated faculty helping students speak English with confidence."
      />
      <StructuredData organization localBusiness breadcrumbs={crumbs} />

      {/* Page header */}
      <Container as="section" className="py-12 md:py-16">
        <Breadcrumbs items={crumbs} className="mb-6" />
        <SectionHeading
          as="h1"
          align="left"
          eyebrow="About CIBLE"
          title="About CIBLE School of Language"
          subtitle="CIBLE School of Language helps students in Madhubani and beyond become fluent, confident communicators ready for academics and careers."
        />
      </Container>

      {/* Mission + values */}
      <Container as="section" className="py-8 md:py-12">
        <SectionHeading as="h2" align="left" eyebrow="Who We Are" title="Our Mission & Values" />
        {/* Representative mission narrative — refine with genuine institute copy (AAP §0.7.2). */}
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted md:text-lg">
          At {siteConfig.name}, we believe that clear, confident communication can change the
          direction of a young life. Rooted in {siteConfig.addressParts.addressLocality}, {siteConfig.addressParts.addressRegion}, we
          bring world-class spoken-English training and academic coaching close to home, pairing
          practical, speak-from-day-one methods with the patient encouragement every learner
          deserves. Our teachers know each student by name, celebrate every breakthrough, and build
          the real-world fluency that leads to higher studies and rewarding careers.
        </p>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v) => (
            <FeatureCard key={v.title} icon={v.icon} title={v.title} description={v.description} />
          ))}
        </div>
      </Container>

      {/* Journey / timeline */}
      <section className="bg-surface py-16 md:py-20">
        <Container>
          <SectionHeading eyebrow="Our Journey" title="Milestones" />
          <RepresentativeNote className="mt-8">
            This journey and its milestones are a representative illustration of
            the institute's story, not a verified historical record. Genuine
            history and dates will be confirmed before launch.
          </RepresentativeNote>
          <div className="mt-10">
            <Timeline items={milestones} />
          </div>
        </Container>
      </section>

      {/* Trust signals — animated achievement counters (reused from the Home page) */}
      <Statistics />

      {/* Faculty preview */}
      <Container as="section" className="py-16 md:py-20">
        <SectionHeading
          eyebrow="Our Team"
          title="Meet Our Faculty"
          subtitle="The mentors behind every success story."
        />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {faculty.slice(0, 3).map((member) => (
            <FacultyCard key={member.name} member={member} />
          ))}
        </div>
        <div className="mt-10 flex justify-center">
          <Button to="/faculty" variant="outline" size="lg">
            Meet the full team
          </Button>
        </div>
      </Container>

      <CTASection />
    </>
  )
}

export default About
