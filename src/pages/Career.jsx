import { FaHeart, FaChalkboardTeacher, FaRegClock, FaUsers } from 'react-icons/fa'
import Seo from '../components/seo/Seo.jsx'
import StructuredData from '../components/seo/StructuredData.jsx'
import Container from '../components/ui/Container.jsx'
import SectionHeading from '../components/ui/SectionHeading.jsx'
import Breadcrumbs from '../components/ui/Breadcrumbs.jsx'
import Card from '../components/ui/Card.jsx'
import Badge from '../components/ui/Badge.jsx'
import Button from '../components/ui/Button.jsx'
import FeatureCard from '../components/common/FeatureCard.jsx'
import CTASection from '../components/common/CTASection.jsx'
import siteConfig from '../data/siteConfig.js'

/**
 * Career — the "work at CIBLE" careers / job-openings page (route `/career`).
 *
 * Lazy-loaded by `src/App.jsx`
 * (`const Career = lazy(() => import('./pages/Career.jsx'))`,
 * `<Route path="career" element={<Career />} />`) and rendered inside the shared
 * `<Layout>`, so this component renders ONLY page content — the Navbar, Footer,
 * floating conversion widgets and scroll-to-top are owned by the layout shell.
 *
 * Conversion-first, backend-free: the institute has no application API, so every
 * opening exposes two real, tappable deep-links whose endpoints come from the
 * single source of truth {@link siteConfig} — "Apply via WhatsApp"
 * (`siteConfig.whatsappHref`, an https://wa.me/… link the shared <Button> opens
 * in a new tab) and "Email Resume" (`siteConfig.emailHref`, a `mailto:` opened
 * in place). Each link is PRE-FILLED per role: the WhatsApp `?text=` and the
 * mailto `subject`/`body` name the exact position (QA Issue 13), so the
 * applicant never hands off with a blank, ambiguous message.
 *
 * Reuse-first (zero duplication): the page is assembled entirely from the
 * canonical primitives — <Container>, <SectionHeading>, <Breadcrumbs>, <Card>,
 * <Badge>, <Button>, <FeatureCard> and the site-wide <CTASection> — plus the
 * <Seo>/<StructuredData> head helpers. It introduces no bespoke layout wrappers
 * and no local styling utilities; all classes are token-driven on the 8px scale.
 *
 * Accessibility (WCAG AA): exactly ONE `<h1>` (the page header, via
 * `SectionHeading as="h1"`); section titles are `<h2>` (SectionHeading default);
 * each opening's role title is an `<h3>`, keeping a logical heading outline.
 *
 * @returns {import('react').ReactElement} The rendered careers page.
 */

// Breadcrumb trail for this page. The same `{ name, path }` shape is consumed
// both by the visible <Breadcrumbs> trail and by `breadcrumbSchema()` via
// <StructuredData breadcrumbs={crumbs} />, keeping the UI and the JSON-LD
// BreadcrumbList in agreement (module-local; not exported).
const crumbs = [
  { name: 'Home', path: '/' },
  { name: 'Career', path: '/career' },
]

// FLAG (AAP §0.7.2): representative "why work with us" perks — production-quality
// structure with polished, representative copy. Confirm/replace with the
// institute's own employee value proposition before launch. Icons are passed as
// react-icons COMPONENT REFERENCES (never rendered elements) into FeatureCard.
const perks = [
  {
    title: 'Meaningful Impact',
    description: 'Help students build confidence and shape brighter futures every day.',
    icon: FaHeart,
  },
  {
    title: 'Growth & Training',
    description: 'Ongoing mentoring and teaching development to sharpen your craft.',
    icon: FaChalkboardTeacher,
  },
  {
    title: 'Flexible Batches',
    description: 'Balanced schedules with morning, evening and weekend teaching slots.',
    icon: FaRegClock,
  },
  {
    title: 'Supportive Team',
    description: 'Join a collaborative, student-first team that values every contribution.',
    icon: FaUsers,
  },
]

