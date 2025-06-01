import Header from '@/components/common/Header';
import HeroSection from '@/components/landing/HeroSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import HowItWorksSection from '@/components/landing/HowItWorksSection';
import TestimonialsSection from '@/components/landing/TestimonialsSection';
import PricingSection from '@/components/landing/PricingSection';
import CTABanner from '@/components/landing/CTABanner';
import ExtendedFooter from '@/components/landing/ExtendedFooter';
import EngineerLogo from '@/assets/engineer.svg';

export default function LandingPage() {
  return (
    <>
      <Header
        logoSrc={EngineerLogo}
        logoAlt="Niyati Logo"
        brandName="Niyati Prep"
        navLinks={[
          { label: 'Features', href: '#features' },
          { label: 'How It Works', href: '#how-it-works' },
          { label: 'Pricing', href: '#pricing' },
          { label: 'Testimonials', href: '#testimonials' },
        ]}
        cta={{ label: 'Go to Dashboard', href: '/dashboard' }}
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
