import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Colors } from '@/constants/Colors';
import { Service } from '@/types';

interface ServiceCardProps {
    service: Service;
    onSelect?: (service: Service) => void;
    loading?: boolean;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service, onSelect, loading }) => (
    <TouchableOpacity 
        style={[styles.card, loading && styles.cardLoading]} 
        activeOpacity={0.9} 
        onPress={() => !loading && onSelect?.(service)}
        disabled={loading}
    >
        <View style={styles.header}>
            <Text style={styles.title}>{service.name}</Text>
            <Text style={styles.chip}>{service.category}</Text>
        </View>
        <Text style={styles.description} numberOfLines={2}>{service.description}</Text>
        <View style={styles.footer}>
            {loading ? (
                <ActivityIndicator color={Colors.primary} />
            ) : (
                <>
                    <Text style={styles.price}>
                        S/ {(service.suggestedPrice || 0).toFixed(2)}
                    </Text>
                    {service.technician && (
                        <Text style={styles.technician} numberOfLines={1}>
                            {service.technician.firstName} {service.technician.lastName}
                        </Text>
                    )}
                </>
            )}
        </View>
    </TouchableOpacity>
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
    cardLoading: {
        opacity: 0.6,
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
        flex: 1,
    },
    chip: {
        backgroundColor: Colors.secondary,
        color: Colors.text,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        fontWeight: '600',
        fontSize: 12,
    },
    description: {
        color: Colors.muted,
        fontSize: 14,
        marginBottom: 12,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    price: {
        color: Colors.accent,
        fontSize: 18,
        fontWeight: '700',
    },
    technician: {
        color: Colors.muted,
        fontSize: 12,
        flex: 1,
        marginLeft: 8,
    },
});