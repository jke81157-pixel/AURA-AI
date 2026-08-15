import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Animated, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useApp } from '../context/AppContext';
import { COLORS, RADIUS, SHADOWS } from '../constants/theme';

export const RewardedAdModal: React.FC = () => {
  const { isAdModalOpen, setIsAdModalOpen, watchRewardedAd } = useApp();
  const [countdown, setCountdown] = useState(5);
  const [isCompleted, setIsCompleted] = useState(false);
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let timer: any;
    if (isAdModalOpen) {
      setCountdown(5);
      setIsCompleted(false);
      progressAnim.setValue(0);

      Animated.timing(progressAnim, {
        toValue: 1,
        duration: 5000,
        useNativeDriver: false,
      }).start();

      let secondsLeft = 5;
      timer = setInterval(() => {
        secondsLeft -= 1;
        setCountdown(secondsLeft);
        if (secondsLeft <= 0) {
          clearInterval(timer);
          setIsCompleted(true);
        }
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isAdModalOpen, progressAnim]);

  const handleClaim = async () => {
    await watchRewardedAd();
    setIsAdModalOpen(false);
  };

  const widthInterpolation = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <Modal
      visible={isAdModalOpen}
      transparent
      animationType="fade"
      onRequestClose={() => {
        if (isCompleted) setIsAdModalOpen(false);
      }}
    >
      <View style={styles.overlay}>
        <View style={styles.adCard}>
          {/* Top Info Bar */}
          <View style={styles.topBar}>
            <View style={styles.adBadge}>
              <Text style={styles.adBadgeText}>SPONSORED REWARD</Text>
            </View>
            
            {isCompleted ? (
              <TouchableOpacity
                style={styles.closeBtn}
                onPress={() => setIsAdModalOpen(false)}
              >
                <Ionicons name="close" size={18} color="#FFF" />
              </TouchableOpacity>
            ) : (
              <View style={styles.countdownPill}>
                <Ionicons name="time-outline" size={12} color="#FFF" />
                <Text style={styles.countdownText}>Reward in {countdown}s</Text>
              </View>
            )}
          </View>

          {/* Ad Creative Showcase */}
          <View style={styles.adContent}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80' }}
              style={styles.adImage}
              resizeMode="cover"
            />
            <LinearGradient
              colors={['transparent', 'rgba(11, 15, 25, 0.95)']}
              style={styles.adGradient}
            />

            <View style={styles.adOverlayText}>
              <View style={styles.sponsorRow}>
                <View style={styles.sponsorIcon}>
                  <Ionicons name="sparkles" size={18} color="#FFF" />
                </View>
                <View>
                  <Text style={styles.sponsorTitle}>Veo 3 & Flux Ultra Engine</Text>
                  <Text style={styles.sponsorSub}>Next-Generation Neural AI Diffusion</Text>
                </View>
              </View>
              <Text style={styles.adDesc}>
                Create cinematic 4K videos and ultra-realistic images with zero lag!
              </Text>
            </View>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressBarBg}>
            <Animated.View style={[styles.progressBarFill, { width: widthInterpolation }]} />
          </View>

          {/* Bottom Action */}
          <View style={styles.bottomBar}>
            {isCompleted ? (
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.claimButton}
                onPress={handleClaim}
              >
                <LinearGradient
                  colors={['#10B981', '#059669']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.claimBtnGradient}
                >
                  <Ionicons name="flash" size={20} color="#FBBF24" />
                  <Text style={styles.claimBtnText}>Claim +5 ⚡ Free Credits</Text>
                </LinearGradient>
              </TouchableOpacity>
            ) : (
              <View style={styles.waitingRow}>
                <Ionicons name="hourglass-outline" size={16} color={COLORS.secondary} />
                <Text style={styles.waitingText}>Watching sponsor video ({countdown}s)...</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(5, 8, 16, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  adCard: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: COLORS.cardBackground,
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.borderHighlight,
    ...SHADOWS.glow,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  adBadge: {
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  adBadgeText: {
    color: COLORS.primaryGradientEnd,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  countdownPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
    gap: 4,
  },
  countdownText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '600',
  },
  closeBtn: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  adContent: {
    height: 260,
    position: 'relative',
    backgroundColor: '#000',
  },
  adImage: {
    width: '100%',
    height: '100%',
  },
  adGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 140,
  },
  adOverlayText: {
    position: 'absolute',
    bottom: 12,
    left: 16,
    right: 16,
  },
  sponsorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 6,
  },
  sponsorIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sponsorTitle: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '800',
  },
  sponsorSub: {
    color: COLORS.secondary,
    fontSize: 11,
    fontWeight: '500',
  },
  adDesc: {
    color: COLORS.textSecondary,
    fontSize: 12,
    lineHeight: 16,
  },
  progressBarBg: {
    height: 4,
    backgroundColor: COLORS.border,
    width: '100%',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: COLORS.secondary,
  },
  bottomBar: {
    padding: 16,
    backgroundColor: COLORS.surface,
  },
  claimButton: {
    borderRadius: RADIUS.md,
    overflow: 'hidden',
    ...SHADOWS.md,
  },
  claimBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    gap: 8,
  },
  claimBtnText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '800',
  },
  waitingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    gap: 8,
  },
  waitingText: {
    color: COLORS.textMuted,
    fontSize: 13,
    fontWeight: '500',
  },
});
