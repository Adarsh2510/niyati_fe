const steps = [
  {
    title: 'Choose Your Focus',
    description: 'Select your role, domain and the type of interview you want to practice',
  },
  {
    title: 'Practice Interview',
    description: 'Engage in a realistic interview with our AI interviewer',
  },
  {
    title: 'Get Feedback',
    description: 'Receive detailed feedback and actionable improvements',
  },
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {steps.map((step, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <div className="text-blue-600 text-3xl font-bold mb-2">
                {String(idx + 1).padStart(2, '0')}
              </div>
              <div className="text-lg font-semibold mb-2">{step.title}</div>
              <div className="text-gray-600 text-sm">{step.description}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
