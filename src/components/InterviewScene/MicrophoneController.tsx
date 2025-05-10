import React, { useState, useRef, useCallback, useEffect } from 'react';
import { InterviewRoomSocket } from '@/lib/socket/InterviewRoomSocket';
import { toast } from 'sonner';
import { sendLog } from '@/utils/logs';
import { ELogLevels } from '@/constants/logs';

interface MicrophoneControllerProps {
  socket: InterviewRoomSocket;
  isRecording: boolean;
  onRecordingChange: (isRecording: boolean) => void;
}

const AUDIO_CONFIG = {
  mimeType: 'audio/webm;codecs=opus' as const,
  audioBitsPerSecond: 128000,
  chunkInterval: 500, // 500ms chunks
};

const MicrophoneController: React.FC<MicrophoneControllerProps> = ({
  socket,
  isRecording,
  onRecordingChange,
}) => {
  const [isMicAvailable, setIsMicAvailable] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isBrowser, setIsBrowser] = useState(false);

  useEffect(() => {
    setIsBrowser(true);
  }, []);

  const checkBrowserSupport = useCallback(() => {
    if (!isBrowser) return false;
    if (!MediaRecorder.isTypeSupported(AUDIO_CONFIG.mimeType)) {
      toast.error('Your browser does not support WebM with Opus codec');
      return false;
    }
    return true;
  }, [isBrowser]);

  const checkMicrophoneAvailability = useCallback(async () => {
    if (!isBrowser) return false;
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      setIsMicAvailable(true);
      return true;
    } catch (error) {
      sendLog({
        level: ELogLevels.Error,
        message: 'Microphone not available',
        err: error as Error,
      });
      setIsMicAvailable(false);
      toast.error('Microphone access is required');
      return false;
    }
  }, [isBrowser]);

  // Check microphone availability when component mounts
  useEffect(() => {
    if (isBrowser) {
      checkMicrophoneAvailability();
    }
  }, [isBrowser, checkMicrophoneAvailability]);

  const stopRecording = useCallback(() => {
    if (!isBrowser) return;
    if (mediaRecorderRef.current?.state !== 'inactive') {
      try {
        mediaRecorderRef.current?.stop();
      } catch (error) {
        sendLog({
          level: ELogLevels.Error,
          message: 'Error stopping recording',
          err: error as Error,
        });
      }
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    mediaRecorderRef.current = null;
    onRecordingChange(false);
  }, [onRecordingChange, isBrowser]);

  const startRecording = useCallback(async () => {
    if (!isBrowser) return;
    if (!checkBrowserSupport()) return;

    const micAvailable = await checkMicrophoneAvailability();
    if (!micAvailable) return;

    try {
      const mediaRecorder = new MediaRecorder(streamRef.current!, {
        mimeType: AUDIO_CONFIG.mimeType,
        audioBitsPerSecond: AUDIO_CONFIG.audioBitsPerSecond,
      });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = async event => {
        if (event.data.size > 0) {
          try {
            const arrayBuffer = await event.data.arrayBuffer();
            const uint8Array = new Uint8Array(arrayBuffer);
            const base64Audio = btoa(String.fromCharCode.apply(null, Array.from(uint8Array)));

            sendLog({
              level: ELogLevels.Info,
              message: `Sending audio chunk: ${event.data.size} bytes`,
            });

            socket.sendAudioData([base64Audio]);
          } catch (error) {
            sendLog({
              level: ELogLevels.Error,
              message: 'Error processing audio chunk',
              err: error as Error,
            });
          }
        }
      };

      mediaRecorder.onerror = event => {
        sendLog({
          level: ELogLevels.Error,
          message: 'MediaRecorder error',
          err: event as unknown as Error,
        });
        toast.error('Error recording audio');
        stopRecording();
      };

      mediaRecorder.start(AUDIO_CONFIG.chunkInterval);
      onRecordingChange(true);
    } catch (error) {
      sendLog({
        level: ELogLevels.Error,
        message: 'Error starting MediaRecorder',
        err: error as Error,
      });
      toast.error('Error starting audio recording');
      stopRecording();
    }
  }, [
    checkBrowserSupport,
    checkMicrophoneAvailability,
    onRecordingChange,
    stopRecording,
    socket,
    isBrowser,
  ]);

  const toggleRecording = useCallback(() => {
    if (!isBrowser) return;
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  }, [isRecording, startRecording, stopRecording, isBrowser]);

  if (!isBrowser) {
    return null;
  }

  if (!isMicAvailable) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded-lg" role="alert">
        <p className="font-medium">Microphone access is required</p>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4 p-4 bg-gray-100 rounded-lg">
      <button
        onClick={toggleRecording}
        className={`p-3 rounded-full ${
          isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'
        } text-white transition-colors`}
        aria-label={isRecording ? 'Stop recording' : 'Start recording'}
        title={isRecording ? 'Stop recording' : 'Start recording'}
      >
        {isRecording ? (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"
            />
          </svg>
        ) : (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
            />
          </svg>
        )}
      </button>
      <span className="text-gray-700" aria-live="polite">
        {isRecording ? 'Recording...' : 'Click to start recording'}
      </span>
    </div>
  );
};

export default MicrophoneController;
