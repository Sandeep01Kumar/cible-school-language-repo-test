/**
 * CIBLE School of Language — Frequently Asked Questions (FAQ) data.
 *
 * Pure ESM data module: no imports, no JSX, constants only. It is the single
 * source of truth for FAQ content and is consumed by:
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
 * batch schedules, fee amounts, payment options, and certificate details below
 * are REPRESENTATIVE and intentionally phrased in general terms. They must be
 * verified and finalized with CIBLE before launch. No exact fees or timings are
 * presented here as final; answers deliberately direct users to call, WhatsApp,
 * or visit for the most current information. Contact details (phone, email,
 * exact address) live in src/data/siteConfig.js and are surfaced by components —
 * only the city/location is referenced in this prose.
 */

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
    question: 'Do you offer a free demo class or counseling session?',
    answer:
      'Yes! We offer a free counseling session and a demo class so you can experience our teaching before you decide. Call or WhatsApp us to book your free session today — there is no cost and no obligation.',
    category: 'Admissions',
  },
  {
    question: 'What are the class timings and batch options?',
    answer:
      'We run flexible batches across the morning, afternoon, and evening to suit students, working professionals, and parents. Exact timings vary by course and season, so please call, WhatsApp, or visit us to confirm the current schedule and reserve your seat.',
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
      'We are located on State Highway 75 (SH75), Mukhiapatti, Saharghat, in Madhubani, Bihar. You are always welcome to visit us in person — call or WhatsApp ahead and we will help you plan your visit and find us easily.',
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
      'Yes, students receive a certificate of completion that recognizes the skills and progress you have achieved. Ask us for course-specific details during your free counseling session.',
    category: 'Courses',
  },
  {
    question: 'How can I contact CIBLE or visit the institute?',
    answer:
      'You can reach us by phone or WhatsApp, or simply visit us in Madhubani, Bihar. Have a question or ready to begin? Call or WhatsApp us to book your free counseling session — we are always happy to help you take the first step toward a brighter future.',
    category: 'General',
  },
]

export default faq
