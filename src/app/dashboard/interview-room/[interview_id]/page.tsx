'use client';
import 'regenerator-runtime/runtime';

import { IGetNextQuestionResponse } from '@/lib/api/types';
import { useState, useRef, useMemo } from 'react';
import { QuestionType } from '@/constants/questions';
import { ESolutionType } from '@/constants/interview';
import QuestionSection from '@/components/InterviewScene/QuestionSection';
import InterviewControllers from '@/components/InterviewScene/InterviewControllers';
import { getNextQuestion, submitAnswer } from '@/lib/api/getInterviewData';
import { TUserResponse } from '@/lib/api/types';
import { redirect } from 'next/navigation';
import DashboardHeader from '@/components/common/DashboardHeader';
import Footer from '@/components/common/Footer';
import { currentQuestionAtom } from '@/components/InterviewScene/AnswerBoardTools/atoms';
import { useAtom } from 'jotai';
import { answerBoardPlaceholders } from '@/constants/interviewSceneLabels';

export default function InterviewRoom({ params }: { params: { interview_id: string } }) {
  const { interview_id } = params;
  const [currentQuestion, setCurrentQuestion] = useAtom(currentQuestionAtom);
  const [isInterviewCompleted, setIsInterviewCompleted] = useState(false);
  const [solutionType, setSolutionType] = useState<ESolutionType | undefined>(undefined);
  // const questionType = useRef<QuestionType>(QuestionType.INITIAL);
  const followUpQuestionId = useRef<string | null>(null);
  const answerBoardPlaceholder = useMemo(() => {
    const questionText = currentQuestion?.current_question?.question_text;
    return questionText
      ? `### Question: ${questionText?.replace(/\n{2,}/g, '\n')}\n` +
          answerBoardPlaceholders[solutionType ?? ESolutionType.TEXT_ANSWER]
      : answerBoardPlaceholders[solutionType ?? ESolutionType.TEXT_ANSWER];
  }, [currentQuestion, solutionType]);

  const handleNextQuestion = async () => {
    getNextQuestion({ user_id: 'test-user-id', interview_id: interview_id }).then(data => {
      if (data.is_interview_completed) {
        setCurrentQuestion(undefined);
        setIsInterviewCompleted(true);
      } else if (data.next_question) {
        setCurrentQuestion({
          ...data,
          current_question: data.next_question,
        });
        setSolutionType(data.solution_type);
      }
    });
  };

  const handleSubmitAnswer = (answer: TUserResponse) => {
    console.log('recieved answer', answer);
    submitAnswer({
      user_id: 'test-user-id',
      interview_id: interview_id,
      question_type: currentQuestion?.question_type ?? QuestionType.INITIAL,
      user_response: answer,
      follow_up_question_id: followUpQuestionId.current ?? undefined,
    }).then(data => {
      console.log('recieved data', data);
      if (data.follow_up_question) {
        followUpQuestionId.current = Object.keys(data.follow_up_question)[0] ?? null;
        setCurrentQuestion({
          question_type: QuestionType.FOLLOW_UP,
          current_question: Object.values(data.follow_up_question)[0],
          is_last_question: false,
          is_interview_completed: false,
          solution_type: currentQuestion?.solution_type ?? ESolutionType.TEXT_ANSWER,
        });
      } else {
        followUpQuestionId.current = null;
        getNextQuestion({ user_id: 'test-user-id', interview_id: interview_id }).then(data => {
          if (data.is_interview_completed) {
            setCurrentQuestion(undefined);
            setIsInterviewCompleted(true);
          } else if (data.next_question) {
            setCurrentQuestion({
              ...data,
              current_question: data.next_question,
            });
          }
        });
      }
    });
  };

  const handleUserResponse = async (response: TUserResponse) => {
    console.log(response);
    response.code_response = response.code_response?.replace(answerBoardPlaceholder, '');
    handleSubmitAnswer(response);
  };

  if (isInterviewCompleted) {
    redirect(`/dashboard/interview-room/${interview_id}/summary`);
  }
  return (
    <div className="min-h-screen grid grid-rows-[auto_1fr_auto_auto]">
      <QuestionSection
        solutionType={solutionType ?? ESolutionType.TEXT_ANSWER}
        answerBoardPlaceholder={answerBoardPlaceholder}
      />
      <InterviewControllers
        handleNextQuestion={handleNextQuestion}
        handleUserResponse={handleUserResponse}
        className="p-2 bg-gray-100 border-t"
        interviewId={interview_id}
      />
      <Footer />
    </div>
  );
}
