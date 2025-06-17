import { Metadata } from 'next';
import { generateMetadata } from '@/lib/metadata';
import { PAGE_KEYWORDS } from '@/constants/seo';

export const metadata: Metadata = generateMetadata({
  title: 'Create Account | Niyati Prep',
  description:
    'Sign up for Niyati Prep to access AI-powered mock interviews, personalized feedback, and interview coaching to help you land your dream job.',
  keywords: PAGE_KEYWORDS.signup,
  path: '/signup',
});
