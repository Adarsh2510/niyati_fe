import {
  Command,
  IntWSSMessageType,
  InterviewRoomMessage,
  InterviewRoomResponse,
  UserResponse,
} from '@/types/interview';
import { EBackendEndpoints } from '@/constants/endpoints';
import { getNiyatiBackendApiUrl } from '@/utils/apiBE';
import { ELogLevels } from '@/constants/logs';
import { sendLog } from '@/utils/logs';
import { getSession } from 'next-auth/react';

// WebSocket connection states
enum WebSocketState {
  CONNECTING = 'CONNECTING',
  OPEN = 'OPEN',
  CLOSING = 'CLOSING',
  CLOSED = 'CLOSED',
}

// Custom error types
class WebSocketError extends Error {
  constructor(
    message: string,
    public code: string
  ) {
    super(message);
    this.name = 'WebSocketError';
  }
}

// Connection configuration
interface ConnectionConfig {
  maxReconnectAttempts: number;
  reconnectDelay: number;
  heartbeatDelay: number;
  audioThrottleInterval: number;
  maxAudioBufferSize: number;
}

// Default configuration
const DEFAULT_CONFIG: ConnectionConfig = {
  maxReconnectAttempts: 5,
  reconnectDelay: 1000,
  heartbeatDelay: 30000,
  audioThrottleInterval: 5000, // 5 seconds
  maxAudioBufferSize: 50, // Maximum number of audio chunks to buffer
};

// Singleton instance map
const instances = new Map<string, InterviewRoomSocket>();

/**
 * Get WebSocket URL from backend URL
 * @param roomId The interview room ID
 * @returns Properly formatted WebSocket URL
 */
function getWebSocketUrl(roomId: string): string {
  // Get the base API URL
  const httpUrl = getNiyatiBackendApiUrl(`${EBackendEndpoints.INTERVIEW_ROOM_WS}/${roomId}`);

  // Convert to WebSocket URL (ws:// or wss://)
  return httpUrl.replace(/^http/, 'ws');
}

export class InterviewRoomSocket {
  private ws: WebSocket | null = null;
  private readonly url: string;
  private readonly config: ConnectionConfig;
  private state: WebSocketState = WebSocketState.CLOSED;
  private reconnectAttempts: number = 0;
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private audioThrottleInterval: NodeJS.Timeout | null = null;
  private audioBuffer: Uint8Array[] = [];
  private responseCallbacks: ((response: InterviewRoomResponse) => void)[] = [];
  private errorCallbacks: ((error: Error) => void)[] = [];
  private connectCallbacks: (() => void)[] = [];
  private disconnectCallbacks: (() => void)[] = [];
  private isConnectionInProgress = false;
  private sessionAuthToken: string | null = null;
  private roomId: string;

  private constructor(roomId: string, config: Partial<ConnectionConfig> = {}) {
    this.url = getWebSocketUrl(roomId);
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.roomId = roomId;
  }

  /**
   * Get or create a singleton instance of the WebSocket connection
   * @param roomId The interview room ID
   * @param config Optional configuration
   * @returns The WebSocket instance
   */
  public static getInstance(
    roomId: string,
    config?: Partial<ConnectionConfig>
  ): InterviewRoomSocket {
    if (!roomId) {
      throw new Error('Room ID is required');
    }

    const key = roomId;
    if (!instances.has(key)) {
      const instance = new InterviewRoomSocket(roomId, config);
      instances.set(key, instance);
      // Connect immediately after creation
      instance.connect();
    }
    return instances.get(key)!;
  }

  /**
   * Get authentication token from session
   * Caches the token to reduce session requests
   */
  private async getAuthToken(): Promise<string> {
    if (this.sessionAuthToken) {
      return this.sessionAuthToken;
    }

    const session = await getSession();
    if (!session?.accessToken) {
      throw new WebSocketError('Authentication token not found', 'AUTH_ERROR');
    }

    this.sessionAuthToken = session.accessToken;
    return session.accessToken;
  }

