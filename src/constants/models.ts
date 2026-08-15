import { AIModel, AspectRatioOption, StyleOption, VideoDuration, CameraMotion } from '../types';

export const IMAGE_MODELS: AIModel[] = [
  {
    id: 'flux-schnell',
    name: 'Flux.1 Schnell',
    tagline: 'Ultra-fast 12B DiT Architecture',
    type: 'image',
    badge: 'Popular',
    creditCost: 1,
    iconName: 'flash-outline',
    provider: 'Black Forest Labs',
    description: 'Blazing fast 4-step generation with high realism, prompt accuracy, and photorealistic skin textures.'
  },
  {
    id: 'flux-dev',
    name: 'Flux.1 Dev',
    tagline: 'Maximum Fidelity & Typography',
    type: 'image',
    badge: 'Pro Quality',
    creditCost: 2,
    iconName: 'sparkles-outline',
    provider: 'Black Forest Labs',
    description: 'Unmatched fidelity, complex prompt comprehension, legible typography, and stunning lighting detail.'
  },
  {
    id: 'nana-banana',
    name: 'Nana Banana v2.5',
    tagline: 'Stylized Anime, Manga & Vibrant Art',
    type: 'image',
    badge: 'Trending Anime',
    creditCost: 1,
    iconName: 'color-palette-outline',
    provider: 'Nana Artworks',
    description: 'Custom fine-tuned anime & concept art diffusion engine with hyper-saturated palettes and sharp linework.'
  },
  {
    id: 'sdxl-lightning',
    name: 'SDXL Turbo',
    tagline: 'Real-time Photorealism',
    type: 'image',
    creditCost: 1,
    iconName: 'speedometer-outline',
    provider: 'Stability AI',
    description: 'Ultra-fast diffusion model optimized for instant concept generation and scenic views.'
  },
  {
    id: 'midjourney-v6',
    name: 'MJ v6.1 Cinema',
    tagline: 'Atmospheric Film Look & Mood',
    type: 'image',
    badge: 'Cinema Art',
    creditCost: 2,
    iconName: 'film-outline',
    provider: 'Midjourney Architecture',
    description: 'Rich cinematic depth of field, anamorphic lens flares, and painterly hyper-detailed portraits.'
  }
];

export const VIDEO_MODELS: AIModel[] = [
  {
    id: 'veo-3',
    name: 'Veo 3',
    tagline: 'Google DeepMind Cinematic Engine',
    type: 'video',
    badge: 'Next-Gen 4K',
    creditCost: 3,
    iconName: 'videocam-outline',
    provider: 'Google DeepMind',
    description: 'State-of-the-art cinematic physics, photoreal volumetric lighting, seamless temporal motion consistency.'
  },
  {
    id: 'kling-1.5',
    name: 'Kling 1.5 HD',
    tagline: 'High Motion & Dynamic Physics',
    type: 'video',
    badge: 'High Motion',
    creditCost: 3,
    iconName: 'play-circle-outline',
    provider: 'Kling AI',
    description: 'Unsurpassed dynamic character movements, complex physical interactions, and cinematic drone shots.'
  },
  {
    id: 'sora-cinema',
    name: 'Sora Cinema',
    tagline: 'Multi-Perspective Narrative Video',
    type: 'video',
    badge: 'Story Mode',
    creditCost: 4,
    iconName: 'aperture-outline',
    provider: 'OpenAI Architecture',
    description: 'Deep spatial coherence, multi-angle transitions, realistic physics simulations, and vivid environments.'
  },
  {
    id: 'luma-dream',
    name: 'Luma Dream Machine',
    tagline: 'Hyper-smooth Camera Motion',
    type: 'video',
    creditCost: 3,
    iconName: 'planet-outline',
    provider: 'Luma AI',
    description: 'Fast 3D world morphing, smooth orbit movements, and dreamlike scene expansions.'
  }
];

export const ALL_MODELS = [...IMAGE_MODELS, ...VIDEO_MODELS];

