import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const api = axios.create({
    baseURL: API_URL,
});

// Add request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        if (!(config.data instanceof FormData)) {
            config.headers['Content-Type'] = 'application/json';
        }

        return config;
    },
    (error) => Promise.reject(error)
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
                return Promise.reject(error);
            }
        }
        return Promise.reject(error);
    }
);

// Helper function to validate store responses
function validateStoreResponse(data) {
    const requiredFields = ['id', 'store_name', 'store_description'];
    for (const field of requiredFields) {
        if (!(field in data)) {
            throw new Error(`Invalid store response: missing ${field}`);
        }
    }
    return data;
}

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
    return await api.post('/vendors/', storeData);
};

export const getStore = async (storeId) => {
    return await api.get(`/vendors/${storeId}/`);
};

export const updateStore = async (storeId, storeData) => {
    return await api.put(`/vendors/${storeId}/`, storeData);
};

export const deleteStore = async (storeId) => {
    return await api.delete(`/vendors/${storeId}/`);
};

export const listStores = async () => {
    try {
        const response = await api.get('/vendors/');
        return response.data;
    } catch (error) {
        handleApiError(error, 'Failed to fetch stores');
    }
};
// Product API calls
export const getAllCategories = async () => await api.get(`/products/categories/`);
export const getStoreProducts = async (storeId) => {
    return await api.get(`/products/?store_id=${storeId}`);
}
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
    try {
        const response = await api.get('/cart/');
        return response.data;
    } catch (error) {
        handleApiError(error, 'Failed to fetch cart');
    }
};

export const addToCart = async (productId, quantity = 1) => {
    try {
        const response = await api.post('/cart/items/', { product: productId, quantity });
        return response.data;
    } catch (error) {
        handleApiError(error, 'Failed to add to cart');
    }
};

export const updateCartItem = async (itemId, quantity) => {
    try {
        const response = await api.put(`/cart/items/${itemId}/`, { quantity });
        return response.data;
    } catch (error) {
        handleApiError(error, 'Failed to update cart item');
    }
};

export const removeFromCart = async (itemId) => {
    try {
        await api.delete(`/cart/items/${itemId}/`);
        return true;
    } catch (error) {
        handleApiError(error, 'Failed to remove from cart');
    }
};

// Order API calls


// File Upload API
export const uploadFile = async (file, fieldName = 'file') => {
    try {
        const formData = new FormData();
        formData.append(fieldName, file);
        const response = await api.post('/upload/', formData);
        return response.data;
    } catch (error) {
        handleApiError(error, 'Failed to upload file');
    }
};

// Helper function to handle API errors consistently
function handleApiError(error, defaultMessage) {
    if (error.response) {
        console.error('API Error:', error.response.data);
        throw new Error(error.response.data.message || defaultMessage);
    } else if (error.request) {
        console.error('Network Error:', error.request);
        throw new Error('Network error. Please check your connection.');
    } else {
        console.error('Error:', error.message);
        throw error;
    }
}




export default api;