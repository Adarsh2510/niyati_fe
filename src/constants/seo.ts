// Site-wide SEO constants
export const SITE_NAME = 'Niyati Prep';
export const SITE_URL = 'https://niyatiprep.com';
export const SITE_DESCRIPTION =
  'Niyati Prep offers AI-powered mock interviews for software engineering roles. Practice coding, system design, and behavioral interviews with instant feedback, real questions, and detailed analytics. Trusted by engineers at top tech companies.';
export const DEFAULT_TITLE =
  'AI Mock Interviews for Software Engineers | Practice Coding, System Design & Behavioral Rounds';
export const DEFAULT_DESCRIPTION =
  'Niyati Prep offers AI-powered mock interviews for software engineering roles. Practice coding, system design, and behavioral interviews with instant feedback, real questions, and detailed analytics. Trusted by engineers at top tech companies.';

// Social media handles
//TODO: Add social media handles later
export const SOCIAL_MEDIA = {
  twitter: 'https://x.com/adarsh__trivedi',
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
  'AI mock interview for software engineers',
  'coding interview practice',
  'system design interview simulator',
  'behavioral interview AI',
  'software engineering job prep',
  'technical interview feedback',
  'practice interviews for Google, Amazon, Meta, Microsoft',
  'AI interview analytics',
  'realistic tech interview practice',
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
