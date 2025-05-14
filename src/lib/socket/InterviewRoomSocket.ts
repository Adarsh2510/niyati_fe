import { sendLog } from '@/utils/logs';
import { ELogLevels } from '@/constants/logs';
import {
  MessageType,
  CommandType,
  WebSocketMessage,
  UserResponsePayload,
  AudioPayload,
  HeartbeatPayload,
  ErrorPayload,
  ConnectionPayload,
  QuestionPayload,
  SolutionSavedPayload,
  InterviewRoomResponse,
  SolutionType,
} from '@/types/interview';

interface WebSocketCallbacks {
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: unknown) => void;
  onResponse?: (response: InterviewRoomResponse) => void;
}

interface ConnectionConfig {
  maxReconnectAttempts: number;
  reconnectDelay: number;
  heartbeatDelay: number;
  audioThrottleInterval: number;
  maxAudioBufferSize: number;
}

const DEFAULT_CONFIG: ConnectionConfig = {
  maxReconnectAttempts: 5,
  reconnectDelay: 1000,
  heartbeatDelay: 30000,
  audioThrottleInterval: 5000,
  maxAudioBufferSize: 50,
};

const isBrowser = typeof window !== 'undefined';

export class InterviewRoomSocket {
  private static instances: Map<string, InterviewRoomSocket> = new Map();
  private ws: WebSocket | null = null;
  private roomId: string;
  private token: string;
  private config: ConnectionConfig;
  private callbacks: WebSocketCallbacks = {};
  private reconnectAttempts = 0;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private audioThrottleInterval: NodeJS.Timeout | null = null;
  private audioBuffer: Uint8Array[] = [];
  private isRecording = false;
  private audioContext: AudioContext | null = null;
  private audioSource: MediaStreamAudioSourceNode | null = null;
  private audioProcessor: ScriptProcessorNode | null = null;
  private audioStream: MediaStream | null = null;
  private audioChunks: Uint8Array[] = [];
  private audioStartTime: number | null = null;
  private audioDuration = 0;
  private audioFormat = 'audio/webm';
  private isConnecting = false;
  private connectionTimeout: NodeJS.Timeout | null = null;

