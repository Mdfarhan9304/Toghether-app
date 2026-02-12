import React from 'react';
import { Dimensions, Image, Text, View } from 'react-native';

const { width } = Dimensions.get('window');

interface OnboardingSlideProps {
    title: string;
    description: string;
    image?: any; // Placeholder for now, typically require('path') or uri
    icon?: React.ReactNode;
}

export const OnboardingSlide: React.FC<OnboardingSlideProps> = ({
    title,
    description,
    image,
    icon,
}) => {
    return (
        <View className="flex-1 items-center justify-center px-6" style={{ width }}>
            {image ? (
                <Image
                    source={image}
                    className="w-full h-1/2 mb-8"
                    resizeMode="contain"
                />
            ) : (
                <View className="w-full h-1/2 mb-8 items-center justify-center bg-gray-100 dark:bg-zinc-900 rounded-3xl">
                    {icon ? icon : <Text className="text-gray-400">Image Placeholder</Text>}
                </View>
            )}

            <Text className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-4">
                {title}
            </Text>

            <Text className="text-base text-center text-gray-600 dark:text-gray-300 px-4">
                {description}
            </Text>
        </View>
    );
};
