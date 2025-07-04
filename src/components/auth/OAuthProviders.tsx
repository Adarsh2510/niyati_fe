'use client';

import OAuthButton, { OAuthButtonProps } from '@/components/auth/OAuthButton';
import { SupportedOAuthProvider } from '@/lib/auth/OAuthProviders';

interface OAuthProvidersProps {
  callbackUrl: string;
  isSignUp?: boolean;
  providers?: SupportedOAuthProvider[];
  className?: string;
}

/**
 * A component to render multiple OAuth provider buttons
 */
export default function OAuthProviders({
  callbackUrl,
  isSignUp = false,
  providers = ['google'], // Default to Google only
  className = '',
}: OAuthProvidersProps) {
  return (
    <div className="space-y-3">
      {providers.map(provider => (
        <OAuthButton
          key={provider}
          provider={provider}
          callbackUrl={callbackUrl}
          isSignUp={isSignUp}
          className={className}
        />
      ))}
    </div>
  );
}
