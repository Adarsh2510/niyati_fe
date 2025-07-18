import { ESolutionType } from './interview';

export const answerBoardPlaceholders = {
  [ESolutionType.CODE_SOLUTION]:
    '// Type your code solution here\n// You can also add comments to explain your approach',
  [ESolutionType.WHITEBOARD_IMAGE]:
    "// Use the whiteboard to draw your solution\n// Click save when you're done",
  [ESolutionType.CODE_REPO_WITH_OUTPUT]:
    '// Type your code solution here\n// Include any supporting text or explanations',
  [ESolutionType.TEXT_ANSWER]:
    '// Type your answer here\n// You can include explanations, examples, or additional context',
};
