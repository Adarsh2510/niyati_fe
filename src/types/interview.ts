export enum Command {
  SPEAK = 'SPEAK',
  GET_ALL_SOLUTION_DATA = 'GET_ALL_SOLUTION_DATA',
  USER_RESPONSE = 'USER_RESPONSE',
}

export enum IntWSSMessageType {
  CONNECTION = 'CONNECTION',
  USER_RESPONSE = 'USER_RESPONSE',
  SYSTEM_MESSAGE = 'SYSTEM_MESSAGE',
}

export enum SolutionType {
  TEXT_ANSWER = 'TEXT_ANSWER',
  CODE_ANSWER = 'CODE_ANSWER',
  IMAGE_ANSWER = 'IMAGE_ANSWER',
  AUDIO_ANSWER = 'AUDIO_ANSWER',
}

export interface UserResponse {
  text_response?: string;
  code_response?: string;
  image_response?: string;
  audio_response?: string;
}

export interface IntQuestions {
  id: string;
  question_text: string;
  question_type: string;
  solution_type: SolutionType;
}

export interface InterviewRoomMessage {
  command: Command;
  user_response: UserResponse;
  audio_chunks?: Uint8Array[]; // Raw PCM audio data sent in chunks from the client
}

export interface InterviewRoomResponse {
  type: IntWSSMessageType;
  message: string;
  room_id?: string;
  user_id?: string;
  command: Command;
  question?: IntQuestions;
  is_interview_completed: boolean;
  solution_type?: SolutionType;
}
