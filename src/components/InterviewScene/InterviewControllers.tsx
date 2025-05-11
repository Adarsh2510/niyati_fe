import { useEffect, useState, useCallback } from 'react';
import UnSupportedBrowser from './UnSupportedBrowser';
import { TUserResponse } from '@/lib/api/types';
import { currentQuestionAtom } from './AnswerBoardTools/atoms';
import { useSetAtom } from 'jotai';
import { Button } from '../ui/button';
import { getCurrentQuestion } from '@/lib/api/getInterviewData';
import { RefreshCw } from 'lucide-react';
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
  const [isRepeating, setIsRepeating] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [socket, setSocket] = useState<InterviewRoomSocket | null>(null);
  const { data: session } = useSession();
  const setCurrentQuestion = useSetAtom(currentQuestionAtom);
  const router = useRouter();

  const handleSocketResponse = useCallback(
    (response: InterviewRoomResponse) => {
      const { payload } = response;

      if (payload.is_interview_completed) {
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
      });

      sendLog({
        level: ELogLevels.Info,
        message: `Received new question: ${payload.question.question_text}`,
      });
    },
    [interviewId, router, setCurrentQuestion]
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
    newSocket.connect();
    setSocket(newSocket);

    return newSocket;
  }, [interviewId, session?.accessToken, handleSocketResponse]);

  useEffect(() => {
    if (!isBrowser) return;
    const setupSocket = async () => {
      const socketInstance = await initializeSocket();
      return () => socketInstance?.cleanup();
    };
    setupSocket();
  }, [initializeSocket]);

  const handleRepeatQuestion = async () => {
    if (!isBrowser) return;

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

  const handleRecordingChange = (recording: boolean) => {
    if (!isBrowser) return;
    setIsRecording(recording);
    recording ? socket?.startRecording() : socket?.stopRecording();
  };

  const handleStartInterview = () => {
    if (!socket) {
      toast.error('Not connected to interview room');
      return;
    }
    socket.requestNextQuestion();
  };

  if (!isBrowser) return <UnSupportedBrowser />;

  return (
    <div className={`flex gap-4 justify-center ${className}`}>
      <Button
        variant="default"
        className="bg-green-500 hover:bg-green-600"
        onClick={handleStartInterview}
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
      {socket && (
        <MicrophoneController
          socket={socket}
          isRecording={isRecording}
          onRecordingChange={handleRecordingChange}
        />
      )}
    </div>
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