  private constructor(roomId: string, token: string, config: Partial<ConnectionConfig> = {}) {
    this.roomId = roomId;
    this.token = token;
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  public static getInstance(
    roomId: string,
    token: string,
    config?: Partial<ConnectionConfig>
  ): InterviewRoomSocket {
    if (!this.instances.has(roomId)) {
      this.instances.set(roomId, new InterviewRoomSocket(roomId, token, config));
    }
    return this.instances.get(roomId)!;
  }

  public connect(): void {
    if (!isBrowser || this.ws?.readyState === WebSocket.OPEN || this.isConnecting) return;

    this.isConnecting = true;
    this.setupConnectionTimeout();
    this.initializeWebSocket();
  }

  private setupConnectionTimeout(): void {
    this.connectionTimeout = setTimeout(() => {
      if (this.isConnecting) {
        this.isConnecting = false;
        this.ws?.close();
        this.callbacks.onError?.(new Error('Connection timeout'));
      }
    }, 10000);
  }

  private initializeWebSocket(): void {
    const wsBaseUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000';
    const wsUrl = `${wsBaseUrl}/ws/interview-room/${this.roomId}?token=${this.token}`;

    sendLog({
      level: ELogLevels.Info,
      message: `Connecting to WebSocket: ${wsUrl}`,
    });

    this.ws = new WebSocket(wsUrl);
    this.setupWebSocketHandlers();
  }

  private setupWebSocketHandlers(): void {
    if (!this.ws) return;

    this.ws.onopen = this.handleWebSocketOpen.bind(this);
    this.ws.onclose = this.handleWebSocketClose.bind(this);
    this.ws.onerror = this.handleWebSocketError.bind(this);
    this.ws.onmessage = this.handleWebSocketMessage.bind(this);
  }

  private handleWebSocketOpen(): void {
    this.clearConnectionTimeout();
    this.isConnecting = false;
    this.reconnectAttempts = 0;
    this.startHeartbeat();
    this.startAudioThrottle();
    this.callbacks.onConnect?.();
  }

  private handleWebSocketClose(event: CloseEvent): void {
    this.clearConnectionTimeout();
    this.isConnecting = false;
    this.stopHeartbeat();
    this.stopAudioThrottle();

    if (event.code === 1008) {
      this.callbacks.onError?.(new Error('Authentication failed'));
      return;
    }

    this.callbacks.onDisconnect?.();
    this.handleReconnect();
  }

  private handleWebSocketError(error: Event): void {
    this.clearConnectionTimeout();
    this.isConnecting = false;
    sendLog({
      level: ELogLevels.Error,
      message: 'WebSocket connection error',
      err: new Error('WebSocket connection failed'),
    });
    this.callbacks.onError?.(new Error('WebSocket connection failed'));
  }

  private handleWebSocketMessage(event: MessageEvent): void {
    try {
      const message = JSON.parse(event.data) as WebSocketMessage;
      this.handleMessage(message);
    } catch (error) {
      this.callbacks.onError?.(error);
    }
  }

  private clearConnectionTimeout(): void {
    if (this.connectionTimeout) {
      clearTimeout(this.connectionTimeout);
      this.connectionTimeout = null;
    }
  }

  private handleReconnect(): void {
    if (this.reconnectAttempts >= this.config.maxReconnectAttempts) {
      this.callbacks.onError?.(new Error('Max reconnection attempts reached'));
      return;
    }

    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
    this.reconnectTimeout = setTimeout(() => {
      this.reconnectAttempts++;
      this.connect();
    }, delay);
  }

  private startHeartbeat(): void {
    this.heartbeatInterval = setInterval(() => {
      const heartbeatMessage: WebSocketMessage<HeartbeatPayload> = {
        type: MessageType.HEARTBEAT,
        command: CommandType.HEARTBEAT,
        payload: {
          client_timestamp: Date.now(),
        },
        timestamp: Date.now(),
      };

      this.ws?.send(JSON.stringify(heartbeatMessage));
      sendLog({
        level: ELogLevels.Info,
        message: 'Sent heartbeat message',
      });
    }, this.config.heartbeatDelay);
  }

  private stopHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  private startAudioThrottle(): void {
    this.audioThrottleInterval = setInterval(() => {
      this.flushAudioBuffer();
    }, this.config.audioThrottleInterval);
  }

  private stopAudioThrottle(): void {
    if (this.audioThrottleInterval) {
      clearInterval(this.audioThrottleInterval);
      this.audioThrottleInterval = null;
    }
    this.flushAudioBuffer();
  }

  private flushAudioBuffer(): void {
    if (this.audioBuffer.length === 0 || this.ws?.readyState !== WebSocket.OPEN) return;

    const base64Chunks = this.audioBuffer.map(chunk => {
      const binary = Array.from(chunk)
        .map(byte => String.fromCharCode(byte))
        .join('');
      return btoa(binary);
    });

    const message: WebSocketMessage<AudioPayload> = {
      type: MessageType.INTERVIEW_ACTION,
      command: CommandType.AUDIO_STREAM,
      payload: {
        audio_chunks: base64Chunks,
        format: this.audioFormat,
      },
      timestamp: Date.now(),
    };

    this.ws?.send(JSON.stringify(message));
    sendLog({
      level: ELogLevels.Info,
      message: `Sent ${base64Chunks.length} audio chunks`,
    });

    this.audioBuffer = [];
  }

  private handleMessage(message: WebSocketMessage): void {
    switch (message.type) {
      case MessageType.CONNECTION:
        this.handleConnectionMessage(message as WebSocketMessage<ConnectionPayload>);
        break;
      case MessageType.HEARTBEAT:
        this.handleHeartbeatMessage(message as WebSocketMessage<HeartbeatPayload>);
        break;
      case MessageType.INTERVIEW_CONTROL:
        this.handleInterviewControlMessage(message);
        break;
      case MessageType.ERROR:
        this.handleErrorMessage(message as WebSocketMessage<ErrorPayload>);
        break;
      default:
        sendLog({
          level: ELogLevels.Warning,
          message: `Unknown message type: ${message.type}`,
        });
    }
  }

  private handleConnectionMessage(message: WebSocketMessage<ConnectionPayload>): void {
    sendLog({
      level: ELogLevels.Info,
      message: `Connection established: ${message.payload.message}`,
    });
  }

  private handleHeartbeatMessage(message: WebSocketMessage<HeartbeatPayload>): void {
    if (message.command === CommandType.HEARTBEAT_RESPONSE) {
      const latency = Date.now() - message.payload.client_timestamp;
      sendLog({
        level: ELogLevels.Info,
        message: `Heartbeat response received. Latency: ${latency}ms`,
      });
    }
  }

  private handleInterviewControlMessage(message: WebSocketMessage): void {
    switch (message.command) {
      case CommandType.QUESTION_DATA:
        this.handleQuestionData(message as WebSocketMessage<QuestionPayload>);
        break;
      case CommandType.GET_PARTIAL_SOLUTION:
        this.handleGetPartialSolution();
        break;
      case CommandType.INTERRUPTION:
        this.handleInterruption(message.payload);
        break;
      case CommandType.SOLUTION_SAVED:
        this.handleSolutionSaved(message as WebSocketMessage<SolutionSavedPayload>);
        break;
      case CommandType.INTERVIEW_COMPLETED:
        this.handleInterviewCompleted(message.payload);
        break;
      default:
        sendLog({
          level: ELogLevels.Warning,
          message: `Unknown interview control command: ${message.command}`,
        });
    }
  }

  private handleQuestionData(message: WebSocketMessage<QuestionPayload>): void {
    sendLog({
      level: ELogLevels.Info,
      message: `Received question data: ${message.payload.question.question_text}`,
    });
    this.callbacks.onResponse?.({
      type: MessageType.INTERVIEW_CONTROL,
      command: CommandType.QUESTION_DATA,
      payload: {
        question: {
          question_name: message.payload.question.question_name,
          question_text: message.payload.question.question_text,
          question_test_cases: message.payload.question.question_test_cases,
        },
        question_type: message.payload.question_type,
        solution_type: message.payload.solution_type,
        is_last_question: message.payload.is_last_question,
        is_interview_completed: false,
        message: message.payload.message,
        reason: message.payload.reason,
      },
      timestamp: Date.now(),
    });
  }

  private handleGetPartialSolution(): void {
    const currentSolution: UserResponsePayload = {
      text_response: this.getCurrentTextResponse(),
      code_response: this.getCurrentCodeResponse(),
      image_response: this.getCurrentImageResponse(),
      audio_response: this.getCurrentAudioResponse(),
    };

    const message: WebSocketMessage<UserResponsePayload> = {
      type: MessageType.INTERVIEW_ACTION,
      command: CommandType.PARTIAL_SOLUTION,
      payload: currentSolution,
      timestamp: Date.now(),
    };

    this.ws?.send(JSON.stringify(message));
    sendLog({
      level: ELogLevels.Info,
      message: 'Sent partial solution',
    });
  }

  private handleInterruption(payload: unknown): void {
    sendLog({
      level: ELogLevels.Info,
      message: `Received interruption: ${JSON.stringify(payload)}`,
    });
  }

  private handleSolutionSaved(message: WebSocketMessage<SolutionSavedPayload>): void {
    sendLog({
      level: ELogLevels.Info,
      message: `Solution saved: ${message.payload.message}`,
    });
  }

  private handleInterviewCompleted(payload: unknown): void {
    sendLog({
      level: ELogLevels.Info,
      message: `Interview completed: ${JSON.stringify(payload)}`,
    });

    // Close the WebSocket connection
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }

    // Clean up all resources
    this.cleanup();

    // Notify the callback with completion status
    this.callbacks.onResponse?.({
      type: MessageType.INTERVIEW_CONTROL,
      command: CommandType.INTERVIEW_COMPLETED,
      payload: {
        is_interview_completed: true,
        message: 'Interview completed',
        reason: 'Interview has been completed successfully',
        question_type: 'INITIAL',
        solution_type: SolutionType.TEXT_ANSWER,
        is_last_question: true,
        question: {
          question_name: '',
          question_text: '',
          question_test_cases: [],
        },
      },
      timestamp: Date.now(),
    });
  }

