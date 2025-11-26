import { DependencyList, useCallback, useEffect, useState } from 'react';

export const useApiRequest = <T,>(requestFn: () => Promise<T>, deps: DependencyList = []) => {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const execute = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await requestFn();
            setData(response);
        } catch (err: any) {
            console.error('API request failed', err?.message || err);
            setError(err?.response?.data?.message || 'Unexpected error');
        } finally {
            setLoading(false);
        }
    }, deps);

    useEffect(() => {
        execute();
    }, [execute]);

    return { data, loading, error, refresh: execute };
};
