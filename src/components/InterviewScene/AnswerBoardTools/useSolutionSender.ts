import { useCallback } from 'react';
import { useAtomValue } from 'jotai';
import { userTextResponseAtom, userCodeResponseAtom, userImageResponseAtom } from './atoms';
import { InterviewRoomSocket } from '@/lib/socket/InterviewRoomSocket';
import { CommandType, UserResponsePayload } from '@/types/interview';
import { toast } from 'sonner';

export function useSolutionSender(socket: InterviewRoomSocket | null) {
  const text_response = useAtomValue(userTextResponseAtom);
  const code_response = useAtomValue(userCodeResponseAtom);
  const image_response = useAtomValue(userImageResponseAtom);

  return useCallback(
    (command: CommandType) => {
      if (!socket) {
        toast.error('Not connected to interview room');
        return;
      }
      const payload: UserResponsePayload = {
        text_response,
        code_response,
        image_response,
      };
      socket.sendCompleteSolution(payload, command);
    },
    [socket, text_response, code_response, image_response]
  );
}
