// siteConfig — single source of truth for CIBLE School of Language brand identity,
// contact details, SEO base, map embed, and social profiles. Imported by
// src/lib/schema.js (JSON-LD Organization/LocalBusiness), Navbar, Footer, GoogleMap,
// the forms, and the <Seo> component. Consumers MUST read brand/contact values from
// here rather than hardcoding them.
//
// CLIENT LAUNCH TODO — the following are placeholders and MUST be replaced before launch:
//   • `siteUrl` uses the placeholder domain https://www.cibleschool.com. Keep it byte-for-byte
//     identical across index.html canonical, public/sitemap.xml, public/robots.txt, and
//     src/lib/schema.js.
//   • `social[].href` handles and `mapEmbedUrl` are representative placeholders — swap them for
//     the official profile URLs and the precise pinned Google Maps embed.
import { FaFacebookF, FaInstagram, FaYoutube, FaWhatsapp } from 'react-icons/fa'

export const siteConfig = {
  name: 'CIBLE School of Language',
  shortName: 'CIBLE',
  tagline: 'Learn English. Build Confidence. Shape Your Future.',
  // Default SEO description (used as the site-wide fallback meta description). Production-quality, keyword-aware.
  description:
    'CIBLE School of Language in Madhubani, Bihar offers Spoken English, English Communication, Personality Development, Science (PCM/PCB) coaching and Computer courses. Learn English. Build Confidence. Shape Your Future.',
  phone: '+91 98993 15093',            // display format (verbatim user example)
  phoneHref: 'tel:+919899315093',      // click-to-call deep link
  whatsappHref: 'https://wa.me/919899315093',
  // Optional pre-filled WhatsApp text the widgets may append as ?text=...; keep as plain string.
  whatsappMessage: "Hello CIBLE, I'd like to know more about admissions.",
  email: 'info2cible@gmail.com',
  emailHref: 'mailto:info2cible@gmail.com',
  address: 'State Highway 75 (SH75), Mukhiapatti, Saharghat, Madhubani, Bihar – 847305',
  // Structured address for JSON-LD LocalBusiness (src/lib/schema.js consumes this).
  addressParts: {
    streetAddress: 'State Highway 75 (SH75), Mukhiapatti, Saharghat',
    addressLocality: 'Madhubani',
    addressRegion: 'Bihar',
    postalCode: '847305',
    addressCountry: 'IN',
  },
  // PLACEHOLDER DOMAIN — client MUST replace at launch. This value is the canonical base URL and
  // MUST stay identical to: index.html canonical, public/sitemap.xml, public/robots.txt, and src/lib/schema.js.
  siteUrl: 'https://www.cibleschool.com',
  ogImage: '/og-image.jpg',            // matches index.html og:image + public/og-image.jpg (Seo builds absolute = siteUrl + ogImage)
  // Dedicated brand logo (distinct from the OG marketing image). Served from public/logo.svg and
  // emitted as the schema.org Organization `logo` (src/lib/schema.js) and usable by UI/manifest.
  logo: '/logo.svg',
  // Verification / launch-readiness flags (AAP §0.7.2 — representative content is in scope; genuine
  // ownership/records are client-supplied launch blockers and must NOT be asserted as verified fact):
  //   • socialVerified — when false, src/lib/schema.js OMITS the social `sameAs` block so no
  //     unverified profile is published as the institute's machine-readable identity. Flip to true
  //     only after the client confirms ownership of every URL in `social` below.
  //   • representativeContent — when true, the UI surfaces a tasteful, site-wide "representative
  //     content pending verification" disclosure (see Footer) so demo copy/data is never presented
  //     as verified fact. Set to false once all public-facing content is client-confirmed.
  socialVerified: false,
  representativeContent: true,
  // Google Maps EMBED url for GoogleMap.jsx (iframe src). Query-embed fallback (no API key, iframe-safe).
  // TODO(client): replace with the precise pinned embed from Google Maps "Share > Embed a map" (https://www.google.com/maps/embed?pb=...).
  mapEmbedUrl:
    'https://www.google.com/maps?q=Mukhiapatti%2C%20Saharghat%2C%20Madhubani%2C%20Bihar%20847305&output=embed',
  // "Open in Google Maps" link (for a button/anchor near the map).
  mapLink:
    'https://www.google.com/maps/search/?api=1&query=Mukhiapatti%2C%20Saharghat%2C%20Madhubani%2C%20Bihar%20847305',
  // Representative opening hours (client to confirm). Structured for LocalBusiness JSON-LD openingHours.
  hours: [
    { days: 'Monday – Saturday', time: '8:00 AM – 7:00 PM' },
    { days: 'Sunday', time: 'Closed' },
  ],
  social: [
    // Pliable placeholder handles — TODO(client): confirm/replace with official profile URLs.
    { label: 'Facebook', href: 'https://www.facebook.com/cibleschool', icon: FaFacebookF },
    { label: 'Instagram', href: 'https://www.instagram.com/cibleschool', icon: FaInstagram },
    { label: 'YouTube', href: 'https://www.youtube.com/@cibleschool', icon: FaYoutube },
    { label: 'WhatsApp', href: 'https://wa.me/919899315093', icon: FaWhatsapp },
  ],
}

export default siteConfig
