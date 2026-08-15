import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useApp } from '../context/AppContext';
import { COLORS, RADIUS, SHADOWS } from '../constants/theme';

interface TabItem {
  id: 'studio' | 'gallery' | 'explore' | 'credits' | 'settings';
  label: string;
  icon: string;
  iconActive: string;
  badge?: string;
}

const TABS: TabItem[] = [
  { id: 'studio', label: 'Studio', icon: 'sparkles-outline', iconActive: 'sparkles' },
  { id: 'gallery', label: 'Gallery', icon: 'images-outline', iconActive: 'images' },
  { id: 'explore', label: 'Explore', icon: 'compass-outline', iconActive: 'compass' },
  { id: 'credits', label: 'Rewards', icon: 'gift-outline', iconActive: 'gift' },
  { id: 'settings', label: 'Settings', icon: 'settings-outline', iconActive: 'settings' },
];

export const BottomTabBar: React.FC = () => {
  const { activeTab, setActiveTab, gallery, credits } = useApp();

  return (
    <View style={styles.container}>
      <View style={styles.bar}>
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          const isStudio = tab.id === 'studio';

          return (
            <TouchableOpacity
              key={tab.id}
              activeOpacity={0.7}
              style={[styles.tabButton, isStudio && styles.studioTabButton]}
              onPress={() => setActiveTab(tab.id)}
            >
              {isStudio ? (
                <View style={[styles.studioIconCircle, isActive && styles.studioIconCircleActive]}>
                  <Ionicons name="sparkles" size={20} color="#FFF" />
                </View>
              ) : (
                <View style={styles.iconContainer}>
                  <Ionicons
                    name={(isActive ? tab.iconActive : tab.icon) as any}
                    size={20}
                    color={isActive ? COLORS.primaryGradientEnd : COLORS.textMuted}
                  />
                  {tab.id === 'gallery' && gallery.length > 0 && (
                    <View style={styles.dotBadge} />
                  )}
                  {tab.id === 'credits' && (
                    <View style={styles.rewardDotBadge} />
                  )}
                </View>
              )}

              <Text
                style={[
                  styles.tabLabel,
                  isActive && styles.tabLabelActive,
                  isStudio && styles.studioTabLabel,
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingBottom: Platform.OS === 'web' ? 8 : 20,
    paddingTop: 6,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    flex: 1,
  },
  studioTabButton: {
    marginTop: -14,
  },
  iconContainer: {
    position: 'relative',
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  studioIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.cardBackgroundLight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.primary,
    ...SHADOWS.sm,
  },
  studioIconCircleActive: {
    backgroundColor: COLORS.primary,
    ...SHADOWS.glow,
  },
  tabLabel: {
    color: COLORS.textMuted,
    fontSize: 10,
    fontWeight: '600',
    marginTop: 2,
  },
  tabLabelActive: {
    color: COLORS.primaryGradientEnd,
    fontWeight: '700',
  },
  studioTabLabel: {
    marginTop: 3,
  },
  dotBadge: {
    position: 'absolute',
    top: -2,
    right: -6,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.secondary,
  },
  rewardDotBadge: {
    position: 'absolute',
    top: -2,
    right: -6,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#F59E0B',
  },
});
