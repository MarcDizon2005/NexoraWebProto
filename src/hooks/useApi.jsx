import { useState, useCallback } from 'react';

const useApi = (apiFunction) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const execute = useCallback(
        async (...args) => {
            setLoading(true);
            setError(null);
            try {
                const result = await apiFunction(...args);
                setData(result);
                return { success: true, data: result };
            } catch (err) {
                const errorMessage = err.message || 'An error occurred';
                setError(errorMessage);
                return { success: false, error: errorMessage, status: err.status };
            } finally {
                setLoading(false);
            }
        },
        [apiFunction]
    );

    const reset = useCallback(() => {
        setData(null);
        setError(null);
        setLoading(false);
    }, []);

    return {
        data,
        loading,
        error,
        execute,
        reset,
    };
};

export default useApi;
