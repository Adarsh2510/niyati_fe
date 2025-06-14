import { useEffect, useState, useCallback } from 'react';
import UnSupportedBrowser from './UnSupportedBrowser';
import { TUserResponse } from '@/lib/api/types';
import {
  currentQuestionAtom,
  interruptionMessageAtom,
  isInterruptionSpeakingAtom,
  interruptionWordIndexAtom,
  interruptionStateAtom,
  isRecordingAtom,
  isAudioChunkSentAtom,
} from './AnswerBoardTools/atoms';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { Button } from '../ui/button';
import { ELogLevels } from '@/constants/logs';
import { sendLog } from '@/utils/logs';
import { toast } from 'sonner';
import MicrophoneController from './MicrophoneController';
import { InterviewRoomSocket } from '@/lib/socket/InterviewRoomSocket';
import { useSession } from 'next-auth/react';
import { InterviewRoomResponse, UserResponsePayload } from '@/types/interview';
import { useRouter } from 'next/navigation';
import { QuestionType } from '@/constants/questions';
import { ESolutionType } from '@/constants/interview';
import { speakText } from './speechController';
import Caption from './Caption';
import { CommandType } from '@/types/interview';
import { useSolutionSender } from './AnswerBoardTools/useSolutionSender';

const isBrowser = typeof window !== 'undefined';

interface InterviewControllersProps {
  handleNextQuestion: () => void;
  handleUserResponse: (response: UserResponsePayload) => void;
  className?: string;
  interviewId: string;
}

