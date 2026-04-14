import { MaterialIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { View } from 'react-native';

import GlassTabBar from '../../components/GlassTabBar';

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <GlassTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#A31645',
        tabBarInactiveTintColor: '#A1A1AA',
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="home" size={26} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="timeline"
        options={{
          title: 'Timeline',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="schedule" size={26} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="quiz"
        options={{
          title: 'Quiz',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="quiz" size={26} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Chat',
          tabBarIcon: ({ color }) => (
            <View>
              <MaterialIcons
                name="chat-bubble-outline"
                size={26}
                color={color}
              />
              {/* Notification badge */}
              <View
                style={{
                  position: 'absolute',
                  top: -2,
                  right: -6,
                  width: 10,
                  height: 10,
                  borderRadius: 5,
                  backgroundColor: '#E11D48',
                  borderWidth: 1.5,
                  borderColor: '#FFFFFF',
                }}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="person-outline" size={26} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
