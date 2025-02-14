'use client'
import { IGetNextQuestionResponse } from "@/lib/api/types";
import { useState, useRef } from "react";
import { QuestionType } from "@/constants/questions";
import QuestionSection from "@/components/InterviewScene/QuestionSection";
import InterviewControllers from "@/components/InterviewScene/InterviewControllers";
import { getNextQuestion, submitAnswer } from "@/lib/api/getInterviewData";

export default function InterviewRoom({params}: {params: {interview_id: string}}) {    
    const { interview_id } = params;
    const [currentQuestion, setCurrentQuestion] = useState<IGetNextQuestionResponse | undefined>(undefined);
    // const questionType = useRef<QuestionType>(QuestionType.INITIAL);
    const followUpQuestionId = useRef<string | null>(null);
    console.log('re rendered');

    const handleNextQuestion = async () => {
        getNextQuestion({ user_id: 'test-user-id', interview_id: interview_id }).then((data)=>{
            if (data.is_interview_completed) {
                setCurrentQuestion(undefined);
            } else {
                setCurrentQuestion(data);
            }
        })
    }

     const handleSubmitAnswer = (answer: string) => {
        console.log('recieved answer', answer);
        submitAnswer({
            user_id: 'test-user-id',
            interview_id: interview_id,
            question_type: currentQuestion?.question_type ?? QuestionType.INITIAL,
            user_response: answer,
            follow_up_question_id: followUpQuestionId.current ?? undefined
        }).then((data)=>{
            console.log('recieved data', data);
            if (data.follow_up_question) {
                followUpQuestionId.current = Object.keys(data.follow_up_question)[0] ?? null;
                setCurrentQuestion({
                    question_type: QuestionType.FOLLOW_UP,
                    next_question: Object.values(data.follow_up_question)[0],
                    is_last_question: false,
                    is_interview_completed: false
                });
            }
            else{
                followUpQuestionId.current = null;
                getNextQuestion({ user_id: 'test-user-id', interview_id: interview_id }).then((data)=>{
                    if (data.is_interview_completed) {
                        setCurrentQuestion(undefined);
                    } else {
                        setCurrentQuestion(data);
                    }
                });
            }
        });
    }

    const handleUserResponse = async (response: string) => {
        console.log(response);
        handleSubmitAnswer(response);
    }

    return (
        <div>
            <h1>Interview Room</h1>
            <QuestionSection currentQuestion={currentQuestion}/>
            <InterviewControllers handleNextQuestion={handleNextQuestion} handleUserResponse={handleUserResponse}/>
        </div>
    )
}