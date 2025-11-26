import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Colors } from '@/constants/Colors';
import { Reservation, ReservationStatus } from '@/types';

interface ReservationCardProps {
    reservation: Reservation;
    onCancel?: (id: number) => void;
    onComplete?: (id: number) => void;
}

const statusColorMap: Record<ReservationStatus, string> = {
    [ReservationStatus.PENDING]: Colors.warning,
    [ReservationStatus.CONFIRMED]: Colors.secondary,
    [ReservationStatus.IN_PROGRESS]: Colors.primary,
    [ReservationStatus.COMPLETED]: Colors.success,
    [ReservationStatus.CANCELLED]: Colors.danger,
};

export const ReservationCard: React.FC<ReservationCardProps> = ({ reservation, onCancel, onComplete }) => (
    <View style={styles.card}>
        <View style={styles.row}>
            <Text style={styles.title}>{reservation.service.name}</Text>
            <Text style={[styles.status, { color: statusColorMap[reservation.status] }]}>
                {reservation.status}
            </Text>
        </View>
        <Text style={styles.meta}>With: {reservation.technician.firstName} {reservation.technician.lastName}</Text>
        <Text style={styles.meta}>Date: {new Date(reservation.scheduledDate).toLocaleString()}</Text>
        <Text style={styles.meta}>Address: {reservation.address}</Text>
        <View style={styles.actions}>
            {reservation.status === ReservationStatus.PENDING && onCancel ? (
                <TouchableOpacity style={[styles.button, styles.danger]} onPress={() => onCancel(reservation.id)}>
                    <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
            ) : null}
            {[ReservationStatus.CONFIRMED, ReservationStatus.IN_PROGRESS].includes(reservation.status) && onComplete ? (
                <TouchableOpacity style={[styles.button, styles.success]} onPress={() => onComplete(reservation.id)}>
                    <Text style={styles.buttonText}>Complete</Text>
                </TouchableOpacity>
            ) : null}
        </View>
    </View>
);

const styles = StyleSheet.create({
    card: {
        backgroundColor: Colors.card,
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: Colors.border,
        marginBottom: 12,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        color: Colors.text,
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 4,
    },
    status: {
        fontWeight: '700',
    },
    meta: {
        color: Colors.muted,
        fontSize: 14,
        marginTop: 2,
    },
    actions: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 12,
    },
    button: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 12,
    },
    buttonText: {
        color: Colors.text,
        fontWeight: '700',
    },
    danger: {
        backgroundColor: Colors.danger,
    },
    success: {
        backgroundColor: Colors.success,
    },
});
