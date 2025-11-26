import { Tabs } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';

export default function TabsLayout() {
    return (
        <Tabs
            screenOptions={{
                headerStyle: { backgroundColor: Colors.background },
                headerTintColor: Colors.text,
                tabBarStyle: { backgroundColor: Colors.card, borderTopColor: Colors.border },
                tabBarActiveTintColor: Colors.primary,
                tabBarInactiveTintColor: Colors.muted,
            }}
        >
            <Tabs.Screen
                name="dashboard"
                options={{
                    title: 'Dashboard',
                    tabBarIcon: ({ color, size }) => <Ionicons name="home" color={color} size={size} />,
                }}
            />
            <Tabs.Screen
                name="services"
                options={{
                    title: 'Services',
                    tabBarIcon: ({ color, size }) => <Ionicons name="construct" color={color} size={size} />,
                }}
            />
            <Tabs.Screen
                name="reservations"
                options={{
                    title: 'Bookings',
                    tabBarIcon: ({ color, size }) => <Ionicons name="calendar" color={color} size={size} />,
                }}
            />
            <Tabs.Screen
                name="payments"
                options={{
                    title: 'Payments',
                    tabBarIcon: ({ color, size }) => <Ionicons name="card" color={color} size={size} />,
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',
                    tabBarIcon: ({ color, size }) => <Ionicons name="person" color={color} size={size} />,
                }}
            />
        </Tabs>
    );
}
