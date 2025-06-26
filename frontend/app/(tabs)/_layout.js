import React from 'react';
import { View } from 'react-native';
import { Tabs } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useUser } from '../../context/UserContext';
import LoginScreen from '../login';

const TabBarIcon = ({ name, color, focused }) => {
  return (
    <View style={{
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: focused ? '#E6F5E4' : 'transparent',
      borderRadius: 12,
      width: 40,
      height: 40,
    }}>
      <MaterialIcons name={name} size={24} color={focused ? '#fd7e14' : color} />
    </View>
  );
};

export default function TabLayout() {
  const { isAuthenticated, loading, user } = useUser();

  if (loading) {
    return null;
  }

  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  const isAdmin = user && user.role === 'admin';

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#fd7e14',
        tabBarInactiveTintColor: '#8E8E93',
        tabBarShowLabel: true,
        tabBarLabelStyle: { fontSize: 12, marginBottom: 2, fontWeight: '500' },
        tabBarItemStyle: { justifyContent: 'center', alignItems: 'center', paddingTop: 4 },
        tabBarStyle: {
          backgroundColor: '#FFF7F0',
          borderTopWidth: 0,
          elevation: 8,
          height: 60,
          marginBottom: 20,
          borderRadius: 20,
          position: 'absolute',
          left: 0,
          right: 0,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.08,
          shadowRadius: 8,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="home" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="submit"
        options={{
          title: 'Submit',
          tabBarLabel: 'Submit',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="add-circle-outline" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="tracker"
        options={{
          title: 'My Ideas',
          tabBarLabel: 'My Ideas',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="lightbulb-outline" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="leaderboard"
        options={{
          title: 'Leaderboard',
          tabBarLabel: 'Leaderboard',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="leaderboard" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="implemented"
        options={{
          title: 'Implemented',
          tabBarLabel: 'Implemented',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="check-circle-outline" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="person-outline" color={color} focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}