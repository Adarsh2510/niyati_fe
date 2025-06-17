// Site-wide SEO constants
export const SITE_NAME = 'Niyati Prep';
export const SITE_URL = 'https://niyatiprep.com';
export const SITE_DESCRIPTION =
  'AI-powered mock interview platform for job seekers to practice and improve their interview skills';
export const DEFAULT_TITLE = 'Niyati Prep | AI-Powered Mock Interview Platform';
export const DEFAULT_DESCRIPTION =
  'Prepare for job interviews with AI-powered mock interviews, personalized feedback, and expert coaching. Improve your interview skills and land your dream job.';

// Social media handles
//TODO: Add social media handles later
export const SOCIAL_MEDIA = {
  twitter: 'https://twitter.com/niyatiprep',
  linkedin: 'https://www.linkedin.com/company/niyatiprep',
  facebook: 'https://www.facebook.com/profile.php?id=61574075484752',
  instagram: 'https://www.instagram.com/niyatiprep/',
};

// Contact information
export const CONTACT_INFO = {
  email: 'trivediadarsh2510@gmail.com',
  phone: '+91-7060760267',
};

// Image assets for SEO
export const SEO_IMAGES = {
  logo: `${SITE_URL}/engineer.svg`,
  ogImage: `${SITE_URL}/engineer.svg`, //TODO Replace this one proper assets are generated
};

// Common keywords
export const COMMON_KEYWORDS = [
  'mock interview',
  'interview preparation',
  'AI interview coach',
  'job interview practice',
  'interview skills',
  'technical interview',
  'behavioral interview',
  'free mock interview',
  'software engineer mock interview',
  'software engineer jobs',
];

// Page-specific keywords
export const PAGE_KEYWORDS = {
  home: [...COMMON_KEYWORDS],
  login: ['login', 'sign in', 'interview prep account', 'Niyati Prep login'],
  signup: [
    'signup',
    'create account',
    'register',
    'interview prep account',
    'mock interview signup',
  ],
  dashboard: [
    'interview dashboard',
    'mock interview dashboard',
    'interview preparation',
    'interview progress tracking',
  ],
};

// Social card types
export const CARD_TYPES = {
  summary: 'summary' as const,
  summaryLargeImage: 'summary_large_image' as const,
};
