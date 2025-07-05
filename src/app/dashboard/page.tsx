import { Suspense } from 'react';
import { StartInterviewCard } from '@/components/dashboard/StartInterviewCard';
import { PerformanceCard } from '@/components/dashboard/PerformanceCard';
import { PastInterviewsCard } from '@/components/dashboard/PastInterviewsCard';
import Footer from '@/components/common/Footer';
import {
  SuggestedInterviews,
  TInterviewSuggestionCard,
} from '@/components/InterviewSummary/SuggestedInterviews';
import { getPastInterviews } from '@/lib/api/getInterviewData';
import { GetPastInterviewsResponse } from '@/lib/api/types';
import {
  EDomain,
  EExperience,
  EInterviewRound,
  EProgrammingLanguage,
  ERole,
  ETargetCompany,
} from '@/constants/interview';
import dynamic from 'next/dynamic';

// Import ErrorBoundary with dynamic import to avoid SSR issues
const ErrorBoundary = dynamic(() => import('@/components/ErrorBoundary'), { ssr: false });

const companySpecificInterviews: TInterviewSuggestionCard[] = [
  {
    title: 'Google System Design',
    subTitle: 'Senior Software Engineer',
    textLogo: 'G',
    difficulty: 'Advanced',
    link: '/',
    role: ERole.FULLSTACK,
    targetCompany: ETargetCompany.GOOGLE,
    interviewRound: EInterviewRound.SYSTEM_DESIGN,
    experience: EExperience.SENIOR,
    domain: EDomain.SOFTWARE_ENGINEER,
    language: EProgrammingLanguage.JAVA,
  },
  {
    title: 'Meta Frontend',
    subTitle: 'Frontend Developer',
    textLogo: 'M',
    difficulty: 'Medium',
    link: '/',
    role: ERole.FRONTEND,
    targetCompany: ETargetCompany.FACEBOOK,
    interviewRound: EInterviewRound.TECHNICAL_ROUND_1,
    experience: EExperience.JUNIOR,
    domain: EDomain.SOFTWARE_ENGINEER,
    language: EProgrammingLanguage.JS,
  },
  {
    title: 'Amazon Behavioral',
    subTitle: 'Backend Developer',
    textLogo: 'A',
    difficulty: 'Medium',
    link: '/',
    role: ERole.BACKEND,
    targetCompany: ETargetCompany.AMAZON,
    interviewRound: EInterviewRound.BEHAVIORAL,
    experience: EExperience.SENIOR,
    domain: EDomain.SOFTWARE_ENGINEER,
    language: EProgrammingLanguage.JAVA,
  },
];

export const suggestedInterviewsData: TInterviewSuggestionCard[] = [
  {
    title: 'Frontend Developer Interview',
    subTitle: 'Netflix',
    difficulty: 'Intermediate',
    descriptors: [
      {
        title: '60 mins',
        iconName: 'Clock',
      },
    ],
    iconName: 'BarChart',
    link: '/',
    role: ERole.FRONTEND,
    targetCompany: ETargetCompany.NETFLIX,
    interviewRound: EInterviewRound.TECHNICAL_ROUND_1,
    language: EProgrammingLanguage.TYPESCRIPT,
    experience: EExperience.JUNIOR,
    domain: EDomain.SOFTWARE_ENGINEER,
  },
  {
    title: 'System Design Interview',
    subTitle: 'Microsoft',
    difficulty: 'Advanced',
    descriptors: [
      {
        title: '45 mins',
        iconName: 'Clock',
      },
    ],
    iconName: 'Layout',
    link: '/',
    role: ERole.FULLSTACK,
    targetCompany: ETargetCompany.MICROSOFT,
    interviewRound: EInterviewRound.SYSTEM_DESIGN,
    language: EProgrammingLanguage.CSHARP,
    experience: EExperience.SENIOR,
    domain: EDomain.SOFTWARE_ENGINEER,
  },
  {
    title: 'Technical Round 1 Apple',
    subTitle: 'Apple',
    difficulty: 'Advanced',
    descriptors: [
      {
        title: '90 mins',
        iconName: 'Clock',
      },
    ],
    iconName: 'TreePine',
    link: '/',
    role: ERole.FULLSTACK,
    targetCompany: ETargetCompany.APPLE,
    interviewRound: EInterviewRound.TECHNICAL_ROUND_1,
    language: EProgrammingLanguage.JS,
    experience: EExperience.LEAD,
    domain: EDomain.SOFTWARE_ENGINEER,
  },
  {
    title: 'Behavioral Interview',
    subTitle: 'Amazon',
    difficulty: 'Medium',
    descriptors: [
      {
        title: '60 mins',
        iconName: 'Clock',
      },
    ],
    iconName: 'TreePine',
    link: '/',
    role: ERole.BACKEND,
    targetCompany: ETargetCompany.AMAZON,
    interviewRound: EInterviewRound.BEHAVIORAL,
    language: EProgrammingLanguage.JAVA,
    experience: EExperience.SENIOR,
    domain: EDomain.SOFTWARE_ENGINEER,
  },
];

const roleInterviewData: TInterviewSuggestionCard[] = [
  {
    title: 'Frontend Developer',
    subTitle: 'Software Engineer',
    descriptors: [
      {
        title: '25 questions',
        iconName: 'Code',
      },
      {
        title: '2 hours',
        iconName: 'Clock',
      },
      {
        title: 'Medium',
        iconName: 'ChartArea',
      },
    ],
    iconName: 'Code',
    link: '/',
    role: ERole.FRONTEND,
    experience: EExperience.JUNIOR,
    domain: EDomain.SOFTWARE_ENGINEER,
    language: EProgrammingLanguage.TYPESCRIPT,
    targetCompany: ETargetCompany.GOOGLE,
  },
  {
    title: 'Backend Developer',
    subTitle: 'Software Engineer',
    descriptors: [
      {
        title: '30 questions',
        iconName: 'Code',
      },
      {
        title: '2.5 hours',
        iconName: 'Clock',
      },
      {
        title: 'Medium',
        iconName: 'ChartArea',
      },
    ],
    iconName: 'Code',
    link: '/',
    role: ERole.BACKEND,
    experience: EExperience.JUNIOR,
    domain: EDomain.SOFTWARE_ENGINEER,
    language: EProgrammingLanguage.PYTHON,
    targetCompany: ETargetCompany.MICROSOFT,
  },
  {
    title: 'Full Stack Developer',
    subTitle: 'Software Engineer',
    descriptors: [
      {
        title: '40 questions',
        iconName: 'Code',
      },
      {
        title: '3 hours',
        iconName: 'Clock',
      },
      {
        title: 'Advanced',
        iconName: 'ChartArea',
      },
    ],
    iconName: 'Code',
    link: '/',
    role: ERole.FULLSTACK,
    experience: EExperience.SENIOR,
    domain: EDomain.SOFTWARE_ENGINEER,
    language: EProgrammingLanguage.PYTHON,
    targetCompany: ETargetCompany.FACEBOOK,
  },
];

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
