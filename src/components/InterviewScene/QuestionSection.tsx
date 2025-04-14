import { IGetNextQuestionResponse } from '@/lib/api/types';
import { speakQuestion } from './speechController';
import { useEffect, useState } from 'react';
import { isSpeakingAtom } from './AnswerBoardTools/atoms';
import { useSetAtom } from 'jotai';
import { InterviewerAvatar } from '../Avatar';
import { Environment } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import CodeEditor from './AnswerBoardTools/CodeEditor';
import { ESolutionType } from '@/constants/interview';
import WhiteboardCanvas from './AnswerBoardTools/WhiteboardCanvas';
import { answerBoardPlaceholders } from '@/constants/interviewSceneLabels';
import { toast } from 'sonner';
import JudgeCodeEditor from './AnswerBoardTools/JudgeCodeEditor';
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
  codeEditorPlaceholder?: string;
};
const answerBoard = (props: TAnswerBoard) => {
  switch (props.solutionType) {
    case ESolutionType.WHITEBOARD_IMAGE:
      toast.info(
        'Please do not forget to save your whiteboard image before submitting your response.'
      );
      return <WhiteboardCanvas />;
    default:
      return <JudgeCodeEditor initialCode={props.codeEditorPlaceholder ?? ''} />;
  }
};
const QuestionSection = ({
  currentQuestion,
  solutionType,
}: {
  currentQuestion?: IGetNextQuestionResponse;
  solutionType: ESolutionType;
}) => {
  const questionText = currentQuestion?.next_question?.question_text;
  const setIsSpeaking = useSetAtom(isSpeakingAtom);
  const [codeEditorPlaceholder, setCodeEditorPlaceholder] = useState('');

  useEffect(() => {
    speakQuestion({ questionText: questionText ?? '', setIsSpeaking });
    const placeholder = `### Question: ${questionText}\n\n Please share your reponse using record answer button and type in your any supporting text or code here.`;
    setCodeEditorPlaceholder(questionText ? placeholder : '');
  }, [questionText]);

  return (
    <>
      <div
        className="h-[85vh] grid grid-cols-[1fr_3fr] grid-rows-[1fr_1fr]"
        style={{ backgroundImage: `url('/meeting-room.webp')` }}
      >
        <div className="col-start-1 col-end-2 row-start-1 row-end-2 p-4">{questionText}</div>
        <div className="col-start-1 col-end-2 row-start-2 row-end-3">
          <Canvas shadows camera={{ position: [0, 0, 5.5], fov: 40 }}>
            <InterviewerAvatarCanvas />
          </Canvas>
        </div>
        <div className="col-start-2 col-end-3 row-start-1 row-end-3 p-2">
          {answerBoard({
            solutionType,
            codeEditorPlaceholder: answerBoardPlaceholders[solutionType],
          })}
        </div>
      </div>
    </>
  );
};

export default QuestionSection;
