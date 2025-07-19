'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { AlertTriangle, ArrowLeft } from 'lucide-react';

interface ExitWarningModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmExit: (feedback?: { reason: string; details?: string }) => void;
}

const EXIT_REASONS = [
  { value: 'too-long', label: 'Interview too long' },
  { value: 'difficult-questions', label: 'Questions too difficult' },
  { value: 'interface-problems', label: 'Interface problems' },
  { value: 'personal-reason', label: 'Personal reason' },
  { value: 'irrelevant-questions', label: 'Irrelevant questions' },
  { value: 'other', label: 'Other reason' },
] as const;

type ExitReason = (typeof EXIT_REASONS)[number]['value'];

export default function ExitWarningModal({
  isOpen,
  onClose,
  onConfirmExit,
}: ExitWarningModalProps) {
  const [step, setStep] = useState<'warning' | 'feedback'>('warning');
  const [selectedReason, setSelectedReason] = useState<ExitReason | ''>('');
  const [feedbackDetails, setFeedbackDetails] = useState('');

  useEffect(() => {
    if (isOpen) {
      setStep('warning');
      setSelectedReason('');
      setFeedbackDetails('');
    }
  }, [isOpen]);

  const handleContinue = () => onClose();
  const handleExitAnyway = () => setStep('feedback');
  const handleBackToWarning = () => setStep('warning');

  const handleConfirmExit = () => {
    const feedback = selectedReason
      ? {
          reason: selectedReason,
          details: feedbackDetails.trim() || undefined,
        }
      : undefined;

    onConfirmExit(feedback);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        {step === 'warning' ? (
          <>
            <DialogHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-full">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <DialogTitle>Don&apos;t lose your progress!</DialogTitle>
              </div>
            </DialogHeader>

            <div className="space-y-4">
              <p className="text-gray-600 leading-relaxed">
                Are you sure you want to leave the interview? All your progress and answers will be
                lost.
              </p>

              <div className="flex gap-3">
                <Button onClick={handleContinue} className="flex-1 bg-blue-600 hover:bg-blue-700">
                  No, Continue Interview
                </Button>
                <Button
                  variant="outline"
                  onClick={handleExitAnyway}
                  className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
                >
                  Yes, Exit Anyway
                </Button>
              </div>
            </div>
          </>
        ) : (
          <>
            <DialogHeader>
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBackToWarning}
                  className="p-1 h-auto"
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                <DialogTitle>Help us improve</DialogTitle>
              </div>
            </DialogHeader>

            <div className="space-y-4">
              <p className="text-gray-600">
                We&apos;d love to know why you&apos;re leaving. This helps us make our interviews
                better.
              </p>

              <div className="space-y-3">
                <Label>What&apos;s the main reason for leaving?</Label>
                <RadioGroup
                  value={selectedReason}
                  onValueChange={value => setSelectedReason(value as ExitReason)}
                >
                  {EXIT_REASONS.map(reason => (
                    <div key={reason.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={reason.value} id={reason.value} />
                      <Label htmlFor={reason.value} className="text-sm cursor-pointer">
                        {reason.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {selectedReason && (
                <div className="space-y-2">
                  <Label>Any additional details? (optional)</Label>
                  <Textarea
                    placeholder="Tell us more about your experience..."
                    value={feedbackDetails}
                    onChange={e => setFeedbackDetails(e.target.value)}
                    className="min-h-[80px] resize-none"
                  />
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={handleConfirmExit}
                  className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
                >
                  Exit Interview
                </Button>
                <Button
                  onClick={handleBackToWarning}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  Back to Interview
                </Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