  private handleErrorMessage(message: WebSocketMessage<ErrorPayload>): void {
    sendLog({
      level: ELogLevels.Error,
      message: `WebSocket error: ${message.payload.message}`,
      err: new Error(message.payload.message),
    });
    this.callbacks.onError?.(new Error(message.payload.message));
  }

  public requestNextQuestion(): void {
    const message: WebSocketMessage = {
      type: MessageType.INTERVIEW_ACTION,
      command: CommandType.REQUEST_NEXT,
      payload: {},
      timestamp: Date.now(),
    };

    this.ws?.send(JSON.stringify(message));
    sendLog({
      level: ELogLevels.Info,
      message: 'Requested next question',
    });
  }

  public sendCompleteSolution(solution: UserResponsePayload, command: CommandType): void {
    const message: WebSocketMessage<UserResponsePayload> = {
      type: MessageType.INTERVIEW_ACTION,
      command: command,
      payload: solution,
      timestamp: Date.now(),
    };

    this.ws?.send(JSON.stringify(message));
    sendLog({
      level: ELogLevels.Info,
      message: `Sent ${command} complete solution`,
    });
  }

  public startRecording(): void {
    if (!isBrowser) return;
    if (this.isRecording) return;

    // Clean up any existing audio resources first
    this.cleanupAudioResources();

    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(stream => {
        this.audioStream = stream;
        this.audioContext = new AudioContext();
        this.audioSource = this.audioContext.createMediaStreamSource(stream);
        this.audioProcessor = this.audioContext.createScriptProcessor(4096, 1, 1);

        this.audioProcessor.onaudioprocess = e => {
          if (!this.isRecording) return;

          const inputData = e.inputBuffer.getChannelData(0);
          const pcmData = new Uint8Array(inputData.length);
          for (let i = 0; i < inputData.length; i++) {
            pcmData[i] = (inputData[i] + 1) * 128;
          }
          this.audioChunks.push(pcmData);
        };

        this.audioSource.connect(this.audioProcessor);
        this.audioProcessor.connect(this.audioContext.destination);

        this.isRecording = true;
        this.audioStartTime = Date.now();
        this.audioChunks = [];

        sendLog({
          level: ELogLevels.Info,
          message: 'Started recording audio',
        });
      })
      .catch(error => {
        this.cleanupAudioResources();
        sendLog({
          level: ELogLevels.Error,
          message: 'Error starting audio recording:',
          err: error,
        });
        this.callbacks.onError?.(error);
      });
  }

