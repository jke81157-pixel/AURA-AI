import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useApp } from '../context/AppContext';
import { COLORS, RADIUS, SHADOWS } from '../constants/theme';

const PRO_TIERS = [
  {
    id: 'weekly' as const,
    name: 'Weekly Access',
    price: '$4.99',
    period: '/ week',
    badge: null,
    bonus: '+100 Bonus ⚡',
  },
  {
    id: 'monthly' as const,
    name: 'Monthly Pro',
    price: '$12.99',
    period: '/ month',
    badge: 'BEST VALUE',
    bonus: '+500 Bonus ⚡ & VIP Queue',
  },
  {
    id: 'lifetime' as const,
    name: 'Lifetime VIP',
    price: '$49.99',
    period: 'one-time',
    badge: 'LIFETIME',
    bonus: 'Unlimited Everything Forever',
  },
];

const FEATURES = [
  { icon: 'infinite', title: 'Unlimited AI Generations', desc: 'No daily limits for Flux & Nana Banana' },
  { icon: 'videocam', title: 'Veo 3 & Kling 10s HD Videos', desc: 'Uncapped cinematic AI video creation' },
  { icon: 'flash', title: 'Priority High-Speed GPU', desc: 'Zero wait queue with 4x faster renders' },
  { icon: 'sparkles', title: '4K Ultra-HD Upscaling', desc: 'Commercial license & watermark-free export' },
  { icon: 'color-wand', title: 'Advanced Camera Controls', desc: 'FPV drone, orbit 360, pan & tilt dynamics' },
];

