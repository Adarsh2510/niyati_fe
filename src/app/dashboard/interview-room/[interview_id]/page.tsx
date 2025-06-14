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

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">Loading interview room...</div>
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
