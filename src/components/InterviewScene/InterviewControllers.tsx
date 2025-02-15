import { useEffect, useState } from "react";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import UnSupportedBrowser from "./UnSupportedBrowser";
import { TUserResponse } from "@/types/interview_room";
import { userTextResponseAtom } from "./atoms";
import { useAtomValue } from "jotai";

enum ESubmitBtnStates {
    INITIAL = 'Record Answer',
    SUBMIT = 'Submit Response',
    ERROR = 'Error',
}

const InterviewControllers = ({handleNextQuestion, handleUserResponse}: {handleNextQuestion: () => void, handleUserResponse: (response: TUserResponse) => void}) => {
    const [submitBtnLabel, setSubmitBtnLabel] = useState(ESubmitBtnStates.INITIAL);
    const [isMounted, setIsMounted] = useState(false);
    const userTextResponse = useAtomValue(userTextResponseAtom);

    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition
      } = useSpeechRecognition();

    const handleSubmitAnswer = () => {
        if (typeof window !== 'undefined') {

        if(submitBtnLabel === ESubmitBtnStates.INITIAL){
            setSubmitBtnLabel(ESubmitBtnStates.SUBMIT);
            SpeechRecognition.startListening({continuous: true})
        }
        else if (submitBtnLabel === ESubmitBtnStates.SUBMIT){
            SpeechRecognition.stopListening();
            console.log('transcript', transcript)
            handleUserResponse({
                response: transcript,
                supporting_text_or_code_response: userTextResponse
            })
            resetTranscript();
            setSubmitBtnLabel(ESubmitBtnStates.INITIAL);
        }}
        // TODO: Share text response as well as audio response
        // Text response mainly gonna contain the coding answers
    }

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (isMounted && !browserSupportsSpeechRecognition) { // Had to check this to avoid hydration error
        return <UnSupportedBrowser />;
    }

    return (
        <div>
            <button className="bg-green-500 text-white p-2 rounded-md hover:bg-green-600" onClick={handleNextQuestion}>Start Interview</button>
            <button className={`text-white p-2 rounded-md  ${submitBtnLabel === ESubmitBtnStates.SUBMIT ? 'bg-red-700 hover:bg-red-500' : 'bg-red-500 hover:bg-red-600'}`} onClick={handleSubmitAnswer}>{submitBtnLabel}</button>
        </div>
    )
}
export default InterviewControllers;