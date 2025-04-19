import { ELogLevels } from '@/constants/logs';
import { sendLog } from '@/utils/logs';

export const speakQuestion = ({
  questionText,
  setIsSpeaking,
  setCurrentWordIndex,
}: {
  questionText: string;
  setIsSpeaking: (isSpeaking: boolean) => void;
  setCurrentWordIndex: (index: number) => void;
}) => {
  if (questionText) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(questionText);
    sendLog({
      level: ELogLevels.Info,
      message: 'Speaking question:' + questionText,
    });

    utterance.lang = 'en-US';
    utterance.pitch = 1;
    utterance.rate = 1;

    let currentWordIndex = 0;

    utterance.onboundary = event => {
      if (event.name === 'word') {
        setCurrentWordIndex(currentWordIndex);
        currentWordIndex++;
      }
    };

    utterance.onstart = () => {
      sendLog({
        level: ELogLevels.Info,
        message: 'Speech started',
      });
      setIsSpeaking(true);
      // Reset the current word index when starting new speech
      currentWordIndex = 0;
      setCurrentWordIndex(-1);
    };

    utterance.onend = () => {
      sendLog({
        level: ELogLevels.Info,
        message: 'Speech ended',
      });
      setIsSpeaking(false);
      setCurrentWordIndex(-1);
    };
    utterance.onerror = event => {
      // Ignore errors with "interrupted" message as they're expected when canceling speech
      if (event.error !== 'interrupted') {
        sendLog({
          level: ELogLevels.Error,
          message: 'Speech error:',
          err: event as unknown as Error,
        });
      }
    };

    window.speechSynthesis.speak(utterance);
  }
};
