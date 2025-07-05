'use client';

import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'sonner';

interface ProtectedComponentProps {
  children: React.ReactNode;
}

export function ProtectedComponent({ children }: ProtectedComponentProps) {
  const { status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === 'unauthenticated') {
      toast.error('Please sign in to access this page');
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
  if (status === 'authenticated') {
    return <>{children}</>;
  }

  // Return empty div while redirecting
  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-lg">Redirecting to login...</p>
    </div>
  );
}
