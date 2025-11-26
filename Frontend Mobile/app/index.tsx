import { Redirect } from 'expo-router';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useAuthStore } from '@/stores/auth.store';
import { Colors } from '@/constants/Colors';

export default function Index() {
    const { isAuthenticated, isLoading } = useAuthStore();

    if (isLoading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator color={Colors.primary} />
                <Text style={styles.text}>Checking your session...</Text>
            </View>
        );
    }

    if (!isAuthenticated) {
        return <Redirect href="/(auth)/login" />;
    }

    return <Redirect href="/(tabs)/dashboard" />;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: Colors.background,
    },
    text: {
        color: Colors.text,
        fontSize: 16,
    },
});
