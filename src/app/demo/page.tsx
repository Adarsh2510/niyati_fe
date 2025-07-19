'use client';

import { useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { getDemoUserDataForSignUp } from './utils';
import { registerUser } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { initialzeInterviewForm } from '@/components/InterviewSelectForm/util';

const DemoPage = () => {
  const { status, data: session } = useSession();
  const router = useRouter();

  const handleSignUp = async () => {
    try {
      const demoUserData = getDemoUserDataForSignUp();
      await registerUser(demoUserData);
      await signIn('credentials', {
        email: demoUserData.email,
        password: demoUserData.password,
        redirect: false,
      });
      toast.success('Demo sign up successful');
    } catch (error) {
      toast.error('Demo sign up failed, Try Reloading the page');
    }
  };

  useEffect(() => {
    if (status === 'unauthenticated') {
      handleSignUp();
    }
    if (status === 'authenticated' && session?.user?.id) {
      handleCreateDemoInterview();
    }
  }, [status, session, router]);

  const handleCreateDemoInterview = async () => {
    if (!session?.user?.id) return;

    try {
      localStorage.removeItem('interview-onboarding-completed');

      // Reuse the existing interview creation logic with demo parameters
      const data = await initialzeInterviewForm({
        user_id: session.user.id,
        role: 'FRONTEND',
        experience: 'JUNIOR',
        domain: 'SOFTWARE_ENGINEER',
        programmingLanguage: 'JS',
        targetCompany: 'AMAZON',
        interviewRound: 'TECHNICAL_ROUND_1',
      });

      if (!data.interview_id) {
        toast.error('Failed to create demo interview session');
        return;
      }

      router.push(`/dashboard/interview-room/${data.interview_id}`);
    } catch (error) {
      console.error('Demo interview initialization error:', error);
      toast.error('Failed to start demo interview. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-blue-50 flex items-center justify-center">
      <div className="text-center">
        <div
          className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"
          aria-label="Loading guest account setup"
        ></div>
        <h2 className="text-2xl font-semibold text-gray-700 mb-2">
          Setting up your guest account...
        </h2>
        <p className="text-gray-600 mb-2">
          Try a real Amazon SDE 1 mock interview instantly -no sign up needed.
        </p>
        <p className="text-gray-600 mb-2">
          For personalized roles, company sets, and progress tracking, create a free account
          anytime.
        </p>
        <p className="text-gray-500 text-sm mt-4">
          Guest accounts are temporary and deleted after some time.
        </p>
      </div>
    </div>
  );
};

export default DemoPage;
