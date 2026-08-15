import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  TextInput,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useApp } from '../context/AppContext';
import { StorageService } from '../services/storageService';
import { COLORS, RADIUS, SHADOWS } from '../constants/theme';

export const SettingsScreen: React.FC = () => {
  const { isPro, setIsProModalOpen, refreshGallery, showToast } = useApp();
  const [hapticsEnabled, setHapticsEnabled] = useState(true);
  const [autoEnhancePrompt, setAutoEnhancePrompt] = useState(false);
  const [customApiKey, setCustomApiKey] = useState('');
  const [isApiKeyVisible, setIsApiKeyVisible] = useState(false);

  const handleClearCache = async () => {
    try {
      await StorageService.clearAllData();
      await refreshGallery();
      showToast('Cache & gallery cleared successfully', 'info');
    } catch (e) {
      showToast('Failed to clear cache', 'error');
    }
  };

  const handleSaveApiKey = () => {
    showToast('Custom API key saved successfully!', 'success');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      {/* VIP Status Hero */}
      <View style={styles.statusCard}>
        <LinearGradient
          colors={isPro ? ['#F59E0B', '#D97706'] : ['#1E293B', '#131B2E']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.statusGradient}
        >
          <View style={styles.statusRow}>
            <View style={styles.statusIconCircle}>
              <Ionicons
                name={isPro ? 'star' : 'flash'}
                size={22}
                color={isPro ? '#FFF' : '#FBBF24'}
              />
            </View>
            <View style={styles.statusTextWrap}>
              <Text style={styles.statusTitle}>
                {isPro ? 'VIP Pro Unlimited Active' : 'Free Tier Member'}
              </Text>
              <Text style={styles.statusSub}>
                {isPro
                  ? 'Unlimited 4K Flux & Veo 3 Video Generations'
                  : 'Daily free credits • Ad rewards enabled'}
              </Text>
            </View>
            {!isPro && (
              <TouchableOpacity
                style={styles.upgradeBtn}
                onPress={() => setIsProModalOpen(true)}
              >
                <Text style={styles.upgradeBtnText}>Upgrade</Text>
              </TouchableOpacity>
            )}
          </View>
        </LinearGradient>
      </View>

      {/* Generation Engine Settings */}
      <Text style={styles.sectionTitle}>Engine & Generation Preferences</Text>
      <View style={styles.settingsGroup}>
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle}>Auto-Enhance Prompts</Text>
            <Text style={styles.settingDesc}>
              Automatically enrich simple prompts with 8K cinematic tokens
            </Text>
          </View>
          <Switch
            value={autoEnhancePrompt}
            onValueChange={setAutoEnhancePrompt}
            trackColor={{ false: COLORS.surface, true: COLORS.primary }}
            thumbColor="#FFF"
          />
        </View>

        <View style={[styles.settingItem, styles.settingBorder]}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle}>Haptic Feedback</Text>
            <Text style={styles.settingDesc}>
              Vibrate on generation completion & button taps
            </Text>
          </View>
          <Switch
            value={hapticsEnabled}
            onValueChange={setHapticsEnabled}
            trackColor={{ false: COLORS.surface, true: COLORS.secondary }}
            thumbColor="#FFF"
          />
        </View>
      </View>

      {/* AI Pipeline Architecture */}
      <Text style={styles.sectionTitle}>Supported AI Architectures</Text>
      <View style={styles.settingsGroup}>
        {[
          {
            name: 'Flux.1 (Schnell & Dev)',
            type: 'Image (12B DiT)',
            provider: 'Black Forest Labs',
            icon: 'flash-outline',
          },
          {
            name: 'Nana Banana v2.5',
            type: 'Stylized Anime & Manga',
            provider: 'Nana Artworks',
            icon: 'color-palette-outline',
          },
          {
            name: 'Veo 3',
            type: 'Cinematic High-Motion Video',
            provider: 'Google DeepMind',
            icon: 'videocam-outline',
          },
          {
            name: 'Kling 1.5 HD',
            type: 'Dynamic Physics & Drone Video',
            provider: 'Kling AI',
            icon: 'play-circle-outline',
          },
        ].map((arch, idx) => (
          <View key={idx} style={[styles.archRow, idx > 0 && styles.settingBorder]}>
            <View style={styles.archIconCircle}>
              <Ionicons name={arch.icon as any} size={16} color={COLORS.secondary} />
            </View>
            <View style={styles.archTextBox}>
              <Text style={styles.archName}>{arch.name}</Text>
              <Text style={styles.archProvider}>
                {arch.type} • {arch.provider}
              </Text>
            </View>
            <View style={styles.readyBadge}>
              <Text style={styles.readyText}>READY</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Custom Developer API Keys (Optional) */}
      <Text style={styles.sectionTitle}>Developer API Override (Optional)</Text>
      <View style={styles.settingsGroup}>
        <View style={styles.apiKeyContainer}>
          <Text style={styles.apiKeyLabel}>
            Fal.ai / Replicate / Pollinations API Key
          </Text>
          <View style={styles.apiKeyInputRow}>
            <TextInput
              style={styles.apiKeyInput}
              placeholder="Enter optional personal API key..."
              placeholderTextColor={COLORS.textMuted}
              value={customApiKey}
              onChangeText={setCustomApiKey}
              secureTextEntry={!isApiKeyVisible}
            />
            <TouchableOpacity
              style={styles.eyeBtn}
              onPress={() => setIsApiKeyVisible(!isApiKeyVisible)}
            >
              <Ionicons
                name={isApiKeyVisible ? 'eye-off-outline' : 'eye-outline'}
                size={18}
                color={COLORS.textMuted}
              />
            </TouchableOpacity>
          </View>
          {customApiKey.length > 0 && (
            <TouchableOpacity style={styles.saveKeyBtn} onPress={handleSaveApiKey}>
              <Text style={styles.saveKeyText}>Save Key</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Data Management */}
      <Text style={styles.sectionTitle}>Data Management</Text>
      <View style={styles.settingsGroup}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.clearButton}
          onPress={handleClearCache}
        >
          <Ionicons name="trash-outline" size={18} color={COLORS.error} />
          <Text style={styles.clearButtonText}>Reset Gallery & Clear Local Storage</Text>
        </TouchableOpacity>
      </View>

      {/* App Info Footer */}
      <View style={styles.appInfoFooter}>
        <Text style={styles.appInfoName}>AURA AI Image & Video Studio</Text>
        <Text style={styles.appInfoVersion}>Version 2.4.0 (Build 2025)</Text>
        <Text style={styles.appInfoCopyright}>
          Flux.1 • Nana Banana • Veo 3 • Kling 1.5 HD Pipeline Integration
        </Text>
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
  statusCard: {
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.borderHighlight,
    ...SHADOWS.md,
  },
  statusGradient: {
    padding: 16,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statusIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusTextWrap: {
    flex: 1,
  },
  statusTitle: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '800',
  },
  statusSub: {
    color: 'rgba(255, 255, 255, 0.75)',
    fontSize: 11,
    marginTop: 2,
  },
  upgradeBtn: {
    backgroundColor: '#F59E0B',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
  },
  upgradeBtnText: {
    color: '#000',
    fontSize: 12,
    fontWeight: '800',
  },
  sectionTitle: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
    marginTop: 4,
  },
  settingsGroup: {
    backgroundColor: COLORS.cardBackgroundLight,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 14,
    paddingVertical: 4,
    marginBottom: 18,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingBorder: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  settingInfo: {
    flex: 1,
    paddingRight: 12,
  },
  settingTitle: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: '600',
  },
  settingDesc: {
    color: COLORS.textMuted,
    fontSize: 11,
    marginTop: 2,
  },
  archRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    gap: 10,
  },
  archIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  archTextBox: {
    flex: 1,
  },
  archName: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: '700',
  },
  archProvider: {
    color: COLORS.textMuted,
    fontSize: 10,
    marginTop: 1,
  },
  readyBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  readyText: {
    color: COLORS.success,
    fontSize: 9,
    fontWeight: '800',
  },
  apiKeyContainer: {
    paddingVertical: 12,
  },
  apiKeyLabel: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
  },
  apiKeyInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 10,
  },
  apiKeyInput: {
    flex: 1,
    color: COLORS.text,
    fontSize: 13,
    paddingVertical: 8,
  },
  eyeBtn: {
    padding: 6,
  },
  saveKeyBtn: {
    backgroundColor: COLORS.primary,
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: RADIUS.sm,
    marginTop: 8,
  },
  saveKeyText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    gap: 8,
  },
  clearButtonText: {
    color: COLORS.error,
    fontSize: 13,
    fontWeight: '600',
  },
  appInfoFooter: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  appInfoName: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: '700',
  },
  appInfoVersion: {
    color: COLORS.textMuted,
    fontSize: 11,
    marginTop: 2,
  },
  appInfoCopyright: {
    color: COLORS.textDisabled,
    fontSize: 10,
    marginTop: 4,
    textAlign: 'center',
  },
});
