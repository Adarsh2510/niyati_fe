import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { ScrollArea } from '@/components/ui/scroll-area';
import { GetPastInterviewsResponse } from '@/lib/api/types';
import Conditional from '../Conditional';
import { useMemo } from 'react';

interface PastInterviewsCardProps {
  interviews: GetPastInterviewsResponse['interviews'];
}

export function PastInterviewsCard({ interviews }: PastInterviewsCardProps) {
  const sortedInterviews = useMemo(() => {
    return interviews.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [interviews]);

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Past Interviews</h2>
      <ScrollArea className="h-[200px] w-full pr-4">
        <Conditional if={sortedInterviews.length === 0}>
          <div className="h-full flex items-center justify-center">
            <p className="text-gray-500 text-center mx-auto">
              Looks like you haven&apos;t given any interviews yet. Let&apos;s get started!
            </p>
          </div>
        </Conditional>
        <Conditional if={sortedInterviews.length > 0}>
          <div>
            {sortedInterviews.map(interview => (
              <Link
                key={interview.interview_id}
                href={`/dashboard/interview-room/${interview.interview_id}/summary`}
                className="block"
              >
                <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  <div>
                    <h3 className="font-medium">{interview.name}</h3>
                    <p className="text-sm text-gray-500">
                      {new Date(interview.date)
                        .toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                        })
                        .replace(' ', ', ')}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">{Math.round(interview.score * 10)}%</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </Conditional>
      </ScrollArea>
    </Card>
  );
}
