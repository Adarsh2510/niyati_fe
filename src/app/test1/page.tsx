'use client';

import JudgeCodeEditor from '@/components/InterviewScene/AnswerBoardTools/JudgeCodeEditor';

export default function TestPage() {
  return (
    <JudgeCodeEditor
      initialCode="console.log('Hello, World!');"
      theme="dark"
      onCodeChange={code => console.log('Code changed:', code)}
    />
  );
}
