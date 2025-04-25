export enum MessageType {
  CONNECTION = 'CONNECTION',
  HEARTBEAT = 'HEARTBEAT',
  USER_RESPONSE = 'USER_RESPONSE',
  SYSTEM_MESSAGE = 'SYSTEM_MESSAGE',
  ERROR = 'ERROR',
}

export enum CommandType {
  SPEAK = 'SPEAK',
  GET_ALL_SOLUTION_DATA = 'GET_ALL_SOLUTION_DATA',
  USER_RESPONSE = 'USER_RESPONSE',
  HEARTBEAT = 'HEARTBEAT',
}

export enum SolutionType {
  TEXT_ANSWER = 'TEXT_ANSWER',
  CODE_ANSWER = 'CODE_ANSWER',
  IMAGE_ANSWER = 'IMAGE_ANSWER',
  AUDIO_ANSWER = 'AUDIO_ANSWER',
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
  format?: string; // Audio format information
}

export interface HeartbeatPayload {
  client_timestamp: number;
}

export interface ErrorPayload {
  code: string;
  message: string;
  details?: unknown;
}

export interface SystemPayload {
  [key: string]: unknown;
}

export interface ConnectionPayload {
  status: string;
  message?: string;
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
  type: MessageType.USER_RESPONSE;
  command: CommandType.USER_RESPONSE;
}

export interface AudioMessage extends WebSocketMessage<AudioPayload> {
  type: MessageType.SYSTEM_MESSAGE;
  command: CommandType.SPEAK;
}

export interface HeartbeatMessage extends WebSocketMessage<HeartbeatPayload> {
  type: MessageType.HEARTBEAT;
  command: CommandType.HEARTBEAT;
}

export interface ErrorMessage extends WebSocketMessage<ErrorPayload> {
  type: MessageType.ERROR;
}

// Legacy interfaces for backward compatibility
export interface IntQuestions {
  id: string;
  question_text: string;
  question_type: string;
  solution_type: SolutionType;
}

export interface InterviewRoomResponse {
  type: MessageType;
  message: string;
  room_id?: string;
  user_id?: string;
  command: CommandType;
  question?: IntQuestions;
  is_interview_completed: boolean;
  solution_type?: SolutionType;
  payload?: unknown;
  timestamp?: number;
}
