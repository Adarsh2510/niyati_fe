// atoms for the interview scene

import { atom } from 'jotai';
import { IGetCurrentQuestionResponse } from '@/lib/api/types';
import { createExcalidrawRef } from './utils';

export const isSpeakingAtom = atom(false);
export const userTextResponseAtom = atom('');
export const userImageResponseAtom = atom('');
export const userCodeResponseAtom = atom('');
export const currentQuestionAtom = atom<
  (IGetCurrentQuestionResponse & { _repeatId?: number }) | null
>(null);
export const currentWordIndexAtom = atom(-1);
export const excalidrawRefAtom = atom(createExcalidrawRef());

// Unified interruption state
export const interruptionStateAtom = atom<{
  message: string | null;
  _repeatId?: number;
  isSpeaking: boolean;
  wordIndex: number;
}>({
  message: null,
  _repeatId: undefined,
  isSpeaking: false,
  wordIndex: -1,
});

// Derived atoms for interruption state
export const interruptionMessageAtom = atom(
  get => get(interruptionStateAtom).message,
  (get, set, newData: { message: string; _repeatId?: number } | null) => {
    const state = get(interruptionStateAtom);
    set(interruptionStateAtom, {
      ...state,
      message: newData?.message ?? null,
      _repeatId: newData?._repeatId,
    });
  }
);

export const isInterruptionSpeakingAtom = atom(
  get => get(interruptionStateAtom).isSpeaking,
  (get, set, isSpeaking: boolean) => {
    const state = get(interruptionStateAtom);
    set(interruptionStateAtom, {
      ...state,
      isSpeaking,
    });
  }
);

export const interruptionWordIndexAtom = atom(
  get => get(interruptionStateAtom).wordIndex,
  (get, set, index: number) => {
    const state = get(interruptionStateAtom);
    set(interruptionStateAtom, {
      ...state,
      wordIndex: index,
    });
  }
);
