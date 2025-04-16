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
    const utterance = new SpeechSynthesisUtterance(questionText);
    console.log('Speaking question:', questionText);

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
      console.log('Speech started');
      setIsSpeaking(true);
      // Reset the current word index when starting new speech
      currentWordIndex = 0;
      setCurrentWordIndex(-1);
    };

    utterance.onend = () => {
      console.log('Speech ended');
      setIsSpeaking(false);
      setCurrentWordIndex(-1);
    };
    utterance.onerror = event => console.error('Speech error:', event);

    window.speechSynthesis.speak(utterance);
  }
};
