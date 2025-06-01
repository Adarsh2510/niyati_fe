import { testimonials } from '@/constants/landingData';
import Image from 'next/image';
import { AnonymousUserIcon } from '@/assets/AnonymousUserIcon';
import { useMemo } from 'react';
import Conditional from '../Conditional';

// Pastel colors for background variety
const backgroundColors = [
  '#E9F5E1', // Light green
  '#F5E1E9', // Light pink
  '#E1E9F5', // Light blue
  '#F5F1E1', // Light yellow
  '#E1F5F1', // Light teal
  '#F1E1F5', // Light purple
];

export default function TestimonialsSection() {
  // Generate random but consistent colors for each testimonial
  const testimonialColors = useMemo(
    () =>
      testimonials.map(() => backgroundColors[Math.floor(Math.random() * backgroundColors.length)]),
    []
  );

  return (
    <section id="testimonials" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">What Our Users Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="bg-gray-50 rounded-xl p-6 shadow-sm flex flex-col items-start"
            >
              <div className="flex flex-row items-center justify-between gap-4">
                <Conditional if={!!t.avatar}>
                  <Image
                    src={t.avatar ?? ''}
                    alt={t.name}
                    width={48}
                    height={48}
                    className="rounded-full mb-3"
                  />
                </Conditional>
                <Conditional if={!t.avatar}>
                  <AnonymousUserIcon
                    width={60}
                    height={60}
                    className="mb-3"
                    backgroundColor={testimonialColors[idx]}
                    fillColor="#444444"
                  />
                </Conditional>
                <div>
                  <div className="font-semibold text-lg mb-1">{t.name}</div>
                  <div className="text-xs text-gray-500 mb-2">{t.title}</div>
                </div>
              </div>
              <div className="text-gray-700 text-sm mb-3">{t.text}</div>
              <div className="flex gap-1">
                {[...Array(t.rating)].map((_, i) => (
                  <span key={i} aria-label="star" className="text-yellow-400 text-lg">
                    ★
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
