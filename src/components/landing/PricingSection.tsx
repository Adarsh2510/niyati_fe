import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const plans = [
  {
    name: 'Basic',
    price: 'Free',
    features: [
      '2 mock interviews per month',
      'Basic AI feedback',
      'Standard questions library',
      'Email support',
    ],
    cta: 'Get Started',
    highlight: false,
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
    cta: 'Get Started',
    highlight: true,
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
    cta: 'Get Started',
    highlight: false,
  },
];

export default function PricingSection() {
  return (
    <section id="pricing" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">Choose Your Plan</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, idx) => (
            <Card
              key={idx}
              className={`p-6 flex flex-col items-center text-center border border-gray-100 shadow-sm ${plan.highlight ? 'ring-2 ring-blue-500' : ''}`}
            >
              {plan.highlight && (
                <div className="mb-2 text-xs font-semibold text-blue-600 uppercase">
                  Most Popular
                </div>
              )}
              <CardTitle className="mb-2 text-lg font-semibold">{plan.name}</CardTitle>
              <div className="mb-4 text-3xl font-bold">
                {plan.price}
                {plan.priceSuffix && (
                  <span className="text-base font-normal">{plan.priceSuffix}</span>
                )}
              </div>
              <ul className="mb-6 text-gray-600 text-sm space-y-2">
                {plan.features.map((feature, i) => (
                  <li key={i}>&#10003; {feature}</li>
                ))}
              </ul>
              <Button size="lg" variant={plan.highlight ? 'default' : 'outline'}>
                {plan.cta}
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
