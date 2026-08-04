/**
 * heroProof.js — Factual proof metrics and trust labels for the premium Hero.
 *
 * Single source of truth for the two above-the-fold proof rows: a compact grid of
 * counters (`heroStats`) and a short row of trust labels (`heroTrustBadges`).
 * Intended for the Hero proof rows, where counters are rendered by the shared
 * <StatCounter> and labels by the canonical <Badge>; those components own ALL
 * presentation and ALL activation/reduced-motion behaviour, so no Tailwind class,
 * color, size or spacing value appears below.
 *
 * Pure ESM data module — constants only (no JSX / no React / no hook / no side
 * effect / no window access / no timer). Every value is derived at module scope
 * from src/data/courses.js (the counts) and src/data/siteConfig.js (location and
 * contact facts) and is never restated as a literal, so the Hero can never drift
 * from the catalog it advertises or from the contact details the rest of the site
 * dials.
 *
 * CONTENT INTEGRITY: the Hero carries the most prominent claims on the site, so
 * this module publishes only facts the repository itself can defend — plain
 * counts of the catalog, the institute's own city and region, and the presence of
 * contact and admission paths that already exist. It asserts nothing about
 * recognition, affiliation, scores, reviews, job outcomes, teaching credentials,
 * learner numbers or time in service: no record here supports such a claim, and
 * each one would need a source the client has yet to supply.
 *
 * Shape invariants beyond the `@type` block on each export:
 *   • Every `heroStats` label must be unique — the counter row keys on it — and
 *     every value must be a plain number, because the counter tweens 0 → value
 *     and formats it with `value.toLocaleString('en-US')`.
 *   • No stat carries a '+' suffix: each value is an exact, checkable count of
 *     the catalog, so a '+' would overstate it.
 *   • Each badge `icon` is a react-icons component REFERENCE, never a JSX
 *     element, and is rendered decoratively — so the badge `label` must carry the
 *     record's full meaning on its own (WCAG AA).
 */

import { FaGraduationCap, FaHeadset, FaMapMarkerAlt } from 'react-icons/fa'
import { courses } from './courses.js'
import { siteConfig } from './siteConfig.js'

const ENGLISH_CATEGORY = 'English'

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

const TRUST_BADGE_VARIANT = 'primary'

/**
 * The Hero proof counters, in display order. They carry no `icon` field because
 * the proof presentation is typographic.
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
  { label: cityRegion, icon: FaMapMarkerAlt, variant: TRUST_BADGE_VARIANT },
  ...(hasDirectContactChannels
    ? [{ label: 'Call & WhatsApp support', icon: FaHeadset, variant: TRUST_BADGE_VARIANT }]
    : []),
  { label: 'Admission guidance available', icon: FaGraduationCap, variant: TRUST_BADGE_VARIANT },
]

export default { heroStats, heroTrustBadges }
