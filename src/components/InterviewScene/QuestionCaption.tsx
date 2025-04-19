import { useAtomValue } from 'jotai';
import {
  isSpeakingAtom,
  currentQuestionAtom,
  currentWordIndexAtom,
} from './AnswerBoardTools/atoms';
import { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import { RefreshCw, X } from 'lucide-react';
import { Button } from '../ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const QuestionCaption = () => {
  const isSpeaking = useAtomValue(isSpeakingAtom);
  const currentQuestion = useAtomValue(currentQuestionAtom);
  const currentWordIndex = useAtomValue(currentWordIndexAtom);
  const questionText = currentQuestion?.current_question?.question_text;
  const highlightedWordRef = useRef<HTMLSpanElement>(null);
  const previousLineTopRef = useRef<number>(0);
  const captionRef = useRef<HTMLDivElement>(null);
  const [allowAutoScroll, setAllowAutoScroll] = useState(false);
  const [isCaptionVisible, setIsCaptionVisible] = useState(true);

  const words = useMemo(() => {
    return questionText ? questionText.split(' ') : [];
  }, [questionText]);

  const scrollToHighlightedWord = useCallback(() => {
    if (highlightedWordRef.current && allowAutoScroll) {
      highlightedWordRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
      previousLineTopRef.current = highlightedWordRef.current.offsetTop;
    }
  }, [allowAutoScroll]);

  useEffect(() => {
    if (highlightedWordRef.current?.offsetTop !== previousLineTopRef.current && allowAutoScroll) {
      scrollToHighlightedWord();
    }
  }, [currentWordIndex, scrollToHighlightedWord]);

  useEffect(() => {
    if (captionRef.current) {
      captionRef.current.addEventListener('scroll', () => {
        //disable auto scroll when user scrolls
        setAllowAutoScroll(false);
      });
    }
  }, []);

  const handleResetAutoScroll = () => {
    setAllowAutoScroll(true);
    scrollToHighlightedWord();
  };

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
    <TooltipProvider delayDuration={0}>
      <div className="fixed bottom-14 left-0 right-0 bg-black/70 text-neutral-100 p-2 flex flex-row items-start z-50">
        <div ref={captionRef} className="flex-grow overflow-y-auto max-h-8 scroll-smooth mr-2">
          <p className="text-lg text-left">{captionContent}</p>
        </div>

        <div className="flex-shrink-0">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-neutral-400 hover:text-black-100"
                onClick={handleResetAutoScroll}
              >
                <RefreshCw className="w-5 h-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Reset auto-scroll to follow words</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <div className="flex-shrink-0">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-neutral-400 hover:text-black-100"
                onClick={() => setIsCaptionVisible(!isCaptionVisible)}
              >
                <X className="w-5 h-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Close caption</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default QuestionCaption;
