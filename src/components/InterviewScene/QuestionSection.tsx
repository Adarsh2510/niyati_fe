import { IGetNextQuestionResponse } from "@/lib/api/types";
import { speakQuestion } from "./speechController";
import { useEffect, useState } from "react";
import { isSpeakingAtom } from "./atoms";
import { useSetAtom } from "jotai";
import { InterviewerAvatar } from "../Avatar";
import { Environment } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import CodeEditor from "./CodeEditor";

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

const QuestionSection = ({currentQuestion}: {currentQuestion?: IGetNextQuestionResponse}) => {
    
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
            <h1>{questionText}</h1>
            <div className="w-full bg-cover bg-center h-full relative flex" style={{ backgroundImage: `url('/meeting-room.webp')`, height:"45rem" }}>
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
                <div className="m-2 w-3/4 border-8 rounded-lg border-slate-500/75 overflow-hidden">
                    <CodeEditor placeholder={codeEditorPlaceholder}/>
                </div>
            </div>
        </div>
    )
}

export default QuestionSection;