import Header from '@/components/common/Header';
import HeroSection from '@/components/landing/HeroSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import HowItWorksSection from '@/components/landing/HowItWorksSection';
import TestimonialsSection from '@/components/landing/TestimonialsSection';
import PricingSection from '@/components/landing/PricingSection';
import CTABanner from '@/components/landing/CTABanner';
import ExtendedFooter from '@/components/landing/ExtendedFooter';
import { Metadata } from 'next';
import HomePageStructuredData from '@/components/structured-data/HomePageStructuredData';
import { generateMetadata } from '@/lib/metadata';
import { DEFAULT_TITLE, DEFAULT_DESCRIPTION, PAGE_KEYWORDS } from '@/constants/seo';

export const metadata: Metadata = generateMetadata({
  title: DEFAULT_TITLE,
  description: DEFAULT_DESCRIPTION,
  keywords: PAGE_KEYWORDS.home,
  path: '/',
});

export default function LandingPage() {
  return (
    <>
      <HomePageStructuredData />
      <Header
        logoSrc={'/engineer.svg'}
        logoAlt="Niyati Logo"
        brandName="Niyati Prep"
        navLinks={[
          { label: 'Features', href: '#features' },
          { label: 'How It Works', href: '#how-it-works' },
          { label: 'Pricing', href: '#pricing' },
          { label: 'Testimonials', href: '#testimonials' },
        ]}
        cta={{ label: 'Try for Free', href: '/signup' }}
      />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <PricingSection />
      <CTABanner />
      <ExtendedFooter />
    </>
  );
}
