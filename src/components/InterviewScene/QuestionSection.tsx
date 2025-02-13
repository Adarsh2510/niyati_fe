import { IGetNextQuestionResponse } from "@/lib/api/types";
import { speakQuestion } from "./speechController";
import { useEffect } from "react";
import { isSpeakingAtom } from "./atoms";
import { useSetAtom } from "jotai";
import { InterviewerAvatar } from "../Avatar";
import { Environment } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";

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

    useEffect(() => {
        speakQuestion({questionText: questionText ?? '', setIsSpeaking})
    }, [questionText])

    return (
        <div>
            <h1>{questionText}</h1>
            <div className="w-full bg-cover bg-center relative" style={{ backgroundImage: `url('/meeting-room.webp')`, height:"43rem" }}>
                <div className="absolute bottom-0 left-0 h-96">
                    <Canvas shadows camera={{ position: [0, 0, 8], fov: 30 }}>
                        <InterviewerAvatarCanvas/>
                    </Canvas>
                </div>
            </div>
        </div>
    )
}

export default QuestionSection;