import { Metadata } from 'next';
import {
  SITE_NAME,
  SITE_URL,
  DEFAULT_TITLE,
  DEFAULT_DESCRIPTION,
  COMMON_KEYWORDS,
  SEO_IMAGES,
  CARD_TYPES,
} from '@/constants/seo';

interface MetadataOptions {
  title?: string;
  description?: string;
  keywords?: string[];
  path?: string;
  noIndex?: boolean;
  ogImageUrl?: string;
  icons?: {
    icon?: string;
    shortcut?: string;
    apple?: string;
  };
}

/**
 * Generate consistent metadata for any page
 */
export function generateMetadata({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  keywords = COMMON_KEYWORDS,
  path = '/',
  noIndex = false,
  ogImageUrl = SEO_IMAGES.ogImage,
  icons = {
    icon: '/engineer.svg',
    shortcut: '/engineer.svg',
    apple: '/engineer.svg',
  },
}: MetadataOptions = {}): Metadata {
  const canonicalUrl = `${SITE_URL}${path}`;

  return {
    title,
    description,
    keywords,
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: path,
    },
    icons,
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: SITE_NAME,
      locale: 'en_US',
      type: 'website',
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${SITE_NAME} - ${title}`,
        },
      ],
    },
    twitter: {
      card: CARD_TYPES.summaryLargeImage,
      title,
      description,
    },
    robots: {
      index: !noIndex,
      follow: true,
    },
  };
}
