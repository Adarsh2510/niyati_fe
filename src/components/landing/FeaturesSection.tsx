import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Zap, GraduationCap, BarChart3 } from 'lucide-react';

const features = [
  {
    icon: <Zap className="text-blue-600 w-8 h-8 mb-2" />,
    title: 'Smart AI Feedback',
    description:
      'Receive instant, actionable insights on your answers—highlighting strengths, weaknesses, and personalized improvement tips.',
  },
  {
    icon: <GraduationCap className="text-blue-600 w-8 h-8 mb-2" />,
    title: 'Real-World Interview Questions',
    description:
      'Practice with questions sourced from actual interviews across top companies and industries—stay ahead with what truly matters.',
  },
  {
    icon: <BarChart3 className="text-blue-600 w-8 h-8 mb-2" />,
    title: 'Insightful Performance Analytics',
    description:
      'Visualize your growth with detailed metrics and trends—track your readiness and optimize for success.',
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">Why Choose Niyati?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <Card key={idx} className="p-6 text-center border border-gray-100 shadow-sm">
              <CardContent className="flex flex-col items-center">
                {feature.icon}
                <CardTitle className="mb-2 text-lg font-semibold">{feature.title}</CardTitle>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
