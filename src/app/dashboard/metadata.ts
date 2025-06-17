import { Metadata } from 'next';
import { generateMetadata } from '@/lib/metadata';
import { PAGE_KEYWORDS } from '@/constants/seo';

export const metadata: Metadata = generateMetadata({
  title: 'Dashboard | Niyati Prep',
  description:
    'Access your personalized interview preparation dashboard. Schedule mock interviews, review feedback, and track your progress.',
  keywords: PAGE_KEYWORDS.dashboard,
  path: '/dashboard',
  noIndex: true,
});
