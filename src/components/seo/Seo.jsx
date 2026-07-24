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
  const canonicalUrl = absoluteUrl(canonical)
  const ogImage = absoluteUrl(image || siteConfig.ogImage)

  return (
    <Helmet>
      <title>{pageTitle}</title>
      <meta name="description" content={metaDescription} />
      <link rel="canonical" href={canonicalUrl} />

      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={siteConfig.name} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:url" content={canonicalUrl} />
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
