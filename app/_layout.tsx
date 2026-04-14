import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold
} from '@expo-google-fonts/plus-jakarta-sans';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { ActivityIndicator, Alert, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import '../global.css';
import { supabase } from '../lib/supabase';
import { useQuizStore } from '../store/quizStore';

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'Plus Jakarta Sans': PlusJakartaSans_500Medium,
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
    PlusJakartaSans_800ExtraBold,
  });

  // Realtime notification listener
  useEffect(() => {
    let channel: any;

    const setupRealtime = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      channel = supabase
        .channel('notifications')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${user.id}`,
          },
          (payload: any) => {
            const notification = payload.new;
            useQuizStore.getState().fetchNotifications();
            Alert.alert(notification.title, notification.body);
          }
        )
        .subscribe();
    };

    setupRealtime();

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, []);

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#A31645" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(onboarding)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="paywall"
          options={{
            headerShown: false,
            presentation: 'modal',
            animation: 'slide_from_bottom',
          }}
        />
        <Stack.Screen
          name="add-goal"
          options={{
            headerShown: false,
            presentation: 'transparentModal',
            animation: 'fade',
          }}
        />
        <Stack.Screen
          name="goal-detail"
          options={{
            headerShown: false,
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name="quiz/create"
          options={{
            headerShown: false,
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name="quiz/play/[id]"
          options={{
            headerShown: false,
            animation: 'slide_from_bottom',
          }}
        />
        <Stack.Screen
          name="quiz/result/[id]"
          options={{
            headerShown: false,
            animation: 'fade',
          }}
        />
      </Stack>
    </GestureHandlerRootView>
  );
}