export const STYLES: StyleOption[] = [
  {
    id: 'cinematic',
    label: 'Cinematic',
    icon: 'film-outline',
    previewColor: '#FF6B6B',
    previewGradient: ['#FF416C', '#FF4B2B'],
    promptModifier: 'cinematic 35mm film shot, anamorphic lens, shallow depth of field, blockbuster movie grading, atmospheric haze, 8k resolution, photorealistic masterpiece'
  },
  {
    id: 'anime',
    label: 'Anime / Manga',
    icon: 'color-wand-outline',
    previewColor: '#9B51E0',
    previewGradient: ['#8A2387', '#E94057'],
    promptModifier: 'vibrant anime aesthetic, Makoto Shinkai style, Kyoto Animation studio quality, delicate detailed linework, glowing light particles, cel shaded masterpiece'
  },
  {
    id: 'photoreal',
    label: 'Photoreal 8K',
    icon: 'camera-outline',
    previewColor: '#2D9CDB',
    previewGradient: ['#00B4DB', '#0083B0'],
    promptModifier: 'raw national geographic photograph, Hasselblad H6D-100c, 8k uhd, soft natural studio lighting, ultra sharp skin texture, authentic reflections'
  },
  {
    id: 'cyberpunk',
    label: 'Cyberpunk Neon',
    icon: 'hardware-chip-outline',
    previewColor: '#00F2FE',
    previewGradient: ['#4FACFE', '#00F2FE'],
    promptModifier: 'cyberpunk neon lit night city, holographic reflections in rain puddles, volumetric teal and magenta neon lighting, high-tech cybernetic details, synthwave vibe'
  },
  {
    id: '3d-render',
    label: '3D Pixar',
    icon: 'cube-outline',
    previewColor: '#F2994A',
    previewGradient: ['#F37335', '#FDC830'],
    promptModifier: 'Pixar Disney animation 3D character render, Octane 3D render, smooth subsurface scattering, expressive big eyes, adorable charming aesthetic, ray tracing lighting'
  },
  {
    id: 'fantasy',
    label: 'Fantasy Oil',
    icon: 'brush-outline',
    previewColor: '#27AE60',
    previewGradient: ['#11998E', '#38EF7D'],
    promptModifier: 'mythical high fantasy oil painting, Frank Frazetta and Greg Rutkowski art style, epic golden lighting, detailed fantasy brush strokes, enchanting mystical mood'
  },
  {
    id: 'synthwave',
    label: 'Retro Synthwave',
    icon: 'radio-outline',
    previewColor: '#D946EF',
    previewGradient: ['#EC4899', '#8B5CF6'],
    promptModifier: '1980s synthwave retro outrun art, glowing wireframe grid, purple chrome sunset, CRT scanlines, retrowave aesthetic, vibrant laser lights'
  },
  {
    id: 'studio-portrait',
    label: 'Studio Portrait',
    icon: 'person-outline',
    previewColor: '#EC4899',
    previewGradient: ['#F43F5E', '#FB7185'],
    promptModifier: 'professional high fashion magazine cover portrait, Vogue style, rim lighting, beauty dish softbox, 85mm lens f/1.4, flawless model posing, immaculate skin pores'
  },
  {
    id: 'dark-scifi',
    label: 'Dark Sci-Fi',
    icon: 'shield-outline',
    previewColor: '#64748B',
    previewGradient: ['#334155', '#0F172A'],
    promptModifier: 'dark sci-fi mech concept, H.R. Giger inspired biomechanical architecture, gritty metallic textures, sinister atmospheric smoke, ominous amber glows'
  },
  {
    id: 'watercolor',
    label: 'Watercolor Art',
    icon: 'water-outline',
    previewColor: '#06B6D4',
    previewGradient: ['#38BDF8', '#818CF8'],
    promptModifier: 'delicate wet-on-wet watercolor painting, soft pastel pigments bleeding onto textured cotton paper, artistic splatters, dreamy whimsical feeling'
  }
];

export const ASPECT_RATIOS: AspectRatioOption[] = [
  {
    id: '16:9',
    label: '16:9',
    sublabel: 'Landscape',
    icon: 'desktop-outline',
    ratioValue: 16 / 9,
    width: 1024,
    height: 576
  },
  {
    id: '9:16',
    label: '9:16',
    sublabel: 'Reels / TikTok',
    icon: 'phone-portrait-outline',
    ratioValue: 9 / 16,
    width: 576,
    height: 1024
  },
  {
    id: '1:1',
    label: '1:1',
    sublabel: 'Square Post',
    icon: 'square-outline',
    ratioValue: 1,
    width: 768,
    height: 768
  },
  {
    id: '4:3',
    label: '4:3',
    sublabel: 'Standard',
    icon: 'tv-outline',
    ratioValue: 4 / 3,
    width: 800,
    height: 600
  },
  {
    id: '21:9',
    label: '21:9',
    sublabel: 'Cinema Scope',
    icon: 'videocam-outline',
    ratioValue: 21 / 9,
    width: 1152,
    height: 494
  }
];

export const VIDEO_DURATIONS: { id: VideoDuration; label: string; creditCost: number; badge?: string }[] = [
  { id: '5s', label: '5 Seconds', creditCost: 3, badge: 'Standard' },
  { id: '10s', label: '10 Seconds', creditCost: 5, badge: 'Pro Ultra' },
  { id: '15s', label: '15 Seconds', creditCost: 8, badge: 'Cinematic' }
];

export const CAMERA_MOTIONS: { id: CameraMotion; label: string; icon: string }[] = [
  { id: 'none', label: 'Static Camera', icon: 'pause-outline' },
  { id: 'pan-left', label: 'Pan Left', icon: 'arrow-back-outline' },
  { id: 'pan-right', label: 'Pan Right', icon: 'arrow-forward-outline' },
  { id: 'zoom-in', label: 'Zoom In', icon: 'add-circle-outline' },
  { id: 'zoom-out', label: 'Zoom Out', icon: 'remove-circle-outline' },
  { id: 'orbit-360', label: 'Orbit 360°', icon: 'sync-outline' },
  { id: 'fpv-drone', label: 'FPV Drone Flythrough', icon: 'airplane-outline' }
];
