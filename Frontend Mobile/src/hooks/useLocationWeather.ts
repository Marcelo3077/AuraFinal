import { useCallback, useEffect, useState } from 'react';
import * as Location from 'expo-location';

interface WeatherData {
    temperature: number;
    description: string;
}

export const useLocationWeather = () => {
    const [locationName, setLocationName] = useState<string | null>(null);
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchWeather = useCallback(async (latitude: number, longitude: number) => {
        try {
            // Open-Meteo free API (no key required)
            const query = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code`;
            const response = await fetch(query);
            const data = await response.json();
            const temperature = data?.current?.temperature_2m;
            setWeather({
                temperature,
                description: 'Outdoor conditions updated',
            });
        } catch (err) {
            console.error('Weather fetch failed', err);
            setError('Could not fetch weather information');
        }
    }, []);

    const request = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setError('Location permission denied. Using fallback city.');
                setLocationName('Unknown city');
                setWeather({ temperature: 22, description: 'Permission not granted' });
                return;
            }

            const position = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
            const geoCode = await Location.reverseGeocodeAsync(position.coords);
            const readableLocation = geoCode[0];
            const label = readableLocation
                ? `${readableLocation.city || readableLocation.region || 'My area'}, ${readableLocation.country}`
                : 'Your area';
            setLocationName(label);
            await fetchWeather(position.coords.latitude, position.coords.longitude);
        } catch (err) {
            console.error('Location request failed', err);
            setError('We could not read your location.');
            setWeather({ temperature: 21, description: 'Fallback weather' });
        } finally {
            setLoading(false);
        }
    }, [fetchWeather]);

    useEffect(() => {
        request();
    }, [request]);

    return { locationName, weather, loading, error, request };
};
