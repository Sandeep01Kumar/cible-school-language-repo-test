import { Helmet } from 'react-helmet-async'
import { siteConfig } from '../../data/siteConfig.js'

const absoluteUrl = (path) => {
  if (!path) return siteConfig.siteUrl
  if (path.startsWith('http')) return path
  return `${siteConfig.siteUrl}${path.startsWith('/') ? path : `/${path}`}`
}

function Seo({ title, description, canonical, image, type = 'website' }) {
  const pageTitle = title ? `${title} | ${siteConfig.name}` : siteConfig.name
  const metaDescription = description || siteConfig.description
  // Only compute a canonical/og:url when the page explicitly supplies one.
  // Pages that have no single stable URL — chiefly the catch-all 404 NotFound
  // route, which can render under ANY unmatched path — must NOT emit a canonical
  // link; previously an absent `canonical` fell back to the site root, so every
  // unknown URL wrongly self-canonicalised to the homepage (QA Issue 12).
  const canonicalUrl = canonical ? absoluteUrl(canonical) : null
  const ogImage = absoluteUrl(image || siteConfig.ogImage)

  return (
    <Helmet>
      <title>{pageTitle}</title>
      <meta name="description" content={metaDescription} />
      {canonicalUrl ? <link rel="canonical" href={canonicalUrl} /> : null}

      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={siteConfig.name} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={metaDescription} />
      {canonicalUrl ? <meta property="og:url" content={canonicalUrl} /> : null}
      <meta property="og:image" content={ogImage} />
      <meta property="og:locale" content="en_IN" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={ogImage} />
    </Helmet>
  )
}

export default Seo
