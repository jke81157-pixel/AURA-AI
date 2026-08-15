import React from 'react';
import { View, StyleSheet, SafeAreaView, Platform, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import Ionicons from '@expo/vector-icons/Ionicons';

import { AppProvider, useApp } from './src/context/AppContext';
import { Header } from './src/components/Header';
import { BottomTabBar } from './src/components/BottomTabBar';
import { Toast } from './src/components/Toast';
import { DailyStreakModal } from './src/components/DailyStreakModal';
import { RewardedAdModal } from './src/components/RewardedAdModal';
import { ProUpgradeModal } from './src/components/ProUpgradeModal';

import { StudioScreen } from './src/screens/StudioScreen';
import { GalleryScreen } from './src/screens/GalleryScreen';
import { ExploreScreen } from './src/screens/ExploreScreen';
import { CreditsScreen } from './src/screens/CreditsScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { COLORS } from './src/constants/theme';

const MainNavigator: React.FC = () => {
  const { activeTab } = useApp();

  const renderScreen = () => {
    switch (activeTab) {
      case 'studio':
        return <StudioScreen />;
      case 'gallery':
        return <GalleryScreen />;
      case 'explore':
        return <ExploreScreen />;
      case 'credits':
        return <CreditsScreen />;
      case 'settings':
        return <SettingsScreen />;
      default:
        return <StudioScreen />;
    }
  };

  const getSubtitle = () => {
    switch (activeTab) {
      case 'studio':
        return 'Flux • Nana Banana • Veo 3 • Kling';
      case 'gallery':
        return 'Your Generated Masterpieces';
      case 'explore':
        return 'Trending AI Art & Prompts';
      case 'credits':
        return 'Daily Free Credits & Rewards';
      case 'settings':
        return 'Engine & Pipeline Settings';
      default:
        return 'Neural Creation Studio';
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      
      {/* Universal Top Header */}
      <Header subtitle={getSubtitle()} />

      {/* Screen Body */}
      <View style={styles.screenBody}>
        {renderScreen()}
      </View>

      {/* Bottom Navigation */}
      <BottomTabBar />

      {/* Global Modals & Toast */}
      <DailyStreakModal />
      <RewardedAdModal />
      <ProUpgradeModal />
      <Toast />
    </SafeAreaView>
  );
};

export default function App() {
  const [fontsLoaded] = useFonts({
    ...Ionicons.font,
  });

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <AppProvider>
        <MainNavigator />
      </AppProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: Platform.OS === 'android' ? 24 : 0,
  },
  screenBody: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
