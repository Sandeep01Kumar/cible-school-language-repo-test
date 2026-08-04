/**
 * successMilestones.js — The illustrative learner journey for CIBLE School of
 * Language.
 *
 * Single source of truth for the four stages a learner moves through at the
 * institute: naming a goal, learning with a teacher, practising in real
 * contexts, and planning what to take up next. Intended for the Success Stories
 * journey band, rendered through the existing shared <Timeline>.
 *
 * CONTENT NOTICE: the sequence is an ILLUSTRATIVE LEARNING PATHWAY, not a
 * verified individual student record, so the copy stays process-oriented (what a
 * learner does and what the institute provides) and names no date, duration,
 * credential, ranking or individual. The matching VISIBLE disclosure belongs to
 * the consuming page — <RepresentativeNote>, which self-gates on
 * `siteConfig.representativeContent` — and must not be duplicated here.
 *
 * Pure ESM data module — constants only, no JSX and no side effect. <Timeline>
 * owns all presentation and reveal behaviour, so no Tailwind class, color or
 * size appears below.
 *
 * Per-item shape `{ title, description, icon }` — exactly the contract
 * <Timeline> reads; a field it does not consume would be dead data:
 *   • `title` renders as an <h3> AND is used as the React `key`, so every title
 *     must be unique.
 *   • `description` stays one sentence: it renders as small supporting copy on a
 *     narrow rail, so more would not read cleanly at 320px.
 *   • `icon` is a react-icons component REFERENCE (never JSX) rendered inside an
 *     `aria-hidden` marker, so it is DECORATIVE — the title and description
 *     alone must carry the meaning.
 *   • Array order is the displayed sequence; <Timeline> emits a semantic <ol>,
 *     so no entry encodes a step number or an ordinal.
 */

import {
  FaBullseye,
  FaChalkboardTeacher,
  FaComments,
  FaCompass,
} from 'react-icons/fa'

/**
 * The four stages of the illustrative CIBLE learning journey, in display order.
 *
 * @type {ReadonlyArray<{
 *   title: string,
 *   description: string,
 *   icon: import('react-icons').IconType,
 * }>}
 */
export const successMilestones = [
  {
    title: 'Define Your Goal',
    description:
      'A teacher helps you name the skills you want to build and choose a course that fits your level.',
    icon: FaBullseye,
  },
  {
    title: 'Learn with Guidance',
    description:
      'Work through structured lessons with teachers who explain each concept, correct mistakes and answer questions as you go.',
    icon: FaChalkboardTeacher,
  },
  {
    title: 'Practice in Real Contexts',
    description:
      'Apply each skill through conversation practice, group activities and presentations drawn from real academic and workplace situations.',
    icon: FaComments,
  },
  {
    title: 'Plan the Next Step',
    description:
      'Discuss your progress with a mentor and choose the course, skill or area of study to take up next.',
    icon: FaCompass,
  },
]

export default successMilestones
