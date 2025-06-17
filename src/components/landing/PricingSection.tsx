import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckIcon } from 'lucide-react';
import Link from 'next/link';

const plans = [
  {
    name: 'Basic',
    price: 'Free',
    features: [
      'Free Pro plan access for first 1 month 🤑 (Limited time offer)',
      '2 mock interviews per month',
      'Basic AI feedback',
      'Standard questions library',
      'Email support',
    ],
    cta: 'Get Started',
    highlight: null,
  },
  {
    name: 'Pro',
    price: '$10',
    priceSuffix: '/month',
    features: [
      'Unlimited mock interviews',
      'Advanced AI feedback',
      'Industry-specific questions',
      'Performance analytics',
      'Priority support',
    ],
    cta: 'Coming soon',
    highlight: 'Most Popular',
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    features: [
      'Custom question library',
      'Team management',
      'API access',
      'Dedicated support',
      'Custom integrations',
    ],
    cta: 'Coming soon',
    highlight: null,
  },
];
export default function PricingSection() {
  return (
    <section id="pricing" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">Choose Your Plan</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, idx) => (
            <div key={idx} className="relative">
              {plan?.highlight && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-500 text-white px-6 py-1.5 rounded-full font-medium text-sm z-10">
                  {plan.highlight}
                </div>
              )}
              <Card
                className={`relative h-full p-6 flex flex-col border ${
                  plan.highlight
                    ? 'border-blue-500 rounded-xl shadow-md bg-gradient-to-br from-white to-blue-50'
                    : 'border-gray-200 shadow-sm'
                }`}
              >
                <CardTitle className="mb-2 text-xl font-bold">{plan.name}</CardTitle>
                <div className="mb-6 flex items-end">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  {plan.priceSuffix && (
                    <span className="text-base font-normal text-gray-500 ml-1">
                      {plan.priceSuffix}
                    </span>
                  )}
                </div>
                <ul className="mb-8 text-gray-600 space-y-2 flex-grow text-md">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <span className="text-blue-500 mr-2">
                        <CheckIcon size={20} strokeWidth={3} className="inline-block" />
                      </span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/dashboard" className="w-full">
                  <Button
                    size="lg"
                    className={`w-full ${
                      plan.highlight
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-white border border-gray-300 text-gray-800 hover:bg-gray-50'
                    }`}
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
