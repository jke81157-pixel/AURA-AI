import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { GeneratedMedia, UserCredits, StyleId, ModelId } from '../types';
import { StorageService } from '../services/storageService';

interface ToastState {
  visible: boolean;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

interface RemixData {
  prompt: string;
  style?: StyleId;
  model?: ModelId;
  aspectRatio?: any;
}

interface AppContextType {
  credits: UserCredits;
  isPro: boolean;
  gallery: GeneratedMedia[];
  activeTab: 'studio' | 'gallery' | 'explore' | 'credits' | 'settings';
  setActiveTab: (tab: 'studio' | 'gallery' | 'explore' | 'credits' | 'settings') => void;
  toast: ToastState;
  showToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  hideToast: () => void;
  
  // Credits & Rewards
  spendCredits: (amount: number) => boolean;
  addCredits: (amount: number, reason?: string) => void;
  claimDailyStreak: () => { success: boolean; claimedAmount: number; streak: number };
  watchRewardedAd: () => Promise<number>;
  upgradeToPro: (tier: 'weekly' | 'monthly' | 'lifetime') => void;
  restorePurchases: () => void;
  
  // Gallery Management
  addGeneratedMedia: (item: GeneratedMedia) => Promise<void>;
  deleteMedia: (id: string) => Promise<void>;
  toggleFavorite: (id: string) => Promise<void>;
  
  // Remix / Prompt transfer
  remixData: RemixData | null;
  setRemixData: (data: RemixData | null) => void;
  clearRemixData: () => void;
  
  // Modals
  isDailyModalOpen: boolean;
  setIsDailyModalOpen: (open: boolean) => void;
  isProModalOpen: boolean;
  setIsProModalOpen: (open: boolean) => void;
  isAdModalOpen: boolean;
  setIsAdModalOpen: (open: boolean) => void;

  // Refresh
  refreshGallery: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [credits, setCredits] = useState<UserCredits>({
    balance: 20,
    dailyStreak: 1,
    lastClaimDate: null,
    isPro: false,
    adsWatchedToday: 0,
  });
  const [gallery, setGallery] = useState<GeneratedMedia[]>([]);
  const [activeTab, setActiveTab] = useState<'studio' | 'gallery' | 'explore' | 'credits' | 'settings'>('studio');
  const [toast, setToast] = useState<ToastState>({
    visible: false,
    message: '',
    type: 'info',
  });
  const [remixData, setRemixData] = useState<RemixData | null>(null);

  const [isDailyModalOpen, setIsDailyModalOpen] = useState(false);
  const [isProModalOpen, setIsProModalOpen] = useState(false);
  const [isAdModalOpen, setIsAdModalOpen] = useState(false);

  // Load initial data
  useEffect(() => {
    async function loadData() {
      const savedCredits = await StorageService.getCredits();
      const savedGallery = await StorageService.getGallery();
      setCredits(savedCredits);
      setGallery(savedGallery);

      // Check if daily streak can be claimed
      const today = new Date().toISOString().split('T')[0];
      if (savedCredits.lastClaimDate !== today) {
        // Daily claim is ready!
        setTimeout(() => {
          setIsDailyModalOpen(true);
        }, 1500);
      }
    }
    loadData();
  }, []);

  const showToast = useCallback((message: string, type: 'success' | 'info' | 'warning' | 'error' = 'info') => {
    setToast({
      visible: true,
      message,
      type,
    });
  }, []);

  const hideToast = useCallback(() => {
    setToast((prev) => ({ ...prev, visible: false }));
  }, []);

  const spendCredits = useCallback((amount: number): boolean => {
    if (credits.isPro) {
      return true; // Pro users have unlimited generation!
    }

    if (credits.balance < amount) {
      showToast(`Not enough credits (Need ${amount} ⚡). Watch an ad or claim rewards!`, 'warning');
      setIsAdModalOpen(true);
      return false;
    }

    const updated: UserCredits = {
      ...credits,
      balance: credits.balance - amount,
    };
    setCredits(updated);
    StorageService.saveCredits(updated);
    return true;
  }, [credits, showToast]);

