'use client'

import { IIntQuestions } from "@/lib/api/types";
import { QuestionType } from "@/constants/questions";
import { useEffect, useState, useRef } from "react";

export default function QuestionSection({currentQuestion, handleIsQuestionAsked, questionType }: {currentQuestion: IIntQuestions | null, handleIsQuestionAsked: (is_question_asked: boolean) => void, questionType: QuestionType}) {
    const [isQuestionNarrated, setIsQuestionNarrated] = useState(false);
    const previousQuestionRef = useRef<string | null>(null);

    const speakQuestion = () => {
        if (currentQuestion?.question_text && 
            !isQuestionNarrated && 
            currentQuestion.question_text !== previousQuestionRef.current) {
            
            console.log('Speaking question:', currentQuestion.question_text);
            const utterance = new SpeechSynthesisUtterance(currentQuestion.question_text);
            utterance.lang = 'en-US';
            utterance.pitch = 1;
            utterance.rate = 1;

            utterance.onstart = () => console.log('Speech started');
            utterance.onend = () => {
                console.log('Speech ended');
                setIsQuestionNarrated(true);
                handleIsQuestionAsked(true);
            };
            utterance.onerror = (event) => console.error('Speech error:', event);

            window.speechSynthesis.speak(utterance);
            previousQuestionRef.current = currentQuestion.question_text;
        }
    };

    useEffect(() => {
        if (currentQuestion?.question_text !== previousQuestionRef.current) {
            setIsQuestionNarrated(false);
        }
    }, [currentQuestion?.question_text]);

    useEffect(() => {
        if (currentQuestion) {
            speakQuestion();
        }
    }, [currentQuestion]);

    return (
        <div>
            <h1>{currentQuestion?.question_text ?? "No question found"}</h1>
            
        </div>
    )
}
