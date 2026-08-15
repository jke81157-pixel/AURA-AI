import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { AspectRatioId } from '../types';
import { ASPECT_RATIOS } from '../constants/models';
import { COLORS, RADIUS, SHADOWS } from '../constants/theme';

interface AspectRatioSelectorProps {
  selectedRatio: AspectRatioId;
  onSelectRatio: (ratio: AspectRatioId) => void;
}

export const AspectRatioSelector: React.FC<AspectRatioSelectorProps> = ({
  selectedRatio,
  onSelectRatio,
}) => {
  const getBoxDimensions = (id: AspectRatioId) => {
    switch (id) {
      case '16:9':
        return { width: 28, height: 16 };
      case '9:16':
        return { width: 16, height: 28 };
      case '1:1':
        return { width: 22, height: 22 };
      case '4:3':
        return { width: 24, height: 18 };
      case '21:9':
        return { width: 32, height: 14 };
      default:
        return { width: 20, height: 20 };
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>Aspect Ratio & Canvas</Text>
        <Text style={styles.ratioHint}>{selectedRatio}</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {ASPECT_RATIOS.map((item) => {
          const isSelected = selectedRatio === item.id;
          const dims = getBoxDimensions(item.id);

          return (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.8}
              style={[styles.ratioCard, isSelected && styles.ratioCardSelected]}
              onPress={() => onSelectRatio(item.id)}
            >
              <View style={styles.previewContainer}>
                <View
                  style={[
                    styles.ratioBox,
                    { width: dims.width, height: dims.height },
                    isSelected && styles.ratioBoxSelected,
                  ]}
                />
              </View>

              <Text style={[styles.ratioLabel, isSelected && styles.ratioLabelSelected]}>
                {item.label}
              </Text>
              <Text style={styles.sublabel}>{item.sublabel}</Text>
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
  ratioHint: {
    color: COLORS.primaryGradientEnd,
    fontSize: 12,
    fontWeight: '700',
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 10,
  },
  ratioCard: {
    width: 90,
    backgroundColor: COLORS.cardBackgroundLight,
    borderRadius: RADIUS.md,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  ratioCardSelected: {
    borderColor: COLORS.primary,
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    ...SHADOWS.glow,
  },
  previewContainer: {
    height: 34,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  ratioBox: {
    borderWidth: 1.5,
    borderColor: COLORS.textMuted,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  ratioBoxSelected: {
    borderColor: '#FFF',
    backgroundColor: 'rgba(99, 102, 241, 0.4)',
  },
  ratioLabel: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: '700',
  },
  ratioLabelSelected: {
    color: '#FFF',
  },
  sublabel: {
    color: COLORS.textMuted,
    fontSize: 9,
    marginTop: 2,
    textAlign: 'center',
  },
});
