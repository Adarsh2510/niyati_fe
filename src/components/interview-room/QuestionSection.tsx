'use client'

import { IIntQuestions } from "@/lib/api/types";
import { QuestionType } from "@/constants/questions";
import { Canvas } from "@react-three/fiber";
import Interviewer from "./Interviewer";
export default function QuestionSection({currentQuestion, handleIsQuestionAsked, questionType}: {currentQuestion: IIntQuestions | null, handleIsQuestionAsked: (is_question_asked: boolean) => void, questionType: QuestionType}) {
    // if (!currentQuestion) {
    //     return <div>No question found</div>;
    // }
    return (
        <div>
            <h1>{currentQuestion?.question_text ?? "No question found"}</h1>
            <button onClick={() => {
                handleIsQuestionAsked(true);
                
            }}>
                Question Asked
            </button>

            <div className="w-full bg-cover bg-center relative" style={{ backgroundImage: `url('/meeting-room.webp')`, height:"43rem" }}>
                <div className="absolute bottom-0 left-0 h-96">
                <Canvas shadows camera={{ position: [0, 0, 8], fov: 30 }}>
                <Interviewer/>
                </Canvas>
                </div>
            </div>
        </div>
    )
}
