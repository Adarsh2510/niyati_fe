import { QuestionType } from '@/constants/questions';
import { ESolutionType } from '@/constants/interview';
export interface IApiResponse<T> {
  data: T;
  status: number;
  cached?: boolean;
}

export interface IGetNextQuestionParams {
  user_id: string;
  interview_id: string;
}

export interface IIntQuestions {
  question_name: string;
  question_text: string;
  question_test_cases?: string[];
}
export interface IGetNextQuestionResponse {
  question_type: QuestionType;
  next_question: IIntQuestions | null;
  is_last_question: boolean;
  is_interview_completed: boolean;
  solution_type: ESolutionType;
}

export interface IGetCurrentQuestionResponse
  extends Omit<IGetNextQuestionResponse, 'next_question'> {
  current_question: IIntQuestions | null;
}

export type TUserResponse = {
  audio_response?: string; // audio response which is now converted to text
  text_response?: string; // text response - from code/text editor
  image_response?: string; // image response from whiteboard - base64 data of image
  code_response?: string; // code response - from code editor
};
export interface ISubmitAnswerRequest {
  user_id: string;
  interview_id: string;
  question_type: QuestionType;
  user_response: TUserResponse;
  follow_up_question_id?: string; // Optional property
}
export interface ISubmitAnswerResponse {
  follow_up_question?: Record<string, IIntQuestions>;
}

export type TGetInterviewSummaryRequest = {
  interview_id: string;
  user_id: string;
};

export type TOverallFeedback = {
  summary: string;
  weak_points: string[];
  strong_points: string[];
};

export type TQuestionWiseFeedback = {
  question_id: string;
  question_name: string;
  section_id: string;
  section_name: string;
  feedback: string[];
  weak_points: string[];
  score: number;
};

export type TGetInterviewSummaryResponse = {
  overall_feedback: TOverallFeedback;
  total_score: number;
  section_wise_total_score: Record<string, number>;
  question_wise_feedback: TQuestionWiseFeedback[];
};

export type TInterviewRoomResponse = {
  interview_id: string;
};

export interface GetPastInterviewsResponse {
  interviews: Array<{
    interview_id: string;
    name: string;
    date: string;
    score: number;
  }>;
}
