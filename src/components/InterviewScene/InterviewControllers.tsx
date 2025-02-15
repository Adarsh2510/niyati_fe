import { useState } from "react";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import UnSupportedBrowser from "./UnSupportedBrowser";

enum ESubmitBtnStates {
    INITIAL = 'Record Answer',
    SUBMIT = 'Submit Response',
    ERROR = 'Error',
}

const InterviewControllers = ({handleNextQuestion, handleUserResponse}: {handleNextQuestion: () => void, handleUserResponse: (response: string) => void}) => {
    const [userResponse, setUserResponse] = useState('');
    const [submitBtnLabel, setSubmitBtnLabel] = useState(ESubmitBtnStates.INITIAL);
    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition
      } = useSpeechRecognition();

      if (!browserSupportsSpeechRecognition) {
        return <UnSupportedBrowser />;
      }

    const handleSubmitAnswer = () => {
        if (typeof window !== 'undefined') {

        if(submitBtnLabel === ESubmitBtnStates.INITIAL){
            setSubmitBtnLabel(ESubmitBtnStates.SUBMIT);
            SpeechRecognition.startListening({continuous: true})
        }
        else if (submitBtnLabel === ESubmitBtnStates.SUBMIT){
            SpeechRecognition.stopListening();
            console.log('transcript', transcript)
            handleUserResponse(transcript)
            resetTranscript();
            setSubmitBtnLabel(ESubmitBtnStates.INITIAL);
        }}
        // TODO: Share text response as well as audio response
        // Text response mainly gonna contain the coding answers
    }
    return (
        <div>
            <button className="bg-green-500 text-white p-2 rounded-md hover:bg-green-600" onClick={handleNextQuestion}>Start Interview</button>
            <input type="text" onChange={(e) => setUserResponse(e.target.value)} />
            <button className={`text-white p-2 rounded-md  ${submitBtnLabel === ESubmitBtnStates.SUBMIT ? 'bg-red-700 hover:bg-red-500' : 'bg-red-500 hover:bg-red-600'}`} onClick={handleSubmitAnswer}>{submitBtnLabel}</button>
        </div>
    )
}
export default InterviewControllers;