import { Tabs } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';

function CustomPlusIcon({ color }: { color: string }) {
  return (
    <View style={styles.plusIconContainer}>
      <View style={[styles.plusButton, { backgroundColor: '#FF0050' }]}>
        <IconSymbol name="plus" size={24} color="#fff" />
      </View>
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#000',
          borderTopWidth: 0,
        },
        tabBarActiveTintColor: '#fff',
        tabBarInactiveTintColor: '#888',
        tabBarShowLabel: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color }) => (
            <IconSymbol name="house.fill" size={25} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="friends"
        options={{
          tabBarIcon: ({ color }) => (
            <IconSymbol name="person.2.fill" size={25} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          tabBarIcon: ({ color }) => <CustomPlusIcon color={color} />,
        }}
      />
      <Tabs.Screen
        name="inbox"
        options={{
          tabBarIcon: ({ color }) => (
            <IconSymbol name="envelope.fill" size={25} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color }) => (
            <IconSymbol name="person.fill" size={25} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  plusIconContainer: {
    width: 48,
    height: 32,
    marginTop: 4,
  },
  plusButton: {
    flex: 1,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FF0050',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
