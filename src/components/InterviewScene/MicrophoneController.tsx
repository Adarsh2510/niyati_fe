import React, { useState, useRef, useCallback, useEffect } from 'react';
import { InterviewRoomSocket } from '@/lib/socket/InterviewRoomSocket';
import { toast } from 'sonner';
import { sendLog } from '@/utils/logs';
import { ELogLevels } from '@/constants/logs';
import { useAtomValue } from 'jotai';
import {
  userCodeResponseAtom,
  userImageResponseAtom,
  userTextResponseAtom,
} from './AnswerBoardTools/atoms';
import { CommandType } from '@/types/interview';

interface MicrophoneControllerProps {
  socket: InterviewRoomSocket;
  isRecording: boolean;
  onRecordingChange: (isRecording: boolean) => void;
}

const AUDIO_CONFIG = {
  mimeType: 'audio/webm;codecs=opus' as const,
  audioBitsPerSecond: 128000,
  chunkInterval: 500,
};

const MicrophoneController: React.FC<MicrophoneControllerProps> = ({
  socket,
  isRecording,
  onRecordingChange,
}) => {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isBrowser, setIsBrowser] = useState(false);

  const codeResponse = useAtomValue(userCodeResponseAtom);
  const imageResponse = useAtomValue(userImageResponseAtom);
  const textResponse = useAtomValue(userTextResponseAtom);

  useEffect(() => {
    setIsBrowser(true);
  }, []);

  const cleanupResources = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.stop();
        track.enabled = false;
      });
      streamRef.current = null;
    }
    mediaRecorderRef.current = null;
    onRecordingChange(false);
  }, [onRecordingChange]);

  const sendUserResponse = useCallback(() => {
    socket.sendCompleteSolution(
      {
        text_response: textResponse,
        code_response: codeResponse,
        image_response: imageResponse,
      },
      CommandType.PARTIAL_SOLUTION
    );
  }, [socket, textResponse, codeResponse, imageResponse]);

  const stopRecording = useCallback(async () => {
    if (!isBrowser) return;

    if (mediaRecorderRef.current?.state !== 'inactive') {
      try {
        mediaRecorderRef.current?.stop();
        await new Promise<void>(resolve => {
          mediaRecorderRef.current!.onstop = () => {
            cleanupResources();
            sendUserResponse();
            resolve();
          };
        });
      } catch (error) {
        sendLog({
          level: ELogLevels.Error,
          message: 'Error stopping recording',
          err: error as Error,
        });
        cleanupResources();
      }
    } else {
      cleanupResources();
      sendUserResponse();
    }
  }, [isBrowser, cleanupResources, sendUserResponse]);

  const startRecording = useCallback(async () => {
    if (!isBrowser) return;

    if (!MediaRecorder.isTypeSupported(AUDIO_CONFIG.mimeType)) {
      toast.error('Your browser does not support WebM with Opus codec');
      return;
    }

    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: AUDIO_CONFIG.mimeType,
        audioBitsPerSecond: AUDIO_CONFIG.audioBitsPerSecond,
      });

      mediaRecorder.ondataavailable = async event => {
        if (event.data.size > 0) {
          try {
            const arrayBuffer = await event.data.arrayBuffer();
            const uint8Array = new Uint8Array(arrayBuffer);
            const base64Audio = btoa(String.fromCharCode.apply(null, Array.from(uint8Array)));
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

      mediaRecorder.onerror = () => {
        toast.error('Error recording audio');
        stopRecording();
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start(AUDIO_CONFIG.chunkInterval);
      onRecordingChange(true);
    } catch (error) {
      sendLog({
        level: ELogLevels.Error,
        message: 'Error starting MediaRecorder',
        err: error as Error,
      });
      toast.error('Error starting audio recording');
      cleanupResources();
    }
  }, [isBrowser, socket, stopRecording, onRecordingChange, cleanupResources]);

  const toggleRecording = useCallback(() => {
    if (!isBrowser) return;
    isRecording ? stopRecording() : startRecording();
  }, [isBrowser, isRecording, startRecording, stopRecording]);

  if (!isBrowser) return null;

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
