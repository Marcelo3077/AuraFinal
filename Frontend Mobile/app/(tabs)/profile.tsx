import { useState } from 'react';
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useAuthStore } from '@/stores/auth.store';
import { authService } from '@/api';

export default function ProfileScreen() {
    const { user, updateUser, logout } = useAuthStore();
    const [firstName, setFirstName] = useState(user?.firstName || '');
    const [lastName, setLastName] = useState(user?.lastName || '');
    const [phone, setPhone] = useState(user?.phone || '');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleUpdateProfile = async () => {
        setLoading(true);
        try {
            const payload = { firstName, lastName, phone };
            await authService.updateProfile(payload);
            updateUser(payload);
            Alert.alert('Profile updated', 'Your contact info was updated on the backend');
        } catch (err: any) {
            const message = err?.response?.data?.message || 'Could not update profile';
            Alert.alert('Error', message);
        } finally {
            setLoading(false);
        }
    };

    const handleChangePassword = async () => {
        if (!oldPassword || !newPassword) {
            Alert.alert('Missing information', 'Enter both current and new password');
            return;
        }
        setLoading(true);
        try {
            await authService.changePassword(oldPassword, newPassword);
            Alert.alert('Password updated', 'Please use the new password next time');
            setOldPassword('');
            setNewPassword('');
        } catch (err: any) {
            const message = err?.response?.data?.message || 'Could not change password';
            Alert.alert('Error', message);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        await logout();
    };

    return (
        <SafeAreaView style={styles.safe}>
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.title}>Profile & settings</Text>
                <Text style={styles.subtitle}>Stay in sync with your Aura identity</Text>

                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Personal info</Text>
                    <TextInput
                        value={firstName}
                        onChangeText={setFirstName}
                        placeholder="First name"
                        placeholderTextColor={Colors.muted}
                        style={styles.input}
                    />
                    <TextInput
                        value={lastName}
                        onChangeText={setLastName}
                        placeholder="Last name"
                        placeholderTextColor={Colors.muted}
                        style={styles.input}
                    />
                    <TextInput
                        value={phone}
                        onChangeText={setPhone}
                        placeholder="Phone"
                        placeholderTextColor={Colors.muted}
                        style={styles.input}
                    />

                    <TouchableOpacity style={styles.button} onPress={handleUpdateProfile} disabled={loading}>
                        <Text style={styles.buttonText}>{loading ? 'Saving...' : 'Update profile'}</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Security</Text>
                    <TextInput
                        value={oldPassword}
                        onChangeText={setOldPassword}
                        placeholder="Current password"
                        placeholderTextColor={Colors.muted}
                        style={styles.input}
                        secureTextEntry
                    />
                    <TextInput
                        value={newPassword}
                        onChangeText={setNewPassword}
                        placeholder="New password"
                        placeholderTextColor={Colors.muted}
                        style={styles.input}
                        secureTextEntry
                    />
                    <TouchableOpacity style={styles.button} onPress={handleChangePassword} disabled={loading}>
                        <Text style={styles.buttonText}>{loading ? 'Updating...' : 'Change password'}</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={[styles.button, styles.logout]} onPress={handleLogout}>
                    <Text style={styles.buttonText}>Logout</Text>
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
        padding: 14,
        gap: 10,
    },
    cardTitle: {
        color: Colors.text,
        fontWeight: '800',
        fontSize: 16,
    },
    input: {
        backgroundColor: Colors.card,
        borderColor: Colors.border,
        borderWidth: 1,
        borderRadius: 12,
        padding: 12,
        color: Colors.text,
    },
    button: {
        backgroundColor: Colors.primary,
        padding: 14,
        borderRadius: 12,
        alignItems: 'center',
    },
    buttonText: {
        color: Colors.text,
        fontWeight: '800',
    },
    logout: {
        backgroundColor: Colors.danger,
    },
});
