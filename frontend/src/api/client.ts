import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);


export const getAssetUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    const base = (import.meta.env.VITE_API_URL || 'http://localhost:8080/api').replace('/api', '');
    return `${base}${url.startsWith('/') ? '' : '/'}${url}`;
};

export default api;
