import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useOnboardingStore } from '../../store/onboardingStore';

export default function DashboardScreen() {
  const { resetOnboarding } = useOnboardingStore();
  const router = useRouter();

  const handleReset = async () => {
    await resetOnboarding();
    router.replace('/');
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-black items-center justify-center">
      <StatusBar style="auto" />
      <View className="items-center space-y-4">
        <Text className="text-3xl font-bold text-primary">GoldShare Dashboard</Text>
        <Text className="text-gray-500 dark:text-gray-400">Your shared investments will appear here.</Text>

        <TouchableOpacity
          onPress={handleReset}
          className="mt-8 bg-gray-200 dark:bg-zinc-800 px-6 py-3 rounded-full"
        >
          <Text className="text-primary font-bold">Reset Onboarding (Debug)</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
