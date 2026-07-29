/**
 * JSON-LD structured-data builders for the CIBLE School of Language website (SEO).
 *
 * Pure, side-effect-free functions that return plain, JSON-serializable
 * schema.org objects. They are injected into the document head as
 * `<script type="application/ld+json">` payloads by
 * `src/components/seo/StructuredData.jsx`, and are also used directly by pages
 * that render course or breadcrumb structured data. The output follows the
 * search-engine structured-data types called for by the project SEO
 * requirements: Organization (as `EducationalOrganization`), LocalBusiness,
 * Course, and BreadcrumbList.
 *
 * Single source of truth: every brand, contact, and URL value is read from the
 * shared {@link module:data/siteConfig siteConfig} module — nothing here is
 * hardcoded. The only literal strings this module introduces are generic
 * schema.org vocabulary values (for example `'admissions'`, `'IN'`, and the
 * `['en', 'hi']` language list) plus the structural `@context` / `@type`
 * keywords required by the specification.
 *
 * Serialization safety: `siteConfig.social[].icon` and `course.icon` are
 * `react-icons` component *function references*, which are not
 * JSON-serializable. They are deliberately never copied into any returned
 * object — `sameAs`, for instance, maps social entries to their `href` only —
 * so that `JSON.stringify()` of any builder's output never emits an `"icon"`
 * key or a function value.
 *
 * Every export is a plain function with no React, JSX, or hooks, which keeps
 * the module trivially compliant with the project's lint rules and safe to
 * import anywhere. All values are exported by name; there is no default export.
 *
 * @module lib/schema
 */

import { siteConfig } from '../data/siteConfig.js'

/**
 * The schema.org context IRI shared by every structured-data object.
 *
 * @type {string}
 */
const SCHEMA = 'https://schema.org'

/**
 * Resolve a path or URL to an absolute URL rooted at {@link siteConfig.siteUrl}.
 *
 * Behaviour:
 * - An empty / missing `path` resolves to the bare site URL (no trailing slash).
 * - A value already starting with `http` (an absolute URL) is returned as-is.
 * - A relative value is joined to the site URL, ensuring exactly one `/`
 *   between the origin and the path.
 *
 * `siteConfig.siteUrl` has no trailing slash, so joining is deterministic and
 * every result begins with the canonical origin.
 *
 * @param {string} [path] - An absolute URL, a root-relative path (`/og-image.jpg`),
 *   or a bare path segment (`courses`).
 * @returns {string} A fully-qualified absolute URL.
 */
const absoluteUrl = (path = '') => {
  if (!path) return siteConfig.siteUrl
  if (String(path).startsWith('http')) return path
  return `${siteConfig.siteUrl}${String(path).startsWith('/') ? path : `/${path}`}`
}

/**
 * Clean E.164 telephone number derived from the click-to-call deep link.
 *
 * `siteConfig.phoneHref` is `'tel:+919899315093'`; stripping the `tel:` scheme
 * yields `'+919899315093'`, the form expected by schema.org `telephone`.
 *
 * @type {string}
 */
const telephone = siteConfig.phoneHref.replace('tel:', '')

/**
 * Build the schema.org `PostalAddress` node from the structured address parts.
 *
 * Spreads {@link siteConfig.addressParts} (streetAddress, addressLocality,
 * addressRegion, postalCode, addressCountry) onto a typed object.
 *
 * @returns {{'@type': string, streetAddress: string, addressLocality: string, addressRegion: string, postalCode: string, addressCountry: string}}
 *   A schema.org PostalAddress object.
 */
const postalAddress = () => ({ '@type': 'PostalAddress', ...siteConfig.addressParts })

/**
 * Build the site-wide Organization structured-data object.
 *
 * Emits an `EducationalOrganization` (a schema.org subtype of `Organization`)
 * describing the institute: name, branding logo/image, description, contact
 * channels, postal address, an admissions `ContactPoint`, and — only when the
 * profiles have been verified as owned by the institute — the social profile
 * URLs via `sameAs`.
 *
 * Structured-data truthfulness (review M15):
 * - `logo` is the institute's dedicated brand logo (`siteConfig.logo`, served
 *   from `/logo.svg`), NOT the Open Graph marketing image. The two are distinct
 *   assets: `logo` must be a recognizable brand mark, while `image` remains the
 *   Open Graph social-share graphic.
 * - `sameAs` is emitted **only** when `siteConfig.socialVerified` is `true`.
 *   Until the client confirms ownership of the social accounts, no unverified
 *   identity links are published as machine-readable structured data. Only
 *   social `href` values are ever mapped in — the non-serializable `icon`
 *   references are excluded.
 *
 * @returns {object} A schema.org EducationalOrganization JSON-LD object.
 */
