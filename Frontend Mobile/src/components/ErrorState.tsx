import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '@/constants/Colors';

interface ErrorStateProps {
    message: string;
    details?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ message, details }) => (
    <View style={styles.container}>
        <Text style={styles.title}>Something went wrong</Text>
        <Text style={styles.message}>{message}</Text>
        {details ? <Text style={styles.details}>{details}</Text> : null}
    </View>
);

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.card,
        borderRadius: 12,
        padding: 16,
        borderColor: Colors.border,
        borderWidth: 1,
    },
    title: {
        color: Colors.text,
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 4,
    },
    message: {
        color: Colors.muted,
        fontSize: 14,
    },
    details: {
        color: Colors.warning,
        marginTop: 6,
    },
});
