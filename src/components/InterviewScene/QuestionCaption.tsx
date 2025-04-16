import { useAtomValue } from 'jotai';
import {
  isSpeakingAtom,
  currentQuestionAtom,
  currentWordIndexAtom,
} from './AnswerBoardTools/atoms';
import { useRef, useEffect, useState, useMemo } from 'react';
import { X } from 'lucide-react';
import { Button } from '../ui/button';

const QuestionCaption = () => {
  const isSpeaking = useAtomValue(isSpeakingAtom);
  const currentQuestion = useAtomValue(currentQuestionAtom);
  const currentWordIndex = useAtomValue(currentWordIndexAtom);
  const questionText = currentQuestion?.next_question?.question_text;
  const highlightedWordRef = useRef<HTMLSpanElement>(null);
  const [isCaptionVisible, setIsCaptionVisible] = useState(true);

  const words = useMemo(() => {
    return questionText ? questionText.split(' ') : [];
  }, [questionText]);

  useEffect(() => {
    highlightedWordRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
  }, [currentWordIndex]);

  const shouldRender = isSpeaking && questionText && currentQuestion && isCaptionVisible;

  if (!shouldRender) {
    return null;
  }

  // Generate the spans to render
  const captionContent = words.map((word, index) => {
    const isHighlighted = index === currentWordIndex;
    return (
      <span
        key={index}
        ref={isHighlighted ? highlightedWordRef : null} // Assign ref only to the highlighted word
        className={isHighlighted ? 'text-yellow-300' : ''}
      >
        {word}{' '}
      </span>
    );
  });

  return (
    <div className="fixed bottom-14 left-0 right-0 bg-black/70 text-neutral-100 p-2 flex flex-row items-start z-50">
      <div className="flex-grow overflow-y-auto max-h-8 scroll-smooth mr-2">
        <p className="text-lg text-left">{captionContent}</p>
      </div>

      <div className="flex-shrink-0">
        <Button
          variant="ghost"
          size="icon"
          className="text-neutral-400 hover:text-black-100"
          onClick={() => setIsCaptionVisible(!isCaptionVisible)}
        >
          <X className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};

export default QuestionCaption;
