import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor to handle token refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const refreshToken = localStorage.getItem('refresh_token');
                const response = await axios.post(`${API_URL}/auth/token/refresh/`, {
                    refresh: refreshToken
                });
                const { access } = response.data;
                localStorage.setItem('access_token', access);
                originalRequest.headers.Authorization = `Bearer ${access}`;
                return api(originalRequest);
            } catch (error) {
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                window.location.href = '/login';
                return Promise.reject(error);
            }
        }
        return Promise.reject(error);
    }
);

// Auth API calls
export const login = async (credentials) => {
    try {
        const response = await api.post('/auth/login/', {
            email: credentials.email,
            password: credentials.password
        });
        if (response.data.access) {
            localStorage.setItem('access_token', response.data.access);
            localStorage.setItem('refresh_token', response.data.refresh);
        }
        return response;
    } catch (error) {
        if (error.response?.data?.error === 'Please verify your email before logging in.') {
            throw new Error('Please verify your email before logging in.');
        }
        throw error;
    }
};

export const register = async (userData) => {
    return await api.post('/auth/register/', userData);
};

export const verifyEmail = async (uid, token) => {
    return await api.post(`/auth/verify-email/${uid}/${token}/`);
};

export const requestPasswordReset = async (email) => {
    return await api.post('/auth/password-reset/', { email });
};

export const resetPassword = async (data) => {
    return await api.post('/auth/password-reset/confirm/', data);
};

export const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
};

// User API calls
export const getCurrentUser = async () => {
    return await api.get('/auth/profile/');
};

export const updateUser = async (userData) => {
    return await api.put('/auth/profile/', userData);
};

export const changePassword = async (passwords) => {
    return await api.post('/auth/change-password/', passwords);
};

// Store API calls
export const createStore = async (storeData) => {
    return await api.post('/stores/', storeData);
};

export const getStore = async (storeId) => {
    return await api.get(`/stores/${storeId}/`);
};

export const updateStore = async (storeId, storeData) => {
    return await api.put(`/stores/${storeId}/`, storeData);
};

export const deleteStore = async (storeId) => {
    return await api.delete(`/stores/${storeId}/`);
};

export const listStores = async () => {
    return await api.get('/stores/');
};

// Product API calls
export const createProduct = async (productData) => {
    return await api.post('/products/', productData);
};

export const getProduct = async (productId) => {
    return await api.get(`/products/${productId}/`);
};

export const updateProduct = async (productId, productData) => {
    return await api.put(`/products/${productId}/`, productData);
};

export const deleteProduct = async (productId) => {
    return await api.delete(`/products/${productId}/`);
};

export const listProducts = async () => {
    return await api.get('/products/');
};

// Cart API calls
export const getCart = async () => {
    return await api.get('/cart/');
};

export const addToCart = async (productId, quantity) => {
    return await api.post('/cart/items/', { product: productId, quantity });
};

export const updateCartItem = async (itemId, quantity) => {
    return await api.put(`/cart/items/${itemId}/`, { quantity });
};

export const removeFromCart = async (itemId) => {
    return await api.delete(`/cart/items/${itemId}/`);
};

// Order API calls
export const createOrder = async (orderData) => {
    return await api.post('/orders/', orderData);
};

export const getOrder = async (orderId) => {
    return await api.get(`/orders/${orderId}/`);
};

export const listOrders = async () => {
    return await api.get('/orders/');
};

export const updateOrderStatus = async (orderId, status) => {
    return await api.put(`/orders/${orderId}/status/`, { status });
};

export default api;
