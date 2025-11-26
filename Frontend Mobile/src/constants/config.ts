import Constants from 'expo-constants';

export const API_URL = Constants.expoConfig?.extra?.apiUrl || process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8080/api';
export const APP_ENV = Constants.expoConfig?.extra?.appEnv || process.env.EXPO_PUBLIC_APP_ENV || 'development';
export const IS_DEV = APP_ENV === 'development';
