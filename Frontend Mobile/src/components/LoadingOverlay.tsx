import React from 'react';
import { ActivityIndicator, Modal, StyleSheet, View, Text } from 'react-native';
import { Colors } from '@/constants/Colors';

interface LoadingOverlayProps {
    visible: boolean;
    message?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ visible, message = 'Please wait...' }) => (
    <Modal visible={visible} transparent animationType="fade">
        <View style={styles.overlay}>
            <View style={styles.content}>
                <ActivityIndicator size="large" color={Colors.primary} />
                <Text style={styles.message}>{message}</Text>
            </View>
        </View>
    </Modal>
);

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        backgroundColor: Colors.card,
        padding: 24,
        borderRadius: 16,
        alignItems: 'center',
        gap: 12,
    },
    message: {
        color: Colors.text,
        fontSize: 16,
        fontWeight: '600',
    },
});
