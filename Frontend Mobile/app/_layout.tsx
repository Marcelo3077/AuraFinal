import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ActivityIndicator, View, Text, StyleSheet } from 'react-native';
import { useAuthStore } from '@/stores/auth.store';
import { Colors } from '@/constants/Colors';

export default function RootLayout() {
    const { isLoading, loadAuthData } = useAuthStore();

    useEffect(() => {
        loadAuthData();
    }, [loadAuthData]);

    if (isLoading) {
        return (
            <View style={styles.loader}>
                <ActivityIndicator size="large" color={Colors.primary} />
                <Text style={styles.loaderText}>Preparing Aura mobile...</Text>
            </View>
        );
    }

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <Stack
                screenOptions={{
                    headerShown: false,
                    contentStyle: { backgroundColor: Colors.background },
                }}
            />
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    loader: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        backgroundColor: Colors.background,
    },
    loaderText: {
        color: Colors.text,
        fontWeight: '700',
        fontSize: 16,
    },
});
