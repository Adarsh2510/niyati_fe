import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { getNiyatiBackendApiUrl } from '@/utils/apiBE';
import { RegisterRequest, RegisterResponse, LoginRequest, LoginResponse } from '@/types/auth';
import { getOAuthProviders } from './auth/OAuthProviders';

// Extend the types
declare module 'next-auth' {
  interface Session {
    accessToken?: string;
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }

  interface User {
    id: string;
    name?: string;
    email?: string;
    accessToken: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken?: string;
    id?: string;
    provider?: string;
    provider_account_id?: string;
  }
}

// Registration function
export const registerUser = async (userData: RegisterRequest): Promise<RegisterResponse> => {
  try {
    const response = await fetch(getNiyatiBackendApiUrl('/api/v1/auth/register'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `Registration failed with status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

// OAuth authentication function
export const authenticateOAuth = async (oauthData: {
  provider: string;
  token: string;
  name: string;
  email: string;
  provider_account_id: string;
}): Promise<LoginResponse> => {
  try {
    const response = await fetch(getNiyatiBackendApiUrl('/api/v1/auth/oauth'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(oauthData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        errorData?.message || `OAuth authentication failed with status: ${response.status}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error('OAuth authentication error:', error);
    throw error;
  }
};

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const loginData: LoginRequest = {
            email: credentials.email,
            password: credentials.password,
          };

          // Replace this with your actual authentication endpoint
          const response = await fetch(getNiyatiBackendApiUrl('/api/v1/auth/login'), {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(loginData),
          });

          if (!response.ok) {
            return null;
          }

          const user: LoginResponse = await response.json();
          return user;
        } catch (error) {
          console.error('Authentication error:', error);
          return null;
        }
      },
    }),
    // Add OAuth providers from the centralized configuration
    ...getOAuthProviders(),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }

      // Store OAuth provider details in token
      if (account) {
        token.provider = account.provider;
        token.provider_account_id = account.providerAccountId;
      }

      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.accessToken = token.accessToken as string;
      }

      // Handle OAuth authentication for any provider
      if (token.provider && token.provider_account_id && !session.accessToken) {
        try {
          const response = await authenticateOAuth({
            provider: token.provider,
            token: token.sub as string,
            name: session.user.name || '',
            email: session.user.email || '',
            provider_account_id: token.provider_account_id as string,
          });

          session.accessToken = response.accessToken;
          session.user.id = response.id;
          session.user.name = response.name;
          session.user.email = response.email;
        } catch (error) {
          console.error(`Failed to exchange ${token.provider} OAuth token for backend JWT:`, error);
        }
      }

      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
};
