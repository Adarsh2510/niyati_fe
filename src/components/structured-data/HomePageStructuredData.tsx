import Script from 'next/script';
import { getWebsiteData } from '@/constants/structuredData';

export default function HomePageStructuredData() {
  const structuredData = getWebsiteData();

  return (
    <Script
      id="homepage-structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
