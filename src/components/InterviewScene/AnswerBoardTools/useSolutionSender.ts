import { useCallback } from 'react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import {
  userTextResponseAtom,
  userCodeResponseAtom,
  userImageResponseAtom,
  excalidrawRefAtom,
  answerBoardPlaceholderAtom,
} from './atoms';
import { InterviewRoomSocket } from '@/lib/socket/InterviewRoomSocket';
import { CommandType, UserResponsePayload } from '@/types/interview';
import { ESolutionType } from '@/constants/interview';
import { toast } from 'sonner';
import { generateWhiteboardImageUrl } from './utils';
import { currentQuestionAtom } from './atoms';

export function useSolutionSender(socket: InterviewRoomSocket | null) {
  const text_response = useAtomValue(userTextResponseAtom);
  const code_response = useAtomValue(userCodeResponseAtom);
  const [image_response, setImageResponse] = useAtom(userImageResponseAtom);
  const excalidrawRef = useAtomValue(excalidrawRefAtom);
  const currentQuestion = useAtomValue(currentQuestionAtom);
  const answerBoardPlaceholder = useAtomValue(answerBoardPlaceholderAtom);
  return useCallback(
    async (command: CommandType) => {
      if (!socket) {
        toast.error('Not connected to interview room');
        return;
      }

      let finalImageResponse = image_response;
      let finalCodeResponse = code_response;
      if (currentQuestion?.solution_type === ESolutionType.WHITEBOARD_IMAGE) {
        const generatedUrl = await generateWhiteboardImageUrl(excalidrawRef);
        if (generatedUrl) {
          setImageResponse(generatedUrl);
          finalImageResponse = generatedUrl;
        } else {
          toast.error('Failed to generate whiteboard image. Please try again.');
          return;
        }
      }

      if (currentQuestion?.solution_type === ESolutionType.CODE_SOLUTION) {
        const placeholderLines = answerBoardPlaceholder
          .split('\n')
          .map(l => l.trim())
          .filter(l => l.length > 0);

        const cleanedCodeLines = code_response
          .split('\n')
          .filter(line => !placeholderLines.includes(line.trim()));

        finalCodeResponse = cleanedCodeLines.join('\n').trim();
      }

      const payload: UserResponsePayload = {
        text_response,
        code_response: finalCodeResponse,
        image_response: finalImageResponse,
      };
      socket.sendCompleteSolution(payload, command);
    },
    [
      socket,
      text_response,
      code_response,
      image_response,
      excalidrawRef,
      setImageResponse,
      currentQuestion,
    ]
  );
}
