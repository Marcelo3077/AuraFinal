import { useState } from 'react';
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Colors } from '@/constants/Colors';
import { Role } from '@/types';
import { authService } from '@/api';
import { useAuthStore } from '@/stores/auth.store';

const registerSchema = z.object({
    firstName: z.string().min(2),
    lastName: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
    phone: z.string().min(7),
});

type RegisterValues = z.infer<typeof registerSchema>;

export default function RegisterScreen() {
    const router = useRouter();
    const { login } = useAuthStore();
    const [loading, setLoading] = useState(false);

    const { control, handleSubmit } = useForm<RegisterValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            phone: '',
        },
    });

    const onSubmit = async (values: RegisterValues) => {
        setLoading(true);
        try {
            const response = await authService.register({ ...values, role: Role.USER });
            await login(response.user, response.token);
            router.replace('/(tabs)/dashboard');
        } catch (error: any) {
            const message = error?.response?.data?.message || 'Could not create your account';
            Alert.alert('Registration failed', message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.safe}>
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.title}>Create your account</Text>
                <Text style={styles.subtitle}>Access specialized home services on the go</Text>

                <View style={styles.form}>
                    {(['firstName', 'lastName', 'email', 'phone', 'password'] as const).map((field) => (
                        <Controller
                            key={field}
                            control={control}
                            name={field}
                            render={({ field: { value, onChange, onBlur }, fieldState }) => (
                                <View style={{ marginBottom: 12 }}>
                                    <Text style={styles.label}>{field === 'phone' ? 'Phone' : field === 'email' ? 'Email' : field === 'firstName' ? 'First name' : field === 'lastName' ? 'Last name' : 'Password'}</Text>
                                    <TextInput
                                        value={value}
                                        onChangeText={onChange}
                                        onBlur={onBlur}
                                        placeholder={field === 'email' ? 'you@example.com' : ''}
                                        placeholderTextColor={Colors.muted}
                                        style={styles.input}
                                        autoCapitalize={field === 'email' ? 'none' : 'words'}
                                        keyboardType={field === 'phone' ? 'phone-pad' : 'default'}
                                        secureTextEntry={field === 'password'}
                                    />
                                    {fieldState.error ? <Text style={styles.error}>{fieldState.error.message}</Text> : null}
                                </View>
                            )}
                        />
                    ))}

                    <TouchableOpacity style={styles.button} onPress={handleSubmit(onSubmit)} disabled={loading}>
                        <Text style={styles.buttonText}>{loading ? 'Creating account...' : 'Register'}</Text>
                    </TouchableOpacity>

                    <Text style={styles.linkText}>
                        Already registered? <Link href="/(auth)/login">Go to login</Link>
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    container: {
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
        marginBottom: 16,
    },
    form: {
        gap: 10,
    },
    label: {
        color: Colors.text,
        fontWeight: '700',
        marginBottom: 4,
    },
    input: {
        backgroundColor: Colors.card,
        borderRadius: 12,
        padding: 14,
        color: Colors.text,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    button: {
        backgroundColor: Colors.secondary,
        padding: 14,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 8,
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
