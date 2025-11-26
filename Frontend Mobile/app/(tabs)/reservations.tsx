import { useState } from 'react';
import { Alert, RefreshControl, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useApiRequest } from '@/hooks/useApiRequest';
import { reservationService } from '@/api';
import { ReservationCard } from '@/components/ReservationCard';
import { EmptyState } from '@/components/EmptyState';
import { ReservationStatus } from '@/types';

export default function ReservationsScreen() {
    const { data, loading, error, refresh } = useApiRequest(
        () => reservationService.getMyReservations(0, 30),
        [],
        {
            onError: (err) => {
                console.error('Failed to load reservations:', err);
            }
        }
    );
    
    const [updating, setUpdating] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState<ReservationStatus | 'ALL'>('ALL');

    const handleCancel = async (id: number) => {
        Alert.alert(
            'Cancel Reservation',
            'Are you sure you want to cancel this reservation?',
            [
                { text: 'No', style: 'cancel' },
                {
                    text: 'Yes, Cancel',
                    style: 'destructive',
                    onPress: async () => {
                        setUpdating(true);
                        try {
                            await reservationService.cancel(id);
                            Alert.alert('Success', 'Your reservation was cancelled successfully');
                            await refresh();
                        } catch (err: any) {
                            const message = err?.response?.data?.message || 'Could not cancel reservation';
                            Alert.alert('Error', message);
                        } finally {
                            setUpdating(false);
                        }
                    }
                }
            ]
        );
    };

    const handleComplete = async (id: number) => {
        Alert.alert(
            'Mark as Completed',
            'Confirm that this service has been completed?',
            [
                { text: 'Not Yet', style: 'cancel' },
                {
                    text: 'Completed',
                    onPress: async () => {
                        setUpdating(true);
                        try {
                            await reservationService.complete(id);
                            Alert.alert('Success', 'Reservation marked as completed');
                            await refresh();
                        } catch (err: any) {
                            const message = err?.response?.data?.message || 'Could not complete reservation';
                            Alert.alert('Error', message);
                        } finally {
                            setUpdating(false);
                        }
                    }
                }
            ]
        );
    };

    const filteredReservations = data?.content?.filter(reservation => {
        if (selectedFilter === 'ALL') return true;
        return reservation.status === selectedFilter;
    }) || [];

    const statusFilters: Array<{ label: string; value: ReservationStatus | 'ALL' }> = [
        { label: 'All', value: 'ALL' },
        { label: 'Pending', value: ReservationStatus.PENDING },
        { label: 'Confirmed', value: ReservationStatus.CONFIRMED },
        { label: 'Completed', value: ReservationStatus.COMPLETED },
    ];

    return (
        <SafeAreaView style={styles.safe}>
            <ScrollView
                contentContainerStyle={styles.container}
                refreshControl={
                    <RefreshControl 
                        refreshing={loading || updating} 
                        onRefresh={refresh} 
                        tintColor={Colors.text} 
                    />
                }
            >
                <Text style={styles.title}>My Reservations</Text>
                <Text style={styles.subtitle}>
                    Manage your service bookings ({data?.totalElements || 0} total)
                </Text>

                {/* Filter Pills */}
                <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={false} 
                    style={styles.filterContainer}
                >
                    {statusFilters.map(filter => (
                        <TouchableOpacity
                            key={filter.value}
                            style={[
                                styles.filterPill,
                                selectedFilter === filter.value && styles.filterPillActive
                            ]}
                            onPress={() => setSelectedFilter(filter.value)}
                        >
                            <Text style={[
                                styles.filterPillText,
                                selectedFilter === filter.value && styles.filterPillTextActive
                            ]}>
                                {filter.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {error ? (
                    <View style={styles.errorContainer}>
                        <Text style={styles.error}>⚠️ {error}</Text>
                        <TouchableOpacity style={styles.retryButton} onPress={refresh}>
                            <Text style={styles.retryButtonText}>Try Again</Text>
                        </TouchableOpacity>
                    </View>
                ) : null}

                {filteredReservations.length > 0 ? (
                    <>
                        {filteredReservations.map((reservation) => (
                            <ReservationCard
                                key={reservation.id}
                                reservation={reservation}
                                onCancel={handleCancel}
                                onComplete={handleComplete}
                            />
                        ))}
                        <Text style={styles.resultsText}>
                            Showing {filteredReservations.length} of {data?.totalElements || 0} reservations
                        </Text>
                    </>
                ) : (
                    <EmptyState 
                        title="No reservations found" 
                        description={
                            selectedFilter === 'ALL' 
                                ? "You haven't made any reservations yet." 
                                : `No ${selectedFilter.toLowerCase()} reservations.`
                        }
                    />
                )}

                <TouchableOpacity 
                    style={[styles.button, (loading || updating) && styles.buttonDisabled]} 
                    onPress={refresh}
                    disabled={loading || updating}
                >
                    <Text style={styles.buttonText}>
                        {loading || updating ? 'Syncing...' : 'Sync with Backend'}
                    </Text>
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
    filterContainer: {
        marginVertical: 8,
        maxHeight: 45,
    },
    filterPill: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: Colors.card,
        borderWidth: 1,
        borderColor: Colors.border,
        marginRight: 8,
    },
    filterPillActive: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
    },
    filterPillText: {
        color: Colors.muted,
        fontWeight: '600',
        fontSize: 14,
    },
    filterPillTextActive: {
        color: Colors.text,
    },
    errorContainer: {
        backgroundColor: Colors.card,
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: Colors.danger,
        gap: 8,
    },
    error: {
        color: Colors.danger,
        fontSize: 14,
    },
    retryButton: {
        backgroundColor: Colors.danger,
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
    },
    retryButtonText: {
        color: Colors.text,
        fontWeight: '700',
    },
    resultsText: {
        color: Colors.muted,
        fontSize: 12,
        textAlign: 'center',
        marginTop: 8,
    },
    button: {
        backgroundColor: Colors.primary,
        padding: 14,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 12,
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    buttonText: {
        color: Colors.text,
        fontWeight: '800',
    },
});