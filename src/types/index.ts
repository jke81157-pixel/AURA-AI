export type MediaType = 'image' | 'video';

export type ImageModelId = 'flux-schnell' | 'flux-dev' | 'nana-banana' | 'sdxl-lightning' | 'midjourney-v6';

export type VideoModelId = 'veo-3' | 'kling-1.5' | 'sora-cinema' | 'luma-dream';

export type ModelId = ImageModelId | VideoModelId;

export interface AIModel {
  id: ModelId;
  name: string;
  tagline: string;
  type: MediaType;
  badge?: string;
  creditCost: number;
  iconName: string;
  provider: string;
  description: string;
}

export type StyleId =
  | 'cinematic'
  | 'anime'
  | 'photoreal'
  | 'cyberpunk'
  | '3d-render'
  | 'fantasy'
  | 'synthwave'
  | 'studio-portrait'
  | 'dark-scifi'
  | 'watercolor';

export interface StyleOption {
  id: StyleId;
  label: string;
  icon: string;
  previewColor: string;
  previewGradient: [string, string];
  promptModifier: string;
}

export type AspectRatioId = '16:9' | '9:16' | '1:1' | '4:3' | '21:9';

export interface AspectRatioOption {
  id: AspectRatioId;
  label: string;
  sublabel: string;
  icon: string;
  ratioValue: number; // width / height
  width: number;
  height: number;
}

export type VideoDuration = '5s' | '10s' | '15s';

export type CameraMotion = 'none' | 'pan-left' | 'pan-right' | 'zoom-in' | 'zoom-out' | 'orbit-360' | 'fpv-drone';

export interface GenerationConfig {
  type: MediaType;
  prompt: string;
  model: ModelId;
  style: StyleId;
  aspectRatio: AspectRatioId;
  duration?: VideoDuration;
  referenceImage?: string | null;
  referenceStrength?: number; // 0.1 - 1.0
  motionStrength?: number; // 1 - 10
  cameraMotion?: CameraMotion;
  negativePrompt?: string;
  seed?: number;
  steps?: number;
  cfgScale?: number;
  enableSoundFX?: boolean;
  highResUpscale?: boolean;
}

export interface GeneratedMedia {
  id: string;
  type: MediaType;
  prompt: string;
  enhancedPrompt?: string;
  model: ModelId;
  modelName: string;
  style: StyleId;
  styleLabel: string;
  aspectRatio: AspectRatioId;
  duration?: VideoDuration;
  cameraMotion?: CameraMotion;
  mediaUrl: string;
  thumbnailUrl?: string;
  referenceImage?: string | null;
  seed: number;
  createdAt: number;
  isFavorite: boolean;
  likesCount?: number;
  authorName?: string;
  authorAvatar?: string;
}

export interface UserCredits {
  balance: number;
  dailyStreak: number;
  lastClaimDate: string | null;
  isPro: boolean;
  proExpiryDate?: string | null;
  adsWatchedToday: number;
}

export interface GenerationStepProgress {
  stage: string;
  progress: number; // 0 to 100
  details: string;
}
