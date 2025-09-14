import { Metadata } from 'next'
import { Navbar } from '@/components/navbar'
import { HeroSection } from '@/components/sections/hero-section'
import { FeaturesSection } from '@/components/sections/features-section'
import { StatsSection } from '@/components/sections/stats-section'
import { TestimonialsSection } from '@/components/sections/testimonials-section'
import { CTASection } from '@/components/sections/cta-section'
import { Footer } from '@/components/footer'

export const metadata: Metadata = {
  title: 'NeverDown - Reliable Uptime & Infrastructure Solutions',
  description: 'Ensure 99.9% uptime for your business with NeverDown\'s reliable infrastructure solutions. Trusted by thousands of companies worldwide.',
  keywords: ['uptime monitoring', 'infrastructure', 'reliability', 'server monitoring', 'website monitoring'],
  openGraph: {
    title: 'NeverDown - Reliable Uptime & Infrastructure Solutions',
    description: 'Ensure 99.9% uptime for your business with NeverDown\'s reliable infrastructure solutions.',
    url: 'https://neverdown.com',
    siteName: 'NeverDown',
    images: [{
      url: '/og-image.jpg',
      width: 1200,
      height: 630,
    }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NeverDown - Reliable Uptime & Infrastructure Solutions',
    description: 'Ensure 99.9% uptime for your business with NeverDown\'s reliable infrastructure solutions.',
    images: ['/twitter-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <StatsSection />
        <TestimonialsSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}
