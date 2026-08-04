/**
 * CIBLE School of Language — Course Catalog
 *
 * Single source of truth for the institute's course offerings. Consumed by the
 * `CourseCard` / `CourseGrid` components, the `Courses` page (category filtering),
 * and the category landing pages (`SpokenEnglish`, `ScienceCoaching`,
 * `ComputerCourses`).
 *
 * Each `category` is one of: 'English' | 'Science' | 'Computer' | 'Career', so
 * pages can filter reliably (e.g. `courses.filter(c => c.category === 'Science')`).
 *
 * Each `eligibility` string states who a course suits (learner fit) and never
 * promises acceptance or an outcome. `CourseCard` surfaces it as visible card
 * metadata and `courseSchema()` serializes it as schema.org
 * `coursePrerequisites`, so every value must stay concise, truthful, and
 * defensible without a rating, credential, or review to justify it.
 *
 * NOTE: Durations, highlights, and curriculum details below are representative,
 * production-quality placeholders and MUST be confirmed with the institute before
 * launch (see AAP §0.7.2). Titles, slugs, and categories are canonical and MUST NOT
 * be changed — page routing and filtering depend on them.
 */

import {
  FaComments, FaLanguage, FaUserTie, FaMicrophone, FaUserCheck,
  FaAtom, FaMicroscope, FaDesktop, FaLaptopCode, FaCompass,
} from 'react-icons/fa'

export const courses = [
  {
    slug: 'spoken-english',
    title: 'Spoken English',
    category: 'English',
    summary:
      'Speak English with confidence in everyday situations. This beginner-friendly course builds real fluency, clear pronunciation, and the self-assurance to hold conversations at work, in college, and beyond.',
    duration: '3 Months',
    eligibility: 'Learners building everyday spoken-English confidence',
    highlights: [
      'Daily guided conversation practice',
      'Pronunciation and accent training',
      'Grammar essentials made simple',
      'Confidence-building speaking activities',
    ],
    icon: FaComments,
  },
  {
    slug: 'english-communication',
    title: 'English Communication',
    category: 'English',
    summary:
      'Master professional communication for the modern workplace. Sharpen your written and spoken English — from crafting clear emails to delivering confident presentations that get you noticed.',
    duration: '3 Months',
    eligibility: 'Learners improving academic, social, or workplace communication',
    highlights: [
      'Business writing and email etiquette',
      'Presentation and meeting skills',
      'Active listening and comprehension',
      'Vocabulary for professional settings',
    ],
    icon: FaLanguage,
  },
  {
    slug: 'personality-development',
    title: 'Personality Development',
    category: 'English',
    summary:
      'Grow into the confident, well-rounded person that colleges and employers remember. Develop the soft skills, body language, and etiquette that make a lasting first impression.',
    duration: '2 Months',
    eligibility: 'Learners developing confidence, presentation, and interpersonal skills',
    highlights: [
      'Body language and positive posture',
      'Self-confidence and self-esteem building',
      'Social and professional etiquette',
      'Goal-setting and time management',
    ],
    icon: FaUserTie,
  },
  {
    slug: 'public-speaking',
    title: 'Public Speaking',
    category: 'English',
    summary:
      'Command any stage with clarity and poise. Learn to structure powerful speeches, overcome stage fear, and shine in debates, anchoring, and group discussions.',
    duration: '45 Days',
    eligibility: 'Learners seeking structured speaking and audience practice',
    highlights: [
      'Stage-fear management techniques',
      'Speech structuring and storytelling',
      'Debate, anchoring, and impromptu speaking',
      'Voice modulation and delivery',
    ],
    icon: FaMicrophone,
  },
  {
    slug: 'interview-preparation',
    title: 'Interview Preparation',
    category: 'English',
    summary:
      'Walk into any interview ready to win the offer. Practice realistic HR and technical rounds, polish your resume, and master group discussions through personalized mock sessions.',
    duration: '45 Days',
    eligibility: 'Students and job-seekers preparing for interviews',
    highlights: [
      'One-on-one mock interviews with feedback',
      'HR and technical round preparation',
      'Resume building and profile tips',
      'Group discussion strategies',
    ],
    icon: FaUserCheck,
  },
  {
    slug: 'pcm-coaching',
    title: 'PCM Coaching',
    category: 'Science',
    summary:
      'Build a rock-solid foundation in Physics, Chemistry, and Mathematics for Class 11 and 12. Concept-first teaching and regular practice prepare you for board exams and competitive tests like JEE.',
    duration: '12 Months',
    eligibility: 'Class 11–12 learners studying Physics, Chemistry, and Mathematics',
    highlights: [
      'Concept-focused Physics, Chemistry, and Maths',
      'Class 11 and 12 board syllabus coverage',
      'Competitive-exam (JEE) foundation',
      'Regular tests and doubt-clearing sessions',
    ],
    icon: FaAtom,
  },
  {
    slug: 'pcb-coaching',
    title: 'PCB Coaching',
    category: 'Science',
    summary:
      'Pursue your medical dream with structured Physics, Chemistry, and Biology coaching for Class 11 and 12. Strengthen core concepts and exam temperament for board exams and NEET.',
    duration: '12 Months',
    eligibility: 'Class 11–12 learners studying Physics, Chemistry, and Biology',
    highlights: [
      'In-depth Physics, Chemistry, and Biology',
      'Class 11 and 12 board syllabus coverage',
      'NEET foundation and practice',
      'Weekly tests and performance tracking',
    ],
    icon: FaMicroscope,
  },
  {
    slug: 'basic-computer',
    title: 'Basic Computer',
    category: 'Computer',
    summary:
      'Get comfortable with computers from day one. Learn essential MS Office skills, typing, and internet basics that power everyday work, study, and job readiness.',
    duration: '3 Months',
    eligibility: 'Beginners learning core computer and office skills',
    highlights: [
      'Computer fundamentals and operating systems',
      'MS Word, Excel, and PowerPoint',
      'Typing speed and accuracy practice',
      'Internet, email, and online safety basics',
    ],
    icon: FaDesktop,
  },
  {
    slug: 'digital-literacy',
    title: 'Digital Literacy',
    category: 'Computer',
    summary:
      'Thrive in a digital-first world with practical, up-to-date skills. Learn safe online habits, digital payments, everyday productivity tools, and a smart introduction to AI.',
    duration: '2 Months',
    eligibility: 'Beginners building safe, practical everyday digital skills',
    highlights: [
      'Online safety and privacy essentials',
      'Digital payments and e-governance services',
      'Productivity and cloud tools',
      'Introduction to everyday AI tools',
    ],
    icon: FaLaptopCode,
  },
  {
    slug: 'career-guidance',
    title: 'Career Guidance',
    category: 'Career',
    summary:
      'Discover the right path with expert, one-on-one career counseling. Assess your aptitude, choose the ideal stream, and build a clear, achievable roadmap toward your goals.',
    duration: '45 Days',
    eligibility: 'Students and job-seekers exploring education and career options',
    highlights: [
      'Aptitude and interest assessment',
      'Stream and career selection guidance',
      'Personalized goal roadmap',
      'Mentorship and follow-up sessions',
    ],
    icon: FaCompass,
  },
]

export default courses
