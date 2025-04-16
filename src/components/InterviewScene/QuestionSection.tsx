import { speakQuestion } from './speechController';
import { useEffect, useState, useMemo } from 'react';
import {
  currentQuestionAtom,
  isSpeakingAtom,
  currentWordIndexAtom,
} from './AnswerBoardTools/atoms';
import { useAtomValue, useSetAtom } from 'jotai';
import { InterviewerAvatar } from '../Avatar';
import { Environment } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { ESolutionType } from '@/constants/interview';
import WhiteboardCanvas from './AnswerBoardTools/WhiteboardCanvas';
import { answerBoardPlaceholders } from '@/constants/interviewSceneLabels';
import { toast } from 'sonner';
import JudgeCodeEditor from './AnswerBoardTools/JudgeCodeEditor';
import QuestionCaption from './QuestionCaption';

function InterviewerAvatarCanvas() {
  // const backgroundImage = useTexture('/meeting-room.webp');
  // const viewPort = useThree((state: any) => state.viewport);
  // const [animation, setAnimation] = useState(animations.SittingIdle);

  return (
    <>
      <Environment preset="sunset" />
      <InterviewerAvatar position={[0, -3, -2]} scale={2} />
    </>
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

const QuestionSection = ({
  solutionType,
  answerBoardPlaceholder,
}: {
  solutionType: ESolutionType;
  answerBoardPlaceholder: string;
}) => {
  const currentQuestion = useAtomValue(currentQuestionAtom);
  const questionText = currentQuestion?.next_question?.question_text;
  const questionTestCases = currentQuestion?.next_question?.question_test_cases;
  const setIsSpeaking = useSetAtom(isSpeakingAtom);
  const setCurrentWordIndex = useSetAtom(currentWordIndexAtom);

  useEffect(() => {
    speakQuestion({
      questionText: questionText ?? '',
      setIsSpeaking,
      setCurrentWordIndex,
    });
  }, [questionText, setIsSpeaking, setCurrentWordIndex]);

  const answerBoardComponent = useMemo(() => {
    return answerBoard({
      solutionType,
      answerBoardPlaceholder,
      questionTestCases,
    });
  }, [solutionType, answerBoardPlaceholder, questionTestCases]);

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
      <QuestionCaption />
    </>
  );
};

export default QuestionSection;
