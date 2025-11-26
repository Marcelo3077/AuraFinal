import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useLocationWeather } from '@/hooks/useLocationWeather';

export const LocationWeatherCard: React.FC = () => {
    const { locationName, weather, loading, error, request } = useLocationWeather();

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Location & Weather</Text>
                <TouchableOpacity onPress={request}>
                    <Text style={styles.refresh}>Refresh</Text>
                </TouchableOpacity>
            </View>
            {loading ? (
                <ActivityIndicator color={Colors.primary} />
            ) : (
                <>
                    <Text style={styles.location}>{locationName || 'Locating you...'}</Text>
                    <Text style={styles.weather}>
                        {weather ? `${weather.temperature}°C - ${weather.description}` : 'No weather data yet'}
                    </Text>
                    {error ? <Text style={styles.error}>{error}</Text> : null}
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.card,
        padding: 16,
        borderRadius: 16,
        borderColor: Colors.border,
        borderWidth: 1,
        marginBottom: 12,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    title: {
        color: Colors.text,
        fontSize: 16,
        fontWeight: '700',
    },
    refresh: {
        color: Colors.secondary,
        fontWeight: '700',
    },
    location: {
        color: Colors.text,
        fontSize: 15,
    },
    weather: {
        color: Colors.muted,
        marginTop: 4,
    },
    error: {
        color: Colors.warning,
        marginTop: 6,
    },
});
