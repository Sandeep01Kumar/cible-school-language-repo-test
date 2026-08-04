/**
 * heroProof.js — Factual proof metrics and trust labels for the premium Hero.
 *
 * Single source of truth for the two above-the-fold proof rows the Hero adds in
 * AAP §0.6.1: a compact grid of counters and a short row of trust labels.
 * Consumed by src/components/common/Hero.jsx, which renders each counter through
 * the shared src/components/common/StatCounter.jsx and each label through the
 * canonical src/components/ui/Badge.jsx. Those components own ALL presentation
 * and ALL activation/reduced-motion behavior, so no Tailwind class, color, size
 * or spacing value appears below.
 *
 * Pure ESM data module — exports constants only (no JSX / no React / no hook /
 * no side effect / no window access / no timer). Every derivation runs ONCE at
 * module scope in a single cheap pass over the catalog, because the Hero is the
 * LCP surface and this module sits on its critical path.
 *
 * DERIVED, NEVER RESTATED: every number below is computed from
 * src/data/courses.js, and every location and contact fact from
 * src/data/siteConfig.js. Nothing here is written as a figure, so the Hero can
 * never drift from the catalog it advertises or from the contact details the rest
 * of the site dials.
 *
 * CONTENT INTEGRITY (AAP §0.7.4): the Hero carries the most prominent claims on
 * the site, so this module publishes ONLY facts the repository itself can defend
 * — plain counts of the catalog, the institute's own city and region, and the
 * presence of contact and admission paths that already exist. By design it
 * asserts nothing about recognition, affiliation, scores, reviews, job outcomes,
 * teaching credentials, learner numbers or time in service: no record exists in
 * this repository to support such a claim, and each one would need a source the
 * client has yet to supply.
 *
 * `heroStats` per-item shape — deliberately the same counter contract
 * src/data/stats.js documents, so ONE shared StatCounter serves both the Hero
 * proof grid and the Statistics band:
 *   {
 *     label:   string  REQUIRED human-readable metric name. It is also the React
 *                      `key` of the rendered item, so every label MUST be unique.
 *     value:   number  REQUIRED plain number — the counter tweens 0 → value and
 *                      formats it with `value.toLocaleString('en-US')`. A quoted
 *                      value would break both, so it is never a string.
 *     suffix?: string  optional text after the number. Intentionally ABSENT from
 *                      all three metrics: each is an exact, checkable count of
 *                      the catalog, so a '+' would overstate it.
 *     prefix?: string  optional text before the number (omitted here).
 *   }
 *
 * `heroTrustBadges` per-item shape:
 *   {
 *     label:   string   REQUIRED visible badge text. It carries the record's FULL
 *                       meaning, because the icon beside it is decorative and the
 *                       consumer hides it from assistive technology (WCAG AA).
 *     icon:    IconType react-icons component REFERENCE, never a JSX element.
 *     variant: string   Badge color scheme; one of the only four Badge defines.
 *   }
 */

import { FaGraduationCap, FaHeadset, FaMapMarkerAlt } from 'react-icons/fa'
import { courses } from './courses.js'
import { siteConfig } from './siteConfig.js'

// The canonical 'English' category literal, named once so the filter below reads
// plainly and the string is never repeated. src/data/courses.js defines the four
// canonical categories and every consumer filters on these exact values.
const ENGLISH_CATEGORY = 'English'

// All three metrics are derived from the catalog rather than written as figures,
// so adding or retiring a course updates the Hero on its own and these numbers
// can never contradict the /courses page.
const totalCourses = courses.length
const learningAreaCount = new Set(courses.map((course) => course.category)).size
const englishProgramCount = courses.filter((course) => course.category === ENGLISH_CATEGORY).length

// City and region derived from the single source of truth so the location badge
// never duplicates (and cannot drift from) the address in siteConfig.
const { addressLocality, addressRegion } = siteConfig.addressParts
const cityRegion = `${addressLocality}, ${addressRegion}`

// The contact badge is published ONLY while both direct channels actually exist
// in siteConfig: offering call and WhatsApp support with no link behind it would
// be an unfounded claim, so this gate fails closed.
const hasDirectContactChannels = Boolean(siteConfig.phoneHref) && Boolean(siteConfig.whatsappHref)

// One shared Badge variant for the whole trust row. 'primary' is Badge's own
// default pairing — a light brand fill with dark brand text, AA-compliant for
// normal-size text — and the same pairing the Hero eyebrow already uses, so the
// row reads as one calm group instead of three competing colors.
const TRUST_BADGE_VARIANT = 'primary'

/**
 * The Hero proof counters, in display order. No `icon` field: the proof grid is
 * deliberately typographic and the shared counter treats `icon` as optional, so
 * inventing glyphs here would only add data nothing renders.
 *
 * @type {ReadonlyArray<{
 *   label: string,
 *   value: number,
 *   suffix?: string,
 *   prefix?: string,
 * }>}
 */
export const heroStats = [
  { label: 'Courses Offered', value: totalCourses },
  { label: 'Learning Areas', value: learningAreaCount },
  { label: 'English Programs', value: englishProgramCount },
]

/**
 * The Hero trust labels, in display order.
 *
 * @type {ReadonlyArray<{
 *   label: string,
 *   icon: import('react-icons').IconType,
 *   variant: 'primary'|'secondary'|'accent'|'neutral',
 * }>}
 */
export const heroTrustBadges = [
  // Where the institute actually is — the one local fact the Hero can state
  // outright, assembled from siteConfig's structured address.
  { label: cityRegion, icon: FaMapMarkerAlt, variant: TRUST_BADGE_VARIANT },
  // Published only while both channels exist (see hasDirectContactChannels).
  ...(hasDirectContactChannels
    ? [{ label: 'Call & WhatsApp support', icon: FaHeadset, variant: TRUST_BADGE_VARIANT }]
    : []),
  // Grounded in the /admission and /contact paths that already exist in the
  // route table: it offers guidance, and promises no result or response window.
  { label: 'Admission guidance available', icon: FaGraduationCap, variant: TRUST_BADGE_VARIANT },
]

export default { heroStats, heroTrustBadges }
