import Seo from '../components/seo/Seo.jsx'
import StructuredData from '../components/seo/StructuredData.jsx'
import Container from '../components/ui/Container.jsx'
import SectionHeading from '../components/ui/SectionHeading.jsx'
import Breadcrumbs from '../components/ui/Breadcrumbs.jsx'
import GalleryComponent from '../components/common/Gallery.jsx'
import CTASection from '../components/common/CTASection.jsx'
import heroImg from '../assets/hero.svg'
import courseEnglish from '../assets/course-english.svg'
import coursePersonality from '../assets/course-personality.svg'
import courseScience from '../assets/course-science.svg'
import courseComputer from '../assets/course-computer.svg'
import courseCareer from '../assets/course-career.svg'

/**
 * Gallery — the `/gallery` route of the CIBLE School of Language website.
 *
 * Presentational page that showcases CIBLE's campus and classroom imagery
 * through the single canonical {@link GalleryComponent} composite (a Swiper
 * carousel with an accessible lightbox). It is lazy-loaded and rendered by
 * `src/App.jsx` inside the shared `<Layout>`, so it renders ONLY page content —
 * the navigation, footer and floating conversion widgets are owned by the
 * layout shell, and there is intentionally no `<main>` here.
 *
 * Naming note: the imported composite is also conceptually "Gallery"; it is
 * aliased to `GalleryComponent` so this page's own function can be named
 * `Gallery` and the `export default Gallery` reads naturally without an
 * identifier clash.
 *
 * Asset-import exception: this is the one page permitted to import
 * `../assets/*.svg` directly. Vite resolves each import to a URL string usable
 * as an `<img src>`, and because there is no dedicated gallery data module the
 * imagery is supplied inline here rather than from `src/data`.
 *
 * SEO: emits a unique `<Seo>` head (title/description/canonical/Open Graph/
 * Twitter) plus a BreadcrumbList JSON-LD block via {@link StructuredData}. The
 * `crumbs` array is the single source shared by the visible {@link Breadcrumbs}
 * trail and the structured data so both stay in agreement.
 *
 * Accessibility (WCAG AA): exactly one `<h1>` (rendered by `SectionHeading`
 * with `as="h1"`), every image carries a meaningful `alt`, and both content
 * blocks are semantic `<section>` landmarks. Every styling class resolves to a
 * Tailwind `@theme` token or native utility on the project's 8px spacing scale.
 *
 * @returns {import('react').ReactElement} The rendered Gallery page.
 */

// Breadcrumb trail for this page. Shared verbatim by the visible <Breadcrumbs>
// and the BreadcrumbList JSON-LD (identical { name, path } shape) so the
// rendered trail and the structured data never diverge.
const crumbs = [
  { name: 'Home', path: '/' },
  { name: 'Gallery', path: '/gallery' },
]

// Representative gallery imagery — replace with genuine institute photographs
// before launch (AAP §0.7.2). The shape MUST match GalleryComponent's `images`
// prop ({ src, alt, caption }); every entry provides a meaningful `alt` for
// screen-reader users (WCAG AA).
const galleryImages = [
  { src: heroImg, alt: 'CIBLE School of Language campus', caption: 'Our Campus' },
  { src: courseEnglish, alt: 'Spoken English class in session', caption: 'Spoken English' },
  { src: coursePersonality, alt: 'Personality development workshop', caption: 'Personality Development' },
  { src: courseScience, alt: 'Science coaching class', caption: 'Science Coaching' },
  { src: courseComputer, alt: 'Computer lab training', caption: 'Computer Lab' },
  { src: courseCareer, alt: 'Career guidance session', caption: 'Career Guidance' },
]

function Gallery() {
  return (
    <>
      <Seo
        title="Gallery"
        canonical="/gallery"
        description="Explore photos of CIBLE School of Language — our campus, classrooms, spoken English sessions, science coaching, computer lab and student activities in Madhubani, Bihar."
      />
      <StructuredData breadcrumbs={crumbs} />

      <Container as="section" className="py-12 md:py-16">
        <Breadcrumbs items={crumbs} className="mb-6" />
        <SectionHeading
          as="h1"
          align="left"
          eyebrow="Life at CIBLE"
          title="Gallery"
          subtitle="A glimpse into our classrooms, activities and the CIBLE learning experience."
        />
      </Container>

      <Container as="section" className="pb-16 md:pb-20">
        <GalleryComponent images={galleryImages} />
      </Container>

      <CTASection />
    </>
  )
}

export default Gallery
