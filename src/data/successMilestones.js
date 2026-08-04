/**
 * successMilestones.js — The illustrative learner journey for CIBLE School of
 * Language.
 *
 * Single source of truth for the four stages a learner moves through at the
 * institute: naming a goal, learning with a teacher, practising in real
 * contexts, and planning what to take up next. Consumed by
 * src/components/common/Timeline.jsx.
 *
 * CONTENT NOTICE (AAP §0.6.5 / §0.7.4): this sequence is an ILLUSTRATIVE
 * LEARNING PATHWAY — it is NOT a verified individual student record and it
 * promises no outcome. The copy is deliberately process-oriented (what a learner
 * does and what the institute provides at each stage) and therefore names no
 * date, duration, credential, ranking or individual. The matching VISIBLE
 * disclosure is supplied by the consuming page through
 * src/components/common/RepresentativeNote.jsx, which self-gates on
 * `siteConfig.representativeContent` and retires automatically once the client
 * clears that flag — so the wording lives with the page, never here.
 *
 * Pure ESM data module — exports constants only (no JSX / no React / no hook /
 * no side effect). Rendered by src/pages/SuccessStories.jsx as
 * `<Timeline items={successMilestones} />`; that component owns ALL presentation
 * (the rail, the marker disc, the icon size) and all reveal/reduced-motion
 * behaviour, so no Tailwind class, color or size appears below.
 *
 * Per-item shape (exactly the contract <Timeline> reads — adding a field it does
 * not consume would be dead data):
 *   {
 *     title:       string   REQUIRED short step label rendered as an <h3>.
 *                           <Timeline> also uses it as the React `key`, so every
 *                           title MUST be unique or the list keys collide.
 *     description: string   REQUIRED one-sentence supporting copy. It renders in
 *                           a narrow `text-sm` paragraph beside a 32px gutter,
 *                           so one sentence keeps it readable at 320px.
 *     icon:        IconType react-icons component REFERENCE (never JSX). It is
 *                           rendered inside a marker that <Timeline> marks
 *                           `aria-hidden="true"`, so each icon is DECORATIVE and
 *                           the title/description alone must carry the meaning.
 *   }
 *
 * Array ORDER is the displayed sequence: <Timeline> emits a semantic <ol>, so
 * assistive technology announces the position natively and the marker already
 * shows it. No entry therefore encodes a step number or an ordinal.
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
