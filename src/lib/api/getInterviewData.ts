import { getNiyatiBackendApiUrl } from '@/utils/apiBE';
import { EBackendEndpoints } from '@/constants/endpoints';
import {
  IApiResponse,
  IGetNextQuestionParams,
  IGetNextQuestionResponse,
  ISubmitAnswerRequest,
  ISubmitAnswerResponse,
  TGetInterviewSummaryResponse,
  TGetInterviewSummaryRequest,
  IGetCurrentQuestionResponse,
  GetPastInterviewsResponse,
} from './types';
import { sendLog } from '@/utils/logs';
import { ELogLevels } from '@/constants/logs';
import { getServerSession } from 'next-auth';
import { getSession } from 'next-auth/react';
import { authOptions } from '@/lib/auth';

// Simple in-memory cache for GET requests
const apiCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 60000; // 1 minute cache TTL

/**
 * Fetches data from API with authentication and caching
 */
const fetchApiData = async <T>(
  url: string,
  method: string,
  body?: any
): Promise<IApiResponse<T>> => {
  try {
    // Generate cache key for GET requests
    const cacheKey = method === 'GET' ? url : '';

    // Check cache for GET requests
    if (method === 'GET' && cacheKey) {
      const cachedResponse = apiCache.get(cacheKey);
      if (cachedResponse && Date.now() - cachedResponse.timestamp < CACHE_TTL) {
        return { data: cachedResponse.data, status: 200, cached: true };
      }
    }

    // Try server-side session first, then fall back to client-side session
    let session;
    try {
      session = await getServerSession(authOptions);
    } catch (error) {
      // If getServerSession fails (client component), fall back to getSession
      session = await getSession();
    }

    const requestOptions: RequestInit = {
      method: method || 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(session?.accessToken ? { Authorization: `Bearer ${session.accessToken}` } : {}),
      },
    };

    // Only add body for non-GET requests
    if (method !== 'GET' && body) {
      requestOptions.body = JSON.stringify(body);
    }

    // Simple retry logic for network errors
    let response: Response | undefined;
    let retries = 2;

    while (retries >= 0) {
      try {
        response = await fetch(url, requestOptions);
        break;
      } catch (error) {
        if (retries === 0) throw error;
        retries--;
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    // If we still don't have a response after retries, throw an error
    if (!response) {
      throw new Error('Failed to fetch data after retries');
    }

    if (!response.ok) {
      // Handle common error status codes
      if (response.status === 401) {
        throw new Error('Authentication failed');
      } else if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please try again later.');
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: T = await response.json();

    // Cache GET responses
    if (method === 'GET' && cacheKey) {
      apiCache.set(cacheKey, { data, timestamp: Date.now() });
    }

    return { data, status: response.status };
  } catch (error) {
    sendLog({ err: error as Error, level: ELogLevels.Error });
    throw error;
  }
};

// Clear cache when needed (e.g., on logout)
export const clearApiCache = () => {
  apiCache.clear();
};

export const getNextQuestion = async (
  params: IGetNextQuestionParams
): Promise<IGetNextQuestionResponse> => {
  const url = getNiyatiBackendApiUrl(EBackendEndpoints.GET_NEXT_QUESTION);
  const body = {
    user_id: params.user_id,
    interview_id: params.interview_id,
  };

  const response = await fetchApiData<IGetNextQuestionResponse>(url, 'POST', body);
  return response.data;
};

export const submitAnswer = async (
  params: ISubmitAnswerRequest
): Promise<ISubmitAnswerResponse> => {
  const url = getNiyatiBackendApiUrl(EBackendEndpoints.SUBMIT_ANSWER);
  const body = {
    user_id: params.user_id,
    interview_id: params.interview_id,
    question_type: params.question_type,
    user_response: params.user_response,
    follow_up_question_id: params.follow_up_question_id ?? null,
  };
  const response = await fetchApiData<ISubmitAnswerResponse>(url, 'POST', body);
  return response.data;
};

export const getInterviewSummary = async (
  params: TGetInterviewSummaryRequest
): Promise<TGetInterviewSummaryResponse> => {
  const { interview_id, user_id } = params;
  const url = getNiyatiBackendApiUrl(EBackendEndpoints.GET_INTERVIEW_SUMMARY);

  const body = {
    interview_id,
    user_id,
  };
  const response = await fetchApiData<TGetInterviewSummaryResponse>(url, 'POST', body);
  return response.data;
};

export const getCurrentQuestion = async (params: {
  user_id: string;
  interview_id: string;
}): Promise<IGetCurrentQuestionResponse> => {
  const { interview_id, user_id } = params;
  const url = getNiyatiBackendApiUrl(EBackendEndpoints.GET_CURRENT_QUESTION);

  const body = {
    interview_id,
    user_id,
  };
  const response = await fetchApiData<IGetCurrentQuestionResponse>(url, 'POST', body);
  return response.data;
};

export const getPastInterviews = async (): Promise<GetPastInterviewsResponse> => {
  const url = getNiyatiBackendApiUrl(EBackendEndpoints.GET_PAST_INTERVIEWS);
  const response = await fetchApiData<GetPastInterviewsResponse>(url, 'GET');
  return response.data;
};
