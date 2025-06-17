import { Metadata } from 'next';
import { generateMetadata } from '@/lib/metadata';
import { PAGE_KEYWORDS } from '@/constants/seo';

export const metadata: Metadata = generateMetadata({
  title: 'Sign In | Niyati Prep',
  description:
    'Sign in to your Niyati Prep account to access your personalized interview preparation dashboard and continue your interview practice.',
  keywords: PAGE_KEYWORDS.login,
  path: '/login',
});
