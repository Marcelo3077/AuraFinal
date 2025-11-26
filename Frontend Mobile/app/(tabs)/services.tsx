import { useMemo, useState } from 'react';
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useApiRequest } from '@/hooks/useApiRequest';
import { reservationService, serviceService } from '@/api';
import { Service, ServiceCategory } from '@/types';
import { ServiceCard } from '@/components/ServiceCard';
import { EmptyState } from '@/components/EmptyState';
import { CameraCapture } from '@/components/CameraCapture';
import { useAuthStore } from '@/stores/auth.store';

export default function ServicesScreen() {
    const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | 'ALL'>('ALL');
    const [selectedService, setSelectedService] = useState<Service | null>(null);
    const [scheduledDate, setScheduledDate] = useState('');
    const [address, setAddress] = useState('');
    const [notes, setNotes] = useState('');
    const [attachment, setAttachment] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const { user } = useAuthStore();

    const { data, loading, error, refresh } = useApiRequest(() =>
        selectedCategory === 'ALL'
            ? serviceService.getAll(0, 20)
            : serviceService.getByCategory(selectedCategory, 0, 20),
        [selectedCategory]
    );

    const categories = useMemo(() => Object.values(ServiceCategory), []);

    const handleReservation = async () => {
        if (!selectedService) {
            Alert.alert('Select a service', 'Pick one of the available services first');
            return;
        }
        if (!scheduledDate || !address) {
            Alert.alert('Missing data', 'Please provide a date/time and address');
            return;
        }

        setSubmitting(true);
        try {
            await reservationService.create({
                service: selectedService,
                technician: selectedService.technician,
                user,
                scheduledDate,
                address,
                notes: attachment ? `${notes}\nImage: ${attachment}` : notes,
                status: undefined,
                totalPrice: selectedService.price,
            });
            Alert.alert('Reservation created', 'Your technician will contact you soon');
            setNotes('');
            setAddress('');
            setScheduledDate('');
            setSelectedService(null);
        } catch (err: any) {
            const message = err?.response?.data?.message || 'Could not create the reservation';
            Alert.alert('Error', message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <SafeAreaView style={styles.safe}>
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.title}>Explore our services</Text>
                <Text style={styles.subtitle}>All actions hit the Aura backend in real-time</Text>

                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 12 }}>
                    <TouchableOpacity
                        style={[styles.chip, selectedCategory === 'ALL' && styles.chipActive]}
                        onPress={() => setSelectedCategory('ALL')}
                    >
                        <Text style={styles.chipText}>All</Text>
                    </TouchableOpacity>
                    {categories.map((category) => (
                        <TouchableOpacity
                            key={category}
                            style={[styles.chip, selectedCategory === category && styles.chipActive]}
                            onPress={() => setSelectedCategory(category)}
                        >
                            <Text style={styles.chipText}>{category}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {loading && <Text style={styles.info}>Loading services...</Text>}
                {error && <Text style={styles.error}>{error}</Text>}
                {data?.content?.length ? (
                    data.content.map((service) => (
                        <ServiceCard key={service.id} service={service} onSelect={setSelectedService} />
                    ))
                ) : (
                    <EmptyState title="No services" description="Try refreshing or contact an administrator." />
                )}

                <TouchableOpacity onPress={refresh} style={[styles.button, { marginTop: 12 }]}>
                    <Text style={styles.buttonText}>Refresh list</Text>
                </TouchableOpacity>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Book a service</Text>
                    <Text style={styles.info}>Selected: {selectedService?.name || 'None'}</Text>

                    <TextInput
                        value={scheduledDate}
                        onChangeText={setScheduledDate}
                        placeholder="YYYY-MM-DD HH:mm"
                        placeholderTextColor={Colors.muted}
                        style={styles.input}
                    />
                    <TextInput
                        value={address}
                        onChangeText={setAddress}
                        placeholder="Service address"
                        placeholderTextColor={Colors.muted}
                        style={styles.input}
                    />
                    <TextInput
                        value={notes}
                        onChangeText={setNotes}
                        placeholder="Notes for the technician"
                        placeholderTextColor={Colors.muted}
                        style={[styles.input, { height: 90 }]} 
                        multiline
                    />

                    <Text style={styles.sectionTitle}>Capture issue evidence</Text>
                    <Text style={styles.info}>Use the device camera to add context for the technician.</Text>
                    <CameraCapture onCapture={setAttachment} />

                    <TouchableOpacity style={[styles.button, { marginTop: 14 }]} onPress={handleReservation} disabled={submitting}>
                        <Text style={styles.buttonText}>{submitting ? 'Scheduling...' : 'Submit reservation'}</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: Colors.background },
    container: { padding: 16 },
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
    chip: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 12,
        backgroundColor: Colors.card,
        borderWidth: 1,
        borderColor: Colors.border,
        marginRight: 8,
    },
    chipActive: {
        backgroundColor: Colors.primary,
    },
    chipText: {
        color: Colors.text,
        fontWeight: '700',
    },
    info: {
        color: Colors.muted,
        marginVertical: 6,
    },
    error: {
        color: Colors.danger,
        marginVertical: 6,
    },
    section: {
        marginTop: 16,
        padding: 14,
        backgroundColor: Colors.card,
        borderRadius: 16,
        borderColor: Colors.border,
        borderWidth: 1,
    },
    sectionTitle: {
        color: Colors.text,
        fontWeight: '800',
        fontSize: 16,
        marginBottom: 6,
    },
    input: {
        backgroundColor: Colors.card,
        borderColor: Colors.border,
        borderWidth: 1,
        borderRadius: 12,
        padding: 12,
        color: Colors.text,
        marginTop: 8,
    },
    button: {
        backgroundColor: Colors.accent,
        padding: 14,
        borderRadius: 12,
        alignItems: 'center',
    },
    buttonText: {
        color: Colors.text,
        fontWeight: '800',
    },
});
