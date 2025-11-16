import { useEffect, useRef } from 'react';
import { AppState } from 'react-native';
import { storage } from '@/utils/storage';

export function useAppStateCleanup() {
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    const checkAndClearOnColdStart = async () => {
      const wasBackgrounded = await storage.getAppWasBackgrounded();
      if (wasBackgrounded) {
        await storage.clearChatHistory();
      }
      await storage.setAppWasBackgrounded(false);
    };

    checkAndClearOnColdStart();

    const subscription = AppState.addEventListener('change', async (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        await storage.setAppWasBackgrounded(false);
      } else if (nextAppState.match(/inactive|background/)) {
        await storage.setAppWasBackgrounded(true);
      }

      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);
}
