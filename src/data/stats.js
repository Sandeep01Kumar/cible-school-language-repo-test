/**
 * stats.js — Headline achievement statistics for CIBLE School of Language.
 *
 * NOTE (CLIENT-CONFIRM): The figures below are REPRESENTATIVE, launch-quality
 * placeholders. They MUST be verified and confirmed by the institute before
 * the site goes live (AAP §0.7.2 — authentic institute-supplied metrics are
 * swapped in later). "Courses Offered" (10) intentionally matches the 10
 * courses defined in src/data/courses.js.
 *
 * Pure ESM data module — exports constants only (no JSX / no React). It is the
 * single source of truth for the animated counter bar and is consumed by
 * src/components/common/Statistics.jsx, which:
 *   - animates each `value` from 0 with `react-countup` (end={stat.value}), and
 *   - triggers the count once scrolled into view via `react-intersection-observer`,
 *   rendering the icon as:
 *     const Icon = stat.icon
 *     <Icon aria-hidden="true" />
 *
 * Per-item shape:
 *   {
 *     label:   string   human-readable metric name (required)
 *     value:   number   REQUIRED plain number — react-countup animates 0 → value.
 *                       Must NOT be a string, otherwise the counter cannot run.
 *     suffix?: string   optional text appended after the number (e.g. '+', '%')
 *     prefix?: string   optional text placed before the number (usually omitted)
 *     icon:    IconType react-icons component reference (from 'react-icons/fa')
 *   }
 */

import {
  FaUserGraduate,
  FaAward,
  FaChalkboardTeacher,
  FaBookOpen,
} from 'react-icons/fa'

/**
 * Headline statistics rendered as an animated counter bar.
 *
 * @type {ReadonlyArray<{
 *   label: string,
 *   value: number,
 *   suffix?: string,
 *   prefix?: string,
 *   icon: import('react-icons').IconType,
 * }>}
 */
export const stats = [
  {
    label: 'Students Trained',
    value: 5000,
    suffix: '+',
    icon: FaUserGraduate,
  },
  {
    label: 'Years of Excellence',
    value: 10,
    suffix: '+',
    icon: FaAward,
  },
  {
    label: 'Expert Faculty',
    value: 25,
    suffix: '+',
    icon: FaChalkboardTeacher,
  },
  {
    label: 'Courses Offered',
    value: 10,
    suffix: '+',
    icon: FaBookOpen,
  },
]

export default stats
