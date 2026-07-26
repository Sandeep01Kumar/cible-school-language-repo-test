/**
 * CIBLE School of Language — Frequently Asked Questions (FAQ) data.
 *
 * ESM data module (no JSX, constants only). It is the single source of truth
 * for FAQ content and is consumed by:
 *   - src/components/common/FAQ.jsx  (renders an accessible Accordion)
 *   - src/pages/Faq.jsx              (may group items by `category`)
 *   - src/lib/schema.js              (optional FAQPage JSON-LD structured data)
 *
 * Item shape: { question, answer, category }
 *   - question (required): a real prospective-student / parent question.
 *   - answer   (required): a concise, warm, admissions-oriented reply (1–3 sentences).
 *   - category (optional): one of 'Admissions' | 'Courses' | 'Fees' | 'General',
 *                          used purely for grouping in the FAQ page.
 *
 * NOTE — CLIENT-CONFIRMED CONTENT (AAP §0.7.2): The specific class timings,
 * batch options, fee amounts, payment options, trial/demo-class availability,
 * and certificate details below are REPRESENTATIVE and intentionally phrased in
 * general terms — they are NOT presented as final commitments. They must be
 * verified and finalized with CIBLE before launch. Answers deliberately avoid
 * asserting unconfirmed specifics as fact and instead direct users to call,
 * WhatsApp, or visit for the most current information. The free counseling
 * session is an intentional, standing admissions call-to-action (AAP §0.1.1).
 * Contact details (phone, email, exact street address) live ONLY in
 * src/data/siteConfig.js and are surfaced by components. To keep a single
 * source of truth (no duplicated location facts), the location-related answers
 * below derive the city and region from `siteConfig.addressParts` rather than
 * repeating them as literals, and defer the precise street address to the
 * Contact page / components.
 */

import { siteConfig } from './siteConfig.js'

// City and region derived from the single source of truth so location prose
// never duplicates (and cannot drift from) the address in siteConfig.
const { addressLocality, addressRegion } = siteConfig.addressParts
const cityRegion = `${addressLocality}, ${addressRegion}`

export const faq = [
  {
    question: 'How do I enroll at CIBLE School of Language?',
    answer:
      'Getting started is easy — just fill out our online admission form, or call or WhatsApp us to book a free counseling session. Our friendly team will help you choose the right course and guide you through every step of enrollment.',
    category: 'Admissions',
  },
  {
    question: 'What courses does CIBLE offer?',
    answer:
      'We offer four core areas: Spoken English and communication, Science coaching for the PCM and PCB streams, Computer courses, and Career guidance. Whether you want to speak English confidently, ace your board exams, or build job-ready skills, there is a program designed for you.',
    category: 'Courses',
  },
  {
    question: 'Do you offer a free counseling session or a demo class?',
    answer:
      'Yes — we offer a free, no-obligation counseling session to help you choose the right course and plan your next steps. You are also welcome to ask about a trial or demo class for your chosen program. Call or WhatsApp us to book your free counseling session today.',
    category: 'Admissions',
  },
  {
    question: 'What are the class timings and batch options?',
    answer:
      'We aim to offer flexible batch options to suit students, working professionals, and parents. Exact batch timings vary by course and season, so please call, WhatsApp, or visit us to confirm the current schedule and reserve your seat.',
    category: 'General',
  },
  {
    question: 'How much do the courses cost, and what payment options are available?',
    answer:
      'Our fees are affordable and depend on the course and its duration. For the current fee structure, any ongoing offers, and available payment options, please contact us by phone or WhatsApp, or visit the institute — we will gladly walk you through the details.',
    category: 'Fees',
  },
  {
    question: 'Where is CIBLE located and how do I reach the institute?',
    answer:
      `We are located in ${cityRegion}. You are always welcome to visit us in person — you can find our full street address and directions on the Contact page, or call or WhatsApp ahead and we will help you plan your visit and find us easily.`,
    category: 'General',
  },
  {
    question: 'Are your courses suitable for absolute beginners?',
    answer:
      'Absolutely. Our courses welcome every level, from complete beginners to advanced learners, and our teachers start with the fundamentals to build your confidence step by step. Book a free counseling session and we will suggest the perfect starting point for you.',
    category: 'Courses',
  },
  {
    question: 'Which age groups and students can join CIBLE?',
    answer:
      'We warmly welcome school students, college students, and working professionals alike. Book a free counseling session and we will recommend the right course and batch for your age, current level, and goals.',
    category: 'Courses',
  },
  {
    question: 'Do you provide a certificate after completing a course?',
    answer:
      'Many of our courses include a certificate of completion that recognizes the skills and progress you achieve. Ask us for course-specific certificate details during your free counseling session.',
    category: 'Courses',
  },
  {
    question: 'How can I contact CIBLE or visit the institute?',
    answer:
      `You can reach us by phone or WhatsApp, or simply visit us in ${cityRegion}. Have a question or ready to begin? Call or WhatsApp us to book your free counseling session — we are always happy to help you take the first step toward a brighter future.`,
    category: 'General',
  },
]

export default faq
