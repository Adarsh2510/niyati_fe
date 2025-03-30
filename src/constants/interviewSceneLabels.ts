import { ESolutionType } from "./interview";

export const answerBoardPlaceholders = {
    [ESolutionType.CODE_SOLUTION]: '### Question: ${questionText}\n\n Please share your reponse using record answer button and type in your any supporting text or code here.',
    [ESolutionType.WHITEBOARD_IMAGE]: 'Upload your whiteboard image here',
    [ESolutionType.CODE_REPO_WITH_OUTPUT]: 'Enter your code here',
    [ESolutionType.TEXT_ANSWER]: 'Enter your text answer here',
}
