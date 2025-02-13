'use client'
import { IGetNextQuestionResponse } from "@/lib/api/types";
import { useState, useRef } from "react";
import { QuestionType } from "@/constants/questions";
import QuestionSection from "@/components/InterviewScene/QuestionSection";
import InterviewControllers from "@/components/InterviewScene/InterviewControllers";

export default function InterviewRoom({params}: {params: {interview_id: string}}) {    
    const { interview_id } = params;
    const [currentQuestion, setCurrentQuestion] = useState<IGetNextQuestionResponse | undefined>(undefined);
    const questionType = useRef<QuestionType>(QuestionType.INITIAL);
    console.log('re rendered');
    const getNextQuestion = async () => {
        setCurrentQuestion({
            question_type: QuestionType.INITIAL,
            next_question: {
                question_name: 'Hi, how are you?',
                question_text: 'Hi, how are you?'
            },
            is_last_question: false,
            is_interview_completed: false
        });

    }

    const handleResponse = async (response: string) => {
        console.log(response);
    }

    const handleNextQuestion = async () => {
        await getNextQuestion();
    }

    return (
        <div>
            <h1>Interview Room</h1>
            <QuestionSection currentQuestion={currentQuestion}/>
            <InterviewControllers handleNextQuestion={handleNextQuestion} handleSubmitAnswer={handleResponse}/>
        </div>
    )
}