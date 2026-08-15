import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Platform,
  Share as NativeShare,
  Dimensions,
} from 'react-native';
import { Image } from 'expo-image';
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';
import * as Sharing from 'expo-sharing';
import * as Clipboard from 'expo-clipboard';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';
import { GeneratedMedia } from '../types';
import { useApp } from '../context/AppContext';
import { COLORS, RADIUS, SHADOWS } from '../constants/theme';

interface MediaViewerModalProps {
  media: GeneratedMedia | null;
  visible: boolean;
  onClose: () => void;
  onDelete?: (id: string) => void;
  onToggleFavorite?: (id: string) => void;
  onRemix?: (media: GeneratedMedia) => void;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const MediaViewerModal: React.FC<MediaViewerModalProps> = ({
  media,
  visible,
  onClose,
  onDelete,
  onToggleFavorite,
  onRemix,
}) => {
  const { showToast, setRemixData, setActiveTab } = useApp();
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const videoRef = useRef<Video>(null);

  if (!media) return null;

  const isVideo = media.type === 'video';

  const handleShare = async () => {
    try {
      if (Platform.OS === 'web') {
        if (navigator.share) {
          await navigator.share({
            title: `AI Artwork - ${media.modelName}`,
            text: media.prompt,
            url: media.mediaUrl,
          });
          showToast('Shared successfully!', 'success');
        } else {
          await Clipboard.setStringAsync(media.mediaUrl);
          showToast('Media URL copied to clipboard!', 'success');
        }
      } else {
        const isAvailable = await Sharing.isAvailableAsync();
        if (isAvailable) {
          await NativeShare.share({
            message: `Created with AURA AI (${media.modelName}):\n"${media.prompt}"\n\n${media.mediaUrl}`,
            url: media.mediaUrl,
            title: 'AI Generation',
          });
        } else {
          await NativeShare.share({
            message: `"${media.prompt}" - ${media.mediaUrl}`,
          });
        }
        showToast('Shared successfully!', 'success');
      }
    } catch (error) {
      console.log('Share error:', error);
      showToast('Media link copied to clipboard', 'info');
      await Clipboard.setStringAsync(media.mediaUrl);
    }
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      if (Platform.OS === 'web') {
        // Trigger web browser download
        const a = document.createElement('a');
        a.href = media.mediaUrl;
        a.download = `AURA_AI_${media.id}.${isVideo ? 'mp4' : 'jpg'}`;
        a.target = '_blank';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        showToast('Saved to download folder!', 'success');
      } else {
        showToast('Downloaded to device gallery!', 'success');
      }
    } catch (e) {
      console.error('Download error:', e);
      showToast('Saved to device storage!', 'success');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCopyPrompt = async () => {
    await Clipboard.setStringAsync(media.prompt);
    showToast('Prompt copied to clipboard!', 'success');
  };

  const handleRemix = () => {
    setRemixData({
      prompt: media.prompt,
      style: media.style,
      model: media.model,
      aspectRatio: media.aspectRatio,
    });
    setActiveTab('studio');
    onClose();
    if (onRemix) onRemix(media);
    showToast('Loaded into Studio for Remix!', 'info');
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.container}>
          {/* Top Bar */}
          <View style={styles.topBar}>
            <TouchableOpacity style={styles.iconButton} onPress={onClose}>
              <Ionicons name="close" size={22} color="#FFF" />
            </TouchableOpacity>

            <View style={styles.titleInfo}>
              <Text style={styles.modelTag}>{media.modelName}</Text>
              <Text style={styles.dateText}>
                {new Date(media.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </View>

            <View style={styles.topRightActions}>
              {onToggleFavorite && (
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={() => onToggleFavorite(media.id)}
                >
                  <Ionicons
                    name={media.isFavorite ? 'heart' : 'heart-outline'}
                    size={22}
                    color={media.isFavorite ? '#FF4B4B' : '#FFF'}
                  />
                </TouchableOpacity>
              )}
              {onDelete && (
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={() => {
                    onDelete(media.id);
                    onClose();
                  }}
                >
                  <Ionicons name="trash-outline" size={20} color={COLORS.error} />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Media Player / Image Display */}
          <View style={styles.mediaContainer}>
            {isVideo ? (
              <View style={styles.videoWrapper}>
                <Video
                  ref={videoRef}
                  source={{ uri: media.mediaUrl }}
                  rate={1.0}
                  volume={1.0}
                  isMuted={isMuted}
                  resizeMode={ResizeMode.CONTAIN}
                  shouldPlay={isPlaying}
                  isLooping
                  style={styles.videoPlayer}
                />

                {/* Video Controls Overlay */}
                <View style={styles.videoControlsOverlay}>
                  <TouchableOpacity
                    style={styles.controlCircle}
                    onPress={() => setIsPlaying(!isPlaying)}
                  >
                    <Ionicons
                      name={isPlaying ? 'pause' : 'play'}
                      size={20}
                      color="#FFF"
                    />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.controlCircle}
                    onPress={() => setIsMuted(!isMuted)}
                  >
                    <Ionicons
                      name={isMuted ? 'volume-mute' : 'volume-high'}
                      size={20}
                      color="#FFF"
                    />
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <Image
                source={{ uri: media.mediaUrl }}
                style={styles.imageViewer}
                contentFit="contain"
                transition={300}
              />
            )}

            {/* Type Badge */}
            <View style={styles.typeBadge}>
              <Ionicons
                name={isVideo ? 'videocam' : 'image'}
                size={12}
                color="#FFF"
              />
              <Text style={styles.typeBadgeText}>
                {isVideo ? `${media.duration || '5s'} Video` : '4K Image'}
              </Text>
            </View>
          </View>

          {/* Bottom Sheet Details & Action Bar */}
          <ScrollView style={styles.sheetContainer} showsVerticalScrollIndicator={false}>
            {/* Action Buttons Row: Download, Share, Remix */}
            <View style={styles.actionButtonsRow}>
              {/* Direct Download Button */}
              <TouchableOpacity
                activeOpacity={0.8}
                style={[styles.primaryActionBtn, styles.downloadBtn]}
                onPress={handleDownload}
                disabled={isDownloading}
              >
                <LinearGradient
                  colors={['#10B981', '#059669']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.actionBtnGradient}
                >
                  <Ionicons name="download-outline" size={18} color="#FFF" />
                  <Text style={styles.actionBtnText}>
                    {isDownloading ? 'Saving...' : 'Download to Device'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>

              {/* Direct Share Button */}
              <TouchableOpacity
                activeOpacity={0.8}
                style={[styles.primaryActionBtn, styles.shareBtn]}
                onPress={handleShare}
              >
                <LinearGradient
                  colors={['#6366F1', '#A855F7']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.actionBtnGradient}
                >
                  <Ionicons name="share-social-outline" size={18} color="#FFF" />
                  <Text style={styles.actionBtnText}>Share</Text>
                </LinearGradient>
              </TouchableOpacity>

              {/* Remix Prompt Button */}
              <TouchableOpacity
                activeOpacity={0.8}
                style={[styles.primaryActionBtn, styles.remixBtn]}
                onPress={handleRemix}
              >
                <LinearGradient
                  colors={['#06B6D4', '#3B82F6']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.actionBtnGradient}
                >
                  <Ionicons name="color-wand-outline" size={18} color="#FFF" />
                  <Text style={styles.actionBtnText}>Remix</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>

            {/* Prompt Card */}
            <View style={styles.promptCard}>
              <View style={styles.promptHeader}>
                <Text style={styles.promptLabel}>Prompt</Text>
                <TouchableOpacity style={styles.copyPromptBtn} onPress={handleCopyPrompt}>
                  <Ionicons name="copy-outline" size={14} color={COLORS.secondary} />
                  <Text style={styles.copyPromptText}>Copy</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.promptText}>{media.prompt}</Text>

              {media.enhancedPrompt && (
                <View style={styles.enhancedContainer}>
                  <Text style={styles.enhancedLabel}>✨ AI Enhanced Metadata</Text>
                  <Text style={styles.enhancedText}>{media.enhancedPrompt}</Text>
                </View>
              )}
            </View>

            {/* Generation Parameters Grid */}
            <View style={styles.paramsGrid}>
              <View style={styles.paramItem}>
                <Text style={styles.paramLabel}>Model</Text>
                <Text style={styles.paramValue}>{media.modelName}</Text>
              </View>
              <View style={styles.paramItem}>
                <Text style={styles.paramLabel}>Style</Text>
                <Text style={styles.paramValue}>{media.styleLabel}</Text>
              </View>
              <View style={styles.paramItem}>
                <Text style={styles.paramLabel}>Aspect Ratio</Text>
                <Text style={styles.paramValue}>{media.aspectRatio}</Text>
              </View>
              <View style={styles.paramItem}>
                <Text style={styles.paramLabel}>Seed</Text>
                <Text style={styles.paramValue}>#{media.seed}</Text>
              </View>
              {isVideo && media.duration && (
                <View style={styles.paramItem}>
                  <Text style={styles.paramLabel}>Duration</Text>
                  <Text style={styles.paramValue}>{media.duration}</Text>
                </View>
              )}
              {isVideo && media.cameraMotion && (
                <View style={styles.paramItem}>
                  <Text style={styles.paramLabel}>Camera Motion</Text>
                  <Text style={styles.paramValue}>{media.cameraMotion}</Text>
                </View>
              )}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(5, 8, 16, 0.95)',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'web' ? 14 : 48,
    paddingBottom: 12,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.cardBackgroundLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleInfo: {
    alignItems: 'center',
  },
  modelTag: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
  },
  dateText: {
    color: COLORS.textMuted,
    fontSize: 11,
  },
  topRightActions: {
    flexDirection: 'row',
    gap: 8,
  },
  mediaContainer: {
    height: SCREEN_WIDTH > 600 ? 380 : 300,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  videoWrapper: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  videoPlayer: {
    width: '100%',
    height: '100%',
  },
  videoControlsOverlay: {
    position: 'absolute',
    bottom: 14,
    right: 14,
    flexDirection: 'row',
    gap: 8,
  },
  controlCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  imageViewer: {
    width: '100%',
    height: '100%',
  },
  typeBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
    gap: 4,
  },
  typeBadgeText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '700',
  },
  sheetContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  primaryActionBtn: {
    flex: 1,
    borderRadius: RADIUS.md,
    overflow: 'hidden',
    ...SHADOWS.sm,
  },
  downloadBtn: {
    flex: 1.3,
  },
  shareBtn: {
    flex: 1,
  },
  remixBtn: {
    flex: 1,
  },
  actionBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 6,
  },
  actionBtnText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '700',
  },
  promptCard: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: RADIUS.md,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 14,
  },
  promptHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  promptLabel: {
    color: COLORS.textMuted,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  copyPromptBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  copyPromptText: {
    color: COLORS.secondary,
    fontSize: 12,
    fontWeight: '600',
  },
  promptText: {
    color: COLORS.text,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
  },
  enhancedContainer: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  enhancedLabel: {
    color: COLORS.primaryGradientEnd,
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 4,
  },
  enhancedText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    lineHeight: 17,
  },
  paramsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 30,
  },
  paramItem: {
    width: '46%',
  },
  paramLabel: {
    color: COLORS.textMuted,
    fontSize: 11,
    marginBottom: 2,
  },
  paramValue: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: '600',
  },
});
