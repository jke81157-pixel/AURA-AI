import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Modal, Animated, Easing, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';
import { GenerationStepProgress, MediaType } from '../types';
import { COLORS, RADIUS, SHADOWS } from '../constants/theme';

interface GeneratingOverlayProps {
  visible: boolean;
  type: MediaType;
  modelName: string;
  stepProgress: GenerationStepProgress;
  onCancel?: () => void;
}

export const GeneratingOverlay: React.FC<GeneratingOverlayProps> = ({
  visible,
  type,
  modelName,
  stepProgress,
  onCancel,
}) => {
  const spinAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Rotate animation
      Animated.loop(
        Animated.timing(spinAnim, {
          toValue: 1,
          duration: 3000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();

      // Pulse animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.12,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [visible, spinAnim, pulseAnim]);

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: stepProgress.progress / 100,
      duration: 350,
      useNativeDriver: false,
    }).start();
  }, [stepProgress.progress, progressAnim]);

  if (!visible) return null;

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const widthInterpolation = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Animated Glowing Ring */}
          <View style={styles.animationCenter}>
            <Animated.View
              style={[
                styles.glowCircle,
                {
                  transform: [{ scale: pulseAnim }],
                },
              ]}
            />
            <Animated.View
              style={[
                styles.spinningRing,
                {
                  transform: [{ rotate: spin }],
                },
              ]}
            >
              <LinearGradient
                colors={type === 'video' ? ['#06B6D4', '#3B82F6', '#6366F1'] : ['#6366F1', '#EC4899', '#F59E0B']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.ringGradient}
              />
            </Animated.View>

            <View style={styles.innerIconCircle}>
              <Ionicons
                name={type === 'video' ? 'videocam' : 'sparkles'}
                size={34}
                color="#FFF"
              />
            </View>
          </View>

          {/* Model & Header */}
          <View style={styles.headerInfo}>
            <View style={styles.badgeRow}>
              <Text style={styles.badgeText}>
                {type === 'video' ? 'NEURAL VIDEO SYNTHESIS' : 'DIFFUSION TRANSFORMER'}
              </Text>
            </View>
            <Text style={styles.modelNameText}>{modelName}</Text>
          </View>

          {/* Progress Bar & Stage */}
          <View style={styles.progressSection}>
            <View style={styles.stageRow}>
              <Text style={styles.stageTitle}>{stepProgress.stage}</Text>
              <Text style={styles.percentText}>{stepProgress.progress}%</Text>
            </View>

            <View style={styles.progressTrack}>
              <Animated.View style={[styles.progressFill, { width: widthInterpolation }]}>
                <LinearGradient
                  colors={type === 'video' ? ['#06B6D4', '#6366F1'] : ['#6366F1', '#EC4899']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.fillGradient}
                />
              </Animated.View>
            </View>

            <Text style={styles.detailsText}>{stepProgress.details}</Text>
          </View>

          {/* Neural compute tip */}
          <View style={styles.tipCard}>
            <Ionicons name="hardware-chip-outline" size={16} color={COLORS.secondary} />
            <Text style={styles.tipText}>
              Processing via High-Performance H100 Tensor Core Cluster
            </Text>
          </View>

          {onCancel && (
            <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
              <Text style={styles.cancelBtnText}>Abort Task</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(5, 8, 16, 0.94)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  container: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: COLORS.cardBackground,
    borderRadius: RADIUS.xl,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderHighlight,
    ...SHADOWS.glow,
  },
  animationCenter: {
    width: 140,
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  glowCircle: {
    position: 'absolute',
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: 'rgba(99, 102, 241, 0.25)',
  },
  spinningRing: {
    width: 120,
    height: 120,
    borderRadius: 60,
    padding: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 60,
  },
  innerIconCircle: {
    position: 'absolute',
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.borderHighlight,
  },
  headerInfo: {
    alignItems: 'center',
    marginBottom: 20,
  },
  badgeRow: {
    backgroundColor: 'rgba(99, 102, 241, 0.18)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
    marginBottom: 6,
  },
  badgeText: {
    color: COLORS.primaryGradientEnd,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  modelNameText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '800',
  },
  progressSection: {
    width: '100%',
    marginBottom: 20,
  },
  stageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  stageTitle: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: '700',
  },
  percentText: {
    color: COLORS.secondary,
    fontSize: 14,
    fontWeight: '900',
  },
  progressTrack: {
    height: 8,
    backgroundColor: COLORS.surface,
    borderRadius: 4,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
  },
  fillGradient: {
    width: '100%',
    height: '100%',
  },
  detailsText: {
    color: COLORS.textMuted,
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 16,
  },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: RADIUS.md,
    gap: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 16,
  },
  tipText: {
    color: COLORS.textSecondary,
    fontSize: 11,
    flex: 1,
  },
  cancelBtn: {
    paddingVertical: 6,
    paddingHorizontal: 16,
  },
  cancelBtnText: {
    color: COLORS.textMuted,
    fontSize: 12,
    textDecorationLine: 'underline',
  },
});
