import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity, Platform } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useApp } from '../context/AppContext';
import { COLORS, RADIUS, SHADOWS } from '../constants/theme';

export const Toast: React.FC = () => {
  const { toast, hideToast } = useApp();
  const translateY = useRef(new Animated.Value(-100)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (toast.visible) {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      const timer = setTimeout(() => {
        hideToast();
      }, 3500);

      return () => clearTimeout(timer);
    } else {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: -100,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [toast.visible, hideToast, translateY, opacity]);

  if (!toast.visible && (opacity as any)._value === 0) return null;

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return { name: 'checkmark-circle' as const, color: COLORS.success };
      case 'error':
        return { name: 'alert-circle' as const, color: COLORS.error };
      case 'warning':
        return { name: 'warning' as const, color: COLORS.warning };
      default:
        return { name: 'information-circle' as const, color: COLORS.secondary };
    }
  };

  const icon = getIcon();

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY }],
          opacity,
        },
      ]}
      pointerEvents={toast.visible ? 'auto' : 'none'}
    >
      <TouchableOpacity activeOpacity={0.9} style={styles.toastCard} onPress={hideToast}>
        <Ionicons name={icon.name} size={22} color={icon.color} />
        <Text style={styles.message} numberOfLines={2}>
          {toast.message}
        </Text>
        <Ionicons name="close" size={18} color={COLORS.textMuted} />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: Platform.OS === 'web' ? 20 : 50,
    left: 16,
    right: 16,
    zIndex: 9999,
    alignItems: 'center',
  },
  toastCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBackgroundLight,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.borderHighlight,
    maxWidth: 500,
    width: '100%',
    ...SHADOWS.md,
    gap: 12,
  },
  message: {
    flex: 1,
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '500',
  },
});