// FLAG (AAP §0.7.2): representative currently-open roles — replace with the
// institute's genuine, currently-open positions before launch. Each role drives
// conversion through the WhatsApp / email deep-links rendered below.
const openings = [
  {
    title: 'Spoken English Trainer',
    type: 'Full-time',
    location: 'Saharghat, Madhubani',
    description: 'Deliver engaging spoken English and communication classes for school and college students.',
  },
  {
    title: 'Science Faculty (PCM/PCB)',
    type: 'Full-time',
    location: 'Saharghat, Madhubani',
    description: 'Coach Physics, Chemistry, Mathematics or Biology for board and competitive exam aspirants.',
  },
  {
    title: 'Computer Instructor',
    type: 'Part-time',
    location: 'Saharghat, Madhubani',
    description: 'Teach basic computer skills and digital literacy to learners of all ages.',
  },
]

function Career() {
  return (
    <>
      <Seo
        title="Career"
        canonical="/career"
        description="Build your teaching career at CIBLE School of Language in Madhubani, Bihar. Explore openings for English trainers, science faculty and computer instructors — apply via WhatsApp or email."
      />
      <StructuredData breadcrumbs={crumbs} />

      {/* Page header */}
      <Container as="section" className="py-12 md:py-16">
        <Breadcrumbs items={crumbs} className="mb-6" />
        <SectionHeading
          as="h1"
          align="left"
          eyebrow="Join Our Team"
          title="Careers at CIBLE"
          subtitle="Passionate about teaching? Grow with us and help students learn, achieve and thrive."
        />
      </Container>

      {/* Why work with us (tinted band) */}
      <section className="bg-surface py-16 md:py-20">
        <Container>
          <SectionHeading
            eyebrow="Why CIBLE"
            title="Why Work With Us"
            subtitle="A student-first culture that invests in your growth."
          />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {perks.map((perk) => (
              <FeatureCard
                key={perk.title}
                icon={perk.icon}
                title={perk.title}
                description={perk.description}
              />
            ))}
          </div>
        </Container>
      </section>

      {/* Current openings */}
      <Container as="section" className="py-16 md:py-20">
        <SectionHeading
          eyebrow="Open Roles"
          title="Current Openings"
          subtitle="Apply in a click — send us a message on WhatsApp or email your resume."
        />
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {openings.map((role) => {
            // Per-role, pre-filled deep links (QA Issue 13): each opening carries
            // its OWN WhatsApp `?text=` and `mailto:` subject/body referencing the
            // exact role, so an applicant lands in their messaging/mail app with
            // the position already stated — no blank, ambiguous handoff. Endpoints
            // still come from the single source of truth (siteConfig); only the
            // pre-fill query is composed here.
            const waText = `Hello CIBLE, I would like to apply for the ${role.title} position (${role.type}, ${role.location}). Please find my details below:`
            const applyWhatsApp = `${siteConfig.whatsappHref}?text=${encodeURIComponent(waText)}`
            const emailSubject = `Job Application — ${role.title}`
            const emailBody = `Hello CIBLE Team,\n\nI would like to apply for the ${role.title} position (${role.type}, ${role.location}).\n\nName:\nPhone:\nExperience:\n\n(My resume is attached.)\n\nThank you.`
            const emailResume = `${siteConfig.emailHref}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`
            return (
              <Card key={role.title} className="flex flex-col p-6">
                <div className="mb-3 flex items-start gap-3">
                  <h3 className="min-w-0 text-lg font-semibold text-foreground">{role.title}</h3>
                  <Badge variant="secondary" className="shrink-0">
                    {role.type}
                  </Badge>
                </div>
                <p className="text-sm text-muted">{role.location}</p>
                <p className="mt-3 flex-1 text-muted leading-relaxed">{role.description}</p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Button href={applyWhatsApp} aria-label={`Apply for the ${role.title} role via WhatsApp`}>
                    Apply via WhatsApp
                  </Button>
                  <Button
                    variant="outline"
                    href={emailResume}
                    aria-label={`Email your resume for the ${role.title} role`}
                  >
                    Email Resume
                  </Button>
                </div>
              </Card>
            )
          })}
        </div>
      </Container>

      <CTASection />
    </>
  )
}

export default Career
