import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRightIcon } from 'lucide-react';

export default function ProBanner() {
  return (
    <section className="relative overflow-hidden rounded-3xl h-[300px] flex items-center">
      <Image src="/probanner.png" alt="Pro Banner Background" fill className="object-cover z-0" />
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-2xl">
          <h2 className="text-white text-4xl font-bold mb-4 leading-tight">
            Get 1-Month Pro Access Free!
          </h2>
          <p className="text-white text-2xl mb-6 max-w-xl">
            Practice interviews with real-time AI feedback and unlock premium features – for free!
          </p>
          <Link href="/demo">
            <Button className="bg-blue-500 hover:bg-blue-800 text-white text-xl px-12 py-6 rounded-full font-semibold shadow-lg">
              Let&apos;s Get Started <ArrowRightIcon className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
