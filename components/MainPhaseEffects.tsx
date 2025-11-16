import React, { useState, useEffect } from 'react';
import OfflineDownloadModal from './OfflineDownloadModal';
import { VaccinationStatsModal } from './VaccinationStatsModal';
import { storage } from '@/utils/storage';

export function MainPhaseEffects() {
  const [showOfflineDownload, setShowOfflineDownload] = useState(false);
  const [showVaccinationStats, setShowVaccinationStats] = useState(false);

  useEffect(() => {
    checkOfflineDownload();
    checkVaccinationStats();
  }, []);

  const checkOfflineDownload = async () => {
    const downloaded = await storage.getOfflineDownloaded();
    const dismissed = await storage.getOfflinePromptDismissed();
    if (!downloaded && !dismissed) {
      setShowOfflineDownload(true);
    }
  };

  const checkVaccinationStats = async () => {
    const hasSeenStats = await storage.getHasSeenVaccinationStats();
    if (!hasSeenStats) {
      setShowVaccinationStats(true);
    }
  };

  const handleDownloadOffline = async () => {
    await storage.setOfflineDownloaded(true);
    setShowOfflineDownload(false);
  };

  const handleSkipOffline = async () => {
    await storage.setOfflinePromptDismissed(true);
    setShowOfflineDownload(false);
  };

  return (
    <>
      <OfflineDownloadModal
        visible={showOfflineDownload}
        onDownload={handleDownloadOffline}
        onSkip={handleSkipOffline}
      />
      <VaccinationStatsModal
        visible={showVaccinationStats}
        onClose={async () => {
          await storage.setHasSeenVaccinationStats(true);
          setShowVaccinationStats(false);
        }}
      />
    </>
  );
}
