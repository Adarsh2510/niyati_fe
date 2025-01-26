'use client'

import QuestionSection from "@/components/interview-room/QuestionSection";
import SubmitAnswer from "@/components/interview-room/SubmitAnswer";
import { QuestionType } from "@/constants/questions";
import { getNextQuestion, submitAnswer } from "@/lib/api/getInterviewData";
import { IGetNextQuestionResponse } from "@/lib/api/types";
import { useState, useEffect } from "react";
import Interviewer from "@/components/interview-room/Interviewer";

export default function InterviewRoom({params}: {params: {interview_id: string}}) {    
    const { interview_id } = params;
    const [isInterviewCompleted, setIsInterviewCompleted] = useState(false);
    const [currentQuestionData, setCurrentQuestionData] = useState<IGetNextQuestionResponse | null>(null);
    const [currentAnswer, setCurrentAnswer] = useState<string | null>(null);
    const [isQuestionAsked, setIsQuestionAsked] = useState(false);
    const [questionType, setQuestionType] = useState<QuestionType>(QuestionType.INITIAL);
    const [followUpQuestionId, setFollowUpQuestionId] = useState<string | null>(null);
    const currentQuestion = currentQuestionData?.next_question ?? {
        question_name: 'Hello, how are you?',
        question_text: 'Hello, how are you?',
        question_type: QuestionType.INITIAL,
        is_last_question: false,
        is_interview_completed: false
    };

    const handleIsQuestionAsked = (is_question_asked: boolean) => {
        setIsQuestionAsked(is_question_asked);
    }

    const handleSubmitAnswer = (answer: string) => {
        console.log('recieved answer', answer);
        setCurrentAnswer(answer);
        submitAnswer({
            user_id: 'test-user-id',
            interview_id: interview_id,
            question_type: questionType,
            user_response: answer,
            follow_up_question_id: followUpQuestionId ?? undefined
        }).then((data)=>{
            console.log('recieved data', data);
            if (data.follow_up_question) {
                setFollowUpQuestionId(Object.keys(data.follow_up_question)[0] ?? null);
                setCurrentQuestionData({
                    question_type: QuestionType.FOLLOW_UP,
                    next_question: Object.values(data.follow_up_question)[0],
                    is_last_question: false,
                    is_interview_completed: false
                });
                setQuestionType(QuestionType.FOLLOW_UP);
            }
            else{
                setFollowUpQuestionId(null);
                getNextQuestion({ user_id: 'test-user-id', interview_id: interview_id }).then((data)=>{
                    if (data.is_interview_completed) {
                        setIsInterviewCompleted(true);
                    } else {
                        setCurrentQuestionData(data);
                        setQuestionType(QuestionType.INITIAL);
                    }
                });
            }
        });
    }

    useEffect(() => {
        getNextQuestion({ user_id: 'test-user-id', interview_id: interview_id }).then((data)=>{
            if (data.is_interview_completed) {
                setIsInterviewCompleted(true);
            } else {
                setCurrentQuestionData(data);
                setQuestionType(QuestionType.INITIAL);
            }
        });
    }, []);
    
return (
    <div>
      <h1>Interview Room for {interview_id}</h1>
      <QuestionSection currentQuestion={currentQuestion} handleIsQuestionAsked={handleIsQuestionAsked} questionType={questionType}/>
      <Interviewer/>
      <SubmitAnswer handleSubmitAnswer={handleSubmitAnswer}/>
    </div>
  );
}
