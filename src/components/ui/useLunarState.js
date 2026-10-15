import { useSyncExternalStore } from 'react';
import { getLunarSnapshot, subscribeLunar } from './lunarState.js';
export function useLunarState() {
  return useSyncExternalStore(subscribeLunar, getLunarSnapshot, getLunarSnapshot);
}
