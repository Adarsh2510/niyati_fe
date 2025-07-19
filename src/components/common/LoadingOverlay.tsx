'use client';

import { ReactNode } from 'react';

interface LoadingOverlayProps {
  isVisible: boolean;
  title?: string;
  subtitle?: string;
  children?: ReactNode;
  className?: string;
}

export default function LoadingOverlay({
  isVisible,
  title = 'Processing...',
  subtitle = 'Please wait while we process your request...',
  children,
  className = '',
}: LoadingOverlayProps) {
  if (!isVisible) return null;

  return (
    <div className={`fixed inset-0 bg-black/50 flex items-center justify-center z-50 ${className}`}>
      <div className="bg-white rounded-xl p-8 shadow-2xl text-center max-w-sm mx-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-4">{subtitle}</p>
        {children && <div className="mt-4">{children}</div>}
      </div>
    </div>
  );
}
