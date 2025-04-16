//atoms for the interview scene

import { atom } from 'jotai';
import { IGetNextQuestionResponse } from '@/lib/api/types';
export const isSpeakingAtom = atom(false);
export const userTextResponseAtom = atom('');
export const userImageResponseAtom = atom('');
export const userCodeResponseAtom = atom('');
export const currentQuestionAtom = atom<IGetNextQuestionResponse | undefined>(undefined);
export const currentWordIndexAtom = atom(-1);
// export const currentAnimationAtom = atom(animations.SittingIdle);
