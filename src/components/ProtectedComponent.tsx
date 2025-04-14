'use client';

import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';

interface ProtectedComponentProps {
  children: React.ReactNode;
}

export function ProtectedComponent({ children }: ProtectedComponentProps) {
  const { status, data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === 'unauthenticated') {
      // Redirect to login with the current path as callback URL
      router.push(`/login?callbackUrl=${encodeURIComponent(pathname)}`);
    }
  }, [status, router, pathname]);

  // Show loading state while checking authentication
  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  // Only render children if authenticated
  if (status === 'authenticated' && session) {
    return <>{children}</>;
  }

  // Return empty div while redirecting
  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-lg">Redirecting to login...</p>
    </div>
  );
}
