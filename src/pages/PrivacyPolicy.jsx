import Seo from '../components/seo/Seo.jsx'
import StructuredData from '../components/seo/StructuredData.jsx'
import Container from '../components/ui/Container.jsx'
import SectionHeading from '../components/ui/SectionHeading.jsx'
import Breadcrumbs from '../components/ui/Breadcrumbs.jsx'
import CTASection from '../components/common/CTASection.jsx'
import siteConfig from '../data/siteConfig.js'

// Breadcrumb trail. The SAME array is passed to <Breadcrumbs> (visible trail)
// and <StructuredData> (BreadcrumbList JSON-LD) so the two stay in agreement,
// which is what search engines expect. Module-local, not exported.
const crumbs = [
  { name: 'Home', path: '/' },
  { name: 'Privacy Policy', path: '/privacy-policy' },
]

// Privacy-policy copy REWRITTEN to describe how this website ACTUALLY works
// (M07 / M09): a static, client-only site with NO backend or database. The
// forms do not transmit data to a CIBLE server — they open a pre-filled
// WhatsApp or email draft on the visitor's own device, which is sent only if
// the visitor presses send. The text therefore discloses the third parties that
// process that message (WhatsApp/Meta and email providers) as well as the
// third-party content the site itself loads (Google Fonts on every page and an
// embedded Google Map on the Contact page, both of which send request data such
// as the visitor's IP address to Google), corrects the earlier false
// "analytics/collection/retention/deletion" claims, and addresses minors.
//
// This remains representative pre-launch copy: it MUST be reviewed by legal
// counsel and approved by the institute before publication (AAP §0.7.2 —
// authentic, legally-reviewed copy is client-supplied). That pending-approval
// status is surfaced to visitors in the notice box below. Module-local.
const sections = [
  {
    heading: 'How This Website Works',
    body: 'CIBLE School of Language operates this website as a static, client-side website with no backend server and no database. Nothing you type into a form is transmitted to, or stored on, a CIBLE server. Instead, our admission, contact and newsletter forms open a pre-filled message — a WhatsApp chat or an email draft — on your own device. That message is sent only if you choose to press send.',
  },
  {
    heading: 'Information You Choose to Share',
    body: 'The only personal information we receive is what you decide to send us through those channels: typically your name, phone number, email address and course of interest, plus anything you write in your message. We ask only for the details needed to respond to your enquiry, and you never have to submit a form to browse the site.',
  },
  {
    heading: 'Third-Party Processing (WhatsApp / Meta and Email)',
    body: 'Because your message is delivered through WhatsApp or email, your information is handled by those third parties. When you submit a form, the details you entered are assembled into a pre-filled message and encoded into a link — a WhatsApp click-to-chat URL of the form https://wa.me/<number>?text=… or an email draft (a mailto: link) — which opens in WhatsApp or your email app on your own device. Your entered details therefore travel inside that link: they may appear in your browser\u2019s address bar and local history for that action, and they are passed to WhatsApp/Meta (or your email provider) when the app opens the draft; CIBLE itself receives them only if you choose to press send. WhatsApp messages are then processed by WhatsApp and Meta under the WhatsApp and Meta privacy policies, and email by your email provider and the provider of the institute\u2019s inbox. Their handling of your data is governed by their own terms and privacy policies, which we do not control. Please review them, and avoid including highly sensitive information in your message, before sending.',
  },
  {
    heading: 'Content Delivered by Google (Fonts and Maps)',
    body: 'To present the site, we load the Inter typeface from Google Fonts on every page, and the Contact page embeds an interactive Google Map so visitors can find the institute. When your browser requests these resources, standard technical data \u2014 including your IP address, browser type and the page being viewed \u2014 is sent to Google in order to deliver them. This is inherent to how web fonts and embedded maps work; we do not use it to track or identify you. Google\u2019s handling of that data is governed by Google\u2019s own privacy policy, which we do not control.',
  },
  {
    heading: 'No Tracking or Analytics by CIBLE',
    body: 'CIBLE itself does not use analytics, advertising, tracking pixels, or cookies that identify you, and we build no visitor profiles. Because the site is delivered as static files with no CIBLE backend, CIBLE keeps no server-side log of your browsing on any CIBLE-operated server. However, like any website, the third-party hosting or content-delivery provider that serves these files may keep standard technical access logs \u2014 for example your IP address, the time of the request and the file requested \u2014 for security, reliability and abuse-prevention purposes. Those logs are held by the hosting provider under its own terms, are not used by CIBLE to track, profile or identify you, and the specific provider will be named here when the site is formally published. Aside from that and the technical request data sent to Google when the fonts and the Contact-page map load \u2014 described in the section above \u2014 no browsing data about you is collected by this website.',
  },
  {
    heading: 'How We Use Your Information',
    body: 'We use the details you send only to respond to your enquiry, provide course and admission guidance, and arrange counseling sessions or campus visits. We do not maintain a marketing database, and we do not sell or rent your personal information.',
  },
  {
    heading: 'Data Retention and Your Choices',
    body: 'Because we do not operate a server-side database, any message you send lives in WhatsApp, in your own email, and in the institute\u2019s inbox. To review, correct or remove information you have sent, contact us using the details below, or use the controls provided by WhatsApp/Meta or your email provider. You remain in control of what you choose to send.',
  },
  {
    heading: 'Grievance Redressal and Complaints',
    body: 'If you have a question, concern or complaint about how your information is handled \u2014 or if you would like information you have already sent to us corrected or removed \u2014 please contact the institute using the phone, WhatsApp or email details in the \u201CContact Us About This Policy\u201D section below, marking your message \u201CPrivacy Grievance\u201D. We will acknowledge and work in good faith to resolve genuine privacy grievances promptly. When the institute formalizes its operations, a named grievance/contact officer and a defined response timeline will be published here as required by applicable law.',
  },
  {
    heading: 'Children\u2019s Privacy',
    body: 'Our courses serve learners of many ages. If you are under 18, please involve a parent or guardian before sharing personal details or submitting a form, and share only the information necessary for an admission enquiry.',
  },
  {
    heading: 'Changes to This Policy',
    body: 'As the institute finalizes its operations, this policy will be reviewed by legal counsel and updated. Any changes will be posted on this page with a revised date once the policy is formally published.',
  },
]

