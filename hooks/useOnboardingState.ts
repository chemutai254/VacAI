import { useState, useEffect } from 'react';
import { storage } from '@/utils/storage';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

export type OnboardingPhase = 
  | 'loading'
  | 'landing'
  | 'language'
  | 'consent'
  | 'auth'
  | 'login'
  | 'main';

export function useOnboardingState(): OnboardingPhase {
  const { isAuthenticated, isLoading: authLoading, hasExistingProfile } = useAuth();
  const { isLanguageSelected } = useLanguage();
  const [phase, setPhase] = useState<OnboardingPhase>('loading');

  useEffect(() => {
    determinePhase();
  }, [isAuthenticated, isLanguageSelected, authLoading, hasExistingProfile]);

  const determinePhase = async () => {
    if (authLoading) {
      setPhase('loading');
      return;
    }

    const hasSeenLanding = await storage.getHasSeenLanding();
    if (!hasSeenLanding) {
      setPhase('landing');
      return;
    }

    if (!isLanguageSelected) {
      setPhase('language');
      return;
    }

    const consentValue = await storage.getDataConsent();
    const hasSetConsent = consentValue !== null;
    if (!hasSetConsent) {
      setPhase('consent');
      return;
    }

    if (!isAuthenticated) {
      if (hasExistingProfile) {
        setPhase('login');
      } else {
        setPhase('auth');
      }
      return;
    }

    setPhase('main');
  };

  return phase;
}
