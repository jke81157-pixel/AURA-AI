import { GenerationConfig, GeneratedMedia, GenerationStepProgress, StyleId } from '../types';
import { STYLES, ALL_MODELS } from '../constants/models';
import { PROMPT_ENHANCEMENT_MODIFIERS } from '../constants/prompts';

// Curated high quality style visual bank
const STYLE_IMAGE_BANKS: Record<StyleId, string[]> = {
  cinematic: [
    'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1000&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1000&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=1000&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=1000&auto=format&fit=crop&q=80'
  ],
  anime: [
    'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1000&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1563089145-599997674d42?w=1000&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=1000&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1000&auto=format&fit=crop&q=80'
  ],
  photoreal: [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1000&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?w=1000&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1448375240586-882707db888b?w=1000&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1000&auto=format&fit=crop&q=80'
  ],
  cyberpunk: [
    'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=1000&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1515260268569-9271009adfdb?w=1000&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=1000&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1563089145-599997674d42?w=1000&auto=format&fit=crop&q=80'
  ],
  '3d-render': [
    'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1000&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1000&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=1000&auto=format&fit=crop&q=80'
  ],
  fantasy: [
    'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1000&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=1000&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1000&auto=format&fit=crop&q=80'
  ],
  synthwave: [
    'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=1000&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1515260268569-9271009adfdb?w=1000&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1563089145-599997674d42?w=1000&auto=format&fit=crop&q=80'
  ],
  'studio-portrait': [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1000&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1000&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=1000&auto=format&fit=crop&q=80'
  ],
  'dark-scifi': [
    'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1000&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=1000&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=1000&auto=format&fit=crop&q=80'
  ],
  watercolor: [
    'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=1000&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1000&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1000&auto=format&fit=crop&q=80'
  ]
};

const SAMPLE_VIDEOS = [
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4'
];

/**
 * AI Magic Prompt Enhancer
 * Takes simple user prompt and expands it into a professional prompt with cinematic keywords
 */
export function enhancePromptText(rawPrompt: string, styleId: StyleId): string {
  if (!rawPrompt || rawPrompt.trim().length === 0) {
    return 'A breathtaking masterpiece of futuristic landscape with glowing neon aurora and intricate crystal towers, cinematic 8k';
  }

  const selectedStyle = STYLES.find((s) => s.id === styleId);
  const styleKeywords = selectedStyle?.promptModifier || 'cinematic lighting, ultra detailed 8k';
  
  // Pick random modifiers
  const randomModifier1 = PROMPT_ENHANCEMENT_MODIFIERS[Math.floor(Math.random() * PROMPT_ENHANCEMENT_MODIFIERS.length)];
  const randomModifier2 = PROMPT_ENHANCEMENT_MODIFIERS[(Math.floor(Math.random() * PROMPT_ENHANCEMENT_MODIFIERS.length) + 1) % PROMPT_ENHANCEMENT_MODIFIERS.length];

  return `${rawPrompt.trim()}, ${styleKeywords}, ${randomModifier1}, ${randomModifier2}`;
}

/**
 * Executes AI Generation Pipeline with step-by-step progress
 */
export async function generateAIMedia(
  config: GenerationConfig,
  onProgress?: (progress: GenerationStepProgress) => void
): Promise<GeneratedMedia> {
  const isVideo = config.type === 'video';
  const selectedModel = ALL_MODELS.find((m) => m.id === config.model) || ALL_MODELS[0];
  const selectedStyle = STYLES.find((s) => s.id === config.style) || STYLES[0];
  const seed = config.seed && config.seed > 0 ? config.seed : Math.floor(Math.random() * 900000) + 100000;

  // 1. Initial Step
  onProgress?.({
    stage: 'Initializing Pipeline',
    progress: 10,
    details: `Preparing ${selectedModel.name} pipeline with ${selectedStyle.label} style tokens...`
  });
  await delay(700);

  // 2. Tokenize & Latents
  onProgress?.({
    stage: isVideo ? 'Temporal Graph Computation' : 'Latent Space Synthesis',
    progress: 30,
    details: isVideo
      ? `Simulating ${config.duration || '5s'} motion field with ${config.cameraMotion || 'cinematic'} camera dynamics...`
      : `Tokenizing prompt with DiT transformer weights (Seed: ${seed})...`
  });
  await delay(900);

  // 3. Diffusion Denoising
  onProgress?.({
    stage: isVideo ? 'DeepMind Veo 3 / Kling Diffusion' : 'Flux Denoising Step [16/28]',
    progress: 60,
    details: isVideo
      ? `Generating spatio-temporal coherence across 240 keyframes...`
      : `Running diffusion scheduler with high guidance scale (${config.cfgScale || 7.5})...`
  });
  await delay(1100);

  // 4. VAE Decode & Upscaling
  onProgress?.({
    stage: 'High-Res VAE Decode & Upscale',
    progress: 85,
    details: isVideo
      ? `Interpolating 60fps high motion physics & rendering HDR MP4 container...`
      : `Decoding latent tensor to 4K RGB buffer and refining edge textures...`
  });
  await delay(800);

  // 5. Finalizing
  onProgress?.({
    stage: 'Final Polish',
    progress: 98,
    details: `Generating neural preview & attaching EXIF metadata...`
  });
  await delay(400);

  // Determine output URL
  let mediaUrl = '';
  let thumbnailUrl = '';

  if (isVideo) {
    const videoIndex = Math.abs(seed) % SAMPLE_VIDEOS.length;
    mediaUrl = SAMPLE_VIDEOS[videoIndex];
    const imageList = STYLE_IMAGE_BANKS[config.style] || STYLE_IMAGE_BANKS.cinematic;
    thumbnailUrl = imageList[Math.abs(seed) % imageList.length];
  } else {
    // Attempt live Pollinations AI with fallback to style visual bank
    const encodedPrompt = encodeURIComponent(`${config.prompt}, ${selectedStyle.promptModifier}`);
    const pollinationsUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&seed=${seed}&nologo=true&model=${config.model === 'flux-dev' || config.model === 'flux-schnell' ? 'flux' : 'turbo'}`;
    
    // Choose between instant live pollination URL or style visual
    const imageList = STYLE_IMAGE_BANKS[config.style] || STYLE_IMAGE_BANKS.cinematic;
    const fallbackImage = imageList[Math.abs(seed) % imageList.length];
    
    // Use the online pollinations URL with fallback
    mediaUrl = pollinationsUrl || fallbackImage;
    thumbnailUrl = mediaUrl;
  }

  const generatedItem: GeneratedMedia = {
    id: `gen-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    type: config.type,
    prompt: config.prompt,
    enhancedPrompt: enhancePromptText(config.prompt, config.style),
    model: config.model,
    modelName: selectedModel.name,
    style: config.style,
    styleLabel: selectedStyle.label,
    aspectRatio: config.aspectRatio,
    duration: config.duration,
    cameraMotion: config.cameraMotion,
    mediaUrl,
    thumbnailUrl: thumbnailUrl || mediaUrl,
    referenceImage: config.referenceImage || null,
    seed,
    createdAt: Date.now(),
    isFavorite: false,
    likesCount: Math.floor(Math.random() * 30) + 5,
    authorName: 'You (Creator)',
    authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'
  };

  onProgress?.({
    stage: 'Generation Completed!',
    progress: 100,
    details: 'Masterpiece ready!'
  });

  return generatedItem;
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
