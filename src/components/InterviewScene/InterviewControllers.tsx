import { useState } from "react";

const InterviewControllers = ({handleNextQuestion, handleUserResponse}: {handleNextQuestion: () => void, handleUserResponse: (response: string) => void}) => {
    const [userResponse, setUserResponse] = useState('');
    return (
        <div>
            <button style={{backgroundColor: 'green', color: 'white'}} onClick={handleNextQuestion}>Start Interview</button>
            <input type="text" onChange={(e) => setUserResponse(e.target.value)} />
            <button style={{backgroundColor: 'red', color: 'white'}} onClick={() => handleUserResponse(userResponse)}>Submit Answer</button>
        </div>
    )
}
export default InterviewControllers;