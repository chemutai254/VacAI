import { useEffect, useRef } from 'react';
import { AppState } from 'react-native';
import { storage } from '@/utils/storage';

const BACKGROUND_THRESHOLD = 30 * 60 * 1000;

export function useAppStateCleanup() {
  const appState = useRef(AppState.currentState);
  const backgroundTime = useRef<number | null>(null);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', async (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        if (backgroundTime.current) {
          const timeInBackground = Date.now() - backgroundTime.current;
          
          if (timeInBackground > BACKGROUND_THRESHOLD) {
            await storage.clearChatHistory();
          }
          
          backgroundTime.current = null;
        }
      } else if (nextAppState.match(/inactive|background/)) {
        backgroundTime.current = Date.now();
      }

      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);
}