  public stopRecording(): void {
    if (!isBrowser) return;
    if (!this.isRecording) return;

    this.isRecording = false;
    this.audioDuration = (Date.now() - (this.audioStartTime || 0)) / 1000;

    // Convert audio chunks to base64 before cleaning up
    const base64Chunks = this.audioChunks.map(chunk => {
      const binary = Array.from(chunk)
        .map(byte => String.fromCharCode(byte))
        .join('');
      return btoa(binary);
    });

    const message: WebSocketMessage<AudioPayload> = {
      type: MessageType.INTERVIEW_ACTION,
      command: CommandType.AUDIO_STREAM,
      payload: {
        audio_chunks: base64Chunks,
        format: this.audioFormat,
        duration: this.audioDuration,
      },
      timestamp: Date.now(),
    };

    this.ws?.send(JSON.stringify(message));
    sendLog({
      level: ELogLevels.Info,
      message: `Sent audio data: ${base64Chunks.length} chunks, duration: ${this.audioDuration}s`,
    });

    // Ensure all audio tracks are stopped
    if (this.audioStream) {
      this.audioStream.getTracks().forEach(track => {
        track.stop();
        track.enabled = false;
      });
    }

    // Clean up audio resources
    this.cleanupAudioResources();
  }

  private cleanupAudioResources(): void {
    if (!isBrowser) return;

    if (this.audioProcessor) {
      this.audioProcessor.disconnect();
      this.audioProcessor = null;
    }

    if (this.audioSource) {
      this.audioSource.disconnect();
      this.audioSource = null;
    }

    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }

    if (this.audioStream) {
      this.audioStream.getTracks().forEach(track => {
        track.stop();
        track.enabled = false;
      });
      this.audioStream = null;
    }

    this.audioChunks = [];
    this.audioStartTime = null;
    this.audioDuration = 0;
    this.isRecording = false;
  }

  public isRecordingActive(): boolean {
    return this.isRecording;
  }

  private getCurrentTextResponse(): string | undefined {
    // Implement based on your state management
    return undefined;
  }

  private getCurrentCodeResponse(): string | undefined {
    // Implement based on your state management
    return undefined;
  }

  private getCurrentImageResponse(): string | undefined {
    // Implement based on your state management
    return undefined;
  }

  private getCurrentAudioResponse(): string | undefined {
    // Implement based on your state management
    return undefined;
  }

  public onConnect(callback: () => void): void {
    this.callbacks.onConnect = callback;
  }

  public onDisconnect(callback: () => void): void {
    this.callbacks.onDisconnect = callback;
  }

  public onError(callback: (error: unknown) => void): void {
    this.callbacks.onError = callback;
  }

  public onResponse(callback: (response: InterviewRoomResponse) => void): void {
    this.callbacks.onResponse = callback;
  }

  public cleanup(): void {
    this.stopHeartbeat();
    this.stopAudioThrottle();
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }
    if (this.connectionTimeout) {
      clearTimeout(this.connectionTimeout);
    }
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.cleanupAudioResources();
    this.isConnecting = false;
    InterviewRoomSocket.instances.delete(this.roomId);
  }

  public sendAudioData(audioChunks: string[]): void {
    const message: WebSocketMessage<AudioPayload> = {
      type: MessageType.INTERVIEW_ACTION,
      command: CommandType.AUDIO_STREAM,
      payload: {
        audio_chunks: audioChunks,
        format: this.audioFormat,
      },
      timestamp: Date.now(),
    };

    this.ws?.send(JSON.stringify(message));
    sendLog({
      level: ELogLevels.Info,
      message: `Sent audio data: ${audioChunks.length} chunks`,
    });
  }
}
