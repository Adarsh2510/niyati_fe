import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { trustedBy } from '@/constants/landingData';
import { FE_ASSETS } from '@/constants/imageAssets';
import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="w-full bg-gradient-to-br from-white to-blue-50">
      <div className="container mx-auto flex flex-col md:flex-row items-center gap-12 px-4">
        <div className="flex-1 md:max-w-xl max-w-sm py-12 md:py-20">
          <span className="text-blue-600 font-semibold uppercase tracking-wide mb-2 block">
            Land Your Dream Tech Job
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Crack Your Next Software Engineering Interview with AI
          </h1>
          <p className="mb-8 text-lg text-gray-700">
            Practice real coding, system design, and behavioral interviews with AI-powered mock
            interviews crafted from top industry experiences and a vast question bank. Get instant,
            personalized feedback and boost your confidence to land your dream job !
          </p>
          <div className="flex gap-4">
            <Link href="/demo">
              <Button size="lg" variant="gradient">
                Start Free Practice
              </Button>
            </Link>
            <Link href="#how-it-works">
              <Button size="lg" variant="outline">
                See How It Works
              </Button>
            </Link>
          </div>
          <div className="mt-8">
            <p className="text-xs text-gray-500 mb-2">Trusted by professionals from</p>
            <div className="flex gap-4 items-center">
              {trustedBy.map((item, idx) => (
                <div key={idx} className="w-[100px] h-[42px] flex items-center">
                  {item.logo && <item.logo />}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex-1 flex justify-center py-8">
          <div className="rounded-xl overflow-hidden shadow-lg bg-white">
            <Image
              src={FE_ASSETS.LANDING_PAGE.BANNER_IMAGE}
              alt="Interview practice"
              width={400}
              height={320}
              className="object-cover w-full h-full"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
