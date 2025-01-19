import { getNiyatiBackendApiUrl } from "@/utils/apiBE";
import { EBackendEndpoints } from "@/constants/endpoints";
import { IApiResponse, IGetNextQuestionParams, IGetNextQuestionResponse, ISubmitAnswerRequest, ISubmitAnswerResponse } from "./types";
import { sendLog } from "@/utils/logs";
import { ELogLevels } from "@/constants/logs";

const fetchApiData = async <T>(url: string, method: string, body: any): Promise<IApiResponse<T>> => {
    try {
        const response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json'
            }
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

export const getNextQuestion = async (params: IGetNextQuestionParams): Promise<IGetNextQuestionResponse> => {
    const url = getNiyatiBackendApiUrl(EBackendEndpoints.GET_NEXT_QUESTION)    
    const body = {
        user_id: params.user_id,
        interview_id: params.interview_id
    }

    const response = await fetchApiData<IGetNextQuestionResponse>(url, 'POST', body);
    return response.data;
}

export const submitAnswer = async (params: ISubmitAnswerRequest): Promise<ISubmitAnswerResponse> => {
    const url = getNiyatiBackendApiUrl(EBackendEndpoints.SUBMIT_ANSWER)    
    const body = {
        user_id: params.user_id,
        interview_id: params.interview_id,
        question_type: params.question_type,
        user_response: params.user_response,
        follow_up_question_id: params.follow_up_question_id ?? null
    }
    const response = await fetchApiData<ISubmitAnswerResponse>(url, 'POST', body);
    return response.data;
}