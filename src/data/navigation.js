/**
 * navigation.js — Header and footer navigation link sets for the CIBLE
 * School of Language website.
 *
 * Pure ESM data module: no React, no JSX, no imports. It is the single source
 * of truth for the site's navigation links and is consumed by:
 *   - src/components/layout/Navbar.jsx  (renders `primaryNav`)
 *   - src/components/layout/Footer.jsx  (renders `footerNav` columns)
 *
 * Every `path` below is one of the 17 canonical, kebab-case, leading-slash
 * routes registered in src/App.jsx and listed in public/sitemap.xml:
 *   /                  /about             /courses           /spoken-english
 *   /science-coaching  /computer-courses  /faculty           /gallery
 *   /success-stories   /blog              /events            /admission
 *   /career            /faq               /contact           /privacy-policy
 *   /terms
 *
 * The union of `primaryNav` and every `footerNav[].links` entry covers all 17
 * routes so no page is orphaned. The `*` (NotFound) route is intentionally
 * excluded from navigation. Note: the FAQ URL is lowercase `/faq` even though
 * its page component file is `Faq.jsx`. Navbar additionally renders a
 * standalone "Admission" CTA button (path `/admission`); that button is owned
 * by Navbar, not by this data module.
 */

/**
 * Primary header navigation shown in the Navbar on desktop and inside the
 * mobile drawer — a concise, high-intent subset of the full site map.
 *
 * @type {{ label: string, path: string }[]}
 */
export const primaryNav = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Courses', path: '/courses' },
  { label: 'Faculty', path: '/faculty' },
  { label: 'Gallery', path: '/gallery' },
  { label: 'Blog', path: '/blog' },
  { label: 'Contact', path: '/contact' },
]

/**
 * Footer navigation grouped into columns. Footer.jsx renders one column per
 * group, using `title` as the column heading and `links` as its items.
 *
 * @type {{ title: string, links: { label: string, path: string }[] }[]}
 */
export const footerNav = [
  {
    title: 'Quick Links',
    links: [
      { label: 'Home', path: '/' },
      { label: 'About Us', path: '/about' },
      { label: 'Faculty', path: '/faculty' },
      { label: 'Gallery', path: '/gallery' },
      { label: 'Success Stories', path: '/success-stories' },
      { label: 'Blog', path: '/blog' },
      { label: 'Events', path: '/events' },
      { label: 'Admission', path: '/admission' },
      { label: 'Career', path: '/career' },
      { label: 'FAQ', path: '/faq' },
      { label: 'Contact', path: '/contact' },
    ],
  },
  {
    title: 'Courses',
    links: [
      { label: 'All Courses', path: '/courses' },
      { label: 'Spoken English', path: '/spoken-english' },
      { label: 'Science Coaching', path: '/science-coaching' },
      { label: 'Computer Courses', path: '/computer-courses' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', path: '/privacy-policy' },
      { label: 'Terms & Conditions', path: '/terms' },
    ],
  },
]

/**
 * Convenience default export bundling both navigation sets for single-import
 * consumption, e.g. `import navigation from '../../data/navigation.js'`.
 */
export default { primaryNav, footerNav }
