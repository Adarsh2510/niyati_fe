//atoms for the interview scene

import { atom } from 'jotai';
import { IGetCurrentQuestionResponse } from '@/lib/api/types';
export const isSpeakingAtom = atom(false);
export const userTextResponseAtom = atom('');
export const userImageResponseAtom = atom('');
export const userCodeResponseAtom = atom('');
export const currentQuestionAtom = atom<
  (IGetCurrentQuestionResponse & { _repeatId?: number }) | undefined
>(undefined);
export const currentWordIndexAtom = atom(-1);
// export const currentAnimationAtom = atom(animations.SittingIdle);
