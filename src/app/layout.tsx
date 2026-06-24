import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Providers } from './providers'
import StructuredData from '@/components/StructuredData'
import PerformanceOptimizer from '@/components/PerformanceOptimizer'
import SEOAnalytics from '@/components/SEOAnalytics'

export const metadata: Metadata = {
  title: {
    default: 'Chamodya Hirusha - Full-Stack Developer ',
    template: '%s | Chamodya Hirusha'
  },
  description: 'Experienced Full-Stack Developer specializing in React, Node.js, React Native, and AI/ML technologies. Building scalable web and mobile applications with modern frameworks and cutting-edge solutions.',
  keywords: [
    'Full-Stack Developer',
    'React Developer',
    'Node.js Developer',
    'React Native Developer',
    'AI/ML Engineer',
    'Web Development',
    'Mobile Development',
    'JavaScript Developer',
    'TypeScript Developer',
    'Next.js Developer',
    'Frontend Developer',
    'Backend Developer',
    'Software Engineer',
    'Portfolio',
    'Sri Lanka Developer',
    'Freelance Developer'
  ],
  authors: [{ name: 'Chamodya Hirusha', url: 'https://hirushakarunathilaka.com' }],
  creator: 'Chamodya Hirusha',
  publisher: 'Chamodya Hirusha',
  metadataBase: new URL('https://hirushakarunathilaka.com'),
  alternates: {
    canonical: 'https://hirushakarunathilaka.com',
  },
  openGraph: {
    title: 'Chamodya Hirusha - Full-Stack Developer ',
    description: 'Experienced Full-Stack Developer specializing in React, Node.js, React Native, and AI/ML technologies. Building scalable web and mobile applications.',
    url: 'https://hirushakarunathilaka.com',
    siteName: 'Chamodya Hirusha Portfolio',
    images: [
      {
        url: '/chamodya-hirusha.jpg',
        width: 800,
        height: 800,
        alt: 'Chamodya Hirusha - Full-Stack Developer Portfolio',
        type: 'image/jpeg',
      },
    ],
    locale: 'en_US',
    type: 'website',
    countryName: 'Sri Lanka',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Chamodya Hirusha - Full-Stack Developer ',
    description: 'Experienced Full-Stack Developer specializing in React, Node.js, React Native, and AI/ML technologies.',
    images: ['/chamodya-hirusha.jpg'],
    creator: '@hirushakarunathilaka.com',
    site: '@hirushakarunathilaka.com',
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
  category: 'technology',
  classification: 'Portfolio Website',
  referrer: 'origin-when-cross-origin',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: '/chamodya-hirusha.jpg?v=3', type: 'image/jpeg' },
      { url: '/chamodya-hirusha.jpg?v=3', sizes: '16x16', type: 'image/jpeg' },
      { url: '/chamodya-hirusha.jpg?v=3', sizes: '32x32', type: 'image/jpeg' },
    ],
    apple: [
      { url: '/chamodya-hirusha.jpg?v=3', sizes: '180x180', type: 'image/jpeg' },
    ],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <StructuredData type="Person" />
        <StructuredData type="WebSite" />
        <StructuredData type="WebPage" />
        <link rel="icon" href="/chamodya-hirusha.jpg?v=3" type="image/jpeg" />
        <link rel="apple-touch-icon" href="/chamodya-hirusha.jpg?v=3" type="image/jpeg" />
        <link rel="icon" type="image/jpeg" sizes="32x32" href="/chamodya-hirusha.jpg?v=3" />
        <link rel="icon" type="image/jpeg" sizes="16x16" href="/chamodya-hirusha.jpg?v=3" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#000000" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
      </head>
      <body className="font-sans">
        <PerformanceOptimizer />
        <SEOAnalytics />
        <Providers>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            {children}
          </TooltipProvider>
        </Providers>
      </body>
    </html>
  )
}
