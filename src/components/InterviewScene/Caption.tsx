import { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import { Button } from '../ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { RefreshCw, X } from 'lucide-react';

interface CaptionProps {
  text: string;
  isSpeaking: boolean;
  currentWordIndex: number;
}

const Caption: React.FC<CaptionProps> = ({ text, isSpeaking, currentWordIndex }) => {
  const highlightedWordRef = useRef<HTMLSpanElement>(null);
  const captionRef = useRef<HTMLDivElement>(null);
  const previousLineTopRef = useRef<number>(0);
  const [allowAutoScroll, setAllowAutoScroll] = useState(true);
  const [isCaptionVisible, setIsCaptionVisible] = useState(true);

  const words = useMemo(() => (text ? text.split(' ') : []), [text]);

  const scrollToHighlightedWord = useCallback(() => {
    if (highlightedWordRef.current && allowAutoScroll) {
      highlightedWordRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      previousLineTopRef.current = highlightedWordRef.current.offsetTop;
    }
  }, [allowAutoScroll]);

  useEffect(() => {
    if (highlightedWordRef.current?.offsetTop !== previousLineTopRef.current && allowAutoScroll) {
      scrollToHighlightedWord();
    }
  }, [currentWordIndex, scrollToHighlightedWord, allowAutoScroll]);

  useEffect(() => {
    const el = captionRef.current;
    if (el) {
      const onScroll = () => setAllowAutoScroll(false);
      el.addEventListener('scroll', onScroll);
      return () => el.removeEventListener('scroll', onScroll);
    }
  }, []);

  const handleResetAutoScroll = () => {
    setAllowAutoScroll(true);
    scrollToHighlightedWord();
  };

  if (!isSpeaking || !text || !isCaptionVisible) return null;

  return (
    <TooltipProvider delayDuration={0}>
      <div className="fixed bottom-14 left-0 right-0 bg-black/70 text-neutral-100 p-2 flex flex-row items-start z-50">
        <div ref={captionRef} className="flex-grow overflow-y-auto max-h-8 scroll-smooth mr-2">
          <p className="text-lg text-left">
            {words.map((word, idx) => {
              const isHighlighted = idx === currentWordIndex;
              return (
                <span
                  key={idx}
                  ref={isHighlighted ? highlightedWordRef : null}
                  className={isHighlighted ? 'text-yellow-300' : ''}
                >
                  {word}{' '}
                </span>
              );
            })}
          </p>
        </div>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" onClick={handleResetAutoScroll}>
              <RefreshCw className="w-5 h-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Reset auto-scroll to follow words</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" onClick={() => setIsCaptionVisible(v => !v)}>
              <X className="w-5 h-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Close caption</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
};

export default Caption;