  const addCredits = useCallback((amount: number, reason?: string) => {
    setCredits((prev) => {
      const updated = {
        ...prev,
        balance: prev.balance + amount,
      };
      StorageService.saveCredits(updated);
      return updated;
    });
    if (reason) {
      showToast(`+${amount} Credits added! (${reason})`, 'success');
    }
  }, [showToast]);

  const claimDailyStreak = useCallback(() => {
    const today = new Date().toISOString().split('T')[0];
    
    // Calculate streak logic
    let newStreak = credits.dailyStreak || 1;
    if (credits.lastClaimDate) {
      const lastDate = new Date(credits.lastClaimDate);
      const currentDate = new Date(today);
      const diffDays = Math.floor((currentDate.getTime() - lastDate.getTime()) / (1000 * 3600 * 24));
      
      if (diffDays === 1) {
        newStreak = (credits.dailyStreak % 7) + 1;
      } else if (diffDays > 1) {
        newStreak = 1;
      }
    }

    // Streak rewards: Day 1: 5, Day 2: 8, Day 3: 12, Day 4: 15, Day 5: 20, Day 6: 25, Day 7: 50
    const streakRewardMap = [5, 8, 12, 15, 20, 25, 50];
    const reward = streakRewardMap[(newStreak - 1) % 7] || 10;

    const updated: UserCredits = {
      ...credits,
      balance: credits.balance + reward,
      dailyStreak: newStreak,
      lastClaimDate: today,
    };

    setCredits(updated);
    StorageService.saveCredits(updated);
    showToast(`Claimed +${reward} ⚡ Daily Streak Reward!`, 'success');
    return { success: true, claimedAmount: reward, streak: newStreak };
  }, [credits, showToast]);

  const watchRewardedAd = useCallback(async (): Promise<number> => {
    const rewardAmount = 5;
    const updated: UserCredits = {
      ...credits,
      balance: credits.balance + rewardAmount,
      adsWatchedToday: (credits.adsWatchedToday || 0) + 1,
    };
    setCredits(updated);
    await StorageService.saveCredits(updated);
    showToast(`🎉 Ad Reward Claimed: +${rewardAmount} ⚡ Credits!`, 'success');
    return rewardAmount;
  }, [credits, showToast]);

  const upgradeToPro = useCallback((tier: 'weekly' | 'monthly' | 'lifetime') => {
    const updated: UserCredits = {
      ...credits,
      isPro: true,
      balance: credits.balance + 500,
    };
    setCredits(updated);
    StorageService.saveCredits(updated);
    showToast(`👑 Welcome to VIP Pro Unlimited (${tier})!`, 'success');
    setIsProModalOpen(false);
  }, [credits, showToast]);

  const restorePurchases = useCallback(() => {
    showToast('Checking App Store / Play Store receipts...', 'info');
    setTimeout(() => {
      showToast('Purchases synchronized successfully.', 'success');
    }, 1200);
  }, [showToast]);

  const addGeneratedMedia = useCallback(async (item: GeneratedMedia) => {
    const updated = await StorageService.addMediaToGallery(item);
    setGallery(updated);
  }, []);

  const deleteMedia = useCallback(async (id: string) => {
    const updated = await StorageService.deleteMedia(id);
    setGallery(updated);
    showToast('Deleted from gallery', 'info');
  }, [showToast]);

  const toggleFavorite = useCallback(async (id: string) => {
    const updated = await StorageService.toggleFavorite(id);
    setGallery(updated);
  }, []);

  const clearRemixData = useCallback(() => {
    setRemixData(null);
  }, []);

  const refreshGallery = useCallback(async () => {
    const items = await StorageService.getGallery();
    setGallery(items);
  }, []);

  return (
    <AppContext.Provider
      value={{
        credits,
        isPro: credits.isPro,
        gallery,
        activeTab,
        setActiveTab,
        toast,
        showToast,
        hideToast,
        spendCredits,
        addCredits,
        claimDailyStreak,
        watchRewardedAd,
        upgradeToPro,
        restorePurchases,
        addGeneratedMedia,
        deleteMedia,
        toggleFavorite,
        remixData,
        setRemixData,
        clearRemixData,
        isDailyModalOpen,
        setIsDailyModalOpen,
        isProModalOpen,
        setIsProModalOpen,
        isAdModalOpen,
        setIsAdModalOpen,
        refreshGallery,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
