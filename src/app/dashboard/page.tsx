import { Suspense } from 'react';
import { StartInterviewCard } from '@/components/dashboard/StartInterviewCard';
import { PerformanceCard } from '@/components/dashboard/PerformanceCard';
import { PastInterviewsCard } from '@/components/dashboard/PastInterviewsCard';
import Footer from '@/components/common/Footer';
import { SuggestedInterviews } from '@/components/InterviewSummary/SuggestedInterviews';
import { getPastInterviews } from '@/lib/api/getInterviewData';
import { GetPastInterviewsResponse } from '@/lib/api/types';

import dynamic from 'next/dynamic';
import {
  suggestedInterviewsData,
  roleInterviewData,
  companySpecificInterviews,
} from '@/constants/suggestionCardsData';

// Import ErrorBoundary with dynamic import to avoid SSR issues
const ErrorBoundary = dynamic(() => import('@/components/ErrorBoundary'), { ssr: false });

export default async function DashboardPage() {
  let pastInterviewsData: GetPastInterviewsResponse = { interviews: [] };
  let fetchError = false;

  try {
    pastInterviewsData = await getPastInterviews();
  } catch (error) {
    console.error('Failed to fetch past interviews:', error);
    fetchError = true;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StartInterviewCard />
          <ErrorBoundary>
            <Suspense
              fallback={
                <div className="p-6 bg-white rounded-lg shadow">Loading performance data...</div>
              }
            >
              <PerformanceCard interviews={pastInterviewsData.interviews} />
            </Suspense>
          </ErrorBoundary>
          <ErrorBoundary>
            <Suspense
              fallback={
                <div className="p-6 bg-white rounded-lg shadow">Loading past interviews...</div>
              }
            >
              <PastInterviewsCard interviews={pastInterviewsData.interviews} />
            </Suspense>
          </ErrorBoundary>
        </div>

        {fetchError && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800">
            Some data couldn&apos;t be loaded. Please refresh to try again.
          </div>
        )}

        <div className="space-y-8">
          <ErrorBoundary>
            <Suspense fallback={<div>Loading recommended interviews...</div>}>
              <SuggestedInterviews
                sectionTitle="Recommended for you"
                data={suggestedInterviewsData}
              />
            </Suspense>
          </ErrorBoundary>
        </div>
        <div className="space-y-8">
          <ErrorBoundary>
            <Suspense fallback={<div>Loading role-specific interviews...</div>}>
              <SuggestedInterviews
                sectionTitle="Try out Role Specific Interviews"
                data={roleInterviewData}
              />
            </Suspense>
          </ErrorBoundary>
        </div>
        <div className="space-y-8">
          <ErrorBoundary>
            <Suspense fallback={<div>Loading company-specific interviews...</div>}>
              <SuggestedInterviews
                sectionTitle="Challenge Yourself with Company Specific Interviews"
                data={companySpecificInterviews}
              />
            </Suspense>
          </ErrorBoundary>
        </div>
      </main>
      <Footer />
    </div>
  );
}
