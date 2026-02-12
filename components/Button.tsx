import React from 'react';
import { Text, TouchableOpacity, TouchableOpacityProps, View } from 'react-native';

interface ButtonProps extends TouchableOpacityProps {
    title: string;
    variant?: 'primary' | 'secondary' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    className?: string;
    textClassName?: string;
    icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
    title,
    variant = 'primary',
    size = 'md',
    className = '',
    textClassName = '',
    icon,
    ...props
}) => {
    const getVariantStyles = () => {
        switch (variant) {
            case 'secondary':
                return 'bg-secondary dark:bg-secondary-dark';
            case 'outline':
                return 'bg-transparent border border-primary dark:border-primary-dark';
            case 'primary':
            default:
                return 'bg-primary dark:bg-primary-dark';
        }
    };

    const getTextVariantStyles = () => {
        switch (variant) {
            case 'outline':
                return 'text-primary dark:text-primary-dark';
            case 'secondary':
                return 'text-secondary-foreground';
            case 'primary':
            default:
                return 'text-white';
        }
    };

    const getSizeStyles = () => {
        switch (size) {
            case 'sm':
                return 'py-2 px-4';
            case 'lg':
                return 'py-4 px-8';
            case 'md':
            default:
                return 'py-3 px-6';
        }
    };

    const getTextSizeStyles = () => {
        switch (size) {
            case 'sm':
                return 'text-sm';
            case 'lg':
                return 'text-lg';
            case 'md':
            default:
                return 'text-base';
        }
    };

    return (
        <TouchableOpacity
            activeOpacity={0.8}
            className={`rounded-full flex-row items-center justify-center shadow-sm ${getVariantStyles()} ${getSizeStyles()} ${className}`}
            {...props}
        >
            {icon && <View className="mr-2">{icon}</View>}
            <Text
                className={`font-semibold text-center ${getTextVariantStyles()} ${getTextSizeStyles()} ${textClassName}`}
            >
                {title}
            </Text>
        </TouchableOpacity>
    );
};
