'use client';

import { ProtectedComponent } from '@/components/ProtectedComponent';
import DashboardHeader from '@/components/common/DashboardHeader';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedComponent>
      <div className="flex min-h-screen flex-col">
        <DashboardHeader />
        <main className="flex-1">{children}</main>
      </div>
    </ProtectedComponent>
  );
}
