const InterviewControllers = ({handleNextQuestion, handleSubmitAnswer}: {handleNextQuestion: () => void, handleSubmitAnswer: (response: string) => void}) => {
    return (
        <div>
            <button style={{backgroundColor: 'green', color: 'white'}} onClick={handleNextQuestion}>Next Question</button>
            <button style={{backgroundColor: 'red', color: 'white'}} onClick={() => handleSubmitAnswer('test response')}>Submit Answer</button>
        </div>
    )
}
export default InterviewControllers;