  /**
   * Establish the WebSocket connection with authentication
   */
  public async connect(): Promise<void> {
    if (
      this.isConnectionInProgress ||
      this.state === WebSocketState.CONNECTING ||
      this.state === WebSocketState.OPEN
    ) {
      return;
    }

    try {
      this.isConnectionInProgress = true;
      this.state = WebSocketState.CONNECTING;

      const token = await this.getAuthToken();

      const wsUrl = new URL(this.url);
      wsUrl.searchParams.append('token', token);

      this.ws = new WebSocket(wsUrl.toString());
      this.setupWebSocketHandlers();
    } catch (error) {
      this.state = WebSocketState.CLOSED;
      this.handleError(
        error instanceof WebSocketError
          ? error
          : new WebSocketError('Connection failed', 'CONNECTION_ERROR')
      );
    } finally {
      this.isConnectionInProgress = false;
    }
  }

  private setupWebSocketHandlers(): void {
    if (!this.ws) return;

    this.ws.onopen = () => {
      this.state = WebSocketState.OPEN;
      this.reconnectAttempts = 0;
      this.startHeartbeat();
      this.startAudioThrottle();
      this.connectCallbacks.forEach(callback => callback());
    };

    this.ws.onclose = (event: CloseEvent) => {
      this.state = WebSocketState.CLOSED;
      this.stopHeartbeat();
      this.stopAudioThrottle();

      if (event.code === 1008) {
        // Auth error
        this.sessionAuthToken = null;
        this.handleError(new WebSocketError('Authentication failed', 'AUTH_ERROR'));
      } else if (event.code !== 1000 && event.code !== 1001) {
        // Don't reconnect for normal closures (1000, 1001)
        this.handleDisconnect(event);
      }
    };

    this.ws.onerror = () => {
      // Error handling is done in onclose event
    };

    this.ws.onmessage = (event: MessageEvent) => {
      try {
        this.handleMessage(event);
      } catch (error) {
        sendLog({
          level: ELogLevels.Error,
          message: 'Error handling WebSocket message',
          err: error as Error,
        });
      }
    };
  }

  private handleMessage(event: MessageEvent): void {
    try {
      const response: InterviewRoomResponse = JSON.parse(event.data);
      this.responseCallbacks.forEach(callback => callback(response));
    } catch (error) {
      this.handleError(new WebSocketError('Failed to parse message', 'PARSE_ERROR'));
    }
  }

  private handleDisconnect(event: CloseEvent): void {
    this.disconnectCallbacks.forEach(callback => callback());

    if (this.reconnectAttempts < this.config.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = this.config.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
      setTimeout(() => this.connect(), delay);
    } else {
      this.handleError(new WebSocketError('Max reconnection attempts reached', 'MAX_RECONNECT'));
    }
  }

  private handleError(error: WebSocketError): void {
    this.errorCallbacks.forEach(callback => callback(error));
    sendLog({
      level: ELogLevels.Error,
      message: `WebSocket error: ${error.code}`,
      err: error,
    });
  }

