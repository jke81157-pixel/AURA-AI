import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useApp } from '../context/AppContext';
import { COLORS, RADIUS, SHADOWS } from '../constants/theme';

const CREDIT_PACKS = [
  { id: 'pack-50', credits: 50, price: '$1.99', popular: false },
  { id: 'pack-200', credits: 200, price: '$4.99', popular: true, bonus: '+25 Bonus' },
  { id: 'pack-500', credits: 500, price: '$9.99', popular: false, bonus: '+100 Bonus' },
  { id: 'pack-1200', credits: 1200, price: '$19.99', popular: false, bonus: '+300 Mega Bonus' },
];

export const CreditsScreen: React.FC = () => {
  const {
    credits,
    isPro,
    setIsDailyModalOpen,
    setIsAdModalOpen,
    setIsProModalOpen,
    addCredits,
    showToast,
  } = useApp();

  const handleBuyPack = (pack: typeof CREDIT_PACKS[0]) => {
    addCredits(pack.credits, `Purchased ${pack.credits} Credits Pack`);
  };

  const handleCompleteQuest = (creditsReward: number, questTitle: string) => {
    addCredits(creditsReward, questTitle);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      {/* Hero Balance Card */}
      <View style={styles.balanceCard}>
        <LinearGradient
          colors={['#1E293B', '#0F172A']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.balanceGradient}
        >
          <View style={styles.balanceTopRow}>
            <View>
              <Text style={styles.balanceLabel}>Available Neural Balance</Text>
              <View style={styles.numberRow}>
                <Ionicons name="flash" size={28} color="#FBBF24" />
                <Text style={styles.balanceNumber}>
                  {isPro ? 'UNLIMITED' : credits.balance}
                </Text>
                {!isPro && <Text style={styles.creditsUnit}>Credits</Text>}
              </View>
            </View>

            {isPro && (
              <View style={styles.proPill}>
                <Ionicons name="star" size={14} color="#000" />
                <Text style={styles.proPillText}>VIP PRO</Text>
              </View>
            )}
          </View>

          {/* Streak & Ad Stats */}
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Ionicons name="flame" size={18} color="#FF6B6B" />
              <View>
                <Text style={styles.statVal}>{credits.dailyStreak} Days</Text>
                <Text style={styles.statSub}>Streak</Text>
              </View>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statBox}>
              <Ionicons name="videocam" size={18} color={COLORS.secondary} />
              <View>
                <Text style={styles.statVal}>{credits.adsWatchedToday || 0}</Text>
                <Text style={styles.statSub}>Ads Watched</Text>
              </View>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statBox}>
              <Ionicons name="hardware-chip" size={18} color={COLORS.primaryGradientEnd} />
              <View>
                <Text style={styles.statVal}>Active</Text>
                <Text style={styles.statSub}>Cloud GPU</Text>
              </View>
            </View>
          </View>
        </LinearGradient>
      </View>

      {/* Free Daily & Rewarded Ads Section */}
      <Text style={styles.sectionTitle}>Free Ways to Earn Credits</Text>
      <View style={styles.freeWaysGrid}>
        {/* Daily Streak Card */}
        <TouchableOpacity
          activeOpacity={0.85}
          style={styles.freeCard}
          onPress={() => setIsDailyModalOpen(true)}
        >
          <LinearGradient
            colors={['rgba(255, 107, 107, 0.15)', 'rgba(239, 68, 68, 0.05)']}
            style={styles.freeCardGradient}
          >
            <View style={styles.freeIconCircleFlame}>
              <Ionicons name="flame" size={24} color="#FF6B6B" />
            </View>
            <Text style={styles.freeCardTitle}>Daily Login Streak</Text>
            <Text style={styles.freeCardSub}>Claim up to +50 ⚡ daily</Text>
            <View style={styles.freeActionPill}>
              <Text style={styles.freeActionText}>Check In</Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* Watch Rewarded Ad Card */}
        <TouchableOpacity
          activeOpacity={0.85}
          style={styles.freeCard}
          onPress={() => setIsAdModalOpen(true)}
        >
          <LinearGradient
            colors={['rgba(6, 182, 212, 0.15)', 'rgba(59, 130, 246, 0.05)']}
            style={styles.freeCardGradient}
          >
            <View style={styles.freeIconCircleAd}>
              <Ionicons name="play-circle" size={24} color={COLORS.secondary} />
            </View>
            <Text style={styles.freeCardTitle}>Watch Rewarded Ad</Text>
            <Text style={styles.freeCardSub}>Instant +5 ⚡ per 5s video</Text>
            <View style={[styles.freeActionPill, styles.adActionPill]}>
              <Text style={styles.freeActionText}>Watch Now</Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* VIP Unlimited Pass Banner */}
      <TouchableOpacity
        activeOpacity={0.88}
        style={styles.vipBanner}
        onPress={() => setIsProModalOpen(true)}
      >
        <LinearGradient
          colors={['#F59E0B', '#D97706', '#92400E']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.vipGradient}
        >
          <View style={styles.vipTopRow}>
            <View style={styles.vipBadge}>
              <Text style={styles.vipBadgeText}>VIP MEMBERSHIP</Text>
            </View>
            <Ionicons name="star" size={20} color="#FFF" />
          </View>

          <Text style={styles.vipTitle}>Unlimited AI Image & Video Studio</Text>
          <Text style={styles.vipDesc}>
            Never worry about credits again. Uncapped Flux.1 Dev, Nana Banana v2.5, and Veo 3 10-second HD generations.
          </Text>

          <View style={styles.vipCtaRow}>
            <Text style={styles.vipPricing}>From $4.99 / week</Text>
            <View style={styles.vipButton}>
              <Text style={styles.vipButtonText}>Explore VIP</Text>
              <Ionicons name="arrow-forward" size={14} color="#000" />
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>

      {/* Credit Packs */}
      <Text style={styles.sectionTitle}>Credit Refill Packs</Text>
      <View style={styles.packsGrid}>
        {CREDIT_PACKS.map((pack) => (
          <TouchableOpacity
            key={pack.id}
            activeOpacity={0.85}
            style={[styles.packCard, pack.popular && styles.packCardPopular]}
            onPress={() => handleBuyPack(pack)}
          >
            {pack.popular && (
              <View style={styles.popularBadge}>
                <Text style={styles.popularBadgeText}>MOST POPULAR</Text>
              </View>
            )}

            <View style={styles.packTop}>
              <Ionicons name="flash" size={22} color="#FBBF24" />
              <Text style={styles.packCredits}>{pack.credits} ⚡</Text>
              {pack.bonus && <Text style={styles.packBonus}>{pack.bonus}</Text>}
            </View>

            <View style={styles.packPriceBtn}>
              <Text style={styles.packPriceText}>{pack.price}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Quests & Milestones */}
      <Text style={styles.sectionTitle}>Creator Quests</Text>
      <View style={styles.questsCard}>
        {[
          { title: 'Try Nana Banana Anime Model', reward: 5, icon: 'color-palette-outline' },
          { title: 'Create a 10s Veo 3 Cinematic Video', reward: 10, icon: 'videocam-outline' },
          { title: 'Share an AI Creation to Social Media', reward: 5, icon: 'share-social-outline' },
          { title: 'Attach Reference Image in Studio', reward: 5, icon: 'image-outline' },
        ].map((quest, idx) => (
          <View key={idx} style={[styles.questRow, idx > 0 && styles.questBorder]}>
            <View style={styles.questIconBox}>
              <Ionicons name={quest.icon as any} size={18} color={COLORS.secondary} />
            </View>
            <View style={styles.questTextBox}>
              <Text style={styles.questTitle}>{quest.title}</Text>
              <Text style={styles.questReward}>Reward: +{quest.reward} ⚡ Credits</Text>
            </View>
            <TouchableOpacity
              style={styles.claimQuestBtn}
              onPress={() => handleCompleteQuest(quest.reward, quest.title)}
            >
              <Text style={styles.claimQuestText}>Claim</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: 16,
  },
  balanceCard: {
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(251, 191, 36, 0.3)',
    marginBottom: 18,
    ...SHADOWS.md,
  },
  balanceGradient: {
    padding: 18,
  },
  balanceTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  balanceLabel: {
    color: COLORS.textMuted,
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  numberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  balanceNumber: {
    color: '#FFF',
    fontSize: 28,
    fontWeight: '900',
  },
  creditsUnit: {
    color: '#FBBF24',
    fontSize: 16,
    fontWeight: '700',
  },
  proPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F59E0B',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
    gap: 4,
  },
  proPillText: {
    color: '#000',
    fontSize: 11,
    fontWeight: '900',
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: RADIUS.md,
    padding: 10,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statVal: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '700',
  },
  statSub: {
    color: COLORS.textMuted,
    fontSize: 10,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  sectionTitle: {
    color: COLORS.textSecondary,
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
    marginTop: 6,
  },
  freeWaysGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 18,
  },
  freeCard: {
    flex: 1,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  freeCardGradient: {
    padding: 14,
    alignItems: 'center',
  },
  freeIconCircleFlame: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 107, 107, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  freeIconCircleAd: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(6, 182, 212, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  freeCardTitle: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 2,
  },
  freeCardSub: {
    color: COLORS.textMuted,
    fontSize: 10,
    textAlign: 'center',
    marginBottom: 10,
  },
  freeActionPill: {
    backgroundColor: 'rgba(255, 107, 107, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 107, 0.4)',
  },
  adActionPill: {
    backgroundColor: 'rgba(6, 182, 212, 0.2)',
    borderColor: 'rgba(6, 182, 212, 0.4)',
  },
  freeActionText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '700',
  },
  vipBanner: {
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    marginBottom: 20,
    ...SHADOWS.goldGlow,
  },
  vipGradient: {
    padding: 18,
  },
  vipTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  vipBadge: {
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  vipBadgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  vipTitle: {
    color: '#FFF',
    fontSize: 17,
    fontWeight: '900',
    marginBottom: 4,
  },
  vipDesc: {
    color: 'rgba(255, 255, 255, 0.88)',
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 14,
  },
  vipCtaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  vipPricing: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '700',
  },
  vipButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: RADIUS.full,
    gap: 6,
  },
  vipButtonText: {
    color: '#000',
    fontSize: 12,
    fontWeight: '800',
  },
  packsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  packCard: {
    width: '48%',
    backgroundColor: COLORS.cardBackgroundLight,
    borderRadius: RADIUS.lg,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    position: 'relative',
  },
  packCardPopular: {
    borderColor: COLORS.primary,
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
  },
  popularBadge: {
    position: 'absolute',
    top: -8,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
  },
  popularBadgeText: {
    color: '#FFF',
    fontSize: 8,
    fontWeight: '900',
  },
  packTop: {
    alignItems: 'center',
    marginBottom: 10,
  },
  packCredits: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '800',
    marginTop: 4,
  },
  packBonus: {
    color: COLORS.secondary,
    fontSize: 10,
    fontWeight: '700',
    marginTop: 2,
  },
  packPriceBtn: {
    backgroundColor: COLORS.surface,
    width: '100%',
    paddingVertical: 6,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  packPriceText: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: '700',
  },
  questsCard: {
    backgroundColor: COLORS.cardBackgroundLight,
    borderRadius: RADIUS.lg,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  questRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    gap: 10,
  },
  questBorder: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  questIconBox: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  questTextBox: {
    flex: 1,
  },
  questTitle: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: '600',
  },
  questReward: {
    color: '#FBBF24',
    fontSize: 11,
    fontWeight: '700',
    marginTop: 2,
  },
  claimQuestBtn: {
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  claimQuestText: {
    color: COLORS.primaryGradientEnd,
    fontSize: 11,
    fontWeight: '700',
  },
});
