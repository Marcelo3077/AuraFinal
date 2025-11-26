import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '@/constants/Colors';

interface EmptyStateProps {
    title: string;
    description?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ title, description }) => (
    <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>
        {description ? <Text style={styles.description}>{description}</Text> : null}
    </View>
);

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.card,
        padding: 16,
        borderRadius: 12,
        borderColor: Colors.border,
        borderWidth: 1,
        alignItems: 'center',
    },
    title: {
        color: Colors.text,
        fontSize: 16,
        fontWeight: '600',
    },
    description: {
        color: Colors.muted,
        fontSize: 14,
        marginTop: 4,
        textAlign: 'center',
    },
});
