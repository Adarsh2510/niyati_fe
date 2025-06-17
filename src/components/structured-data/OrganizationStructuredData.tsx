import Script from 'next/script';
import { getOrganizationData } from '@/constants/structuredData';

export default function OrganizationStructuredData() {
  const structuredData = getOrganizationData();

  return (
    <Script
      id="organization-structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
