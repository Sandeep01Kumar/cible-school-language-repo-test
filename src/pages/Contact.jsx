import { FaPhone, FaWhatsapp, FaEnvelope, FaMapMarkerAlt, FaClock } from 'react-icons/fa'
import Seo from '../components/seo/Seo.jsx'
import StructuredData from '../components/seo/StructuredData.jsx'
import Container from '../components/ui/Container.jsx'
import SectionHeading from '../components/ui/SectionHeading.jsx'
import Breadcrumbs from '../components/ui/Breadcrumbs.jsx'
import Card from '../components/ui/Card.jsx'
import Button from '../components/ui/Button.jsx'
import ContactForm from '../components/forms/ContactForm.jsx'
import GoogleMap from '../components/common/GoogleMap.jsx'
import CTASection from '../components/common/CTASection.jsx'
import siteConfig from '../data/siteConfig.js'

/**
 * Contact — the primary contact hub for the CIBLE School of Language SPA
 * (route `/contact`, lazy-loaded by `src/App.jsx` inside the shared `<Layout>`).
 * This component renders ONLY page content; the persistent Navbar, Footer and
 * floating conversion widgets are supplied by the Layout shell.
 *
 * Conversion-first composition (AAP §0.6.3 — every page leads toward admission):
 * a page header, five direct-action contact cards (Call / WhatsApp / Email /
 * Visit / Hours), the validated `ContactForm`, a lazy `GoogleMap` embed of the
 * institute, and the shared admission `CTASection` closing the page.
 *
 * Reuse-first / zero duplication: every UI element is one of the canonical
 * primitives — `Container` (width + gutters), `SectionHeading` (the single
 * page `<h1>`), `Breadcrumbs`, `Card`, `Button` (polymorphic; `href` renders a
 * semantic `<a>`), plus the composite `ContactForm`, `GoogleMap` and
 * `CTASection`. No raw element is restyled to imitate a primitive.
 *
 * Single source of truth: all contact details (phone, WhatsApp/tel deep links,
 * email, address, opening hours, map embed) come from `siteConfig` — nothing is
 * hardcoded here. The click-to-call (`tel:`) and email (`mailto:`) actions open
 * in place while the WhatsApp (`https://wa.me/…`) action opens in a new tab;
 * that behaviour is owned by the `Button` primitive from the scheme of `href`.
 *
 * SEO: a unique `<Seo>` head (title → "Contact | CIBLE School of Language",
 * description, canonical `/contact`, Open Graph / Twitter) plus `<StructuredData
 * localBusiness breadcrumbs={crumbs} />`, which emits BOTH a LocalBusiness and a
 * BreadcrumbList JSON-LD block for this page.
 *
 * Accessibility (WCAG AA): exactly ONE `<h1>` (the page header). The five
 * contact-card labels are genuine section subheadings rendered as plain `<h2>`
 * (NOT `SectionHeading`, which owns the page-level heading) so the outline stays
 * logical. Leading icons are decorative (`aria-hidden="true"`) and the opening
 * hours are a real `<ul>`. Styling is token-only on the 8px spacing scale with
 * static classNames.
 *
 * @returns {import('react').ReactElement} The Contact page content.
 */

// Module-local (NOT exported) so the module exposes only the default Contact
// component under `react/only-export-components`. The `{ name, path }` shape is
// the shared breadcrumb contract consumed by BOTH the visible <Breadcrumbs>
// trail and `breadcrumbSchema` (via <StructuredData breadcrumbs>), keeping the
// rendered trail and the BreadcrumbList JSON-LD in agreement.
const crumbs = [
  { name: 'Home', path: '/' },
  { name: 'Contact', path: '/contact' },
]

function Contact() {
  return (
    <>
      <Seo
        title="Contact"
        canonical="/contact"
        description="Contact CIBLE School of Language, State Highway 75, Saharghat, Madhubani, Bihar. Call +91 98993 15093, message us on WhatsApp, email, or send an enquiry through our contact form."
      />
      <StructuredData localBusiness breadcrumbs={crumbs} />

      {/* Page header */}
      <Container as="section" className="py-12 md:py-16">
        <Breadcrumbs items={crumbs} className="mb-6" />
        <SectionHeading
          as="h1"
          align="left"
          eyebrow="Get in Touch"
          title="Contact CIBLE"
          subtitle="We'd love to hear from you. Reach out for admissions, course details or a free counseling session."
        />
      </Container>

      {/* Contact info + form (two columns on lg) */}
      <Container as="section" className="pb-16 md:pb-20">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Left: contact details */}
          <div className="flex flex-col gap-4">
            <Card className="flex items-start gap-4 p-6">
              <FaPhone aria-hidden="true" className="mt-1 h-5 w-5 text-primary-600" />
              <div>
                <h2 className="text-lg font-semibold text-foreground">Call Us</h2>
                <p className="mt-1 text-muted">{siteConfig.phone}</p>
                <Button href={siteConfig.phoneHref} size="sm" className="mt-3">Call Now</Button>
              </div>
            </Card>

            <Card className="flex items-start gap-4 p-6">
              <FaWhatsapp aria-hidden="true" className="mt-1 h-5 w-5 text-accent-600" />
              <div>
                <h2 className="text-lg font-semibold text-foreground">WhatsApp</h2>
                <p className="mt-1 text-muted">Chat with us for quick answers.</p>
                <Button variant="accent" href={siteConfig.whatsappHref} size="sm" className="mt-3">Message on WhatsApp</Button>
              </div>
            </Card>

            <Card className="flex items-start gap-4 p-6">
              <FaEnvelope aria-hidden="true" className="mt-1 h-5 w-5 text-primary-600" />
              <div>
                <h2 className="text-lg font-semibold text-foreground">Email</h2>
                <p className="mt-1 text-muted">{siteConfig.email}</p>
                <Button variant="outline" href={siteConfig.emailHref} size="sm" className="mt-3">Send Email</Button>
              </div>
            </Card>

            <Card className="flex items-start gap-4 p-6">
              <FaMapMarkerAlt aria-hidden="true" className="mt-1 h-5 w-5 text-secondary-500" />
              <div>
                <h2 className="text-lg font-semibold text-foreground">Visit Us</h2>
                <p className="mt-1 text-muted">{siteConfig.address}</p>
              </div>
            </Card>

            <Card className="flex items-start gap-4 p-6">
              <FaClock aria-hidden="true" className="mt-1 h-5 w-5 text-primary-600" />
              <div>
                <h2 className="text-lg font-semibold text-foreground">Office Hours</h2>
                <ul className="mt-1 space-y-1 text-muted">
                  {siteConfig.hours.map((slot) => (
                    <li key={slot.days}>
                      <span className="font-medium text-foreground">{slot.days}:</span> {slot.time}
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          </div>

          {/* Right: contact form */}
          <div>
            <ContactForm />
          </div>
        </div>
      </Container>

      {/* Map (self-wrapping) */}
      <GoogleMap />

      <CTASection />
    </>
  )
}

export default Contact
