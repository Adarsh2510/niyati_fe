import { ESolutionType } from './interview';

export const answerBoardPlaceholders = {
  [ESolutionType.CODE_SOLUTION]:
    'Please record your answer using microphone button \nand type in your any supporting text or code here. \nFinally, please click on submit button to save your answer.',
  [ESolutionType.WHITEBOARD_IMAGE]:
    'Please record your answer using microphone button \nand draw your supporting whiteboard image here. \nFinally, please click on submit button to save your answer.',
  [ESolutionType.CODE_REPO_WITH_OUTPUT]:
    'Please record your audio using microphone button \nand type in your any supporting text or code here. \nFinally, please click on submit button to save your answer.',
  [ESolutionType.TEXT_ANSWER]:
    'Please record your answer using microphone button \nand type in your any supporting text here. \nFinally, please click on submit button to save your answer.',
};
