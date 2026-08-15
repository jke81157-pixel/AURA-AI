import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useApp } from '../context/AppContext';
import { COLORS, RADIUS, SHADOWS } from '../constants/theme';

const STREAK_DAYS = [
  { day: 1, reward: 5, label: 'Day 1' },
  { day: 2, reward: 8, label: 'Day 2' },
  { day: 3, reward: 12, label: 'Day 3' },
  { day: 4, reward: 15, label: 'Day 4' },
  { day: 5, reward: 20, label: 'Day 5' },
  { day: 6, reward: 25, label: 'Day 6' },
  { day: 7, reward: 50, label: 'Day 7 (MEGA)', isMega: true },
];

export const DailyStreakModal: React.FC = () => {
  const { credits, isDailyModalOpen, setIsDailyModalOpen, claimDailyStreak, setIsAdModalOpen } = useApp();
  const [claimedToday, setClaimedToday] = useState(false);

  const todayStr = new Date().toISOString().split('T')[0];
  const isAlreadyClaimed = credits.lastClaimDate === todayStr || claimedToday;
  const currentStreakDay = ((credits.dailyStreak - 1) % 7) + 1;

  const handleClaim = () => {
    claimDailyStreak();
    setClaimedToday(true);
  };

  const handleDoubleRewardAd = () => {
    setIsDailyModalOpen(false);
    setTimeout(() => {
      setIsAdModalOpen(true);
    }, 300);
  };

  return (
    <Modal
      visible={isDailyModalOpen}
      transparent
      animationType="fade"
      onRequestClose={() => setIsDailyModalOpen(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Header Gradient */}
          <LinearGradient
            colors={['#4F46E5', '#7C3AED']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.modalHeader}
          >
            <TouchableOpacity
              style={styles.closeIcon}
              onPress={() => setIsDailyModalOpen(false)}
            >
              <Ionicons name="close" size={20} color="#FFF" />
            </TouchableOpacity>

            <View style={styles.flameIconCircle}>
              <Ionicons name="flame" size={36} color="#FFD166" />
            </View>

            <Text style={styles.modalTitle}>Daily Login Streak</Text>
            <Text style={styles.modalSubtitle}>
              Check in every day to earn free generation credits!
            </Text>
            
            <View style={styles.streakBadgeRow}>
              <Text style={styles.currentStreakText}>
                Current Streak: <Text style={styles.streakNumber}>{credits.dailyStreak} Days 🔥</Text>
              </Text>
            </View>
          </LinearGradient>

          {/* Calendar Grid */}
          <ScrollView contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
            <View style={styles.grid}>
              {STREAK_DAYS.map((item) => {
                const isPassed = item.day < currentStreakDay;
                const isCurrent = item.day === currentStreakDay;
                const isLocked = item.day > currentStreakDay;

                return (
                  <View
                    key={item.day}
                    style={[
                      styles.dayCard,
                      item.isMega && styles.megaDayCard,
                      isCurrent && styles.activeDayCard,
                      isPassed && styles.passedDayCard,
                    ]}
                  >
                    <Text style={styles.dayLabel}>{item.label}</Text>
                    
                    <View style={styles.rewardIconContainer}>
                      {isPassed ? (
                        <Ionicons name="checkmark-circle" size={24} color={COLORS.success} />
                      ) : item.isMega ? (
                        <Ionicons name="gift" size={26} color="#FBBF24" />
                      ) : (
                        <Ionicons name="flash" size={22} color={isCurrent ? '#FBBF24' : COLORS.textMuted} />
                      )}
                    </View>

                    <Text style={[styles.rewardText, isCurrent && styles.activeRewardText]}>
                      +{item.reward} ⚡
                    </Text>

                    {isCurrent && !isAlreadyClaimed && (
                      <View style={styles.todayPill}>
                        <Text style={styles.todayPillText}>TODAY</Text>
                      </View>
                    )}
                  </View>
                );
              })}
            </View>

            {/* Action Buttons */}
            <View style={styles.actionsContainer}>
              {!isAlreadyClaimed ? (
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={styles.claimButton}
                  onPress={handleClaim}
                >
                  <LinearGradient
                    colors={['#10B981', '#059669']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.buttonGradient}
                  >
                    <Ionicons name="gift-outline" size={20} color="#FFF" />
                    <Text style={styles.claimButtonText}>Claim Free Credits</Text>
                  </LinearGradient>
                </TouchableOpacity>
              ) : (
                <View style={styles.claimedBanner}>
                  <Ionicons name="checkmark-circle-outline" size={20} color={COLORS.success} />
                  <Text style={styles.claimedBannerText}>Today's reward already claimed! Next reward tomorrow.</Text>
                </View>
              )}

              {/* Bonus Double Ad Button */}
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.adBonusButton}
                onPress={handleDoubleRewardAd}
              >
                <Ionicons name="videocam" size={18} color="#06B6D4" />
                <Text style={styles.adBonusText}>Watch Ad for +5 Bonus Credits</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(5, 8, 16, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: COLORS.cardBackground,
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.borderHighlight,
    ...SHADOWS.md,
  },
  modalHeader: {
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 20,
    paddingHorizontal: 20,
    position: 'relative',
  },
  closeIcon: {
    position: 'absolute',
    top: 14,
    right: 14,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  flameIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  modalTitle: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 4,
  },
  modalSubtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 10,
  },
  streakBadgeRow: {
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
  },
  currentStreakText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
  streakNumber: {
    color: '#FBBF24',
    fontWeight: '800',
  },
  contentContainer: {
    padding: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  dayCard: {
    width: '23%',
    backgroundColor: COLORS.cardBackgroundLight,
    borderRadius: RADIUS.md,
    padding: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  megaDayCard: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(251, 191, 36, 0.1)',
    borderColor: 'rgba(251, 191, 36, 0.4)',
  },
  activeDayCard: {
    borderColor: '#6366F1',
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    borderWidth: 2,
  },
  passedDayCard: {
    opacity: 0.7,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  dayLabel: {
    color: COLORS.textMuted,
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 4,
  },
  rewardIconContainer: {
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  rewardText: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: '700',
  },
  activeRewardText: {
    color: '#FBBF24',
  },
  todayPill: {
    position: 'absolute',
    top: -6,
    backgroundColor: '#6366F1',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
  },
  todayPillText: {
    color: '#FFF',
    fontSize: 8,
    fontWeight: '900',
  },
  actionsContainer: {
    gap: 10,
  },
  claimButton: {
    borderRadius: RADIUS.md,
    overflow: 'hidden',
    ...SHADOWS.md,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    gap: 8,
  },
  claimButtonText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '700',
  },
  claimedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    padding: 12,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
    gap: 8,
  },
  claimedBannerText: {
    color: COLORS.success,
    fontSize: 12,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
  adBonusButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    backgroundColor: 'rgba(6, 182, 212, 0.1)',
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: 'rgba(6, 182, 212, 0.3)',
    gap: 8,
  },
  adBonusText: {
    color: '#06B6D4',
    fontSize: 13,
    fontWeight: '700',
  },
});
