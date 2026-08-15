import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '../context/AppContext';
import { CreditBadge } from './CreditBadge';
import { COLORS, RADIUS } from '../constants/theme';

export const Header: React.FC<{ title?: string; subtitle?: string }> = ({
  title = 'AURA AI STUDIO',
  subtitle = 'Flux • Nana • Veo 3 • Kling',
}) => {
  const { credits, isPro, setIsDailyModalOpen, setIsAdModalOpen, setIsProModalOpen } = useApp();

  return (
    <View style={styles.headerContainer}>
      <View style={styles.titleRow}>
        <View style={styles.brandContainer}>
          <LinearGradient
            colors={['#6366F1', '#A855F7']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.logoBadge}
          >
            <Ionicons name="sparkles" size={16} color="#FFF" />
          </LinearGradient>
          <View>
            <View style={styles.brandTitleRow}>
              <Text style={styles.brandTitle}>AURA</Text>
              <Text style={styles.brandTitleAccent}>AI</Text>
              {isPro && (
                <View style={styles.proTag}>
                  <Text style={styles.proTagText}>PRO</Text>
                </View>
              )}
            </View>
            <Text style={styles.subtitle}>{subtitle}</Text>
          </View>
        </View>

        <View style={styles.actionsRow}>
          {/* Daily Streak Button */}
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.streakButton}
            onPress={() => setIsDailyModalOpen(true)}
          >
            <Ionicons name="flame" size={15} color="#FF6B6B" />
            <Text style={styles.streakText}>{credits.dailyStreak}d</Text>
          </TouchableOpacity>

          {/* Ad Free Credit Button */}
          {!isPro && (
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.adButton}
              onPress={() => setIsAdModalOpen(true)}
            >
              <Ionicons name="play-circle" size={14} color="#06B6D4" />
              <Text style={styles.adButtonText}>+5 ⚡</Text>
            </TouchableOpacity>
          )}

          {/* Credit Badge */}
          <CreditBadge />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 12,
    backgroundColor: COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoBadge: {
    width: 34,
    height: 34,
    borderRadius: RADIUS.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  brandTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 1,
  },
  brandTitleAccent: {
    color: COLORS.primaryGradientEnd,
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 1,
  },
  proTag: {
    backgroundColor: '#F59E0B',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
    marginLeft: 2,
  },
  proTagText: {
    color: '#000',
    fontSize: 9,
    fontWeight: '900',
  },
  subtitle: {
    color: COLORS.textMuted,
    fontSize: 10,
    fontWeight: '500',
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  streakButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 107, 107, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 107, 0.3)',
    gap: 3,
  },
  streakText: {
    color: '#FF8A8A',
    fontSize: 12,
    fontWeight: '700',
  },
  adButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(6, 182, 212, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: 'rgba(6, 182, 212, 0.3)',
    gap: 4,
  },
  adButtonText: {
    color: '#06B6D4',
    fontSize: 12,
    fontWeight: '700',
  },
});
