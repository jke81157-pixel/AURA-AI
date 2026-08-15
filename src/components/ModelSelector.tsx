import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';
import { ModelId, MediaType } from '../types';
import { IMAGE_MODELS, VIDEO_MODELS } from '../constants/models';
import { COLORS, RADIUS, SHADOWS } from '../constants/theme';

interface ModelSelectorProps {
  mediaType: MediaType;
  selectedModel: ModelId;
  onSelectModel: (modelId: ModelId) => void;
}

export const ModelSelector: React.FC<ModelSelectorProps> = ({
  mediaType,
  selectedModel,
  onSelectModel,
}) => {
  const models = mediaType === 'video' ? VIDEO_MODELS : IMAGE_MODELS;

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>AI Generation Engine</Text>
        <Text style={styles.providerHint}>
          {mediaType === 'video' ? 'Google DeepMind & Kling' : 'Black Forest Labs & Nana'}
        </Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {models.map((item) => {
          const isSelected = selectedModel === item.id;
          return (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.8}
              style={[styles.modelCard, isSelected && styles.modelCardSelected]}
              onPress={() => onSelectModel(item.id)}
            >
              {isSelected ? (
                <LinearGradient
                  colors={mediaType === 'video' ? ['rgba(6, 182, 212, 0.25)', 'rgba(99, 102, 241, 0.25)'] : ['rgba(99, 102, 241, 0.3)', 'rgba(168, 85, 247, 0.2)']}
                  style={styles.cardInner}
                >
                  <View style={styles.cardTopRow}>
                    <View style={[styles.iconCircle, styles.iconCircleActive]}>
                      <Ionicons
                        name={item.iconName as any}
                        size={16}
                        color={mediaType === 'video' ? COLORS.secondary : COLORS.primaryGradientEnd}
                      />
                    </View>
                    {item.badge && (
                      <View style={styles.badgePill}>
                        <Text style={styles.badgeText}>{item.badge}</Text>
                      </View>
                    )}
                  </View>

                  <Text style={[styles.modelName, styles.modelNameActive]}>{item.name}</Text>
                  <Text style={styles.tagline} numberOfLines={1}>
                    {item.tagline}
                  </Text>

                  <View style={styles.footerRow}>
                    <Text style={styles.providerText}>{item.provider}</Text>
                    <View style={styles.costBadge}>
                      <Ionicons name="flash" size={10} color="#FBBF24" />
                      <Text style={styles.costText}>{item.creditCost} ⚡</Text>
                    </View>
                  </View>
                </LinearGradient>
              ) : (
                <View style={styles.cardInner}>
                  <View style={styles.cardTopRow}>
                    <View style={styles.iconCircle}>
                      <Ionicons name={item.iconName as any} size={16} color={COLORS.textMuted} />
                    </View>
                    {item.badge && (
                      <View style={styles.badgePillInactive}>
                        <Text style={styles.badgeTextInactive}>{item.badge}</Text>
                      </View>
                    )}
                  </View>

                  <Text style={styles.modelName}>{item.name}</Text>
                  <Text style={styles.tagline} numberOfLines={1}>
                    {item.tagline}
                  </Text>

                  <View style={styles.footerRow}>
                    <Text style={styles.providerText}>{item.provider}</Text>
                    <View style={styles.costBadgeInactive}>
                      <Ionicons name="flash" size={10} color={COLORS.textMuted} />
                      <Text style={styles.costTextInactive}>{item.creditCost} ⚡</Text>
                    </View>
                  </View>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  providerHint: {
    color: COLORS.textMuted,
    fontSize: 11,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 10,
  },
  modelCard: {
    width: 175,
    backgroundColor: COLORS.cardBackgroundLight,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    overflow: 'hidden',
    ...SHADOWS.sm,
  },
  modelCardSelected: {
    borderColor: COLORS.primary,
    ...SHADOWS.glow,
  },
  cardInner: {
    padding: 12,
    justifyContent: 'space-between',
    height: 115,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircleActive: {
    backgroundColor: 'rgba(99, 102, 241, 0.25)',
  },
  badgePill: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
  },
  badgeText: {
    color: '#FFF',
    fontSize: 9,
    fontWeight: '800',
  },
  badgePillInactive: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
  },
  badgeTextInactive: {
    color: COLORS.textMuted,
    fontSize: 9,
    fontWeight: '600',
  },
  modelName: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: '700',
    marginTop: 4,
  },
  modelNameActive: {
    color: '#FFF',
  },
  tagline: {
    color: COLORS.textMuted,
    fontSize: 10,
    marginTop: 1,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
    paddingTop: 6,
  },
  providerText: {
    color: COLORS.textMuted,
    fontSize: 9,
  },
  costBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(251, 191, 36, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
  },
  costText: {
    color: '#FBBF24',
    fontSize: 10,
    fontWeight: '700',
  },
  costBadgeInactive: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: COLORS.surface,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
  },
  costTextInactive: {
    color: COLORS.textMuted,
    fontSize: 10,
    fontWeight: '600',
  },
});