export function organizationSchema() {
  return {
    '@context': SCHEMA,
    '@type': 'EducationalOrganization',
    name: siteConfig.name,
    alternateName: siteConfig.shortName,
    url: siteConfig.siteUrl,
    logo: absoluteUrl(siteConfig.logo),
    image: absoluteUrl(siteConfig.ogImage),
    description: siteConfig.description,
    email: siteConfig.email,
    telephone,
    address: postalAddress(),
    contactPoint: {
      '@type': 'ContactPoint',
      telephone,
      contactType: 'admissions',
      email: siteConfig.email,
      areaServed: 'IN',
      availableLanguage: ['en', 'hi'],
    },
    // Only publish verified social identities; omit the key entirely otherwise
    // so no unverified profile is asserted as the organization's own.
    ...(siteConfig.socialVerified ? { sameAs: siteConfig.social.map((s) => s.href) } : {}),
  }
}

/**
 * Build the LocalBusiness structured-data object.
 *
 * Emits a `LocalBusiness` node with the institute's name, canonical URL, Open
 * Graph image, contact details, postal address, and a `hasMap` link to the
 * pinned Google Maps location.
 *
 * `openingHoursSpecification` is intentionally omitted: `siteConfig.hours`
 * holds human-readable display strings (for example `'Monday – Saturday'` /
 * `'8:00 AM – 7:00 PM'`), not machine-parseable times, and fabricating
 * structured times would risk emitting invalid data. `priceRange` is likewise
 * omitted because no source value exists.
 *
 * @returns {object} A schema.org LocalBusiness JSON-LD object.
 */
export function localBusinessSchema() {
  return {
    '@context': SCHEMA,
    '@type': 'LocalBusiness',
    name: siteConfig.name,
    url: siteConfig.siteUrl,
    image: absoluteUrl(siteConfig.ogImage),
    telephone,
    email: siteConfig.email,
    address: postalAddress(),
    hasMap: siteConfig.mapLink,
  }
}

/**
 * Build a Course structured-data object for a single course.
 *
 * The `course` argument comes from `src/data/courses.js` and has the shape
 * `{ slug, title, category, summary, duration, highlights: string[], icon }`.
 * The builder maps `course.title` to `name` and `course.summary` to
 * `description`, and attaches the institute as the `provider`
 * (`EducationalOrganization`). The non-serializable `course.icon` reference is
 * never included.
 *
 * A falsy `course` yields `null` so callers can conditionally render the
 * structured data without additional guards.
 *
 * @param {{title: string, summary: string, category?: string, [key: string]: unknown}} [course]
 *   A course record; `title`, `summary`, and `category` are consumed.
 * @returns {object|null} A schema.org Course JSON-LD object, or `null` when no
 *   course is supplied.
 */
export function courseSchema(course) {
  if (!course) return null
  // Each Course carries a resolvable `url` pointing at the canonical in-app page
  // that presents it (QA Issue 16). The three subject tracks have dedicated
  // landing pages; 'Career' has none in the frozen route table, so it resolves
  // to the admission page, and any unmapped category falls back to the catalog.
  // NOTE: courseSchema is also invoked as `courses.map(courseSchema)`, so it
  // MUST keep its single-argument signature — the landing path is derived
  // INTERNALLY from `course.category`, never passed as a positional argument.
  const COURSE_URL_BY_CATEGORY = {
    English: '/spoken-english',
    Science: '/science-coaching',
    Computer: '/computer-courses',
    Career: '/admission',
  }
  return {
    '@context': SCHEMA,
    '@type': 'Course',
    name: course.title,
    description: course.summary,
    url: absoluteUrl(COURSE_URL_BY_CATEGORY[course.category] || '/courses'),
    provider: {
      '@type': 'EducationalOrganization',
      name: siteConfig.name,
      sameAs: siteConfig.siteUrl,
    },
  }
}

/**
 * Build a BreadcrumbList structured-data object from an ordered trail.
 *
 * Each input item is `{ name, path }`; positions are 1-based and every `item`
 * is resolved to an absolute URL rooted at {@link siteConfig.siteUrl} via
 * {@link absoluteUrl}. The parameter defaults to an empty array so a missing
 * argument still yields a valid (empty) `itemListElement` list.
 *
 * @param {Array<{name: string, path: string}>} [items] - The ordered breadcrumb trail.
 * @returns {object} A schema.org BreadcrumbList JSON-LD object.
 */
export function breadcrumbSchema(items = []) {
  return {
    '@context': SCHEMA,
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  }
}
