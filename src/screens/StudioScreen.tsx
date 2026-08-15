import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useApp } from '../context/AppContext';
import { MediaType, StyleId, ModelId, AspectRatioId, VideoDuration, CameraMotion, GeneratedMedia, GenerationStepProgress } from '../types';
import { StyleSelector } from '../components/StyleSelector';
import { ModelSelector } from '../components/ModelSelector';
import { AspectRatioSelector } from '../components/AspectRatioSelector';
import { AdvancedSettingsModal } from '../components/AdvancedSettingsModal';
import { GeneratingOverlay } from '../components/GeneratingOverlay';
import { MediaViewerModal } from '../components/MediaViewerModal';
import { RANDOM_PROMPTS, INSPIRATION_TAGS } from '../constants/prompts';
import { ALL_MODELS, VIDEO_DURATIONS } from '../constants/models';
import { generateAIMedia, enhancePromptText } from '../services/aiService';
import { COLORS, RADIUS, SHADOWS } from '../constants/theme';

export const StudioScreen: React.FC = () => {
  const { spendCredits, addGeneratedMedia, isPro, showToast, remixData, clearRemixData, setIsProModalOpen } = useApp();

  // State
  const [mediaType, setMediaType] = useState<MediaType>('image');
  const [prompt, setPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState<StyleId>('cinematic');
  const [selectedModel, setSelectedModel] = useState<ModelId>('flux-schnell');
  const [selectedRatio, setSelectedRatio] = useState<AspectRatioId>('16:9');
  
  // Video specific state
  const [duration, setDuration] = useState<VideoDuration>('5s');
  const [cameraMotion, setCameraMotion] = useState<CameraMotion>('pan-right');
  const [motionStrength, setMotionStrength] = useState<number>(6);
  const [enableSoundFX, setEnableSoundFX] = useState(true);

  // Advanced state
  const [negativePrompt, setNegativePrompt] = useState('');
  const [seed, setSeed] = useState<number>(() => Math.floor(Math.random() * 900000) + 100000);
  const [highResUpscale, setHighResUpscale] = useState(true);
  const [referenceImage, setReferenceImage] = useState<string | null>(null);
  const [referenceStrength, setReferenceStrength] = useState(0.6);

  // Modals
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [stepProgress, setStepProgress] = useState<GenerationStepProgress>({
    stage: 'Initializing',
    progress: 0,
    details: 'Preparing engine...',
  });
  const [completedMedia, setCompletedMedia] = useState<GeneratedMedia | null>(null);
  const [isResultOpen, setIsResultOpen] = useState(false);

  // Load remix prompt if any
  useEffect(() => {
    if (remixData) {
      setPrompt(remixData.prompt);
      if (remixData.style) setSelectedStyle(remixData.style);
      if (remixData.model) {
        setSelectedModel(remixData.model);
        const modelObj = ALL_MODELS.find((m) => m.id === remixData.model);
        if (modelObj) setMediaType(modelObj.type);
      }
      if (remixData.aspectRatio) setSelectedRatio(remixData.aspectRatio);
      clearRemixData();
    }
  }, [remixData, clearRemixData]);

  // Adjust model when mode switches
  const handleSwitchMode = (type: MediaType) => {
    setMediaType(type);
    if (type === 'video') {
      if (!selectedModel.startsWith('veo') && !selectedModel.startsWith('kling') && !selectedModel.startsWith('sora') && !selectedModel.startsWith('luma')) {
        setSelectedModel('veo-3');
      }
    } else {
      if (selectedModel.startsWith('veo') || selectedModel.startsWith('kling') || selectedModel.startsWith('sora') || selectedModel.startsWith('luma')) {
        setSelectedModel('flux-schnell');
      }
    }
  };

  const currentModelObj = ALL_MODELS.find((m) => m.id === selectedModel) || ALL_MODELS[0];
  
  // Calculate credit cost
  const baseCost = currentModelObj.creditCost;
  const durationCost = mediaType === 'video' ? (duration === '10s' ? 5 : duration === '15s' ? 8 : 3) : 0;
  const totalCost = mediaType === 'video' ? durationCost : baseCost;

  // AI Prompt Enhancer
  const handleEnhancePrompt = () => {
    if (!prompt.trim()) {
      showToast('Enter a basic idea first, then tap AI Enhance!', 'info');
      return;
    }
    const enhanced = enhancePromptText(prompt, selectedStyle);
    setPrompt(enhanced);
    showToast('✨ Prompt enhanced with cinematic tokens!', 'success');
  };

  // Surprise Me / Random Prompt
  const handleSurpriseMe = () => {
    const random = RANDOM_PROMPTS[Math.floor(Math.random() * RANDOM_PROMPTS.length)];
    setPrompt(random);
    showToast('🎲 Random creative prompt loaded!', 'info');
  };

  // Pick Reference Image
  const handlePickReferenceImage = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        showToast('Photo library permission is required to attach images', 'warning');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setReferenceImage(result.assets[0].uri);
        showToast('Reference image attached!', 'success');
      }
    } catch (e) {
      console.log('Image picker error:', e);
      showToast('Could not open image library', 'error');
    }
  };

  // Generate
  const handleGenerate = async () => {
    if (!prompt.trim()) {
      showToast('Please type a prompt description first', 'warning');
      return;
    }

    // Check credits
    const canSpend = spendCredits(totalCost);
    if (!canSpend) return;

    setIsGenerating(true);
    try {
      const result = await generateAIMedia(
        {
          type: mediaType,
          prompt: prompt.trim(),
          model: selectedModel,
          style: selectedStyle,
          aspectRatio: selectedRatio,
          duration,
          cameraMotion,
          motionStrength,
          negativePrompt,
          seed,
          enableSoundFX,
          highResUpscale,
          referenceImage,
          referenceStrength,
        },
        (progress) => {
          setStepProgress(progress);
        }
      );

      await addGeneratedMedia(result);
      setCompletedMedia(result);
      setIsGenerating(false);
      setIsResultOpen(true);
      showToast('Creation completed & saved to Gallery!', 'success');

      // Randomize seed for next generation
      setSeed(Math.floor(Math.random() * 900000) + 100000);
    } catch (e) {
      console.error('Generation failed:', e);
      setIsGenerating(false);
      showToast('Generation failed. Please try again.', 'error');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.screenContainer}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Mode Selector Tabs (Image vs Video) */}
        <View style={styles.modeTabsContainer}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={[styles.modeTab, mediaType === 'image' && styles.modeTabActive]}
            onPress={() => handleSwitchMode('image')}
          >
            <Ionicons
              name="sparkles"
              size={16}
              color={mediaType === 'image' ? '#FFF' : COLORS.textMuted}
            />
            <Text
              style={[
                styles.modeTabText,
                mediaType === 'image' && styles.modeTabTextActive,
              ]}
            >
              AI Image Studio
            </Text>
            {mediaType === 'image' && <View style={styles.tabIndicator} />}
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            style={[styles.modeTab, mediaType === 'video' && styles.modeTabActiveVideo]}
            onPress={() => handleSwitchMode('video')}
          >
            <Ionicons
              name="videocam"
              size={16}
              color={mediaType === 'video' ? '#FFF' : COLORS.textMuted}
            />
            <Text
              style={[
                styles.modeTabText,
                mediaType === 'video' && styles.modeTabTextActive,
              ]}
            >
              AI Video (Veo 3 / Kling)
            </Text>
            {mediaType === 'video' && <View style={[styles.tabIndicator, styles.tabIndicatorVideo]} />}
          </TouchableOpacity>
        </View>

        {/* Input Box & Prompt Studio */}
        <View style={styles.promptStudioCard}>
          <View style={styles.inputHeader}>
            <Text style={styles.inputHeaderLabel}>
              {mediaType === 'video' ? '🎬 Video Prompt' : '🎨 Image Prompt'}
            </Text>
            
            <View style={styles.inputActionsRow}>
              <TouchableOpacity
                style={styles.smallActionBtn}
                onPress={handleSurpriseMe}
              >
                <Ionicons name="dice-outline" size={14} color={COLORS.secondary} />
                <Text style={styles.smallActionText}>Surprise Me</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.smallActionBtn, styles.enhanceBtn]}
                onPress={handleEnhancePrompt}
              >
                <Ionicons name="sparkles" size={13} color="#FFF" />
                <Text style={styles.enhanceBtnText}>AI Enhance</Text>
              </TouchableOpacity>
            </View>
          </View>

          <TextInput
            style={styles.promptInput}
            placeholder={
              mediaType === 'video'
                ? 'Describe a cinematic scene (e.g. Cyberpunk hovercar drifting through rainy neon Neo-Tokyo...)'
                : 'Describe what you want to create (e.g. Celestial crystal fox in twilight forest...)'
            }
            placeholderTextColor={COLORS.textMuted}
            value={prompt}
            onChangeText={setPrompt}
            multiline
            numberOfLines={4}
          />

          {/* Reference Image Attachment Row */}
          <View style={styles.referenceImageRow}>
            {referenceImage ? (
              <View style={styles.referencePreviewWrapper}>
                <Image source={{ uri: referenceImage }} style={styles.referenceThumb} />
                <View style={styles.referenceInfo}>
                  <Text style={styles.referenceLabel}>Reference Image Attached</Text>
                  <Text style={styles.referenceSub}>Image-to-Image blend active</Text>
                </View>
                <TouchableOpacity
                  style={styles.removeRefBtn}
                  onPress={() => setReferenceImage(null)}
                >
                  <Ionicons name="close-circle" size={20} color={COLORS.error} />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.attachButton}
                onPress={handlePickReferenceImage}
              >
                <Ionicons name="image-outline" size={16} color={COLORS.secondary} />
                <Text style={styles.attachText}>+ Attach Reference Image (Img2Img / ControlNet)</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Inspiration Quick Tags */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tagsScroll}
          >
            {INSPIRATION_TAGS.map((tag, idx) => (
              <TouchableOpacity
                key={idx}
                style={styles.tagPill}
                onPress={() => {
                  setPrompt((prev) => (prev ? `${prev}, ${tag.replace(/^[^\w\s]+/, '').trim()}` : tag.replace(/^[^\w\s]+/, '').trim()));
                }}
              >
                <Text style={styles.tagText}>{tag}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* AI Engine / Model Selector (Flux / Nana Banana / Veo 3 / Kling) */}
        <ModelSelector
          mediaType={mediaType}
          selectedModel={selectedModel}
          onSelectModel={setSelectedModel}
        />

        {/* Visual Style Selector */}
        <StyleSelector
          selectedStyle={selectedStyle}
          onSelectStyle={setSelectedStyle}
        />

        {/* Video Duration Options (Quick Selector) */}
        {mediaType === 'video' && (
          <View style={styles.durationQuickSection}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Duration Option</Text>
              <Text style={styles.durationHint}>{duration} Motion Clip</Text>
            </View>
            <View style={styles.durationPillRow}>
              {VIDEO_DURATIONS.map((d) => (
                <TouchableOpacity
                  key={d.id}
                  style={[
                    styles.durationPill,
                    duration === d.id && styles.durationPillSelected,
                  ]}
                  onPress={() => setDuration(d.id)}
                >
                  <Text
                    style={[
                      styles.durationPillText,
                      duration === d.id && styles.durationPillTextSelected,
                    ]}
                  >
                    {d.label}
                  </Text>
                  <Text style={styles.durationPillCost}>⚡ {d.creditCost}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Aspect Ratio Selector */}
        <AspectRatioSelector
          selectedRatio={selectedRatio}
          onSelectRatio={setSelectedRatio}
        />

        {/* Advanced Settings Opener */}
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.advancedBar}
          onPress={() => setIsAdvancedOpen(true)}
        >
          <View style={styles.advancedLeft}>
            <Ionicons name="options-outline" size={18} color={COLORS.secondary} />
            <Text style={styles.advancedTitle}>Advanced Pipeline Settings</Text>
          </View>
          <View style={styles.advancedRight}>
            <Text style={styles.advancedSub}>
              {mediaType === 'video' ? `${cameraMotion} • ${motionStrength}x` : `Seed #${seed}`}
            </Text>
            <Ionicons name="chevron-forward" size={16} color={COLORS.textMuted} />
          </View>
        </TouchableOpacity>

        {/* Generate Action Button */}
        <View style={styles.generateContainer}>
          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.generateButton}
            onPress={handleGenerate}
          >
            <LinearGradient
              colors={
                mediaType === 'video'
                  ? ['#06B6D4', '#3B82F6', '#6366F1']
                  : ['#6366F1', '#A855F7', '#EC4899']
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.generateGradient}
            >
              <View style={styles.generateIconCircle}>
                <Ionicons
                  name={mediaType === 'video' ? 'videocam' : 'sparkles'}
                  size={20}
                  color="#FFF"
                />
              </View>

              <View style={styles.generateTextContainer}>
                <Text style={styles.generateMainText}>
                  {mediaType === 'video' ? 'GENERATE AI VIDEO' : 'GENERATE AI IMAGE'}
                </Text>
                <Text style={styles.generateSubText}>
                  {currentModelObj.name} • {selectedRatio}
                </Text>
              </View>

              <View style={styles.creditCostBadge}>
                <Ionicons name="flash" size={13} color="#FBBF24" />
                <Text style={styles.creditCostText}>
                  {isPro ? 'FREE' : `${totalCost} ⚡`}
                </Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Pro Banner Teaser */}
        {!isPro && (
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.proBanner}
            onPress={() => setIsProModalOpen(true)}
          >
            <LinearGradient
              colors={['rgba(245, 158, 11, 0.15)', 'rgba(217, 119, 6, 0.1)']}
              style={styles.proBannerGradient}
            >
              <View style={styles.proBannerIcon}>
                <Ionicons name="sparkles" size={18} color="#FBBF24" />
              </View>
              <View style={styles.proBannerTextWrap}>
                <Text style={styles.proBannerTitle}>Upgrade to VIP Pro Unlimited</Text>
                <Text style={styles.proBannerSub}>Unlimited Flux & Veo 3 generations • 4K Upscale</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#FBBF24" />
            </LinearGradient>
          </TouchableOpacity>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Advanced Parameters Modal */}
      <AdvancedSettingsModal
        visible={isAdvancedOpen}
        onClose={() => setIsAdvancedOpen(false)}
        mediaType={mediaType}
        duration={duration}
        onChangeDuration={setDuration}
        cameraMotion={cameraMotion}
        onChangeCameraMotion={setCameraMotion}
        motionStrength={motionStrength}
        onChangeMotionStrength={setMotionStrength}
        negativePrompt={negativePrompt}
        onChangeNegativePrompt={setNegativePrompt}
        seed={seed}
        onChangeSeed={setSeed}
        highResUpscale={highResUpscale}
        onChangeHighResUpscale={setHighResUpscale}
        enableSoundFX={enableSoundFX}
        onChangeEnableSoundFX={setEnableSoundFX}
      />

      {/* Generating Progress Overlay */}
      <GeneratingOverlay
        visible={isGenerating}
        type={mediaType}
        modelName={currentModelObj.name}
        stepProgress={stepProgress}
        onCancel={() => setIsGenerating(false)}
      />

      {/* Completed Result Media Viewer */}
      <MediaViewerModal
        media={completedMedia}
        visible={isResultOpen}
        onClose={() => setIsResultOpen(false)}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  modeTabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    gap: 10,
  },
  modeTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.cardBackgroundLight,
    paddingVertical: 10,
    borderRadius: RADIUS.md,
    gap: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    position: 'relative',
  },
  modeTabActive: {
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
    borderColor: COLORS.primary,
  },
  modeTabActiveVideo: {
    backgroundColor: 'rgba(6, 182, 212, 0.2)',
    borderColor: COLORS.secondary,
  },
  modeTabText: {
    color: COLORS.textMuted,
    fontSize: 13,
    fontWeight: '700',
  },
  modeTabTextActive: {
    color: '#FFF',
  },
  tabIndicator: {
    position: 'absolute',
    bottom: -1,
    left: '20%',
    right: '20%',
    height: 3,
    backgroundColor: COLORS.primary,
    borderRadius: 2,
  },
  tabIndicatorVideo: {
    backgroundColor: COLORS.secondary,
  },
  promptStudioCard: {
    marginHorizontal: 16,
    marginTop: 8,
    backgroundColor: COLORS.cardBackground,
    borderRadius: RADIUS.lg,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.borderHighlight,
    ...SHADOWS.md,
  },
  inputHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  inputHeaderLabel: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: '700',
  },
  inputActionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  smallActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
    gap: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  smallActionText: {
    color: COLORS.secondary,
    fontSize: 11,
    fontWeight: '600',
  },
  enhanceBtn: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primaryGradientEnd,
  },
  enhanceBtnText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '700',
  },
  promptInput: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: 12,
    color: COLORS.text,
    fontSize: 14,
    lineHeight: 20,
    minHeight: 85,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  referenceImageRow: {
    marginTop: 10,
  },
  referencePreviewWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: 8,
    borderRadius: RADIUS.md,
    gap: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  referenceThumb: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.sm,
  },
  referenceInfo: {
    flex: 1,
  },
  referenceLabel: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
  },
  referenceSub: {
    color: COLORS.secondary,
    fontSize: 10,
  },
  removeRefBtn: {
    padding: 4,
  },
  attachButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(6, 182, 212, 0.08)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: 'rgba(6, 182, 212, 0.4)',
    gap: 8,
  },
  attachText: {
    color: COLORS.secondary,
    fontSize: 11,
    fontWeight: '600',
  },
  tagsScroll: {
    gap: 6,
    paddingTop: 10,
  },
  tagPill: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tagText: {
    color: COLORS.textMuted,
    fontSize: 11,
    fontWeight: '500',
  },
  durationQuickSection: {
    marginHorizontal: 16,
    marginVertical: 10,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  durationHint: {
    color: COLORS.secondary,
    fontSize: 12,
    fontWeight: '700',
  },
  durationPillRow: {
    flexDirection: 'row',
    gap: 10,
  },
  durationPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.cardBackgroundLight,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  durationPillSelected: {
    borderColor: COLORS.secondary,
    backgroundColor: 'rgba(6, 182, 212, 0.15)',
  },
  durationPillText: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: '700',
  },
  durationPillTextSelected: {
    color: '#FFF',
  },
  durationPillCost: {
    color: '#FBBF24',
    fontSize: 11,
    fontWeight: '700',
  },
  advancedBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 8,
    backgroundColor: COLORS.surface,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  advancedLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  advancedTitle: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: '600',
  },
  advancedRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  advancedSub: {
    color: COLORS.textMuted,
    fontSize: 11,
  },
  generateContainer: {
    marginHorizontal: 16,
    marginTop: 14,
  },
  generateButton: {
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    ...SHADOWS.glow,
  },
  generateGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 18,
    gap: 12,
  },
  generateIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  generateTextContainer: {
    flex: 1,
  },
  generateMainText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  generateSubText: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 11,
    fontWeight: '500',
    marginTop: 2,
  },
  creditCostBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    gap: 4,
  },
  creditCostText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '800',
  },
  proBanner: {
    marginHorizontal: 16,
    marginTop: 14,
    borderRadius: RADIUS.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(251, 191, 36, 0.3)',
  },
  proBannerGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 10,
  },
  proBannerIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(251, 191, 36, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  proBannerTextWrap: {
    flex: 1,
  },
  proBannerTitle: {
    color: '#FBBF24',
    fontSize: 12,
    fontWeight: '800',
  },
  proBannerSub: {
    color: COLORS.textMuted,
    fontSize: 10,
  },
});
