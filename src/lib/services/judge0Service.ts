import { EJudge0Endpoints } from "@/constants/endpoints";
import { SUPPORTED_LANGUAGES_CODES } from "@/constants/programmingLanguages";

interface Judge0Submission {
  source_code: string;
  language_id: number;
  stdin?: string;
  expected_output?: string;
}

interface Judge0Response {
  token: string;
}

interface Judge0Result {
  stdout: string | null;
  stderr: string | null;
  compile_output: string | null;
  message: string | null;
  status: {
    id: number;
    description: string;
  };
}

const JUDGE0_API_URL = process.env.NEXT_PUBLIC_JUDGE0_API_URL || 'https://judge0-ce.p.rapidapi.com';
const JUDGE0_API_KEY = process.env.NEXT_PUBLIC_JUDGE0_API_KEY;

export const submitCode = async (code: string, language: keyof typeof SUPPORTED_LANGUAGES_CODES): Promise<string> => {
  if (!JUDGE0_API_KEY) {
    throw new Error('Judge0 API key is not configured');
  }

  const submission: Judge0Submission = {
    source_code: code,
    language_id: SUPPORTED_LANGUAGES_CODES[language],
  };

  const response = await fetch(`${JUDGE0_API_URL}${EJudge0Endpoints.SUBMIT_CODE}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-RapidAPI-Key': JUDGE0_API_KEY,
      'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
    },
    body: JSON.stringify(submission),
  });

  if (!response.ok) {
    throw new Error('Failed to submit code');
  }

  const data: Judge0Response = await response.json();
  return data.token;
};

export const getSubmissionResult = async (token: string): Promise<Judge0Result> => {
  if (!JUDGE0_API_KEY) {
    throw new Error('Judge0 API key is not configured');
  }

  const response = await fetch(`${JUDGE0_API_URL}${EJudge0Endpoints.GET_SUBMISSION_RESULT}/${token}`, {
    headers: {
      'X-RapidAPI-Key': JUDGE0_API_KEY,
      'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to get submission result');
  }

  return response.json();
}; 