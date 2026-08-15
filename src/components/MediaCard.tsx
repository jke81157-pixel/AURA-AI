import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';
import { GeneratedMedia } from '../types';
import { COLORS, RADIUS, SHADOWS } from '../constants/theme';

interface MediaCardProps {
  media: GeneratedMedia;
  onPress: () => void;
  onToggleFavorite?: () => void;
  layout?: 'grid' | 'feed';
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const MediaCard: React.FC<MediaCardProps> = ({
  media,
  onPress,
  onToggleFavorite,
  layout = 'grid',
}) => {
  const isVideo = media.type === 'video';
  const isGrid = layout === 'grid';

  const cardWidth = isGrid
    ? SCREEN_WIDTH > 600
      ? (600 - 48) / 2
      : (SCREEN_WIDTH - 44) / 2
    : '100%';

  return (
    <TouchableOpacity
      activeOpacity={0.88}
      style={[
        styles.card,
        { width: cardWidth as any },
        !isGrid && styles.feedCard,
      ]}
      onPress={onPress}
    >
      <View style={[styles.imageContainer, isGrid ? styles.gridImageHeight : styles.feedImageHeight]}>
        <Image
          source={{ uri: media.thumbnailUrl || media.mediaUrl }}
          style={styles.image}
          contentFit="cover"
          transition={300}
        />

        <LinearGradient
          colors={['rgba(0,0,0,0.4)', 'transparent', 'rgba(11, 15, 25, 0.9)']}
          style={styles.overlayGradient}
        />

        {/* Top Badges */}
        <View style={styles.topRow}>
          <View style={[styles.typeBadge, isVideo && styles.videoTypeBadge]}>
            <Ionicons
              name={isVideo ? 'videocam' : 'image'}
              size={11}
              color="#FFF"
            />
            <Text style={styles.typeBadgeText}>
              {isVideo ? media.duration || '5s' : '4K'}
            </Text>
          </View>

          {onToggleFavorite && (
            <TouchableOpacity
              style={styles.favoriteBtn}
              onPress={(e) => {
                e.stopPropagation();
                onToggleFavorite();
              }}
            >
              <Ionicons
                name={media.isFavorite ? 'heart' : 'heart-outline'}
                size={16}
                color={media.isFavorite ? '#FF4B4B' : '#FFF'}
              />
            </TouchableOpacity>
          )}
        </View>

        {/* Play Icon for Videos */}
        {isVideo && (
          <View style={styles.playIconOverlay}>
            <View style={styles.playCircle}>
              <Ionicons name="play" size={18} color="#FFF" style={{ marginLeft: 2 }} />
            </View>
          </View>
        )}

        {/* Bottom Details */}
        <View style={styles.bottomDetails}>
          <View style={styles.modelStyleRow}>
            <View style={styles.modelTag}>
              <Text style={styles.modelTagText} numberOfLines={1}>
                {media.modelName}
              </Text>
            </View>
            <Text style={styles.styleTag}>{media.styleLabel}</Text>
          </View>

          <Text style={styles.promptPreview} numberOfLines={isGrid ? 2 : 3}>
            {media.prompt}
          </Text>

          {/* Feed extra info: Author / Likes */}
          {!isGrid && (
            <View style={styles.feedFooter}>
              <View style={styles.authorRow}>
                {media.authorAvatar && (
                  <Image source={{ uri: media.authorAvatar }} style={styles.avatar} />
                )}
                <Text style={styles.authorName}>{media.authorName || 'Creator'}</Text>
              </View>
              
              <View style={styles.likesRow}>
                <Ionicons name="heart" size={14} color="#FF6B6B" />
                <Text style={styles.likesText}>{media.likesCount || 12}</Text>
              </View>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: RADIUS.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 12,
    ...SHADOWS.sm,
  },
  feedCard: {
    marginBottom: 16,
  },
  imageContainer: {
    width: '100%',
    position: 'relative',
    backgroundColor: COLORS.cardBackgroundLight,
  },
  gridImageHeight: {
    height: 200,
  },
  feedImageHeight: {
    height: 320,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  overlayGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  topRow: {
    position: 'absolute',
    top: 8,
    left: 8,
    right: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 2,
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
    gap: 4,
  },
  videoTypeBadge: {
    backgroundColor: 'rgba(6, 182, 212, 0.75)',
  },
  typeBadgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '800',
  },
  favoriteBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playIconOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(99, 102, 241, 0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FFF',
    ...SHADOWS.glow,
  },
  bottomDetails: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    right: 8,
    zIndex: 2,
  },
  modelStyleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  modelTag: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    maxWidth: '65%',
  },
  modelTagText: {
    color: '#FFF',
    fontSize: 9,
    fontWeight: '700',
  },
  styleTag: {
    color: COLORS.secondary,
    fontSize: 9,
    fontWeight: '600',
  },
  promptPreview: {
    color: COLORS.text,
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '500',
  },
  feedFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  avatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  authorName: {
    color: COLORS.textSecondary,
    fontSize: 11,
    fontWeight: '600',
  },
  likesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  likesText: {
    color: COLORS.textMuted,
    fontSize: 11,
    fontWeight: '600',
  },
});
