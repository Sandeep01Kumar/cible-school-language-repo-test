// CIBLE School of Language — Blog / article posts (single source of truth).
//
// Pure ESM data module: exports plain constants only — no imports, no JSX, no
// side effects. Consumed by `src/components/common/BlogCard.jsx` (card preview)
// and the `src/pages/Blog.jsx` listing page.
//
// CONTENT NOTE (client-supplied, per AAP §0.7.2): the titles, excerpts, and body
// copy below are production-quality, representative editorial content meant to be
// reviewed and swapped for the institute's final copy. Article imagery is
// client-supplied — every `image` is `null`, so `BlogCard` renders its branded
// gradient / category fallback header until a real asset is dropped in at
// `/blog/<slug>.jpg`.

// Primary named export: the ordered list of blog posts (newest first).
export const blog = [
  {
    slug: 'daily-habits-improve-spoken-english',
    title: '5 Daily Habits to Improve Your Spoken English',
    excerpt: 'Small, consistent habits beat occasional cramming. Discover five simple daily practices — from thinking in English to shadowing native speakers — that steadily build fluency and confidence.',
    date: '2025-07-15',
    author: 'CIBLE Team',
    category: 'Spoken English',
    readTime: '5 min read',
    // TODO(client): add real image at /blog/daily-habits-improve-spoken-english.jpg; BlogCard shows gradient fallback when null
    image: null,
    content: 'Fluency is built one day at a time. Set aside ten focused minutes each morning to think and speak in English, narrate your daily routine aloud, shadow a short audio clip, learn five new words in context, and record yourself to track progress. Consistency, not perfection, is what turns hesitant speakers into confident communicators.',
  },
  {
    slug: 'ace-any-job-interview-practical-guide',
    title: 'How to Ace Any Job Interview: A Practical Guide',
    excerpt: 'Preparation turns nerves into confidence. Learn how to research the company, structure your answers with the STAR method, and follow up professionally to leave a lasting impression.',
    date: '2025-06-28',
    author: 'CIBLE Team',
    category: 'Interview Preparation',
    readTime: '6 min read',
    // TODO(client): add real image at /blog/ace-any-job-interview-practical-guide.jpg; BlogCard shows gradient fallback when null
    image: null,
    content: 'A great interview is won before you enter the room. Research the organisation and the role, prepare concise STAR-format stories for common questions, dress the part, and arrive early. Listen carefully, answer with specifics, ask thoughtful questions of your own, and send a short thank-you note afterwards to reinforce your interest.',
  },
  {
    slug: 'why-personality-development-matters',
    title: 'Why Personality Development Matters for Students',
    excerpt: 'Grades open doors, but personality keeps them open. Understand how communication, body language, and emotional intelligence shape lasting success for students in college and career.',
    date: '2025-06-10',
    author: 'CIBLE Faculty',
    category: 'Personality Development',
    readTime: '4 min read',
    // TODO(client): add real image at /blog/why-personality-development-matters.jpg; BlogCard shows gradient fallback when null
    image: null,
    content: 'Personality development is not about changing who you are — it is about presenting your best self with clarity and confidence. Strong communication, positive body language, active listening, and emotional intelligence help students collaborate, lead, and adapt. These are the very skills employers value most, and no exam can measure them.',
  },
  {
    slug: 'pcm-vs-pcb-choose-science-stream',
    title: 'PCM vs PCB: How to Choose Your Science Stream',
    excerpt: 'Choosing between PCM and PCB shapes your future path. Compare the two streams, the careers each one unlocks, and the questions that help you decide with confidence.',
    date: '2025-05-22',
    author: 'CIBLE Science Faculty',
    category: 'Science Coaching',
    readTime: '7 min read',
    // TODO(client): add real image at /blog/pcm-vs-pcb-choose-science-stream.jpg; BlogCard shows gradient fallback when null
    image: null,
    content: 'PCM (Physics, Chemistry, Mathematics) leads toward engineering, architecture, and technology, while PCB (Physics, Chemistry, Biology) opens doors to medicine, pharmacy, and the life sciences. The right choice depends on your interests and strengths, not peer pressure. Reflect on the subjects you genuinely enjoy, the careers that excite you, and talk to mentors before you commit.',
  },
  {
    slug: 'digital-literacy-2025-skills-students-need',
    title: 'Digital Literacy in 2025: Skills Every Student Needs',
    excerpt: 'From online safety to productivity tools, digital literacy is now as essential as reading and writing. Here are the core skills every modern student should master.',
    date: '2025-05-05',
    author: 'CIBLE Team',
    category: 'Digital Literacy',
    readTime: '5 min read',
    // TODO(client): add real image at /blog/digital-literacy-2025-skills-students-need.jpg; BlogCard shows gradient fallback when null
    image: null,
    content: 'Digital literacy goes far beyond browsing the internet. Today students need to manage files and email confidently, use word processors and spreadsheets, evaluate online information critically, protect their privacy, and collaborate through cloud tools. Mastering these fundamentals early makes higher studies and the modern workplace far easier to navigate.',
  },
  {
    slug: 'building-confidence-public-speaking',
    title: 'Building Confidence Through Public Speaking',
    excerpt: 'Stage fright is normal — and beatable. Learn practical techniques to structure your talk, manage nerves, and speak with presence in front of any audience.',
    date: '2025-04-18',
    author: 'CIBLE Faculty',
    category: 'Public Speaking',
    readTime: '4 min read',
    // TODO(client): add real image at /blog/building-confidence-public-speaking.jpg; BlogCard shows gradient fallback when null
    image: null,
    content: 'Confident speakers are made, not born. Start by knowing your material well, then practise aloud, breathe slowly to steady your nerves, and make eye contact to connect with your listeners. Begin with small groups, welcome honest feedback, and treat every talk as practice. With each attempt the fear shrinks and your voice grows stronger.',
  },
]

// Alias named export — the AAP references this data as "blog/posts"; `posts`
// points at the exact same array instance so both names stay in sync.
export const posts = blog

// Default export mirrors the primary named export for convenient importing.
export default blog
