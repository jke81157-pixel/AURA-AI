import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleId } from '../types';
import { STYLES } from '../constants/models';
import { COLORS, RADIUS, SHADOWS } from '../constants/theme';

interface StyleSelectorProps {
  selectedStyle: StyleId;
  onSelectStyle: (styleId: StyleId) => void;
}

export const StyleSelector: React.FC<StyleSelectorProps> = ({ selectedStyle, onSelectStyle }) => {
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>Visual Style</Text>
        <Text style={styles.activeStyleName}>
          {STYLES.find((s) => s.id === selectedStyle)?.label}
        </Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {STYLES.map((item) => {
          const isSelected = selectedStyle === item.id;
          return (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.8}
              style={[styles.styleCard, isSelected && styles.styleCardSelected]}
              onPress={() => onSelectStyle(item.id)}
            >
              <LinearGradient
                colors={item.previewGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.cardGradient}
              >
                <View style={styles.iconCircle}>
                  <Ionicons name={item.icon as any} size={18} color="#FFF" />
                </View>
                <Text style={styles.styleLabel} numberOfLines={1}>
                  {item.label}
                </Text>
                {isSelected && (
                  <View style={styles.selectedCheck}>
                    <Ionicons name="checkmark" size={12} color="#FFF" />
                  </View>
                )}
              </LinearGradient>
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
  activeStyleName: {
    color: COLORS.primaryGradientEnd,
    fontSize: 12,
    fontWeight: '700',
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 10,
  },
  styleCard: {
    width: 105,
    height: 80,
    borderRadius: RADIUS.md,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
    ...SHADOWS.sm,
  },
  styleCardSelected: {
    borderColor: '#FFF',
    ...SHADOWS.glow,
    transform: [{ scale: 1.02 }],
  },
  cardGradient: {
    flex: 1,
    padding: 8,
    justifyContent: 'space-between',
    position: 'relative',
  },
  iconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  styleLabel: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
  },
  selectedCheck: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
