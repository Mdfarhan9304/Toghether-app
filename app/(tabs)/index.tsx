import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function DashboardScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-black items-center justify-center">
      <StatusBar style="auto" />
      <View className="items-center space-y-4">
        <Text className="text-3xl font-bold text-primary">GoldShare Dashboard</Text>
        <Text className="text-gray-500 dark:text-gray-400">Your shared investments will appear here.</Text>
      </View>
    </SafeAreaView>
  );
}
