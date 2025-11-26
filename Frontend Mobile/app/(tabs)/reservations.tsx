import { useState } from 'react';
import { Alert, RefreshControl, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useApiRequest } from '@/hooks/useApiRequest';
import { reservationService } from '@/api';
import { ReservationCard } from '@/components/ReservationCard';
import { EmptyState } from '@/components/EmptyState';

export default function ReservationsScreen() {
    const { data, loading, error, refresh } = useApiRequest(() => reservationService.getMyReservations(0, 30), []);
    const [updating, setUpdating] = useState(false);

    const handleCancel = async (id: number) => {
        setUpdating(true);
        try {
            await reservationService.cancel(id);
            Alert.alert('Cancelled', 'Your reservation was cancelled');
            await refresh();
        } catch (err: any) {
            const message = err?.response?.data?.message || 'Could not cancel';
            Alert.alert('Error', message);
        } finally {
            setUpdating(false);
        }
    };

    const handleComplete = async (id: number) => {
        setUpdating(true);
        try {
            await reservationService.complete(id);
            Alert.alert('Completed', 'Reservation marked as completed');
            await refresh();
        } catch (err: any) {
            const message = err?.response?.data?.message || 'Could not complete reservation';
            Alert.alert('Error', message);
        } finally {
            setUpdating(false);
        }
    };

    return (
        <SafeAreaView style={styles.safe}>
            <ScrollView
                contentContainerStyle={styles.container}
                refreshControl={<RefreshControl refreshing={loading || updating} onRefresh={refresh} tintColor={Colors.text} />}
            >
                <Text style={styles.title}>My reservations</Text>
                <Text style={styles.subtitle}>Manage live bookings pulled from the backend</Text>

                {error ? <Text style={styles.error}>{error}</Text> : null}

                {data?.content?.length ? (
                    data.content.map((reservation) => (
                        <ReservationCard
                            key={reservation.id}
                            reservation={reservation}
                            onCancel={handleCancel}
                            onComplete={handleComplete}
                        />
                    ))
                ) : (
                    <EmptyState title="No reservations" description="Reserve a service to see it here." />
                )}

                <TouchableOpacity style={styles.button} onPress={refresh}>
                    <Text style={styles.buttonText}>Reload from API</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: Colors.background },
    container: { padding: 16, gap: 12 },
    title: {
        color: Colors.text,
        fontSize: 24,
        fontWeight: '800',
        marginTop: 8,
    },
    subtitle: {
        color: Colors.muted,
        marginBottom: 12,
    },
    error: {
        color: Colors.danger,
    },
    button: {
        backgroundColor: Colors.primary,
        padding: 14,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 12,
    },
    buttonText: {
        color: Colors.text,
        fontWeight: '800',
    },
});