const InterviewControllers: React.FC<InterviewControllersProps> = ({
  handleNextQuestion,
  handleUserResponse,
  className,
  interviewId,
}) => {
  const [isRecording, setIsRecording] = useAtom(isRecordingAtom);
  const [isAudioChunkSent, setIsAudioChunkSent] = useAtom(isAudioChunkSentAtom);
  const [socket, setSocket] = useState<InterviewRoomSocket | null>(null);
  const { data: session } = useSession();
  const [currentQuestion, setCurrentQuestion] = useAtom(currentQuestionAtom);
  const router = useRouter();

  // Use the unified interruption state
  const interruptionState = useAtomValue(interruptionStateAtom);
  const setInterruptionMessage = useSetAtom(interruptionMessageAtom);
  const setIsInterruptionSpeaking = useSetAtom(isInterruptionSpeakingAtom);
  const setInterruptionWordIndex = useSetAtom(interruptionWordIndexAtom);

  const handleSocketResponse = useCallback(
    (response: InterviewRoomResponse) => {
      const { payload } = response;

      if (payload.is_interview_completed) {
        if (socket) {
          socket.cleanup();
          setSocket(null);
        }
        router.push(`/dashboard/interview-room/${interviewId}/summary`);
        return;
      }

      if (!payload.question) return;

      const questionType =
        payload.question_type === 'FOLLOW_UP' ? QuestionType.FOLLOW_UP : QuestionType.INITIAL;
      const solutionType = mapSolutionType(payload.solution_type);

      setCurrentQuestion({
        current_question: {
          question_name: payload.question.question_name,
          question_text: payload.question.question_text,
          question_test_cases: payload.question.question_test_cases,
        },
        question_type: questionType,
        solution_type: solutionType,
        is_last_question: payload.is_last_question,
        is_interview_completed: payload.is_interview_completed,
        _repeatId: Math.random(),
      });
      setIsAudioChunkSent(false);

      sendLog({
        level: ELogLevels.Info,
        message: `Received new question: ${payload.question.question_text}`,
      });
    },
    [interviewId, router, setCurrentQuestion, socket, setSocket, setIsAudioChunkSent]
  );

  const initializeSocket = useCallback(async () => {
    if (!isBrowser || !session?.accessToken) return null;

    const newSocket = InterviewRoomSocket.getInstance(interviewId, session.accessToken);

    newSocket.onConnect(() => {
      sendLog({ level: ELogLevels.Info, message: 'WebSocket connected successfully' });
      toast.success('Connected to interview room');
    });

    newSocket.onError(error => {
      sendLog({ level: ELogLevels.Error, message: 'WebSocket error:', err: error as Error });
      toast.error('Connection error. Please try again.');
    });

    newSocket.onDisconnect(() => {
      sendLog({ level: ELogLevels.Info, message: 'WebSocket disconnected' });
      toast.warning('Disconnected from interview room');
    });

    newSocket.onResponse(handleSocketResponse);

    newSocket.onInterruption(interruption => {
      setInterruptionMessage({ message: interruption.message, _repeatId: Math.random() });
      speakText({
        text: interruption.message,
        setIsSpeaking: setIsInterruptionSpeaking,
        setCurrentWordIndex: setInterruptionWordIndex,
      });
    });

    newSocket.connect();
    setSocket(newSocket);

    return newSocket;
  }, [
    interviewId,
    session?.accessToken,
    handleSocketResponse,
    setInterruptionMessage,
    setIsInterruptionSpeaking,
    setInterruptionWordIndex,
  ]);

  useEffect(() => {
    if (!isBrowser) return;
    const setupSocket = async () => {
      const socketInstance = await initializeSocket();
      return () => {
        if (socketInstance) {
          socketInstance.cleanup();
          setSocket(null);
        }
      };
    };
    setupSocket();
  }, [initializeSocket]);

  // Add cleanup on unmount
  useEffect(() => {
    return () => {
      if (socket) {
        socket.cleanup();
        setSocket(null);
      }
    };
  }, [socket]);

  // Manage recording state; actual audio streaming handled by MediaRecorder in MicrophoneController
  const handleRecordingChange = (recording: boolean) => {
    if (!isBrowser) return;
    setIsRecording(recording);
  };

  const handleStartInterview = () => {
    if (!socket) {
      toast.error('Not connected to interview room');
      return;
    }
    socket.requestNextQuestion();
  };

  const sendSolution = useSolutionSender(socket);

  if (!isBrowser) return <UnSupportedBrowser />;
  const isInterviewStarted = !!currentQuestion?.current_question?.question_text;

  return (
    <>
      <div className={`flex gap-4 items-center justify-center h-16 ${className}`}>
        <Button
          variant="default"
          disabled={isInterviewStarted}
          className="bg-green-500 hover:bg-green-600"
          onClick={handleStartInterview}
        >
          Start Interview
        </Button>
        <Button
          variant="default"
          disabled={isRecording || !isAudioChunkSent || !isInterviewStarted}
          className={`bg-blue-500 hover:bg-blue-600`}
          onClick={() => {
            sendSolution(CommandType.COMPLETE_SOLUTION);
          }}
        >
          Submit Solution
        </Button>
        <Button
          variant="outline"
          disabled={isRecording || !isAudioChunkSent || !isInterviewStarted}
          className={`bg-purple-500 hover:bg-purple-600`}
          onClick={() => {
            sendSolution(CommandType.PARTIAL_SOLUTION);
            setIsAudioChunkSent(false);
          }}
        >
          Provoke Interviewer
        </Button>
        {socket && (
          <MicrophoneController
            socket={socket}
            isRecording={isRecording}
            onRecordingChange={handleRecordingChange}
            setIsAudioChunkSent={setIsAudioChunkSent}
          />
        )}
      </div>
    </>
  );
};

// Helper function to map solution types
const mapSolutionType = (type: string): ESolutionType => {
  switch (type) {
    case 'CODE_SOLUTION':
      return ESolutionType.CODE_SOLUTION;
    case 'WHITEBOARD_IMAGE':
      return ESolutionType.WHITEBOARD_IMAGE;
    case 'CODE_REPO_WITH_OUTPUT':
      return ESolutionType.CODE_REPO_WITH_OUTPUT;
    default:
      return ESolutionType.TEXT_ANSWER;
  }
};

export default InterviewControllers;
