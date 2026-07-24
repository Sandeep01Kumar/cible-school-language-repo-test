/**
 * CIBLE School of Language — Teaching Faculty Roster
 * ---------------------------------------------------
 * Single source of truth for the faculty shown on the Faculty page, the Home
 * page faculty preview, and anywhere a `<FacultyCard />` is rendered.
 *
 * CLIENT-SUPPLIED CONTENT NOTICE (AAP §0.7.2):
 * The names, roles and biographies below are REPRESENTATIVE, production-quality
 * placeholders written to reflect the CIBLE program areas and the Madhubani,
 * Bihar context. They are NOT verified institute records. Real faculty
 * photographs and verified biographies are supplied by the client and swapped
 * in later. Nothing here should be presented as a verified credential — no
 * exact tenure, no degrees from named universities are asserted as fact.
 *
 * IMAGE CONTRACT:
 * Every `image` is intentionally `null`. `FacultyCard.jsx` renders a graceful
 * initials-avatar fallback (initials derived from `name`, on a brand-blue
 * background) whenever `image` is null, so there are NO broken images and NO
 * imports of asset files that do not exist yet. When the client provides a real
 * photo, drop it at the documented `/faculty/<slug>.jpg` path (served from
 * `public/`) and replace the corresponding `image: null` with that string.
 *
 * SOCIALS CONTRACT (optional):
 * `socials` is an array — empty by default because no verified social profiles
 * exist yet (inventing URLs would violate the no-fabrication rule). When real
 * profiles are provided, add entries of the shape:
 *   { label: 'LinkedIn', href: 'https://www.linkedin.com/in/...', icon: FaLinkedinIn }
 * where `icon` is a `react-icons` COMPONENT REFERENCE (e.g. import
 * `{ FaLinkedinIn }` from 'react-icons/fa'), never a string. Consumers render it
 * as: `const Icon = s.icon; <Icon aria-hidden="true" />`. While all `socials`
 * arrays stay empty, this module needs no imports and stays dependency-free.
 *
 * @typedef {Object} FacultySocial
 * @property {string} label  Accessible label for the link (e.g. 'LinkedIn').
 * @property {string} href   Absolute profile URL.
 * @property {React.ComponentType} icon  A react-icons component reference.
 *
 * @typedef {Object} FacultyMember
 * @property {string} name              Full name.
 * @property {string} role              Subject / title, aligned to the courses.
 * @property {string} bio               One or two encouraging, professional sentences.
 * @property {string|null} image        Photo URL, or null to use the initials avatar.
 * @property {FacultySocial[]} socials  Optional social links (empty until verified).
 */

/** @type {FacultyMember[]} */
export const faculty = [
  {
    name: 'Rajeev Ranjan Jha',
    role: 'Founder & Director',
    bio: 'Rajeev founded CIBLE on a simple belief: every learner in Madhubani deserves world-class English and career guidance close to home. He leads the academy\u2019s teaching vision and mentors students toward confident communication and clear goals.',
    // TODO(client): add real photo at /faculty/rajeev-ranjan-jha.jpg; FacultyCard shows an initials avatar while this is null
    image: null,
    socials: [],
  },
  {
    name: 'Anjali Mishra',
    role: 'Spoken English & Personality Development Trainer',
    bio: 'Anjali helps hesitant speakers find their voice through daily conversation practice, structured feedback and plenty of encouragement. Her sessions blend spoken fluency with personality development so students carry that confidence well beyond the classroom.',
    // TODO(client): add real photo at /faculty/anjali-mishra.jpg; FacultyCard shows an initials avatar while this is null
    image: null,
    socials: [],
  },
  {
    name: 'Saurabh Kumar Choudhary',
    role: 'English Communication & Public Speaking Trainer',
    bio: 'Saurabh coaches students in professional communication, public speaking and interview readiness using real-world scenarios and mock practice. He focuses on clarity, body language and the calm confidence that presentations and interviews demand.',
    // TODO(client): add real photo at /faculty/saurabh-kumar-choudhary.jpg; FacultyCard shows an initials avatar while this is null
    image: null,
    socials: [],
  },
  {
    name: 'Nidhi Thakur',
    role: 'PCM Faculty (Physics & Mathematics)',
    bio: 'Nidhi makes Physics and Mathematics approachable by breaking tough concepts into simple, logical steps and worked examples. She guides PCM aspirants with regular practice, patient doubt-clearing and steady exam preparation.',
    // TODO(client): add real photo at /faculty/nidhi-thakur.jpg; FacultyCard shows an initials avatar while this is null
    image: null,
    socials: [],
  },
  {
    name: 'Ravi Shankar Mandal',
    role: 'PCB Faculty (Biology & Chemistry)',
    bio: 'Ravi brings Biology and Chemistry to life with clear diagrams, everyday examples and memory techniques that make revision easier. He supports PCB students with well-structured notes and consistent test practice for their medical-track goals.',
    // TODO(client): add real photo at /faculty/ravi-shankar-mandal.jpg; FacultyCard shows an initials avatar while this is null
    image: null,
    socials: [],
  },
  {
    name: 'Pooja Karn',
    role: 'Computer & Digital Literacy Instructor',
    bio: 'Pooja introduces students to computer fundamentals and everyday digital skills, from typing and office tools to safe, confident internet use. Her hands-on, patient approach helps first-time learners quickly become comfortable with technology.',
    // TODO(client): add real photo at /faculty/pooja-karn.jpg; FacultyCard shows an initials avatar while this is null
    image: null,
    socials: [],
  },
]

export default faculty
