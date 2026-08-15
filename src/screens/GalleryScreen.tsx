import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useApp } from '../context/AppContext';
import { GeneratedMedia } from '../types';
import { MediaCard } from '../components/MediaCard';
import { MediaViewerModal } from '../components/MediaViewerModal';
import { COLORS, RADIUS, SHADOWS } from '../constants/theme';

type FilterType = 'all' | 'image' | 'video' | 'favorites';

export const GalleryScreen: React.FC = () => {
  const { gallery, deleteMedia, toggleFavorite, setActiveTab, refreshGallery } = useApp();
  
  const [filter, setFilter] = useState<FilterType>('all');
  const [layout, setLayout] = useState<'grid' | 'feed'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMedia, setSelectedMedia] = useState<GeneratedMedia | null>(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const onRefresh = async () => {
    setIsRefreshing(true);
    await refreshGallery();
    setIsRefreshing(false);
  };

  const filteredItems = gallery.filter((item) => {
    // Type filter
    if (filter === 'image' && item.type !== 'image') return false;
    if (filter === 'video' && item.type !== 'video') return false;
    if (filter === 'favorites' && !item.isFavorite) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchPrompt = item.prompt.toLowerCase().includes(q);
      const matchModel = item.modelName.toLowerCase().includes(q);
      const matchStyle = item.styleLabel.toLowerCase().includes(q);
      return matchPrompt || matchModel || matchStyle;
    }
    return true;
  });

  const handleOpenMedia = (media: GeneratedMedia) => {
    setSelectedMedia(media);
    setIsViewerOpen(true);
  };

  return (
    <View style={styles.container}>
      {/* Search & Layout Control Bar */}
      <View style={styles.topControlBar}>
        <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={16} color={COLORS.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search creations, models, styles..."
            placeholderTextColor={COLORS.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={16} color={COLORS.textMuted} />
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          style={styles.layoutToggleBtn}
          onPress={() => setLayout(layout === 'grid' ? 'feed' : 'grid')}
        >
          <Ionicons
            name={layout === 'grid' ? 'grid-outline' : 'list-outline'}
            size={18}
            color={COLORS.text}
          />
        </TouchableOpacity>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterRow}>
        {(
          [
            { id: 'all', label: 'All Items', count: gallery.length },
            { id: 'image', label: 'Images', count: gallery.filter((g) => g.type === 'image').length },
            { id: 'video', label: 'Videos', count: gallery.filter((g) => g.type === 'video').length },
            { id: 'favorites', label: 'Favorites', count: gallery.filter((g) => g.isFavorite).length },
          ] as { id: FilterType; label: string; count: number }[]
        ).map((tab) => {
          const isActive = filter === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              activeOpacity={0.8}
              style={[styles.filterTab, isActive && styles.filterTabActive]}
              onPress={() => setFilter(tab.id)}
            >
              <Text style={[styles.filterLabel, isActive && styles.filterLabelActive]}>
                {tab.label}
              </Text>
              <View style={[styles.filterCountBadge, isActive && styles.filterCountBadgeActive]}>
                <Text style={[styles.filterCountText, isActive && styles.filterCountTextActive]}>
                  {tab.count}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Media Grid / Feed */}
      <FlatList
        data={filteredItems}
        key={layout} // re-render layout switch properly
        numColumns={layout === 'grid' ? 2 : 1}
        keyExtractor={(item) => item.id}
        columnWrapperStyle={layout === 'grid' ? styles.columnWrapper : undefined}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />
        }
        renderItem={({ item }) => (
          <MediaCard
            media={item}
            layout={layout}
            onPress={() => handleOpenMedia(item)}
            onToggleFavorite={() => toggleFavorite(item.id)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
              <Ionicons name="images-outline" size={44} color={COLORS.textMuted} />
            </View>
            <Text style={styles.emptyTitle}>
              {searchQuery ? 'No creations matched your search' : 'No creations here yet'}
            </Text>
            <Text style={styles.emptySub}>
              {searchQuery
                ? 'Try a different keyword or clear your search query.'
                : 'Head over to the Studio to generate your first AI masterpiece!'}
            </Text>

            <TouchableOpacity
              activeOpacity={0.85}
              style={styles.createNowBtn}
              onPress={() => setActiveTab('studio')}
            >
              <LinearGradient
                colors={['#6366F1', '#A855F7']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.createNowGradient}
              >
                <Ionicons name="sparkles" size={16} color="#FFF" />
                <Text style={styles.createNowText}>Generate Now in Studio</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        }
      />

      {/* Fullscreen Media Viewer */}
      <MediaViewerModal
        media={selectedMedia}
        visible={isViewerOpen}
        onClose={() => setIsViewerOpen(false)}
        onDelete={deleteMedia}
        onToggleFavorite={toggleFavorite}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  topControlBar: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    gap: 10,
    alignItems: 'center',
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBackgroundLight,
    borderRadius: RADIUS.md,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchInput: {
    flex: 1,
    color: COLORS.text,
    fontSize: 13,
    padding: 0,
  },
  layoutToggleBtn: {
    width: 38,
    height: 38,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.cardBackgroundLight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 10,
    gap: 8,
  },
  filterTab: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 6,
  },
  filterTabActive: {
    borderColor: COLORS.primary,
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
  },
  filterLabel: {
    color: COLORS.textMuted,
    fontSize: 12,
    fontWeight: '600',
  },
  filterLabelActive: {
    color: '#FFF',
    fontWeight: '700',
  },
  filterCountBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: RADIUS.full,
  },
  filterCountBadgeActive: {
    backgroundColor: COLORS.primary,
  },
  filterCountText: {
    color: COLORS.textMuted,
    fontSize: 10,
    fontWeight: '700',
  },
  filterCountTextActive: {
    color: '#FFF',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 40,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 24,
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.cardBackgroundLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    color: '#FFF',
    fontSize: 17,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 6,
  },
  emptySub: {
    color: COLORS.textMuted,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
  },
  createNowBtn: {
    borderRadius: RADIUS.md,
    overflow: 'hidden',
    ...SHADOWS.glow,
  },
  createNowGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    gap: 8,
  },
  createNowText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
