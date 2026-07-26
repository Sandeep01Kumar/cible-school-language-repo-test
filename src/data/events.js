/**
 * CIBLE School of Language — Events data source
 *
 * Single source of truth for CIBLE's upcoming and recent events (workshops,
 * seminars, batch starts, competitions and webinars). Consumed by
 * `src/components/common/EventCard.jsx` and the `Events.jsx` page, which sort
 * and format each `date` for display (for example via `toLocaleDateString`).
 *
 * NOTE (client-supplied): The entries below are representative,
 * production-quality content that establishes real structure, layout and tone
 * for the events experience. The institute must confirm and supply the final
 * event media, exact dates and times before launch. Every `image` is
 * intentionally `null` so `EventCard` renders its branded gradient / date-badge
 * fallback header; drop real artwork at `/events/<slug>.jpg` (see the per-event
 * TODO notes) to override the fallback once assets are available.
 */

/**
 * A single CIBLE event.
 *
 * @typedef {Object} CibleEvent
 * @property {string} slug        Stable, URL-safe identifier. Used to build event-aware
 *                                Register links (`/contact?event=<slug>`) and validated as an
 *                                allowlist by the Contact page so an event's identity survives the
 *                                handoff. Must be unique and match the `/events/<slug>.jpg` asset path.
 * @property {string} title       Human-readable event name.
 * @property {string} date        ISO 'YYYY-MM-DD' date string. Parse for display with
 *                                {@link module:lib/dates.parseCivilDate} to avoid the UTC day-shift.
 * @property {string} [time]      Optional display time, e.g. '10:00 AM – 1:00 PM'.
 * @property {('Workshop'|'Seminar'|'Batch Start'|'Competition'|'Webinar')} [type] Optional category.
 * @property {string} description One–two inviting, admission-oriented sentences.
 * @property {string} location    Event-specific location text (never the full site address block).
 * @property {?string} image      Client-supplied image path, or `null` to use the branded fallback.
 */

/**
 * Upcoming CIBLE events, listed in chronological order so consuming components
 * can render them directly or re-sort/format `date` as needed.
 *
 * @type {CibleEvent[]}
 */
export const events = [
  {
    slug: 'free-spoken-english-workshop',
    title: 'Free Spoken English Workshop',
    date: '2026-08-16',
    time: '10:00 AM – 1:00 PM',
    type: 'Workshop',
    description:
      'A hands-on session where beginners practise everyday conversation, pronunciation and confidence-building drills with our English faculty. Seats are free but limited – register early to reserve your spot and take the first step toward fluent, confident English.',
    location: 'CIBLE Campus, Saharghat, Madhubani',
    // TODO(client): add real image at /events/free-spoken-english-workshop.jpg; EventCard shows gradient fallback when null
    image: null,
  },
  {
    slug: 'personality-development-seminar',
    title: 'Personality Development Seminar',
    date: '2026-08-30',
    time: '11:00 AM – 1:00 PM',
    type: 'Seminar',
    description:
      'An interactive seminar on communication, body language and interview-ready confidence for students and young professionals. Bring a friend, book your free seat and discover how CIBLE programmes shape a standout personality.',
    location: 'CIBLE Seminar Hall, Saharghat, Madhubani',
    // TODO(client): add real image at /events/personality-development-seminar.jpg; EventCard shows gradient fallback when null
    image: null,
  },
  {
    slug: 'pcm-pcb-batch-orientation',
    title: 'New PCM & PCB Science Batch Orientation',
    date: '2026-09-13',
    time: '9:00 AM – 11:00 AM',
    type: 'Batch Start',
    description:
      'Meet our science mentors and preview the PCM and PCB coaching roadmap for board and competitive-exam success. Attend the orientation, confirm your seat for the new batch and start strong this session.',
    location: 'CIBLE Science Wing, Saharghat, Madhubani',
    // TODO(client): add real image at /events/pcm-pcb-batch-orientation.jpg; EventCard shows gradient fallback when null
    image: null,
  },
  {
    slug: 'public-speaking-competition',
    title: 'Spoken English & Public Speaking Competition',
    date: '2026-09-27',
    time: '10:00 AM – 4:00 PM',
    type: 'Competition',
    description:
      'Take the stage in our friendly elocution and public-speaking contest, with certificates and prizes for every level. Entry is free for enrolled and prospective students alike – register now and turn practice into performance.',
    location: 'CIBLE Main Auditorium, Saharghat, Madhubani',
    // TODO(client): add real image at /events/public-speaking-competition.jpg; EventCard shows gradient fallback when null
    image: null,
  },
  {
    slug: 'digital-literacy-webinar',
    title: 'Digital Literacy & Online Interview Skills Webinar',
    date: '2026-10-18',
    time: '6:00 PM – 7:30 PM',
    type: 'Webinar',
    description:
      'A live online session covering essential computer skills, digital safety and how to ace video interviews. Join from anywhere, ask our trainers directly and enquire about admission to our Computer and Career Guidance courses.',
    location: 'Online via Google Meet (link shared after registration)',
    // TODO(client): add real image at /events/digital-literacy-webinar.jpg; EventCard shows gradient fallback when null
    image: null,
  },
]

export default events
