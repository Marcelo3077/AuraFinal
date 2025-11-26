import { useState } from 'react';
import { Alert, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Colors } from '@/constants/Colors';
import { authService } from '@/api';
import { useAuthStore } from '@/stores/auth.store';

const loginSchema = z.object({
    email: z.string().email({ message: 'Enter a valid email' }),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginValues = z.infer<typeof loginSchema>;

export default function LoginScreen() {
    const router = useRouter();
    const { login } = useAuthStore();
    const [loading, setLoading] = useState(false);
    const { control, handleSubmit } = useForm<LoginValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: { email: '', password: '' },
    });

    const onSubmit = async (values: LoginValues) => {
        setLoading(true);
        try {
            const response = await authService.login(values);
            await login(response.user, response.token);
            router.replace('/(tabs)/dashboard');
        } catch (error: any) {
            const message = error?.response?.data?.message || 'Could not sign you in';
            Alert.alert('Login failed', message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Welcome back</Text>
            <Text style={styles.subtitle}>Sign in to manage your Aura services</Text>

            <View style={styles.form}>
                <Text style={styles.label}>Email</Text>
                <Controller
                    control={control}
                    name="email"
                    render={({ field: { value, onChange, onBlur }, fieldState }) => (
                        <>
                            <TextInput
                                value={value}
                                onChangeText={onChange}
                                onBlur={onBlur}
                                placeholder="you@example.com"
                                placeholderTextColor={Colors.muted}
                                style={styles.input}
                                autoCapitalize="none"
                                keyboardType="email-address"
                            />
                            {fieldState.error ? <Text style={styles.error}>{fieldState.error.message}</Text> : null}
                        </>
                    )}
                />

                <Text style={styles.label}>Password</Text>
                <Controller
                    control={control}
                    name="password"
                    render={({ field: { value, onChange, onBlur }, fieldState }) => (
                        <>
                            <TextInput
                                value={value}
                                onChangeText={onChange}
                                onBlur={onBlur}
                                placeholder="••••••••"
                                placeholderTextColor={Colors.muted}
                                style={styles.input}
                                secureTextEntry
                            />
                            {fieldState.error ? <Text style={styles.error}>{fieldState.error.message}</Text> : null}
                        </>
                    )}
                />

                <TouchableOpacity style={styles.button} onPress={handleSubmit(onSubmit)} disabled={loading}>
                    <Text style={styles.buttonText}>{loading ? 'Signing in...' : 'Login'}</Text>
                </TouchableOpacity>

                <Text style={styles.linkText}>
                    Need an account? <Link href="/(auth)/register">Create one</Link>
                </Text>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
        padding: 20,
        gap: 12,
    },
    title: {
        color: Colors.text,
        fontSize: 28,
        fontWeight: '800',
        marginTop: 24,
    },
    subtitle: {
        color: Colors.muted,
        fontSize: 16,
    },
    form: {
        marginTop: 24,
        gap: 10,
    },
    label: {
        color: Colors.text,
        fontWeight: '700',
        marginTop: 8,
    },
    input: {
        backgroundColor: Colors.card,
        borderRadius: 12,
        padding: 14,
        color: Colors.text,
        borderWidth: 1,
        borderColor: Colors.border,
        marginTop: 6,
    },
    button: {
        backgroundColor: Colors.primary,
        padding: 14,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 18,
    },
    buttonText: {
        color: Colors.text,
        fontSize: 16,
        fontWeight: '800',
    },
    linkText: {
        color: Colors.muted,
        textAlign: 'center',
        marginTop: 8,
    },
    error: {
        color: Colors.danger,
        marginTop: 4,
    },
});
