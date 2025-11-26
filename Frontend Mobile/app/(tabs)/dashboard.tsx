import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { LocationWeatherCard } from '@/components/LocationWeatherCard';
import { useAuthStore } from '@/stores/auth.store';
import { useApiRequest } from '@/hooks/useApiRequest';
import { reservationService, serviceService } from '@/api';
import { ServiceCard } from '@/components/ServiceCard';
import { ReservationCard } from '@/components/ReservationCard';
import { EmptyState } from '@/components/EmptyState';

export default function DashboardScreen() {
    const router = useRouter();
    const { user } = useAuthStore();

    const { data: services } = useApiRequest(() => serviceService.getAll(0, 3), []);
    const { data: reservations, refresh: reloadReservations } = useApiRequest(() => reservationService.getMyReservations(0, 3), []);

    return (
        <SafeAreaView style={styles.safe}>
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.heading}>Hi {user?.firstName || 'there'} 👋</Text>
                <Text style={styles.subheading}>Monitor your home services in one place</Text>

                <LocationWeatherCard />

                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Suggested services</Text>
                    <TouchableOpacity onPress={() => router.push('/(tabs)/services')}>
                        <Text style={styles.link}>See all</Text>
                    </TouchableOpacity>
                </View>
                {services?.content?.length ? (
                    services.content.map((service) => <ServiceCard key={service.id} service={service} />)
                ) : (
                    <EmptyState title="No services yet" description="We will load them as soon as they are created." />
                )}

                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Recent reservations</Text>
                    <TouchableOpacity onPress={reloadReservations}>
                        <Text style={styles.link}>Refresh</Text>
                    </TouchableOpacity>
                </View>
                {reservations?.content?.length ? (
                    reservations.content.map((reservation) => <ReservationCard key={reservation.id} reservation={reservation} />)
                ) : (
                    <EmptyState
                        title="You have no bookings"
                        description="Reserve a technician and track their arrival in real time."
                    />
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: Colors.background },
    container: { padding: 16, gap: 12 },
    heading: {
        color: Colors.text,
        fontSize: 26,
        fontWeight: '800',
        marginTop: 8,
    },
    subheading: {
        color: Colors.muted,
        fontSize: 15,
        marginBottom: 12,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 12,
    },
    sectionTitle: {
        color: Colors.text,
        fontSize: 18,
        fontWeight: '800',
    },
    link: {
        color: Colors.secondary,
        fontWeight: '700',
    },
});
