import GoogleProvider from 'next-auth/providers/google';
import type { OAuthConfig, OAuthUserConfig } from 'next-auth/providers/oauth';

// Export provider configuration functions to reuse across the app

/**
 * Configures Google OAuth provider for NextAuth
 */
export const getGoogleProvider = (config?: OAuthUserConfig<any>) => {
  return GoogleProvider({
    clientId: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    ...config,
  });
};

// Export a function that provides all configured OAuth providers
export const getOAuthProviders = () => {
  const providers: OAuthConfig<any>[] = [getGoogleProvider()];

  // Add more providers here as needed
  // Example:
  // if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  //   providers.push(getGithubProvider());
  // }

  return providers;
};

// Helper type for supported providers
export type SupportedOAuthProvider = 'google' | 'github' | 'facebook';