  private startHeartbeat(): void {
    this.stopHeartbeat();
    this.heartbeatInterval = setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        const heartbeatMessage: InterviewRoomMessage = {
          command: Command.SPEAK,
          user_response: {},
        };
        this.ws.send(JSON.stringify(heartbeatMessage));
      }
    }, this.config.heartbeatDelay);
  }

  private stopHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  /**
   * Start audio throttle interval to send batched audio chunks
   */
  private startAudioThrottle(): void {
    this.stopAudioThrottle();
    this.audioThrottleInterval = setInterval(() => {
      this.flushAudioBuffer();
    }, this.config.audioThrottleInterval);
  }

  /**
   * Stop audio throttle interval
   */
  private stopAudioThrottle(): void {
    if (this.audioThrottleInterval) {
      clearInterval(this.audioThrottleInterval);
      this.audioThrottleInterval = null;
    }
    // Flush any remaining audio chunks
    this.flushAudioBuffer();
  }

  /**
   * Flush audio buffer by sending all accumulated chunks
   */
  private flushAudioBuffer(): void {
    if (this.audioBuffer.length === 0 || this.ws?.readyState !== WebSocket.OPEN) {
      return;
    }

    const message: InterviewRoomMessage = {
      command: Command.SPEAK,
      user_response: {},
      audio_chunks: [...this.audioBuffer],
    };

    try {
      this.ws?.send(JSON.stringify(message));
      // Clear the buffer after successful send
      this.audioBuffer = [];
    } catch (error) {
      sendLog({
        level: ELogLevels.Error,
        message: 'Failed to send audio chunks',
        err: error as Error,
      });
    }
  }

  /**
   * Buffer audio chunk for throttled sending
   * @param audioChunk Binary audio chunk
   */
  public sendSpeakCommand(audioChunk: Uint8Array): void {
    // Add chunk to buffer
    this.audioBuffer.push(audioChunk);

    // If buffer exceeds maximum size, flush immediately
    if (this.audioBuffer.length >= this.config.maxAudioBufferSize) {
      this.flushAudioBuffer();
    }

    // If not connected and not connecting, try to connect
    if (this.state === WebSocketState.CLOSED) {
      this.connect();
    }
  }

  /**
   * Send user response over the WebSocket
   * @param response User response object
   */
  public sendUserResponse(response: UserResponse): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      const message: InterviewRoomMessage = {
        command: Command.USER_RESPONSE,
        user_response: response,
      };
      this.ws.send(JSON.stringify(message));
    } else if (this.state !== WebSocketState.CONNECTING) {
      this.connect();
    }
  }

  /**
   * Request all solution data from the server
   */
  public getAllSolutionData(): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      const message: InterviewRoomMessage = {
        command: Command.GET_ALL_SOLUTION_DATA,
        user_response: {},
      };
      this.ws.send(JSON.stringify(message));
    } else if (this.state !== WebSocketState.CONNECTING) {
      this.connect();
    }
  }

  /**
   * Register a callback for WebSocket responses
   * @param callback Function to call when a response is received
   */
  public onResponse(callback: (response: InterviewRoomResponse) => void): void {
    this.responseCallbacks.push(callback);
  }

  /**
   * Register a callback for WebSocket errors
   * @param callback Function to call when an error occurs
   */
  public onError(callback: (error: Error) => void): void {
    this.errorCallbacks.push(callback);
  }

  /**
   * Register a callback for WebSocket connection
   * @param callback Function to call when connected
   */
  public onConnect(callback: () => void): void {
    this.connectCallbacks.push(callback);
    if (this.state === WebSocketState.OPEN) {
      callback();
    }
  }

  /**
   * Register a callback for WebSocket disconnection
   * @param callback Function to call when disconnected
   */
  public onDisconnect(callback: () => void): void {
    this.disconnectCallbacks.push(callback);
  }

  /**
   * Manually disconnect the WebSocket
   */
  public disconnect(): void {
    this.state = WebSocketState.CLOSING;
    this.stopHeartbeat();
    this.stopAudioThrottle();
    if (this.ws) {
      this.ws.close(1000, 'Client disconnected');
      this.ws = null;
    }
    this.state = WebSocketState.CLOSED;
  }

  /**
   * Clean up all resources and callbacks
   */
  public cleanup(): void {
    this.disconnect();
    this.responseCallbacks = [];
    this.errorCallbacks = [];
    this.connectCallbacks = [];
    this.disconnectCallbacks = [];
    this.sessionAuthToken = null;
    this.audioBuffer = [];
    instances.delete(this.url);
  }

  /**
   * Get the current connection state
   * @returns Current WebSocket state
   */
  public getState(): WebSocketState {
    return this.state;
  }
}
