'use client';

import { speakText } from './speechController';
import { useEffect, useState, useMemo, Suspense } from 'react';
import {
  currentQuestionAtom,
  isSpeakingAtom,
  currentWordIndexAtom,
  answerBoardPlaceholderAtom,
} from './AnswerBoardTools/atoms';
import { useAtomValue, useSetAtom } from 'jotai';
import { InterviewerAvatar } from '../Avatar';
import { Environment } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { ESolutionType } from '@/constants/interview';
import { toast } from 'sonner';
import JudgeCodeEditor from './AnswerBoardTools/JudgeCodeEditor';
import Caption from './Caption';
import dynamic from 'next/dynamic';
import QuestionSectionSkeleton from './QuestionSectionSkeleton';

const WhiteboardCanvas = dynamic(() => import('./AnswerBoardTools/WhiteboardCanvas'), {
  ssr: false,
});

function InterviewerAvatarCanvas() {
  return (
    <Suspense fallback={null}>
      <Environment preset="sunset" />
      <InterviewerAvatar position={[0, -3, -2]} scale={2} />
    </Suspense>
  );
}

type TAnswerBoard = {
  solutionType: ESolutionType;
  answerBoardPlaceholder?: string;
  questionTestCases?: string[];
};

const answerBoard = (props: TAnswerBoard) => {
  switch (props.solutionType) {
    case ESolutionType.WHITEBOARD_IMAGE:
      toast.info(
        'Please do not forget to save your whiteboard image before submitting your response.'
      );
      return <WhiteboardCanvas />;
    default:
      return (
        <JudgeCodeEditor
          initialCode={props.answerBoardPlaceholder ?? ''}
          questionTestCases={props.questionTestCases}
        />
      );
  }
};

const QuestionSection = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAssetsLoaded, setIsAssetsLoaded] = useState(false);
  const answerBoardPlaceholder = useAtomValue(answerBoardPlaceholderAtom);
  const currentQuestion = useAtomValue(currentQuestionAtom);
  const questionText = currentQuestion?.current_question?.question_text;
  const questionTestCases = currentQuestion?.current_question?.question_test_cases;
  const solutionType = currentQuestion?.solution_type || ESolutionType.TEXT_ANSWER;
  const setIsSpeaking = useSetAtom(isSpeakingAtom);
  const setCurrentWordIndex = useSetAtom(currentWordIndexAtom);
  const isSpeaking = useAtomValue(isSpeakingAtom);
  const currentWordIndex = useAtomValue(currentWordIndexAtom);

  // Handle initial mounting
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Handle asset loading
  useEffect(() => {
    if (!isMounted) return;

    // Minimum loading time to prevent flash
    const minLoadingTime = new Promise(resolve => setTimeout(resolve, 1000));

    // Simulate asset loading (replace with actual asset loading check if needed)
    Promise.all([minLoadingTime]).then(() => {
      setIsAssetsLoaded(true);
      setIsLoading(false);
    });
  }, [isMounted]);

  useEffect(() => {
    if (isMounted && questionText && !isLoading) {
      speakText({
        text: questionText,
        setIsSpeaking,
        setCurrentWordIndex,
      });
    }
  }, [
    questionText,
    currentQuestion?._repeatId,
    setIsSpeaking,
    setCurrentWordIndex,
    isMounted,
    isLoading,
  ]);

  const answerBoardComponent = useMemo(() => {
    if (!isMounted || isLoading) return null;

    return answerBoard({
      solutionType,
      answerBoardPlaceholder,
      questionTestCases,
    });
  }, [solutionType, answerBoardPlaceholder, questionTestCases, isMounted, isLoading]);

  if (!isMounted || isLoading || !isAssetsLoaded) {
    return <QuestionSectionSkeleton />;
  }

  return (
    <>
      <div
        className="h-[85vh] grid grid-cols-[1fr_3fr] grid-rows-[1fr_1fr]"
        style={{ backgroundImage: `url('/meeting-room.webp')` }}
      >
        <div className="col-start-1 col-end-2 row-start-1 row-end-2 p-4">{}</div>
        <div className="col-start-1 col-end-2 row-start-2 row-end-3">
          <Canvas shadows camera={{ position: [0, 0, 5.5], fov: 40 }}>
            <InterviewerAvatarCanvas />
          </Canvas>
        </div>
        <div className="col-start-2 col-end-3 row-start-1 row-end-3 p-2">
          {answerBoardComponent}
        </div>
      </div>
      <Caption
        key={currentQuestion?._repeatId}
        text={questionText ?? ''}
        isSpeaking={isSpeaking}
        currentWordIndex={currentWordIndex}
      />
    </>
  );
};

export default QuestionSection;
