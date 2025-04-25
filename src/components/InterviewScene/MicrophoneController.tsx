import React, { useState, useRef, useEffect, useCallback } from 'react';
import { InterviewRoomSocket } from '@/lib/socket/InterviewRoomSocket';
import { toast } from 'sonner';
import { sendLog } from '@/utils/logs';
import { ELogLevels } from '@/constants/logs';

interface MicrophoneControllerProps {
  socket: InterviewRoomSocket;
  isRecording: boolean;
  onRecordingChange: (isRecording: boolean) => void;
}

// Audio constraints for better quality
const AUDIO_CONSTRAINTS = {
  audio: {
    echoCancellation: true,
    noiseSuppression: true,
    autoGainControl: true,
    sampleRate: 44100,
    channelCount: 1,
  },
};

// Time between audio chunks in ms
const RECORDING_INTERVAL = 100;

const MicrophoneController: React.FC<MicrophoneControllerProps> = ({
  socket,
  isRecording,
  onRecordingChange,
}) => {
  const [isMicAvailable, setIsMicAvailable] = useState<boolean>(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Get best supported MIME type for audio recording
  const getSupportedMimeType = useCallback(() => {
    const preferredTypes = [
      'audio/webm;codecs=opus', // Best quality and compression for WebM
      'audio/ogg;codecs=opus', // Good quality and compression for Firefox
      'audio/webm', // Fallback for Chrome
      'audio/mp4', // Fallback for Safari
    ];

    return preferredTypes.find(type => MediaRecorder.isTypeSupported(type)) || '';
  }, []);

  // Check and request microphone access
  const checkMicrophoneAvailability = useCallback(async () => {
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }

      const stream = await navigator.mediaDevices.getUserMedia(AUDIO_CONSTRAINTS);
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
  }, []);

  // Safely stop recording and cleanup resources
  const stopRecording = useCallback(() => {
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
  }, [onRecordingChange]);

  // Begin audio recording with optimal settings
  const startRecording = useCallback(async () => {
    const micAvailable = await checkMicrophoneAvailability();
    if (!micAvailable) return;

    try {
      const mimeType = getSupportedMimeType();
      if (!mimeType) {
        throw new Error('No supported audio format found');
      }

      const mediaRecorder = new MediaRecorder(streamRef.current!, {
        mimeType,
        audioBitsPerSecond: 128000,
      });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = async event => {
        if (event.data.size > 0) {
          try {
            const arrayBuffer = await event.data.arrayBuffer();
            socket.sendSpeakCommand(new Uint8Array(arrayBuffer));
          } catch (error) {
            sendLog({
              level: ELogLevels.Error,
              message: 'Error processing audio data',
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

      mediaRecorder.start(RECORDING_INTERVAL);
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
  }, [checkMicrophoneAvailability, getSupportedMimeType, socket, onRecordingChange, stopRecording]);

  const toggleRecording = useCallback(() => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  }, [isRecording, startRecording, stopRecording]);

  useEffect(() => {
    checkMicrophoneAvailability();
    return () => stopRecording();
  }, [checkMicrophoneAvailability, stopRecording]);

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
