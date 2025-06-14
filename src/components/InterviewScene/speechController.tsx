import { ELogLevels } from '@/constants/logs';
import { sendLog } from '@/utils/logs';

export const speakText = ({
  text,
  setIsSpeaking,
  setCurrentWordIndex,
}: {
  text: string;
  setIsSpeaking: (isSpeaking: boolean) => void;
  setCurrentWordIndex: (index: number) => void;
}) => {
  if (typeof window === 'undefined') return;
  if (!text) return;

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  sendLog({ level: ELogLevels.Info, message: 'Speaking: ' + text });
  utterance.lang = 'en-US';
  utterance.pitch = 1;
  utterance.rate = 1;

  let wordIndex = 0;
  utterance.onboundary = event => {
    if (event.name === 'word') {
      setCurrentWordIndex(wordIndex);
      wordIndex++;
    }
  };

  utterance.onstart = () => {
    sendLog({ level: ELogLevels.Info, message: 'Speech started' });
    setIsSpeaking(true);
    wordIndex = 0;
    setCurrentWordIndex(-1);
  };

  utterance.onend = () => {
    sendLog({ level: ELogLevels.Info, message: 'Speech ended' });
    setIsSpeaking(false);
    setCurrentWordIndex(-1);
  };

  utterance.onerror = event => {
    if (event.error !== 'interrupted') {
      sendLog({
        level: ELogLevels.Error,
        message: 'Speech error:',
        err: event as unknown as Error,
      });
    }
  };

  window.speechSynthesis.speak(utterance);
};
