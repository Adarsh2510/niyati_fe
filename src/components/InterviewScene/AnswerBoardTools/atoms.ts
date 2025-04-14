//atoms for the interview scene

import { atom } from 'jotai';
import { animations } from '@/constants/interviewer';

export const isSpeakingAtom = atom(false);
export const userTextResponseAtom = atom('');
export const userImageResponseAtom = atom('');
export const userCodeResponseAtom = atom('');
// export const currentAnimationAtom = atom(animations.SittingIdle);
