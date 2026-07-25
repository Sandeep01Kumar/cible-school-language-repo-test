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

// Representative gallery imagery. The current assets are BRAND SVG ILLUSTRATIONS
// (not photographs), so the `alt` text describes each as an "illustration
// representing …" rather than asserting a real photograph — this keeps the page
// truthful (the site must not present illustrations as genuine institute
// photos). Authentic institute photographs are client-supplied and swapped in
// before launch (AAP §0.7.2); when they are, revert the `alt` copy to describe
// the real scene. The shape MUST match GalleryComponent's `images` prop
// ({ src, alt, caption }); every entry provides a meaningful `alt` for
// screen-reader users (WCAG AA), and the caption is a concise subject label.
const galleryImages = [
  { src: heroImg, alt: 'Illustration representing the CIBLE School of Language campus', caption: 'Our Campus' },
  { src: courseEnglish, alt: 'Illustration representing a spoken English class', caption: 'Spoken English' },
  { src: coursePersonality, alt: 'Illustration representing a personality development workshop', caption: 'Personality Development' },
  { src: courseScience, alt: 'Illustration representing a science coaching class', caption: 'Science Coaching' },
  { src: courseComputer, alt: 'Illustration representing computer lab training', caption: 'Computer Lab' },
  { src: courseCareer, alt: 'Illustration representing a career guidance session', caption: 'Career Guidance' },
]

function Gallery() {
  return (
    <>
      <Seo
        title="Gallery"
        canonical="/gallery"
        description="An illustrated gallery of CIBLE School of Language — depicting our campus, classrooms, spoken English sessions, science coaching, computer lab and student activities in Madhubani, Bihar."
      />
      <StructuredData breadcrumbs={crumbs} />

      <Container as="section" className="py-12 md:py-16">
        <Breadcrumbs items={crumbs} className="mb-6" />
        <SectionHeading
          as="h1"
          align="left"
          eyebrow="Life at CIBLE"
          title="Gallery"
          subtitle="An illustrated glimpse into our classrooms, activities and the CIBLE learning experience."
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
