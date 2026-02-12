import { MaterialIcons } from '@expo/vector-icons';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ExploreScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-black p-6">
      <View className="flex-row items-center mb-6">
        <MaterialIcons name="explore" size={32} color="#A31645" style={{ marginRight: 12 }} />
        <Text className="text-3xl font-bold text-primary">Explore</Text>
      </View>

      <ScrollView>
        <View className="bg-gray-100 dark:bg-zinc-900 p-4 rounded-xl mb-4">
          <Text className="text-lg font-bold text-primary mb-2">Investment Trends</Text>
          <Text className="text-gray-600 dark:text-gray-300">
            Gold prices are up 2.5% this week.
          </Text>
        </View>

        <View className="bg-gray-100 dark:bg-zinc-900 p-4 rounded-xl mb-4">
          <Text className="text-lg font-bold text-primary mb-2">Community</Text>
          <Text className="text-gray-600 dark:text-gray-300">
            See how other couples are reaching their goals.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
