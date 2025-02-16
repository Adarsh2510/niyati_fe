import { QuestionType } from "@/constants/questions";

export interface IApiResponse<T> {
    data: T;
    status: number;
}

export interface IGetNextQuestionParams {
    user_id: string;
    interview_id: string;
}

export interface IIntQuestions {
    question_name: string;
    question_text: string;
}
export interface IGetNextQuestionResponse {
    question_type: QuestionType;
    next_question: IIntQuestions | null;
    is_last_question: boolean;
    is_interview_completed: boolean;
}
export interface ISubmitAnswerRequest {
    user_id: string;
    interview_id: string;
    question_type: QuestionType;
    user_response: string;
    follow_up_question_id?: string; // Optional property
}
export interface ISubmitAnswerResponse {
    follow_up_question?: Record<string, IIntQuestions>;
}

export type TGetInterviewSummaryRequest = {
    interview_id: string;
    user_id: string;
}

export type TOverallFeedback = {
    summary: string;
    weak_points: string[];
    strong_points: string[];
}

export type TQuestionWiseFeedback = {
    question_id: string;
    question_name: string;
    section_id: string;
    section_name: string;
    feedback: string[];
    weak_points: string[];
    score: number;
}

export type TGetInterviewSummaryResponse = {
    overall_feedback: TOverallFeedback;
    total_score: number;
    section_wise_total_score: Record<string, number>;
    question_wise_feedback: TQuestionWiseFeedback[];
}
