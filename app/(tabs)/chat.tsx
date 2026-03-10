import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { ScreenPlaceholder } from '../../components/common/ScreenPlaceholder';

export default function ChatScreen() {
    return (
        <>
            <StatusBar style="dark" />
            <ScreenPlaceholder
                icon="chat-bubble-outline"
                title="Chat"
                description="Message your partner and stay connected throughout the day."
            />
        </>
    );
}
