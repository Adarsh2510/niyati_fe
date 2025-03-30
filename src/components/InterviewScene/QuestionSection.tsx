import { IGetNextQuestionResponse } from "@/lib/api/types";
import { speakQuestion } from "./speechController";
import { useEffect, useState } from "react";
import { isSpeakingAtom } from "./AnswerBoardTools/atoms";
import { useSetAtom } from "jotai";
import { InterviewerAvatar } from "../Avatar";
import { Environment } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import CodeEditor from "./AnswerBoardTools/CodeEditor";
import { ESolutionType } from "@/constants/interview";
import WhiteboardCanvas from "./AnswerBoardTools/WhiteboardCanvas";
import { answerBoardPlaceholders } from "@/constants/interviewSceneLabels";
function InterviewerAvatarCanvas() {
    // const backgroundImage = useTexture('/meeting-room.webp');
    // const viewPort = useThree((state: any) => state.viewport);
    // const [animation, setAnimation] = useState(animations.SittingIdle);

    return (
        <>
        <Environment preset="sunset" />
        <InterviewerAvatar position={[0, -3, -2]} scale={2}/>
        </>
    )
}

type TAnswerBoard = {
    solutionType: ESolutionType;
    codeEditorPlaceholder?: string;
}
const answerBoard = (props: TAnswerBoard) => {
    switch (props.solutionType) {
        case ESolutionType.CODE_SOLUTION:
            return (
                <div className="border-8 rounded-lg border-slate-500/75">
                    <CodeEditor placeholder={props.codeEditorPlaceholder ?? ''}/>
                </div>
            )
        case ESolutionType.WHITEBOARD_IMAGE:
            return <WhiteboardCanvas />
        default:
            return <WhiteboardCanvas />
    }
}
const QuestionSection = ({currentQuestion, solutionType}: {currentQuestion?: IGetNextQuestionResponse, solutionType: ESolutionType}) => {
    
    const questionText = currentQuestion?.next_question?.question_text;
    const setIsSpeaking = useSetAtom(isSpeakingAtom);
    const [codeEditorPlaceholder, setCodeEditorPlaceholder] = useState('');

    useEffect(() => {
        speakQuestion({questionText: questionText ?? '', setIsSpeaking})
        const placeholder = `### Question: ${questionText}\n\n Please share your reponse using record answer button and type in your any supporting text or code here.`
        setCodeEditorPlaceholder(questionText ? placeholder : '');
    }, [questionText])

    return (
        <div>
            <div className="w-full bg-cover bg-center h-full relative flex" style={{ backgroundImage: `url('/meeting-room.webp')`, height:"44rem" }}>
                <div className="h-full w-1/4">
                <div className="h-1/4 w-full">
                 {/*TODO ADD section name here*/}
                </div>
                <div className="h-3/4 w-full">
                    <Canvas shadows camera={{ position: [0, 0, 8], fov: 30 }}>
                        <InterviewerAvatarCanvas/>
                    </Canvas>
                </div>
                </div>
                <div className="m-2 w-3/4 overflow-hidden">
                    {answerBoard({solutionType, codeEditorPlaceholder: answerBoardPlaceholders[solutionType]})}
                </div>
            </div>
        </div>
    )
}

export default QuestionSection;