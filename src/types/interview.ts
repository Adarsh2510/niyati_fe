export enum MessageType {
  CONNECTION = 'CONNECTION',
  HEARTBEAT = 'HEARTBEAT',
  INTERVIEW_ACTION = 'USER_RESPONSE',
  INTERVIEW_CONTROL = 'SYSTEM_MESSAGE',
  ERROR = 'ERROR',
}

export enum CommandType {
  // Server Commands
  CONNECTION_ESTABLISHED = 'CONNECTION_ESTABLISHED',
  HEARTBEAT_RESPONSE = 'HEARTBEAT_RESPONSE',
  QUESTION_DATA = 'QUESTION_DATA',
  SOLUTION_SAVED = 'SOLUTION_SAVED',
  GET_PARTIAL_SOLUTION = 'GET_PARTIAL_SOLUTION',
  INTERRUPTION = 'INTERRUPTION',
  INTERVIEW_STARTED = 'INTERVIEW_STARTED',
  INTERVIEW_COMPLETED = 'INTERVIEW_COMPLETED',

  // Client Commands
  HEARTBEAT = 'HEARTBEAT',
  AUDIO_STREAM = 'AUDIO_STREAM',
  COMPLETE_SOLUTION = 'COMPLETE_SOLUTION',
  PARTIAL_SOLUTION = 'PARTIAL_SOLUTION',
  REQUEST_NEXT = 'REQUEST_NEXT',
}

export enum SolutionType {
  TEXT_ANSWER = 'TEXT_ANSWER',
  CODE_SOLUTION = 'CODE_SOLUTION',
  WHITEBOARD_IMAGE = 'WHITEBOARD_IMAGE',
  CODE_REPO_WITH_OUTPUT = 'CODE_REPO_WITH_OUTPUT',
}

export enum ErrorCode {
  INVALID_MESSAGE = 'INVALID_MESSAGE',
  INVALID_TOKEN = 'INVALID_TOKEN',
  SERVER_ERROR = 'SERVER_ERROR',
  INTERVIEW_NOT_FOUND = 'INTERVIEW_NOT_FOUND',
  INTERVIEW_COMPLETED = 'INTERVIEW_COMPLETED',
  NO_QUESTIONS = 'NO_QUESTIONS',
  INITIALIZATION_ERROR = 'INITIALIZATION_ERROR',
  NO_SESSION = 'NO_SESSION',
  AUDIO_PROCESSING_ERROR = 'AUDIO_PROCESSING_ERROR',
  SOLUTION_SAVE_ERROR = 'SOLUTION_SAVE_ERROR',
  PARTIAL_SOLUTION_ERROR = 'PARTIAL_SOLUTION_ERROR',
}

// Payloads
export interface UserResponsePayload {
  text_response?: string;
  code_response?: string;
  image_response?: string;
  audio_response?: string;
}

export interface AudioPayload {
  audio_chunks: string[]; // Base64 encoded audio chunks
  format: string; // Audio format information
  duration?: number; // Optional duration in seconds
}

export interface HeartbeatPayload {
  client_timestamp: number;
  server_timestamp?: number;
  latency?: number;
}

export interface ErrorPayload {
  code: ErrorCode;
  message: string;
  details?: unknown;
}

export interface ConnectionPayload {
  message: string;
  room_id: string;
  user_id: string;
}

export interface QuestionPayload {
  question: {
    question_name: string;
    question_text: string;
    question_test_cases: string[];
  };
  message: string;
  reason: string;
  question_type: 'INITIAL' | 'FOLLOW_UP';
  solution_type: SolutionType;
  is_last_question: boolean;
  is_interview_completed: boolean;
}

export interface SolutionSavedPayload {
  result: unknown;
  message: string;
  reason: string;
}

// Base message interface
export interface WebSocketMessage<T = unknown> {
  type: MessageType;
  command: CommandType;
  payload: T;
  timestamp?: number;
}

// Type-specific message interfaces
export interface UserResponseMessage extends WebSocketMessage<UserResponsePayload> {
  type: MessageType.INTERVIEW_ACTION;
  command: CommandType.COMPLETE_SOLUTION | CommandType.PARTIAL_SOLUTION;
}

export interface AudioMessage extends WebSocketMessage<AudioPayload> {
  type: MessageType.INTERVIEW_ACTION;
  command: CommandType.AUDIO_STREAM;
}

export interface HeartbeatMessage extends WebSocketMessage<HeartbeatPayload> {
  type: MessageType.HEARTBEAT;
  command: CommandType.HEARTBEAT | CommandType.HEARTBEAT_RESPONSE;
}

export interface ErrorMessage extends WebSocketMessage<ErrorPayload> {
  type: MessageType.ERROR;
}

export interface ConnectionMessage extends WebSocketMessage<ConnectionPayload> {
  type: MessageType.CONNECTION;
  command: CommandType.CONNECTION_ESTABLISHED;
}

export interface QuestionMessage extends WebSocketMessage<QuestionPayload> {
  type: MessageType.INTERVIEW_CONTROL;
  command: CommandType.QUESTION_DATA;
}

export interface SolutionSavedMessage extends WebSocketMessage<SolutionSavedPayload> {
  type: MessageType.INTERVIEW_CONTROL;
  command: CommandType.SOLUTION_SAVED;
}

// Legacy interfaces for backward compatibility
export interface IntQuestions {
  question_name: string;
  question_text: string;
  question_test_cases: string[];
  question_type: string;
  solution_type: SolutionType;
}

export interface InterviewRoomResponse {
  type: MessageType;
  command: CommandType;
  payload: QuestionPayload;
  timestamp: number;
}
