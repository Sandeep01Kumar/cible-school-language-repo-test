import { Helmet } from 'react-helmet-async'
import {
  organizationSchema,
  localBusinessSchema,
  courseSchema,
  breadcrumbSchema,
} from '../../lib/schema.js'

function StructuredData({
  schema,
  data,
  organization = false,
  localBusiness = false,
  course,
  breadcrumbs,
}) {
  const blocks = []

  if (organization) blocks.push(organizationSchema())
  if (localBusiness) blocks.push(localBusinessSchema())
  if (course) blocks.push(courseSchema(course))
  if (breadcrumbs) blocks.push(breadcrumbSchema(breadcrumbs))

  const provided = schema || data
  if (Array.isArray(provided)) blocks.push(...provided)
  else if (provided) blocks.push(provided)

  const jsonLdBlocks = blocks.filter(Boolean)

  if (jsonLdBlocks.length === 0) return null

  return (
    <Helmet>
      {jsonLdBlocks.map((block, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(block)}
        </script>
      ))}
    </Helmet>
  )
}

export default StructuredData
