import { useState } from "react";

export default function SubmitAnswer({handleSubmitAnswer}: {handleSubmitAnswer: (answer: string) => void}) {
    const [answer, setAnswer] = useState<string | null>(null);  
    return (
        <div>
            <input type="text" onChange={(e) => {
                setAnswer(e.target.value);
            }} placeholder="Enter your answer here"/> 
            <button onClick={() => {
                if (answer) {
                    handleSubmitAnswer(answer);
                }
                else{
                    handleSubmitAnswer('user did not enter any answer');
                }
            }}>
            Submit Answer
        </button>
        </div>
    )
}