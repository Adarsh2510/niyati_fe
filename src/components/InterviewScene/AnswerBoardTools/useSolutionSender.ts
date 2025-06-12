import { useCallback } from 'react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import {
  userTextResponseAtom,
  userCodeResponseAtom,
  userImageResponseAtom,
  excalidrawRefAtom,
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

  return useCallback(
    async (command: CommandType) => {
      if (!socket) {
        toast.error('Not connected to interview room');
        return;
      }

      let finalImageResponse = image_response;
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

      const payload: UserResponsePayload = {
        text_response,
        code_response,
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
