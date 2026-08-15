import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import Ionicons from '@expo/vector-icons/Ionicons';
import { EXPLORE_FEED } from '../constants/sampleData';
import { GeneratedMedia } from '../types';
import { MediaCard } from '../components/MediaCard';
import { MediaViewerModal } from '../components/MediaViewerModal';
import { useApp } from '../context/AppContext';
import { COLORS, RADIUS, SHADOWS } from '../constants/theme';

const EXPLORE_CATEGORIES = [
  '🔥 Trending',
  '🎬 Veo 3 Video',
  '🍌 Nana Anime',
  '⚡ Flux Photoreal',
  '🌆 Cyberpunk',
  '🎨 3D Pixar',
  '🐉 Fantasy Art',
];

export const ExploreScreen: React.FC = () => {
  const { setRemixData, setActiveTab, showToast } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('🔥 Trending');
  const [selectedMedia, setSelectedMedia] = useState<GeneratedMedia | null>(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [exploreItems, setExploreItems] = useState<GeneratedMedia[]>(EXPLORE_FEED);

  const handleLike = (id: string) => {
    setExploreItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newFav = !item.isFavorite;
          return {
            ...item,
            isFavorite: newFav,
            likesCount: (item.likesCount || 0) + (newFav ? 1 : -1),
          };
        }
        return item;
      })
    );
  };

  const handleQuickRemix = (item: GeneratedMedia) => {
    setRemixData({
      prompt: item.prompt,
      style: item.style,
      model: item.model,
      aspectRatio: item.aspectRatio,
    });
    setActiveTab('studio');
    showToast('Prompt loaded into Studio!', 'info');
  };

  const filteredFeed = exploreItems.filter((item) => {
    if (selectedCategory === '🎬 Veo 3 Video') return item.type === 'video';
    if (selectedCategory === '🍌 Nana Anime') return item.style === 'anime' || item.model === 'nana-banana';
    if (selectedCategory === '⚡ Flux Photoreal') return item.model.includes('flux') || item.style === 'photoreal';
    if (selectedCategory === '🌆 Cyberpunk') return item.style === 'cyberpunk';
    if (selectedCategory === '🎨 3D Pixar') return item.style === '3d-render';
    if (selectedCategory === '🐉 Fantasy Art') return item.style === 'fantasy';
    return true;
  });

  return (
    <View style={styles.container}>
      {/* Featured Banner */}
      <View style={styles.bannerContainer}>
        <LinearGradient
          colors={['#4F46E5', '#7C3AED', '#DB2777']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.bannerGradient}
        >
          <View style={styles.bannerTextWrap}>
            <View style={styles.bannerBadge}>
              <Text style={styles.bannerBadgeText}>COMMUNITY SPOTLIGHT</Text>
            </View>
            <Text style={styles.bannerTitle}>Flux.1 & Veo 3 Creations</Text>
            <Text style={styles.bannerSub}>
              Discover prompts from top neural artists and remix instantly.
            </Text>
          </View>
          <Ionicons name="sparkles" size={36} color="rgba(255, 255, 255, 0.4)" />
        </LinearGradient>
      </View>

      {/* Category Horizontal Filter */}
      <View style={styles.categoryContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
        >
          {EXPLORE_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <TouchableOpacity
                key={cat}
                activeOpacity={0.8}
                style={[styles.categoryPill, isSelected && styles.categoryPillSelected]}
                onPress={() => setSelectedCategory(cat)}
              >
                <Text
                  style={[styles.categoryText, isSelected && styles.categoryTextSelected]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Feed List */}
      <FlatList
        data={filteredFeed}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.feedContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.feedCardWrapper}>
            <MediaCard
              media={item}
              layout="feed"
              onPress={() => {
                setSelectedMedia(item);
                setIsViewerOpen(true);
              }}
              onToggleFavorite={() => handleLike(item.id)}
            />

            {/* Quick Prompt Remix Bar */}
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.remixBar}
              onPress={() => handleQuickRemix(item)}
            >
              <Ionicons name="color-wand-outline" size={15} color={COLORS.secondary} />
              <Text style={styles.remixBarText}>Try This Prompt in Studio</Text>
              <Ionicons name="arrow-forward" size={14} color={COLORS.secondary} />
            </TouchableOpacity>
          </View>
        )}
      />

      {/* Media Viewer */}
      <MediaViewerModal
        media={selectedMedia}
        visible={isViewerOpen}
        onClose={() => setIsViewerOpen(false)}
        onToggleFavorite={handleLike}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  bannerContainer: {
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 10,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    ...SHADOWS.md,
  },
  bannerGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  bannerTextWrap: {
    flex: 1,
    paddingRight: 12,
  },
  bannerBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginBottom: 6,
  },
  bannerBadgeText: {
    color: '#FFF',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  bannerTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '900',
    marginBottom: 2,
  },
  bannerSub: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 11,
    lineHeight: 15,
  },
  categoryContainer: {
    marginBottom: 10,
  },
  categoryScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  categoryPill: {
    backgroundColor: COLORS.cardBackgroundLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  categoryPillSelected: {
    borderColor: COLORS.primary,
    backgroundColor: 'rgba(99, 102, 241, 0.25)',
  },
  categoryText: {
    color: COLORS.textMuted,
    fontSize: 12,
    fontWeight: '600',
  },
  categoryTextSelected: {
    color: '#FFF',
    fontWeight: '700',
  },
  feedContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  feedCardWrapper: {
    marginBottom: 16,
  },
  remixBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(6, 182, 212, 0.1)',
    paddingVertical: 10,
    borderRadius: RADIUS.md,
    marginTop: -8,
    borderWidth: 1,
    borderColor: 'rgba(6, 182, 212, 0.3)',
    gap: 8,
  },
  remixBarText: {
    color: COLORS.secondary,
    fontSize: 12,
    fontWeight: '700',
  },
});
