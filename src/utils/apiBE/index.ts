import { getSession } from 'next-auth/react';
import { AuthHeader } from '@/types/auth';

export const getNiyatiBackendApiUrl = (endpoint: string, params?: { [_key: string]: string }) => {
  const url = new URL(endpoint, process.env.NEXT_PUBLIC_BE_ENDPOINT);
  if (params) {
    url.search = new URLSearchParams(params).toString();
  }
  return url.toString();
};

export const fetchWithAuth = async (
  url: string,
  options: RequestInit = {},
  isFormData: boolean = false
) => {
  const session = await getSession();

  const headers: Record<string, string> = {
    ...((options.headers as Record<string, string>) || {}),
  };

  // Only set Content-Type for JSON requests
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }

  if (session?.accessToken) {
    const authHeader: AuthHeader = {
      Authorization: `Bearer ${session.accessToken}`,
    };

    Object.assign(headers, authHeader);
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  return response;
};
