'use client';
import 'regenerator-runtime/runtime';

import { useState, useEffect } from 'react';
import { redirect } from 'next/navigation';
import Footer from '@/components/common/Footer';
import dynamic from 'next/dynamic';

const QuestionSection = dynamic(() => import('@/components/InterviewScene/QuestionSection'), {
  ssr: false,
});

const InterviewControllers = dynamic(
  () => import('@/components/InterviewScene/InterviewControllers'),
  { ssr: false }
);

export default function InterviewRoom({ params }: { params: { interview_id: string } }) {
  const { interview_id } = params;
  const [isMounted, setIsMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Check if device is mobile
    const userAgent = window.navigator.userAgent;
    const mobileCheck =
      /Mobile|Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    const isSmallScreen = window.innerWidth < 768;
    setIsMobile(mobileCheck || isSmallScreen);
  }, []);

  if (!isMounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">Loading interview room...</div>
    );
  }

  if (isMobile) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold mb-4">Best experienced on larger screens</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Our interview room is currently optimized for desktop and tablet devices. Please access
            from a larger screen for the best experience.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            Minimum recommended screen width: 768px
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen grid grid-rows-[auto_1fr_auto_auto]">
      <QuestionSection />
      <InterviewControllers
        handleNextQuestion={() => {}}
        handleUserResponse={() => {}}
        className="p-2 bg-gray-100 border-t"
        interviewId={interview_id}
      />
      <Footer />
    </div>
  );
}
