import { useEffect, useState } from 'react';
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
import { isSpeakingAtom, currentQuestionAtom } from './AnswerBoardTools/atoms';
import { RefreshCw } from 'lucide-react';
import { ELogLevels } from '@/constants/logs';
import { sendLog } from '@/utils/logs';
import { toast } from 'sonner';

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
  handleUserResponse: (response: TUserResponse) => void;
  className?: string;
  interviewId: string;
}) => {
  const [submitBtnLabel, setSubmitBtnLabel] = useState(ESubmitBtnStates.INITIAL);
  const [isMounted, setIsMounted] = useState(false);
  const [isRepeating, setIsRepeating] = useState(false);
  const setCurrentQuestion = useSetAtom(currentQuestionAtom);
  const userTextResponse = useAtomValue(userTextResponseAtom);
  const userImageResponse = useAtomValue(userImageResponseAtom);
  const userCodeResponse = useAtomValue(userCodeResponseAtom);

  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } =
    useSpeechRecognition();

  const handleRepeatQuestion = async () => {
    setIsRepeating(true);
    try {
      const currentQuestion = await getCurrentQuestion({
        user_id: 'test-user-id',
        interview_id: interviewId,
      });
      if (currentQuestion.current_question) {
        const question = {
          ...currentQuestion,
          current_question: null,
          next_question: currentQuestion.current_question,
        };
        setCurrentQuestion(question);
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
        console.log('transcript', transcript);
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
    </div>
  );
};
export default InterviewControllers;
