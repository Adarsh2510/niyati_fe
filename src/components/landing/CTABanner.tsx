import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function CTABanner() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Ace Your Next Interview?</h2>
        <p className="mb-8 text-gray-700">
          Join thousands of professionals who have improved their interview skills with Niyati
        </p>
        <Link href="/login">
          <Button size="lg" variant="gradient">
            Start Free Practice
          </Button>
        </Link>
      </div>
    </section>
  );
}