export const ProUpgradeModal: React.FC = () => {
  const { isProModalOpen, setIsProModalOpen, upgradeToPro, restorePurchases, isPro } = useApp();
  const [selectedTier, setSelectedTier] = useState<'weekly' | 'monthly' | 'lifetime'>('monthly');

  const handleUpgrade = () => {
    upgradeToPro(selectedTier);
  };

  return (
    <Modal
      visible={isProModalOpen}
      transparent
      animationType="slide"
      onRequestClose={() => setIsProModalOpen(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <LinearGradient
            colors={['#F59E0B', '#D97706', '#B45309']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.header}
          >
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setIsProModalOpen(false)}
            >
              <Ionicons name="close" size={20} color="#FFF" />
            </TouchableOpacity>

            <View style={styles.crownCircle}>
              <Ionicons name="star" size={32} color="#FFF" />
            </View>

            <Text style={styles.proTitle}>AURA AI VIP PRO</Text>
            <Text style={styles.proSubtitle}>
              Unlock Unlimited Flux & Veo 3 Neural Studios
            </Text>
          </LinearGradient>

          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            {/* Feature Highlights */}
            <View style={styles.featuresContainer}>
              {FEATURES.map((feat, idx) => (
                <View key={idx} style={styles.featureRow}>
                  <View style={styles.featureIconBox}>
                    <Ionicons name={feat.icon as any} size={18} color="#FBBF24" />
                  </View>
                  <View style={styles.featureTextBox}>
                    <Text style={styles.featureTitle}>{feat.title}</Text>
                    <Text style={styles.featureDesc}>{feat.desc}</Text>
                  </View>
                </View>
              ))}
            </View>

            {/* Pricing Options */}
            <Text style={styles.sectionHeader}>Select Your Plan</Text>
            <View style={styles.tierCardsContainer}>
              {PRO_TIERS.map((tier) => {
                const isSelected = selectedTier === tier.id;
                return (
                  <TouchableOpacity
                    key={tier.id}
                    activeOpacity={0.8}
                    style={[styles.tierCard, isSelected && styles.tierCardSelected]}
                    onPress={() => setSelectedTier(tier.id)}
                  >
                    {tier.badge && (
                      <View style={styles.tierBadge}>
                        <Text style={styles.tierBadgeText}>{tier.badge}</Text>
                      </View>
                    )}
                    <View style={styles.tierHeader}>
                      <Text style={[styles.tierName, isSelected && styles.tierNameSelected]}>
                        {tier.name}
                      </Text>
                      <View style={styles.radioCircle}>
                        {isSelected && <View style={styles.radioInner} />}
                      </View>
                    </View>

                    <View style={styles.priceRow}>
                      <Text style={styles.priceNumber}>{tier.price}</Text>
                      <Text style={styles.periodText}>{tier.period}</Text>
                    </View>

                    <Text style={styles.bonusText}>{tier.bonus}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Guarantee and terms */}
            <View style={styles.guaranteeRow}>
              <Ionicons name="shield-checkmark-outline" size={16} color={COLORS.success} />
              <Text style={styles.guaranteeText}>Cancel anytime • 100% Satisfaction Guarantee</Text>
            </View>
          </ScrollView>

          {/* Bottom Action Footer */}
          <View style={styles.footer}>
            <TouchableOpacity
              activeOpacity={0.85}
              style={styles.unlockButton}
              onPress={handleUpgrade}
            >
              <LinearGradient
                colors={['#F59E0B', '#D97706']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.unlockGradient}
              >
                <Ionicons name="sparkles" size={20} color="#FFF" />
                <Text style={styles.unlockText}>
                  {isPro ? 'Manage Active VIP Pro' : 'Unlock VIP Pro Access'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={styles.restoreBtn} onPress={restorePurchases}>
              <Text style={styles.restoreText}>Restore Purchases</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(5, 8, 16, 0.88)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 440,
    maxHeight: '92%',
    backgroundColor: COLORS.cardBackground,
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(251, 191, 36, 0.3)',
    ...SHADOWS.goldGlow,
  },
  header: {
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 18,
    paddingHorizontal: 20,
    position: 'relative',
  },
  closeBtn: {
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
  crownCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  proTitle: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 1,
  },
  proSubtitle: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
    textAlign: 'center',
  },
  scrollView: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  featuresContainer: {
    backgroundColor: COLORS.surface,
    padding: 14,
    borderRadius: RADIUS.md,
    gap: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 16,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureIconBox: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: 'rgba(251, 191, 36, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureTextBox: {
    flex: 1,
  },
  featureTitle: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '700',
  },
  featureDesc: {
    color: COLORS.textMuted,
    fontSize: 11,
  },
  sectionHeader: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  tierCardsContainer: {
    gap: 10,
    marginBottom: 14,
  },
  tierCard: {
    backgroundColor: COLORS.cardBackgroundLight,
    borderRadius: RADIUS.md,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    position: 'relative',
  },
  tierCardSelected: {
    borderColor: '#F59E0B',
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    borderWidth: 2,
  },
  tierBadge: {
    position: 'absolute',
    top: -8,
    right: 14,
    backgroundColor: '#F59E0B',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
  },
  tierBadgeText: {
    color: '#000',
    fontSize: 9,
    fontWeight: '900',
  },
  tierHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  tierName: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '700',
  },
  tierNameSelected: {
    color: '#FBBF24',
  },
  radioCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#FBBF24',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FBBF24',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  priceNumber: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '800',
  },
  periodText: {
    color: COLORS.textMuted,
    fontSize: 11,
  },
  bonusText: {
    color: COLORS.secondary,
    fontSize: 11,
    fontWeight: '600',
    marginTop: 4,
  },
  guaranteeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 6,
    marginBottom: 10,
  },
  guaranteeText: {
    color: COLORS.textMuted,
    fontSize: 11,
  },
  footer: {
    padding: 16,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    gap: 8,
  },
  unlockButton: {
    borderRadius: RADIUS.md,
    overflow: 'hidden',
    ...SHADOWS.goldGlow,
  },
  unlockGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    gap: 8,
  },
  unlockText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '800',
  },
  restoreBtn: {
    alignItems: 'center',
    paddingVertical: 4,
  },
  restoreText: {
    color: COLORS.textMuted,
    fontSize: 11,
    textDecorationLine: 'underline',
  },
});
