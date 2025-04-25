import { useEffect, useState, useCallback } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import UnSupportedBrowser from './UnSupportedBrowser';
import { TUserResponse } from '@/lib/api/types';
import {
  userCodeResponseAtom,
  userImageResponseAtom,
  userTextResponseAtom,
} from './AnswerBoardTools/atoms';
import { useAtomValue } from 'jotai';
import { Button } from '../ui/button';
import { getCurrentQuestion } from '@/lib/api/getInterviewData';
import { useSetAtom } from 'jotai';
import { currentQuestionAtom } from './AnswerBoardTools/atoms';
import { RefreshCw } from 'lucide-react';
import { ELogLevels } from '@/constants/logs';
import { sendLog } from '@/utils/logs';
import { toast } from 'sonner';
import MicrophoneController from './MicrophoneController';
import { InterviewRoomSocket } from '@/lib/socket/InterviewRoomSocket';
import { useSession } from 'next-auth/react';
import { InterviewRoomResponse, MessageType, UserResponsePayload } from '@/types/interview';

enum ESubmitBtnStates {
  INITIAL = 'Record Answer',
  SUBMIT = 'Submit Response',
  ERROR = 'Error',
}

const InterviewControllers = ({
  handleNextQuestion,
  handleUserResponse,
  className,
  interviewId,
}: {
  handleNextQuestion: () => void;
  handleUserResponse: (response: UserResponsePayload) => void;
  className?: string;
  interviewId: string;
}) => {
  const [submitBtnLabel, setSubmitBtnLabel] = useState(ESubmitBtnStates.INITIAL);
  const [isMounted, setIsMounted] = useState(false);
  const [isRepeating, setIsRepeating] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [socket, setSocket] = useState<InterviewRoomSocket | null>(null);
  const { data: session } = useSession();
  const setCurrentQuestion = useSetAtom(currentQuestionAtom);
  const userTextResponse = useAtomValue(userTextResponseAtom);
  const userImageResponse = useAtomValue(userImageResponseAtom);
  const userCodeResponse = useAtomValue(userCodeResponseAtom);

  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } =
    useSpeechRecognition();

  const initializeSocket = useCallback(async () => {
    if (session?.accessToken) {
      const newSocket = InterviewRoomSocket.getInstance(interviewId);
      setSocket(newSocket);

      newSocket.onConnect(() => {
        sendLog({
          level: ELogLevels.Info,
          message: 'WebSocket connected successfully',
        });
        toast.success('Connected to interview room');
      });

      newSocket.onError(error => {
        sendLog({
          level: ELogLevels.Error,
          message: 'WebSocket error:',
          err: error as Error,
        });
        toast.error('Connection error. Please try again.');
      });

      newSocket.onDisconnect(() => {
        sendLog({
          level: ELogLevels.Info,
          message: 'WebSocket disconnected',
        });
        toast.warning('Disconnected from interview room');
      });

      newSocket.onResponse((response: InterviewRoomResponse) => {
        switch (response.type) {
          case MessageType.CONNECTION:
            console.log('Connection established:', response.message);
            break;

          case MessageType.SYSTEM_MESSAGE:
            console.log('System message:', response.message);
            break;

          case MessageType.USER_RESPONSE:
            // Handle interview completed status
            if (response.is_interview_completed) {
              console.log('Interview completed');
            }
            // Let existing handlers manage the question
            break;

          default:
            console.warn('Unknown message type:', response);
        }
      });

      return newSocket;
    }
    return null;
  }, [interviewId, session?.accessToken]);

  useEffect(() => {
    const setupSocket = async () => {
      const socketInstance = await initializeSocket();
      return () => {
        socketInstance?.cleanup();
      };
    };

    setupSocket();
  }, [initializeSocket]);

  const handleRepeatQuestion = async () => {
    setIsRepeating(true);
    try {
      const currentQuestion = await getCurrentQuestion({
        user_id: 'test-user-id',
        interview_id: interviewId,
      });
      if (currentQuestion.current_question) {
        setCurrentQuestion({
          ...currentQuestion,
          _repeatId: Math.random(),
        });
      }
    } catch (error) {
      toast.error('Error repeating question');
      sendLog({
        level: ELogLevels.Error,
        message: 'Error repeating question:',
        err: error as Error,
      });
    } finally {
      setIsRepeating(false);
    }
  };

  const handleSubmitAnswer = () => {
    if (typeof window !== 'undefined') {
      if (submitBtnLabel === ESubmitBtnStates.INITIAL) {
        setSubmitBtnLabel(ESubmitBtnStates.SUBMIT);
        SpeechRecognition.startListening({ continuous: true });
      } else if (submitBtnLabel === ESubmitBtnStates.SUBMIT) {
        SpeechRecognition.stopListening();
        sendLog({
          level: ELogLevels.Info,
          message: `Transcript: ${transcript}`,
        });
        handleUserResponse({
          audio_response: transcript,
          text_response: userTextResponse,
          image_response: userImageResponse,
          code_response: userCodeResponse,
        });
        resetTranscript();
        setSubmitBtnLabel(ESubmitBtnStates.INITIAL);
      }
    }
    // TODO: Share text response as well as audio response
    // Text response mainly gonna contain the coding answers
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (isMounted && !browserSupportsSpeechRecognition) {
    // Had to check this to avoid hydration error
    return <UnSupportedBrowser />;
  }

  return (
    <div className={`flex gap-4 justify-center ${className}`}>
      <Button
        variant="default"
        className="bg-green-500 hover:bg-green-600"
        onClick={handleNextQuestion}
      >
        Start Interview
      </Button>
      <Button
        variant="outline"
        className="flex items-center gap-2"
        onClick={handleRepeatQuestion}
        disabled={isRepeating}
      >
        <RefreshCw className={`w-4 h-4 ${isRepeating ? 'animate-spin' : ''}`} />
        Repeat Question
      </Button>
      <Button
        variant="destructive"
        className={
          submitBtnLabel === ESubmitBtnStates.SUBMIT
            ? 'bg-red-700 hover:bg-red-500'
            : 'bg-red-500 hover:bg-red-600'
        }
        onClick={handleSubmitAnswer}
      >
        {submitBtnLabel}
      </Button>
      {socket && (
        <MicrophoneController
          socket={socket}
          isRecording={isRecording}
          onRecordingChange={setIsRecording}
        />
      )}
    </div>
  );
};
export default InterviewControllers;
