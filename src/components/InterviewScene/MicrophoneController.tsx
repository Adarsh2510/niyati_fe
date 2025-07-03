import React, { useState, useRef, useCallback, useEffect } from 'react';
import { InterviewRoomSocket } from '@/lib/socket/InterviewRoomSocket';
import { toast } from 'sonner';
import { sendLog } from '@/utils/logs';
import { ELogLevels } from '@/constants/logs';
import { Mic, MicOff } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

interface MicrophoneControllerProps {
  socket: InterviewRoomSocket;
  isRecording: boolean;
  onRecordingChange: (isRecording: boolean) => void;
  setIsAudioChunkSent: (isAudioChunkSent: boolean) => void;
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
  setIsAudioChunkSent,
}) => {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isBrowser, setIsBrowser] = useState(false);

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

  const stopRecording = useCallback(async () => {
    if (!isBrowser) return;
    setIsAudioChunkSent(true);
    if (mediaRecorderRef.current?.state !== 'inactive') {
      try {
        mediaRecorderRef.current?.stop();
        await new Promise<void>(resolve => {
          mediaRecorderRef.current!.onstop = () => {
            cleanupResources();
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
    }
  }, [isBrowser, cleanupResources, setIsAudioChunkSent]);

  const startRecording = useCallback(async () => {
    if (!isBrowser) return;

    if (!MediaRecorder.isTypeSupported(AUDIO_CONFIG.mimeType)) {
      toast.error('Your browser does not support WebM with Opus codec');
      return;
    }
    setIsAudioChunkSent(false);

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
  }, [isBrowser, socket, stopRecording, onRecordingChange, cleanupResources, setIsAudioChunkSent]);

  const toggleRecording = useCallback(() => {
    if (!isBrowser) return;
    isRecording ? stopRecording() : startRecording();
  }, [isBrowser, isRecording, startRecording, stopRecording]);

  if (!isBrowser) return null;

  return (
    <TooltipProvider>
      <div className="flex items-center gap-4 bg-gray-100 rounded-lg min-w-52 px-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={toggleRecording}
              className={`p-3 rounded-full ${
                isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'
              } text-white transition-colors`}
              aria-label={isRecording ? 'Stop recording' : 'Start recording'}
            >
              {isRecording ? <MicOff className="animate-pulse" /> : <Mic />}
            </button>
          </TooltipTrigger>
          <TooltipContent side="top">
            {isRecording ? 'Stop and process your response' : 'Start speaking'}
          </TooltipContent>
        </Tooltip>
        <span className="text-gray-700" aria-live="polite">
          {isRecording ? 'Stop Recording' : 'Start Recording'}
        </span>
      </div>
    </TooltipProvider>
  );
};

export default MicrophoneController;
