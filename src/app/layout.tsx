import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/components/AuthProvider';
import GoogleAnalytics from '@/components/analytics/GoogleAnalytics';
import ClarityAnalytics from '@/components/analytics/ClarityAnalytics';
import OrganizationStructuredData from '@/components/structured-data/OrganizationStructuredData';
import { generateMetadata } from '@/lib/metadata';
import { DEFAULT_TITLE, DEFAULT_DESCRIPTION } from '@/constants/seo';
import { Analytics } from '@vercel/analytics/react';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = generateMetadata({
  title: DEFAULT_TITLE,
  description: DEFAULT_DESCRIPTION,
  icons: {
    icon: '/engineer.svg',
    shortcut: '/engineer.svg',
    apple: '/engineer.svg',
  },
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
        <ClarityAnalytics />
        <GoogleAnalytics />
        <OrganizationStructuredData />
        <Analytics />
      </body>
    </html>
  );
}
