'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LucideIcon, BarChart, ChartArea, Clock, Layout, TreePine, Code } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import Conditional from '@/components/Conditional';
import { useState } from 'react';
import { Dialog } from '@/components/common/Dialog';
import StartInterviewForm from '@/components/InterviewSelectForm';

export type TDescriptor = {
  title: string;
  iconName: string;
};

export type TInterviewSuggestionCard = {
  title: string;
  subTitle: string;
  difficulty?: string;
  descriptors?: TDescriptor[];
  iconName?: string;
  textLogo?: string;
  link: string;
  // Optional pre-filled form values
  role?: string;
  experience?: string;
  domain?: string;
  language?: string;
  targetCompany?: string;
  interviewRound?: string;
};

export type TInterviewSuggestionCardProps = {
  data: TInterviewSuggestionCard[];
  sectionTitle: string;
};

const DifficultyBadge = ({ difficulty }: { difficulty?: string }) => {
  if (!difficulty) return null;

  const colors = {
    Easy: 'bg-green-100 text-green-700',
    Medium: 'bg-yellow-100 text-yellow-700',
    Intermediate: 'bg-blue-100 text-blue-700',
    Hard: 'bg-red-100 text-red-700',
    Advanced: 'bg-purple-100 text-purple-700',
  };

  return (
    <div
      className={`inline-block px-2 py-1 rounded-full text-sm ${
        colors[difficulty as keyof typeof colors]
      }`}
    >
      {difficulty}
    </div>
  );
};

// Helper function to render the correct icon based on name
const IconComponent = ({ iconName }: { iconName?: string }) => {
  switch (iconName) {
    case 'BarChart':
      return <BarChart className="w-6 h-6 text-blue-600" />;
    case 'Layout':
      return <Layout className="w-6 h-6 text-blue-600" />;
    case 'TreePine':
      return <TreePine className="w-6 h-6 text-blue-600" />;
    case 'Code':
      return <Code className="w-6 h-6 text-blue-600" />;
    case 'Clock':
      return <Clock className="w-4 h-4 mr-1" />;
    case 'ChartArea':
      return <ChartArea className="w-4 h-4 mr-1" />;
    default:
      return null;
  }
};

export function SuggestedInterviews({ data, sectionTitle }: TInterviewSuggestionCardProps) {
  const [showDialog, setShowDialog] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState<TInterviewSuggestionCard | null>(null);

  const handleStartPractice = (interview: TInterviewSuggestionCard) => {
    setSelectedInterview(interview);
    setShowDialog(true);
  };

  return (
    <>
      <div className="flex flex-col space-y-6 mt-8">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">{sectionTitle}</h2>
        </div>

        <Carousel
          opts={{
            align: 'start',
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {Object.values(data)?.map((interview, index) => (
              <CarouselItem key={index} className="pl-4 basis-full md:basis-1/3">
                <Card className="p-6">
                  <div className="flex flex-col space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="bg-blue-100 p-3 rounded-lg">
                        {interview.iconName && <IconComponent iconName={interview.iconName} />}
                        <Conditional if={!interview.iconName && !!interview.textLogo}>
                          {interview.textLogo}
                        </Conditional>
                      </div>
                      <div>
                        <h3 className="font-medium text-base">{interview.title}</h3>
                        <p className="text-sm text-gray-500">{interview.subTitle}</p>
                      </div>
                    </div>

                    <div className="flex flex-col items-start gap-2">
                      <Conditional if={!!interview.difficulty}>
                        <DifficultyBadge difficulty={interview.difficulty} />
                      </Conditional>
                      <Conditional if={!!interview?.descriptors}>
                        {Object.values(interview?.descriptors || {}).map(descriptor => (
                          <div
                            key={descriptor.title}
                            className="flex items-center text-sm text-gray-600"
                          >
                            <IconComponent iconName={descriptor.iconName} />
                            {descriptor.title}
                          </div>
                        ))}
                      </Conditional>
                    </div>

                    <Button
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      onClick={() => handleStartPractice(interview)}
                    >
                      Start Practice
                    </Button>
                  </div>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          {data.length > 3 && (
            <>
              <CarouselPrevious className="hidden md:flex" />
              <CarouselNext className="hidden md:flex" />
            </>
          )}
        </Carousel>
      </div>

      <Dialog
        heading="Start Interview"
        showDialog={showDialog}
        onClose={() => {
          setShowDialog(false);
          setSelectedInterview(null);
        }}
      >
        <StartInterviewForm
          role={selectedInterview?.role}
          experience={selectedInterview?.experience}
          domain={selectedInterview?.domain}
          language={selectedInterview?.language}
          targetCompany={selectedInterview?.targetCompany}
          interviewRound={selectedInterview?.interviewRound}
        />
      </Dialog>
    </>
  );
}
