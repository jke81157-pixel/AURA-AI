import AsyncStorage from '@react-native-async-storage/async-storage';
import { GeneratedMedia, UserCredits } from '../types';
import { INITIAL_GALLERY } from '../constants/sampleData';

const KEYS = {
  GALLERY: '@ai_studio_gallery_v2',
  CREDITS: '@ai_studio_credits_v2',
  SETTINGS: '@ai_studio_settings_v2',
};

const DEFAULT_CREDITS: UserCredits = {
  balance: 20, // Start with 20 generous credits!
  dailyStreak: 1,
  lastClaimDate: null,
  isPro: false,
  adsWatchedToday: 0,
};

export const StorageService = {
  async getGallery(): Promise<GeneratedMedia[]> {
    try {
      const data = await AsyncStorage.getItem(KEYS.GALLERY);
      if (data) {
        return JSON.parse(data);
      }
      // Initialize with sample gallery
      await AsyncStorage.setItem(KEYS.GALLERY, JSON.stringify(INITIAL_GALLERY));
      return INITIAL_GALLERY;
    } catch (e) {
      console.error('Failed to get gallery:', e);
      return INITIAL_GALLERY;
    }
  },

  async saveGallery(items: GeneratedMedia[]): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.GALLERY, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save gallery:', e);
    }
  },

  async addMediaToGallery(item: GeneratedMedia): Promise<GeneratedMedia[]> {
    const current = await this.getGallery();
    const updated = [item, ...current];
    await this.saveGallery(updated);
    return updated;
  },

  async deleteMedia(id: string): Promise<GeneratedMedia[]> {
    const current = await this.getGallery();
    const updated = current.filter((item) => item.id !== id);
    await this.saveGallery(updated);
    return updated;
  },

  async toggleFavorite(id: string): Promise<GeneratedMedia[]> {
    const current = await this.getGallery();
    const updated = current.map((item) => {
      if (item.id === id) {
        return { ...item, isFavorite: !item.isFavorite };
      }
      return item;
    });
    await this.saveGallery(updated);
    return updated;
  },

  async getCredits(): Promise<UserCredits> {
    try {
      const data = await AsyncStorage.getItem(KEYS.CREDITS);
      if (data) {
        return JSON.parse(data);
      }
      await AsyncStorage.setItem(KEYS.CREDITS, JSON.stringify(DEFAULT_CREDITS));
      return DEFAULT_CREDITS;
    } catch (e) {
      console.error('Failed to get credits:', e);
      return DEFAULT_CREDITS;
    }
  },

  async saveCredits(credits: UserCredits): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.CREDITS, JSON.stringify(credits));
    } catch (e) {
      console.error('Failed to save credits:', e);
    }
  },

  async clearAllData(): Promise<void> {
    try {
      await AsyncStorage.removeItem(KEYS.GALLERY);
      await AsyncStorage.removeItem(KEYS.CREDITS);
    } catch (e) {
      console.error('Failed to clear data:', e);
    }
  }
};
