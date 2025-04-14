export const speakQuestion = ({
  questionText,
  setIsSpeaking,
}: {
  questionText: string;
  setIsSpeaking: (isSpeaking: boolean) => void;
}) => {
  if (questionText) {
    const utterance = new SpeechSynthesisUtterance(questionText);
    console.log('Speaking question:', questionText);

    utterance.lang = 'en-US';
    utterance.pitch = 1;
    utterance.rate = 1;

    utterance.onstart = () => {
      console.log('Speech started');
      setIsSpeaking(true);
    };

    utterance.onend = () => {
      console.log('Speech ended');
      setIsSpeaking(false);
    };
    utterance.onerror = event => console.error('Speech error:', event);

    window.speechSynthesis.speak(utterance);
  }
};
