import React, { useEffect, useState } from 'react';
import CodeMirror, { Extension } from '@uiw/react-codemirror';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import { langs } from '@uiw/codemirror-extensions-langs';
import Conditional from '../../Conditional';
import {
  EProgrammingLanguages,
  SUPPORTED_LANGUAGES_EXTENSIONS,
} from '@/constants/programmingLanguages';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Button } from '../../ui/button';
import { ChevronRight, ChevronsLeft, PlayCircle, RefreshCw } from 'lucide-react';
import { submitCode } from '@/lib/services/judge0Service';
import { getSubmissionResult } from '@/lib/services/judge0Service';
import { useAtom } from 'jotai';
import { userCodeResponseAtom } from './atoms';

interface JudgeCodeEditorProps {
  initialCode?: string;
  language?: EProgrammingLanguages;
  theme?: 'light' | 'dark';
  onCodeChange?: (code: string) => void;
  questionTestCases?: string[];
}

const JudgeCodeEditor: React.FC<JudgeCodeEditorProps> = ({
  initialCode = '',
  language: initialLanguage = EProgrammingLanguages.JAVASCRIPT,
  theme = 'light',
  onCodeChange,
  questionTestCases,
}) => {
  const [code, setCode] = useAtom(userCodeResponseAtom);
  const [input, setInput] = useState<string>('');
  const [output, setOutput] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isToolbarVisible, setIsToolbarVisible] = useState(true);
  const [language, setLanguage] = useState<EProgrammingLanguages>(initialLanguage);
  const [languageExtension, setLanguageExtension] = useState<Extension>(
    SUPPORTED_LANGUAGES_EXTENSIONS[language]
  );

  const handleEditorChange = (value: string) => {
    setCode(value);
    onCodeChange?.(value);
  };

  const handleLanguageChange = (value: EProgrammingLanguages) => {
    setLanguage(value);
    setLanguageExtension(SUPPORTED_LANGUAGES_EXTENSIONS[value]);
  };

  const handleRunCode = async () => {
    setIsLoading(true);
    try {
      const token = await submitCode({ code, language, input });
      const result = await getSubmissionResult(token);

      if (result.stderr) {
        setOutput(`Error: ${result.stderr}`);
      } else if (result.stdout) {
        setOutput(result.stdout);
      } else if (result.compile_output) {
        setOutput(`Compilation Output: ${result.compile_output}`);
      } else {
        setOutput('No output available');
      }
    } catch (error) {
      setOutput('Error running code: ' + (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setCode(initialCode);
  }, [initialCode]);

  return (
    <>
      <div className="flex flex-row h-full w-full border-8 border-gray-500 dark:border-gray-800 rounded-md">
        <div className="h-full w-full flex flex-1 flex-col overflow-hidden relative">
          <div className="absolute inset-0">
            <CodeMirror
              value={code}
              theme={vscodeDark}
              extensions={[languageExtension]}
              height="100%"
              width="100%"
              className="h-full [&_.cm-scroller]:!overflow-auto [&_.cm-content]:!overflow-auto"
              onChange={handleEditorChange}
            />
          </div>
        </div>

        <Conditional if={isToolbarVisible}>
          <div className="w-[27%] bg-gray-100 p-4 flex flex-col border-l-2 border-gray-500">
            <div className="flex-1">
              <div className="mb-4">
                <span className="p-2 text-md font-bold">Input</span>
                <textarea
                  rows={4}
                  className="mt-4 w-full p-2 border-2 border-gray-300 dark:border-gray-800 rounded bg-gray-300"
                  value={input}
                  placeholder="Enter input here"
                  onChange={e => setInput(e.target.value)}
                />
              </div>
              <div className="mb-4 overflow-auto">
                <span className="p-2 text-md font-bold">Output</span>
                <pre className="mt-4 p-4 bg-gray-300 dark:bg-gray-800 rounded whitespace-pre-wrap">
                  {output ? output : 'Run code to see output'}
                </pre>
              </div>
            </div>

            <div className="mb-4 overflow-auto">
              <span className="p-2 text-md font-bold">Examples</span>
              {questionTestCases?.map((testCase, index) => (
                <pre
                  key={index}
                  className="mt-4 p-4 bg-gray-300 dark:bg-gray-800 rounded whitespace-pre-wrap"
                >
                  <span>{testCase}</span>
                </pre>
              ))}
            </div>

            <div className="mt-auto pt-4 bg-gray-100">
              <div className="flex flex-row flex-wrap gap-2 justify-end items-center w-full">
                <div className="flex-1">
                  <Select value={language} onValueChange={handleLanguageChange}>
                    <SelectTrigger className="bg-white dark:bg-gray-800">
                      <SelectValue>{language}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(EProgrammingLanguages).map(([key, value]) => (
                        <SelectItem key={key} value={value}>
                          {value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  onClick={handleRunCode}
                  disabled={isLoading}
                  className="bg-blue-500 text-white hover:bg-blue-600 disabled:bg-gray-400 flex-shrink-0"
                >
                  {isLoading ? (
                    <>
                      <span>Running...</span> <RefreshCw />{' '}
                    </>
                  ) : (
                    <>
                      <span>Run Code</span> <PlayCircle />{' '}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </Conditional>
      </div>

      <div className="absolute right-0 bottom-2">
        {isToolbarVisible ? (
          <Button
            onClick={() => setIsToolbarVisible(!isToolbarVisible)}
            disabled={isLoading}
            className="bg-blue-500 text-white rounded-l-full hover:bg-blue-600"
          >
            <span>Hide toolbar</span> <ChevronRight />
          </Button>
        ) : (
          <Button
            onClick={() => setIsToolbarVisible(!isToolbarVisible)}
            className="bg-blue-500 text-white rounded-l-full hover:bg-blue-600"
            aria-label="Show toolbar"
          >
            <ChevronsLeft /> <span className="text-md">toolbar</span>
          </Button>
        )}
      </div>
    </>
  );
};

export default JudgeCodeEditor;
