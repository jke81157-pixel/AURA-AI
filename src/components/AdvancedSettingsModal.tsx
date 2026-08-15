import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Switch,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';
import { VideoDuration, CameraMotion, MediaType } from '../types';
import { VIDEO_DURATIONS, CAMERA_MOTIONS } from '../constants/models';
import { COLORS, RADIUS, SHADOWS } from '../constants/theme';

interface AdvancedSettingsModalProps {
  visible: boolean;
  onClose: () => void;
  mediaType: MediaType;
  duration: VideoDuration;
  onChangeDuration: (duration: VideoDuration) => void;
  cameraMotion: CameraMotion;
  onChangeCameraMotion: (motion: CameraMotion) => void;
  motionStrength: number;
  onChangeMotionStrength: (val: number) => void;
  negativePrompt: string;
  onChangeNegativePrompt: (val: string) => void;
  seed: number;
  onChangeSeed: (seed: number) => void;
  highResUpscale: boolean;
  onChangeHighResUpscale: (val: boolean) => void;
  enableSoundFX: boolean;
  onChangeEnableSoundFX: (val: boolean) => void;
}

export const AdvancedSettingsModal: React.FC<AdvancedSettingsModalProps> = ({
  visible,
  onClose,
  mediaType,
  duration,
  onChangeDuration,
  cameraMotion,
  onChangeCameraMotion,
  motionStrength,
  onChangeMotionStrength,
  negativePrompt,
  onChangeNegativePrompt,
  seed,
  onChangeSeed,
  highResUpscale,
  onChangeHighResUpscale,
  enableSoundFX,
  onChangeEnableSoundFX,
}) => {
  const isVideo = mediaType === 'video';

  const randomizeSeed = () => {
    onChangeSeed(Math.floor(Math.random() * 900000) + 100000);
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <View style={styles.headerTitleRow}>
              <Ionicons name="options-outline" size={20} color={COLORS.secondary} />
              <Text style={styles.modalTitle}>Advanced Parameters</Text>
            </View>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Ionicons name="close" size={20} color="#FFF" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {/* Video Duration (5s, 10s, 15s) */}
            {isVideo && (
              <View style={styles.section}>
                <Text style={styles.sectionLabel}>Video Duration</Text>
                <View style={styles.durationRow}>
                  {VIDEO_DURATIONS.map((dur) => {
                    const isSelected = duration === dur.id;
                    return (
                      <TouchableOpacity
                        key={dur.id}
                        activeOpacity={0.8}
                        style={[styles.durationCard, isSelected && styles.durationCardSelected]}
                        onPress={() => onChangeDuration(dur.id)}
                      >
                        <Text style={[styles.durationText, isSelected && styles.durationTextSelected]}>
                          {dur.label}
                        </Text>
                        <Text style={styles.durationCost}>⚡ {dur.creditCost} Credits</Text>
                        {dur.badge && (
                          <View style={styles.durationBadge}>
                            <Text style={styles.durationBadgeText}>{dur.badge}</Text>
                          </View>
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            )}

            {/* Video Camera Controls */}
            {isVideo && (
              <View style={styles.section}>
                <Text style={styles.sectionLabel}>Camera Motion Preset</Text>
                <View style={styles.cameraGrid}>
                  {CAMERA_MOTIONS.map((cam) => {
                    const isSelected = cameraMotion === cam.id;
                    return (
                      <TouchableOpacity
                        key={cam.id}
                        activeOpacity={0.8}
                        style={[styles.cameraChip, isSelected && styles.cameraChipSelected]}
                        onPress={() => onChangeCameraMotion(cam.id)}
                      >
                        <Ionicons
                          name={cam.icon as any}
                          size={14}
                          color={isSelected ? '#FFF' : COLORS.textMuted}
                        />
                        <Text style={[styles.cameraLabel, isSelected && styles.cameraLabelSelected]}>
                          {cam.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            )}

            {/* Motion Dynamics (1 to 10) */}
            {isVideo && (
              <View style={styles.section}>
                <View style={styles.sliderHeader}>
                  <Text style={styles.sectionLabel}>Motion Dynamics</Text>
                  <Text style={styles.sliderValText}>{motionStrength}x Flow</Text>
                </View>
                <View style={styles.motionStepRow}>
                  {[2, 4, 6, 8, 10].map((val) => (
                    <TouchableOpacity
                      key={val}
                      style={[
                        styles.stepBtn,
                        motionStrength === val && styles.stepBtnSelected,
                      ]}
                      onPress={() => onChangeMotionStrength(val)}
                    >
                      <Text
                        style={[
                          styles.stepText,
                          motionStrength === val && styles.stepTextSelected,
                        ]}
                      >
                        {val === 2 ? 'Subtle' : val === 6 ? 'Dynamic' : val === 10 ? 'High Speed' : `${val}`}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* Negative Prompt */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Negative Prompt (What to Avoid)</Text>
              <TextInput
                style={styles.negativeInput}
                placeholder="e.g. blurry, low quality, distorted anatomy, watermark..."
                placeholderTextColor={COLORS.textMuted}
                value={negativePrompt}
                onChangeText={onChangeNegativePrompt}
                multiline
              />
            </View>

            {/* Seed Control */}
            <View style={styles.section}>
              <View style={styles.seedHeader}>
                <Text style={styles.sectionLabel}>Seed Number</Text>
                <TouchableOpacity style={styles.randomizeBtn} onPress={randomizeSeed}>
                  <Ionicons name="dice-outline" size={14} color={COLORS.secondary} />
                  <Text style={styles.randomizeText}>Randomize</Text>
                </TouchableOpacity>
              </View>
              <TextInput
                style={styles.seedInput}
                keyboardType="numeric"
                value={seed.toString()}
                onChangeText={(text) => {
                  const num = parseInt(text, 10);
                  onChangeSeed(isNaN(num) ? 0 : num);
                }}
              />
            </View>

            {/* Toggles */}
            <View style={styles.toggleRow}>
              <View style={styles.toggleInfo}>
                <Text style={styles.toggleTitle}>4K High-Res Upscale</Text>
                <Text style={styles.toggleSub}>Refine micro-textures & eliminate artifacts</Text>
              </View>
              <Switch
                value={highResUpscale}
                onValueChange={onChangeHighResUpscale}
                trackColor={{ false: COLORS.surface, true: COLORS.primary }}
                thumbColor="#FFF"
              />
            </View>

            {isVideo && (
              <View style={styles.toggleRow}>
                <View style={styles.toggleInfo}>
                  <Text style={styles.toggleTitle}>AI Audio & Sound FX</Text>
                  <Text style={styles.toggleSub}>Generate matching cinematic ambient audio</Text>
                </View>
                <Switch
                  value={enableSoundFX}
                  onValueChange={onChangeEnableSoundFX}
                  trackColor={{ false: COLORS.surface, true: COLORS.secondary }}
                  thumbColor="#FFF"
                />
              </View>
            )}
          </ScrollView>

          {/* Footer apply */}
          <View style={styles.modalFooter}>
            <TouchableOpacity style={styles.applyBtn} onPress={onClose}>
              <LinearGradient
                colors={['#6366F1', '#A855F7']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.applyGradient}
              >
                <Text style={styles.applyText}>Apply Settings</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(5, 8, 16, 0.88)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalCard: {
    width: '100%',
    maxWidth: 450,
    maxHeight: '88%',
    backgroundColor: COLORS.cardBackground,
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.borderHighlight,
    ...SHADOWS.md,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modalTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  closeBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.cardBackgroundLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    padding: 18,
  },
  section: {
    marginBottom: 18,
  },
  sectionLabel: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  durationRow: {
    flexDirection: 'row',
    gap: 8,
  },
  durationCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    padding: 10,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.border,
    position: 'relative',
  },
  durationCardSelected: {
    borderColor: COLORS.secondary,
    backgroundColor: 'rgba(6, 182, 212, 0.15)',
  },
  durationText: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: '700',
  },
  durationTextSelected: {
    color: '#FFF',
  },
  durationCost: {
    color: '#FBBF24',
    fontSize: 10,
    fontWeight: '600',
    marginTop: 4,
  },
  durationBadge: {
    position: 'absolute',
    top: -6,
    backgroundColor: COLORS.secondary,
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
  },
  durationBadgeText: {
    color: '#000',
    fontSize: 8,
    fontWeight: '800',
  },
  cameraGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  cameraChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: RADIUS.sm,
    gap: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cameraChipSelected: {
    borderColor: COLORS.primary,
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
  },
  cameraLabel: {
    color: COLORS.textMuted,
    fontSize: 11,
    fontWeight: '600',
  },
  cameraLabelSelected: {
    color: '#FFF',
  },
  sliderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sliderValText: {
    color: COLORS.secondary,
    fontSize: 12,
    fontWeight: '700',
  },
  motionStepRow: {
    flexDirection: 'row',
    gap: 8,
  },
  stepBtn: {
    flex: 1,
    backgroundColor: COLORS.surface,
    paddingVertical: 8,
    borderRadius: RADIUS.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  stepBtnSelected: {
    borderColor: COLORS.secondary,
    backgroundColor: 'rgba(6, 182, 212, 0.2)',
  },
  stepText: {
    color: COLORS.textMuted,
    fontSize: 11,
    fontWeight: '600',
  },
  stepTextSelected: {
    color: '#FFF',
    fontWeight: '700',
  },
  negativeInput: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: 10,
    color: COLORS.text,
    fontSize: 13,
    minHeight: 55,
    borderWidth: 1,
    borderColor: COLORS.border,
    textAlignVertical: 'top',
  },
  seedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  randomizeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  randomizeText: {
    color: COLORS.secondary,
    fontSize: 11,
    fontWeight: '600',
  },
  seedInput: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: 10,
    color: COLORS.text,
    fontSize: 13,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  toggleInfo: {
    flex: 1,
    paddingRight: 12,
  },
  toggleTitle: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '600',
  },
  toggleSub: {
    color: COLORS.textMuted,
    fontSize: 11,
    marginTop: 2,
  },
  modalFooter: {
    padding: 16,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  applyBtn: {
    borderRadius: RADIUS.md,
    overflow: 'hidden',
  },
  applyGradient: {
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
