/**
 * CIBLE School of Language — Student & Parent Testimonials
 *
 * Single source of truth for the social-proof reviews rendered by
 * `src/components/common/ReviewCard.jsx`, `src/components/common/TestimonialSlider.jsx`
 * (swiper carousel), and the `src/pages/SuccessStories.jsx` page.
 *
 * REPRESENTATIVE CONTENT — CLIENT MUST REPLACE (AAP §0.7.2): The names, quotes,
 * and ratings below are production-quality *representative* samples written in a
 * Madhubani / Bihar (Mithila) context. They are NOT verified student records and
 * must not be presented as authentic reviews. Before launch the institute should
 * replace each entry with a real, consent-approved review and add the reviewer's
 * genuine photo.
 *
 * IMAGE CONTRACT: every `image` is intentionally `null`. `ReviewCard.jsx` renders
 * an initials-avatar fallback whenever `image` is null. When real photos are
 * available, place them under `public/testimonials/` and set `image` to the
 * corresponding `/testimonials/<name>.jpg` path noted on each entry.
 *
 * COURSE CONTRACT: every `course` value MUST exactly match a `title` in
 * `src/data/courses.js` (Spoken English, English Communication, Personality
 * Development, Public Speaking, Interview Preparation, PCM Coaching, PCB Coaching,
 * Basic Computer, Digital Literacy, Career Guidance) so a review can be linked to
 * its program.
 *
 * SHAPE: { name, role, course, rating (number 1–5), quote, image }
 */

export const testimonials = [
  {
    name: 'Priya Kumari',
    role: 'Spoken English Student',
    course: 'Spoken English',
    rating: 5,
    quote:
      'When I joined I could barely finish two sentences in English without freezing. After a few months of daily speaking practice I now present projects in front of my whole college, and the teachers correct you so gently that you never feel shy.',
    image: null, // TODO(client): add real photo at /testimonials/priya-kumari.jpg; ReviewCard shows initials when null
  },
  {
    name: 'Rahul Jha',
    role: 'Personality Development Student',
    course: 'Personality Development',
    rating: 5,
    quote:
      'The personality development sessions completely changed how I carry myself in group discussions and interviews. My trainers worked with me on body language, eye contact, and speaking clearly, and even my family noticed how much more confident I have become.',
    image: null, // TODO(client): add real photo at /testimonials/rahul-jha.jpg; ReviewCard shows initials when null
  },
  {
    name: 'Aditi Mishra',
    role: 'Interview Preparation Student',
    course: 'Interview Preparation',
    rating: 4,
    quote:
      'The mock interviews were the most useful part of the course for me. The feedback after each round was honest and specific, so I walked into my actual bank interview feeling calm and genuinely prepared.',
    image: null, // TODO(client): add real photo at /testimonials/aditi-mishra.jpg; ReviewCard shows initials when null
  },
  {
    name: 'Sunita Devi',
    role: 'Parent of PCM Student',
    course: 'PCM Coaching',
    rating: 5,
    quote:
      'My son struggled with Physics and Maths before he joined the PCM coaching here, and his marks improved steadily through the year. The teachers track every student closely and keep parents updated, which gave me real peace of mind during his board exams.',
    image: null, // TODO(client): add real photo at /testimonials/sunita-devi.jpg; ReviewCard shows initials when null
  },
  {
    name: 'Rajesh Prasad',
    role: 'Parent of PCB Student',
    course: 'PCB Coaching',
    rating: 4,
    quote:
      'We wanted focused Biology and Chemistry coaching for my daughter, and the regular tests and doubt-clearing sessions kept her on track for her medical entrance preparation. The faculty were always approachable whenever we had questions.',
    image: null, // TODO(client): add real photo at /testimonials/rajesh-prasad.jpg; ReviewCard shows initials when null
  },
  {
    name: 'Anjali Kumari',
    role: 'Digital Literacy Student',
    course: 'Digital Literacy',
    rating: 5,
    quote:
      'I had never touched a computer before this course and worried I would be too slow to learn. Now I can send emails, fill online forms, and manage my own documents, all because the trainers started from the very basics and stayed patient with me.',
    image: null, // TODO(client): add real photo at /testimonials/anjali-kumari.jpg; ReviewCard shows initials when null
  },
]

export default testimonials
