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
} from './types';
import { sendLog } from '@/utils/logs';
import { ELogLevels } from '@/constants/logs';
import { getServerSession } from 'next-auth';
import { getSession } from 'next-auth/react';
import { authOptions } from '@/lib/auth';

const fetchApiData = async <T>(
  url: string,
  method: string,
  body: any
): Promise<IApiResponse<T>> => {
  try {
    // Try server-side session first, then fall back to client-side session
    let session;
    try {
      session = await getServerSession(authOptions);
    } catch (error) {
      // If getServerSession fails (client component), fall back to getSession
      session = await getSession();
    }
    const response = await fetch(url, {
      method: method || 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
        ...(session?.accessToken ? { Authorization: `Bearer ${session.accessToken}` } : {}),
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: T = await response.json();
    return { data, status: response.status };
  } catch (error) {
    sendLog({ err: error as Error, level: ELogLevels.Error });
    throw error;
  }
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
