'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const JudgeCodeEditor = dynamic(
  () => import('@/components/InterviewScene/AnswerBoardTools/JudgeCodeEditor'),
  { ssr: false }
);

export default function TestPage() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  }

  return (
    <JudgeCodeEditor
      initialCode="console.log('Hello, World!');"
      theme="dark"
      onCodeChange={code => console.log('Code changed:', code)}
    />
  );
}
