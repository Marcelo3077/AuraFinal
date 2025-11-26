import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useApiRequest } from '@/hooks/useApiRequest';
import { reservationService } from '@/api';

export default function PaymentsScreen() {
    const { data, refresh, loading } = useApiRequest(() => reservationService.getMyReservations(0, 10), []);

    const pendingPayments = data?.content?.filter((reservation) => reservation.status === 'COMPLETED') || [];

    return (
        <SafeAreaView style={styles.safe}>
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.title}>Payments</Text>
                <Text style={styles.subtitle}>Generated from your confirmed and completed services</Text>

                {pendingPayments.length === 0 ? (
                    <View style={styles.card}>
                        <Text style={styles.info}>No payments due</Text>
                        <Text style={styles.muted}>We will show your invoices as soon as your technicians close a job.</Text>
                    </View>
                ) : (
                    pendingPayments.map((reservation) => (
                        <View key={reservation.id} style={styles.card}>
                            <Text style={styles.label}>{reservation.service.name}</Text>
                            <Text style={styles.info}>Total: ${reservation.totalPrice.toFixed(2)}</Text>
                            <Text style={styles.muted}>Technician: {reservation.technician.firstName}</Text>
                            <Text style={styles.muted}>Date: {new Date(reservation.scheduledDate).toLocaleDateString()}</Text>
                        </View>
                    ))
                )}

                <TouchableOpacity style={styles.button} onPress={refresh}>
                    <Text style={styles.buttonText}>{loading ? 'Syncing...' : 'Sync with backend'}</Text>
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
    card: {
        backgroundColor: Colors.card,
        borderRadius: 16,
        borderColor: Colors.border,
        borderWidth: 1,
        padding: 16,
        gap: 6,
    },
    label: {
        color: Colors.text,
        fontWeight: '800',
        fontSize: 16,
    },
    info: {
        color: Colors.text,
        fontWeight: '700',
    },
    muted: {
        color: Colors.muted,
    },
    button: {
        backgroundColor: Colors.secondary,
        padding: 14,
        borderRadius: 12,
        alignItems: 'center',
    },
    buttonText: {
        color: Colors.text,
        fontWeight: '800',
    },
});
