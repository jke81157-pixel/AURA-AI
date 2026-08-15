import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useApp } from '../context/AppContext';
import { COLORS, RADIUS, SHADOWS } from '../constants/theme';

interface CreditBadgeProps {
  onPress?: () => void;
  showAddButton?: boolean;
}

export const CreditBadge: React.FC<CreditBadgeProps> = ({ onPress, showAddButton = true }) => {
  const { credits, isPro, setIsDailyModalOpen, setIsProModalOpen } = useApp();
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [pulseAnim]);

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else if (isPro) {
      setIsProModalOpen(true);
    } else {
      setIsDailyModalOpen(true);
    }
  };

  if (isPro) {
    return (
      <TouchableOpacity activeOpacity={0.8} onPress={() => setIsProModalOpen(true)}>
        <LinearGradient
          colors={['#F59E0B', '#D97706']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.proBadge}
        >
          <Ionicons name="sparkles" size={14} color="#FFF" />
          <Text style={styles.proText}>VIP UNLIMITED</Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity activeOpacity={0.8} onPress={handlePress}>
      <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
        <LinearGradient
          colors={['#1E293B', '#0F172A']}
          style={styles.container}
        >
          <View style={styles.lightningCircle}>
            <Ionicons name="flash" size={13} color="#FBBF24" />
          </View>
          <Text style={styles.balanceText}>{credits.balance}</Text>
          <Text style={styles.labelText}>Credits</Text>
          
          {showAddButton && (
            <View style={styles.addCircle}>
              <Ionicons name="add" size={12} color="#FFF" />
            </View>
          )}
        </LinearGradient>
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: 'rgba(251, 191, 36, 0.4)',
    gap: 6,
    ...SHADOWS.sm,
  },
  lightningCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(251, 191, 36, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  balanceText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
  },
  labelText: {
    color: COLORS.textMuted,
    fontSize: 11,
    fontWeight: '500',
  },
  addCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 2,
  },
  proBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    gap: 6,
    ...SHADOWS.goldGlow,
  },
  proText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});