/**
 * PrivacyPolicy — the `/privacy-policy` legal page for CIBLE School of Language.
 *
 * A readable, long-form legal-prose page that describes how the institute
 * handles the personal information visitors choose to share through the
 * website's WhatsApp and email enquiry forms. Critically, it reflects the
 * site's ACTUAL data-flow (M07 / M09): this is a static, client-only website
 * with no backend — forms open a pre-filled WhatsApp/email draft on the
 * visitor's device rather than transmitting data to a CIBLE server — so the
 * copy discloses the third parties (WhatsApp/Meta, email providers) that
 * process those messages, discloses the third-party content the site loads
 * (Google Fonts and the embedded Google Map, which send request data to
 * Google), clarifies that CIBLE itself performs no analytics/tracking, and
 * addresses minors. It is lazy-loaded by the route table in `src/App.jsx`
 * (`<Route path="privacy-policy" element={<PrivacyPolicy />} />`) and rendered
 * inside the shared `<Layout>`, so this component renders ONLY page content.
 *
 * Pending legal approval: the copy is representative pre-launch text that has
 * NOT yet been reviewed by legal counsel or approved by the institute; that
 * status is surfaced to visitors in a `role="note"` disclosure at the top of
 * the page, and no effective date is asserted until the policy is published.
 *
 * Reuse-first composition (zero duplication): the page is assembled entirely
 * from the canonical primitives — `<Seo>`/`<StructuredData>` for the head,
 * `<Container>` for width/gutters, `<SectionHeading>` for the single page
 * `<h1>`, `<Breadcrumbs>` for the hierarchy trail and `<CTASection>` for the
 * closing admission call-to-action that every page shares.
 *
 * Semantics & accessibility (WCAG AA): exactly ONE `<h1>` (via
 * `<SectionHeading as="h1">`); every policy section title is a genuine `<h2>`
 * in document order; body copy is real long-form prose in semantic `<p>`
 * elements; the narrow `max-w-3xl` measure keeps line length comfortable; and
 * the contact address is a real, actionable `mailto:` link. All styling flows
 * through the Tailwind `@theme` brand tokens defined in `src/index.css` on the
 * 8px spacing scale — no hardcoded or arbitrary values.
 *
 * @returns {import('react').ReactElement} The rendered privacy policy page.
 */
function PrivacyPolicy() {
  return (
    <>
      <Seo
        title="Privacy Policy"
        canonical="/privacy-policy"
        description="How CIBLE School of Language handles the information you share through our website's WhatsApp and email enquiry forms — a static, client-only site with no backend data collection."
      />
      <StructuredData breadcrumbs={crumbs} />

      {/* Page header */}
      <Container as="section" className="py-12 md:py-16">
        <Breadcrumbs items={crumbs} className="mb-6" />
        <SectionHeading
          as="h1"
          align="left"
          eyebrow="Legal"
          title="Privacy Policy"
          subtitle="How CIBLE School of Language handles the information you choose to share."
        />
      </Container>

      {/* Prose body — narrow measure for readable long-form legal text */}
      <Container as="section" className="max-w-3xl pb-16 md:pb-20">
        {/* Draft / pending-approval disclosure (M09). No effective date is
            asserted until the policy is reviewed by counsel and published. */}
        <div role="note" className="rounded-xl border border-border bg-secondary-50 p-4">
          <p className="text-sm leading-relaxed text-foreground">
            <strong className="font-semibold">Draft for review.</strong> This Privacy Policy is a representative
            pre-launch draft that describes how the website currently works. It has not yet been reviewed by legal
            counsel or approved by CIBLE School of Language, and no effective date applies until it is published.
          </p>
        </div>

        {sections.map((section) => (
          <div key={section.heading}>
            <h2 className="mt-8 mb-3 text-xl font-semibold text-foreground md:text-2xl">
              {section.heading}
            </h2>
            <p className="text-muted leading-relaxed">{section.body}</p>
          </div>
        ))}
        <h2 className="mt-8 mb-3 text-xl font-semibold text-foreground md:text-2xl">
          Contact Us
        </h2>
        <p className="text-muted leading-relaxed">
          If you have any questions about this Privacy Policy, please contact us at{' '}
          <a
            href={siteConfig.emailHref}
            className="font-medium text-primary-600 hover:underline"
          >
            {siteConfig.email}
          </a>
          .
        </p>
      </Container>

      <CTASection />
    </>
  )
}

export default PrivacyPolicy
