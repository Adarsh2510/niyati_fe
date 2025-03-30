import { useEffect, useState } from "react";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import UnSupportedBrowser from "./UnSupportedBrowser";
import { TUserResponse } from "@/lib/api/types";
import { userCodeResponseAtom, userImageResponseAtom, userTextResponseAtom } from "./AnswerBoardTools/atoms";
import { useAtomValue } from "jotai";
import { Button } from "../ui/button";

enum ESubmitBtnStates {
    INITIAL = 'Record Answer',
    SUBMIT = 'Submit Response',
    ERROR = 'Error',
}

const InterviewControllers = ({
    handleNextQuestion, 
    handleUserResponse,
    className
}: {
    handleNextQuestion: () => void, 
    handleUserResponse: (response: TUserResponse) => void,
    className?: string
}) => {
    const [submitBtnLabel, setSubmitBtnLabel] = useState(ESubmitBtnStates.INITIAL);
    const [isMounted, setIsMounted] = useState(false);
    const userTextResponse = useAtomValue(userTextResponseAtom);
    const userImageResponse = useAtomValue(userImageResponseAtom);
    const userCodeResponse = useAtomValue(userCodeResponseAtom);

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
                audio_response: transcript,
                text_response: userTextResponse,
                image_response: userImageResponse,
                code_response: userCodeResponse
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
        <div className={`flex gap-4 justify-center ${className}`}>
            <Button 
                variant="default" 
                className="bg-green-500 hover:bg-green-600" 
                onClick={handleNextQuestion}
            >
                Start Interview
            </Button>
            <Button
                variant="destructive"
                className={submitBtnLabel === ESubmitBtnStates.SUBMIT ? 'bg-red-700 hover:bg-red-500' : 'bg-red-500 hover:bg-red-600'}
                onClick={handleSubmitAnswer}
            >
                {submitBtnLabel}
            </Button>
        </div>
    )
}
export default InterviewControllers;