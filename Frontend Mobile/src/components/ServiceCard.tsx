import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Colors } from '@/constants/Colors';
import { Service } from '@/types';

interface ServiceCardProps {
    service: Service;
    onSelect?: (service: Service) => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service, onSelect }) => (
    <TouchableOpacity style={styles.card} activeOpacity={0.9} onPress={() => onSelect?.(service)}>
        <View style={styles.header}>
            <Text style={styles.title}>{service.name}</Text>
            <Text style={styles.chip}>{service.category}</Text>
        </View>
        <Text style={styles.description}>{service.description}</Text>
        <View style={styles.footer}>
            <Text style={styles.price}>${service.price.toFixed(2)}</Text>
            <Text style={styles.duration}>{service.duration} min</Text>
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
        fontSize: 16,
        fontWeight: '700',
    },
    duration: {
        color: Colors.muted,
        fontSize: 14,
    },
});
