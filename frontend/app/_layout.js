import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { DefaultTheme, PaperProvider } from 'react-native-paper';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { UserProvider, useUser } from '../context/UserContext';
import { IdeaProvider, useIdeas } from '../context/IdeaContext';
import { useFrameworkReady } from '../hooks/useFrameworkReady';
import { useIdeaLoader } from '../hooks/useIdeaLoader';
import { theme as customTheme } from '../utils/theme';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    ...customTheme.colors,
  },
};

// Component to connect UserContext and IdeaContext
function ContextConnector() {
  const { refreshUser } = useUser();
  const { setRefreshUserCallback } = useIdeas();

  useEffect(() => {
    setRefreshUserCallback(refreshUser);
  }, [refreshUser, setRefreshUserCallback]);

  return null;
}

function AppContent() {
  useFrameworkReady();
  useIdeaLoader();

  return (
    <>
      <ContextConnector />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="+not-found" />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PaperProvider theme={theme}>
        <UserProvider>
          <IdeaProvider>
            <AppContent />
            <StatusBar style="auto" />
          </IdeaProvider>
        </UserProvider>
      </PaperProvider>
    </GestureHandlerRootView>
  );
}