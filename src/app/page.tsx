import Hero from '@/components/Hero'
import About from '@/components/About'
import TechStack from '@/components/TechStack'
import Projects from '@/components/Projects'
import Contact from '@/components/Contact'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import SEO from '@/components/SEO'

export const metadata = {
  title: 'Chamodya Hirusha - Full-Stack Developer',
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
  openGraph: {
    title: 'Chamodya Hirusha - Full-Stack Developer ',
    description: 'Experienced Full-Stack Developer specializing in React, Node.js, React Native, and AI/ML technologies. Building scalable web and mobile applications.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Chamodya Hirusha - Full-Stack Developer Portfolio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Chamodya Hirusha - Full-Stack Developer ',
    description: 'Experienced Full-Stack Developer specializing in React, Node.js, React Native, and AI/ML technologies.',
    images: ['/og-image.jpg'],
  },
}

export default function Home() {
  return (
    <>
      <SEO 
        title="Chamodya Hirusha - Full-Stack Developer "
        description="Experienced Full-Stack Developer specializing in React, Node.js, React Native, and AI/ML technologies. Building scalable web and mobile applications with modern frameworks and cutting-edge solutions."
        keywords={[
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
        ]}
      />
      <main className="min-h-screen">
        <Navbar />
        <Hero />
        <About />
        <TechStack />
        <Projects />
        <Contact />
        <Footer />
      </main>
    </>
  )
}
