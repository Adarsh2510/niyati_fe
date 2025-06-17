import {
  SITE_NAME,
  SITE_URL,
  SITE_DESCRIPTION,
  SOCIAL_MEDIA,
  CONTACT_INFO,
  SEO_IMAGES,
} from './seo';

// Base organization structured data
export const getOrganizationData = () => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SITE_NAME,
  url: SITE_URL,
  logo: SEO_IMAGES.logo,
  description: SITE_DESCRIPTION,
  sameAs: [SOCIAL_MEDIA.twitter, SOCIAL_MEDIA.linkedin, SOCIAL_MEDIA.facebook],
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: CONTACT_INFO.phone,
    contactType: 'customer service',
    email: CONTACT_INFO.email,
    availableLanguage: ['English'],
  },
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'IN',
  },
});

// Website structured data
export const getWebsiteData = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE_NAME,
  url: SITE_URL,
  potentialAction: {
    '@type': 'SearchAction',
    target: `${SITE_URL}/search?q={search_term_string}`,
    'query-input': 'required name=search_term_string',
  },
  description: SITE_DESCRIPTION,
  publisher: {
    '@type': 'Organization',
    name: SITE_NAME,
    logo: {
      '@type': 'ImageObject',
      url: SEO_IMAGES.logo,
    },
  },
  offers: {
    '@type': 'AggregateOffer',
    priceCurrency: 'USD',
    lowPrice: '0',
    highPrice: '10',
    offerCount: '1',
  },
});
