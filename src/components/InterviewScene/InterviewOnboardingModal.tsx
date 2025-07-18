'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Play,
  Mic,
  Send,
  MessageSquare,
  X,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface InterviewOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  action?: string;
}

const onboardingSteps: OnboardingStep[] = [
  {
    id: 'start',
    title: 'Start Your Interview',
    description:
      'Click the green button to begin your interview session and receive your first question.',
    icon: <Play className="w-6 h-6" />,
    color: 'bg-green-500',
    action: 'Start / Resume Interview',
  },
  {
    id: 'microphone',
    title: 'Voice Your Answers',
    description:
      'Use the microphone to record your response. Please mute the mic before submitting your answer or asking a question.',
    icon: <Mic className="w-6 h-6" />,
    color: 'bg-blue-500',
  },
  {
    id: 'submit',
    title: 'Submit Complete Answer',
    description: "When you're ready, submit your complete answer to move to the next question.",
    icon: <Send className="w-6 h-6" />,
    color: 'bg-blue-500',
    action: 'Submit Answer',
  },
  {
    id: 'request',
    title: 'Ask for Help',
    description:
      'Need clarification, want to ask a follow-up question, repeat the question, or end the interview? Use this button to interact with the interviewer.',
    icon: <MessageSquare className="w-6 h-6" />,
    color: 'bg-purple-500',
    action: 'Request Interviewer',
  },
];

export default function InterviewOnboardingModal({
  isOpen,
  onClose,
  onComplete,
}: InterviewOnboardingModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setCurrentStep(0);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  if (!isVisible) return null;

  const currentStepData = onboardingSteps[currentStep];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 relative">
        {/* Close Button */}
        <button
          onClick={handleSkip}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Progress Indicator */}
        <div className="flex justify-center mb-6">
          <div className="flex space-x-2">
            {onboardingSteps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index <= currentStep ? 'bg-blue-500' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="text-center mb-6">
          <div className="relative">
            <div
              className={`w-16 h-16 ${currentStepData.color} rounded-full flex items-center justify-center mx-auto mb-4`}
            >
              <div className="text-white">{currentStepData.icon}</div>
            </div>

            {/* Navigation Chevrons */}
            <div className="absolute inset-0 flex items-center justify-between pointer-events-none">
              <button
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className={`w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center transition-all ${
                  currentStep === 0
                    ? 'opacity-30 cursor-not-allowed'
                    : 'opacity-90 hover:opacity-100 hover:scale-110'
                } pointer-events-auto`}
              >
                <ChevronLeft className="w-4 h-4 text-gray-600" />
              </button>

              <button
                onClick={handleNext}
                disabled={currentStep === onboardingSteps.length - 1}
                className={`w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center transition-all ${
                  currentStep === onboardingSteps.length - 1
                    ? 'opacity-30 cursor-not-allowed'
                    : 'opacity-90 hover:opacity-100 hover:scale-110'
                } pointer-events-auto`}
              >
                <ChevronRight className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>

          <h3 className="text-xl font-bold text-gray-900 mb-2">{currentStepData.title}</h3>

          <p className="text-gray-600 mb-4">{currentStepData.description}</p>

          {currentStepData.action && (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg text-sm font-medium text-gray-700">
              <span>Button:</span>
              <span className="font-semibold">{currentStepData.action}</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleSkip} className="flex-1">
            Skip Tutorial
          </Button>

          <Button onClick={handleNext} className="flex-1 bg-blue-600 hover:bg-blue-700">
            {currentStep === onboardingSteps.length - 1 ? (
              'Get Started'
            ) : (
              <>
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>

        {/* Step Counter */}
        <div className="text-center mt-4">
          <span className="text-sm text-gray-500">
            Step {currentStep + 1} of {onboardingSteps.length}
          </span>
        </div>
      </div>
    </div>
  );
}
