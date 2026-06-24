import Script from 'next/script'

interface StructuredDataProps {
  type?: 'Person' | 'Organization' | 'WebSite' | 'WebPage'
}

export default function StructuredData({ type = 'Person' }: StructuredDataProps) {
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Chamodya Hirusha",
    "jobTitle": "Full-Stack Developer",
    "description": "Experienced Full-Stack Developer specializing in React, Node.js, React Native, and AI/ML technologies. Building scalable web and mobile applications with modern frameworks and cutting-edge solutions.",
    "url": "https://hirusha.dev",
    "image": "https://hirusha.dev/profile-image.jpg",
    "sameAs": [
      "https://github.com/hirusha-dev",
      "https://linkedin.com/in/chamodya-hirusha",
      "https://twitter.com/hirusha_dev"
    ],
    "knowsAbout": [
      "React",
      "Node.js",
      "React Native",
      "JavaScript",
      "TypeScript",
      "Next.js",
      "AI/ML",
      "Web Development",
      "Mobile Development",
      "Full-Stack Development"
    ],
    "hasOccupation": {
      "@type": "Occupation",
      "name": "Full-Stack Developer",
      "description": "Developing web and mobile applications using modern technologies"
    },
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "LK",
      "addressRegion": "Sri Lanka"
    },
    "alumniOf": {
      "@type": "EducationalOrganization",
      "name": "University of Sri Lanka"
    },
    "worksFor": {
      "@type": "Organization",
      "name": "Freelance"
    }
  }

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Chamodya Hirusha Portfolio",
    "url": "https://hirusha.dev",
    "logo": "https://hirusha.dev/logo.png",
    "description": "Professional portfolio showcasing full-stack development projects and AI/ML solutions",
    "founder": {
      "@type": "Person",
      "name": "Chamodya Hirusha"
    },
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "LK"
    }
  }

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Chamodya Hirusha Portfolio",
    "url": "https://hirusha.dev",
    "description": "Professional portfolio of Chamodya Hirusha, Full-Stack Developer",
    "author": {
      "@type": "Person",
      "name": "Chamodya Hirusha"
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://hirusha.dev/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  }

  const webpageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Chamodya Hirusha - Full-Stack Developer",
    "description": "Experienced Full-Stack Developer specializing in React, Node.js, React Native, and AI/ML technologies.",
    "url": "https://hirusha.dev",
    "mainEntity": {
      "@type": "Person",
      "name": "Chamodya Hirusha"
    },
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://hirusha.dev"
        }
      ]
    }
  }

  const getSchema = () => {
    switch (type) {
      case 'Organization':
        return organizationSchema
      case 'WebSite':
        return websiteSchema
      case 'WebPage':
        return webpageSchema
      default:
        return personSchema
    }
  }

  return (
    <Script
      id="structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(getSchema())
      }}
    />
  )
}
