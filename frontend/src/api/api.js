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
    const isFormData = userData.avatar instanceof Blob || userData instanceof FormData;
    
    if (isFormData) {
        const formData = userData instanceof FormData 
            ? userData 
            : new FormData();
        
        if (!(userData instanceof FormData)) {
            if (userData.avatar) formData.append('avatar', userData.avatar);
            if (userData.name) formData.append('name', userData.name);
            if (userData.email) formData.append('email', userData.email);
        }

        return await api.put('/auth/profile/', formData);
    }
    return await api.put('/auth/profile/', userData);
};

export const changePassword = async (passwords) => {
    return await api.post('/auth/change-password/', passwords);
};

// Store API calls
export const createStore = async (storeData) => {
    try {
        const isFormData = storeData.store_logo instanceof File || storeData instanceof FormData;

        const formData = isFormData ? storeData instanceof FormData ? storeData : new FormData() : null;

        if (formData) {
            // Log FormData to check what's inside
            console.log("FormData: ", formData);

            if (!(storeData instanceof FormData)) {
                formData.append('store_name', storeData.store_name);
                formData.append('store_description', storeData.store_description);
                formData.append('contact_phone', storeData.contact_phone);
                formData.append('contact_email', storeData.contact_email);
                formData.append('store_logo', storeData.store_logo);
                if (storeData.address) formData.append('address', storeData.address);
            }
            return await api.post('/vendors/', formData);
        }

        return await api.post('/vendors/', {
            store_name: storeData.store_name,
            store_description: storeData.store_description,
            contact_phone: storeData.contact_phone,
            contact_email: storeData.contact_email,
            store_logo: storeData.store_logo,
            address: storeData.address,
        });
    } catch (error) {
        console.error('Error creating store:', error);
        throw new Error('Failed to create store');
    }
};

export const getStore = async (storeId) => {
    try {
        const response = await api.get(`/vendors/${storeId}/`);
        return validateStoreResponse(response.data);
    } catch (error) {
        handleApiError(error, 'Failed to fetch store');
    }
};

export const updateStore = async (storeId, storeData) => {
    try {
        if (storeData.store_logo instanceof Blob || storeData instanceof FormData) {
            const formData = storeData instanceof FormData 
                ? storeData 
                : new FormData();
            
            if (!(storeData instanceof FormData)) {
                if (storeData.store_name) formData.append('store_name', storeData.store_name);
                if (storeData.store_description) formData.append('store_description', storeData.store_description);
                if (storeData.contact_phone) formData.append('contact_phone', storeData.contact_phone);
                if (storeData.contact_email) formData.append('contact_email', storeData.contact_email);
                if (storeData.store_logo) formData.append('store_logo', storeData.store_logo);
                if (storeData.address) formData.append('address', storeData.address);
            }

            const response = await api.put(`/vendors/${storeId}/`, formData);
            return validateStoreResponse(response.data);
        }
        
        const response = await api.put(`/vendors/${storeId}/`, storeData);
        return validateStoreResponse(response.data);
    } catch (error) {
        handleApiError(error, 'Failed to update store');
    }
};

export const deleteStore = async (storeId) => {
    try {
        await api.delete(`/vendors/${storeId}/`);
        return true;
    } catch (error) {
        handleApiError(error, 'Failed to delete store');
    }
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
export const getStoreProducts = async (storeId) => {
    try {
        const response = await api.get(`/products/?store_id=${storeId}`);
        return response.data;
    } catch (error) {
        handleApiError(error, 'Failed to fetch store products');
    }
};

export const createProduct = async (productData) => {
    try {
        const isFormData = productData.image instanceof Blob || productData instanceof FormData;
        
        if (isFormData) {
            const formData = productData instanceof FormData 
                ? productData 
                : new FormData();
            
            if (!(productData instanceof FormData)) {
                if (!productData.name) throw new Error('Product name is required');
                formData.append('name', productData.name);
                formData.append('description', productData.description || '');
                formData.append('price', productData.price || 0);
                formData.append('store', productData.store);
                if (productData.image) formData.append('image', productData.image);
                if (productData.category) formData.append('category', productData.category);
                if (productData.stock) formData.append('stock', productData.stock);
            }

            const response = await api.post('/products/', formData);
            return response.data;
        }
        
        if (!productData.name) throw new Error('Product name is required');
        const response = await api.post('/products/', productData);
        return response.data;
    } catch (error) {
        handleApiError(error, 'Failed to create product');
    }
};

export const getProduct = async (productId) => {
    try {
        const response = await api.get(`/products/${productId}/`);
        return response.data;
    } catch (error) {
        handleApiError(error, 'Failed to fetch product');
    }
};

export const updateProduct = async (productId, productData) => {
    try {
        const isFormData = productData.image instanceof Blob || productData instanceof FormData;
        
        if (isFormData) {
            const formData = productData instanceof FormData 
                ? productData 
                : new FormData();
            
            if (!(productData instanceof FormData)) {
                formData.append('name', productData.name || '');
                formData.append('description', productData.description || '');
                formData.append('price', productData.price || 0);
                if (productData.image) formData.append('image', productData.image);
                if (productData.category) formData.append('category', productData.category);
                if (productData.stock) formData.append('stock', productData.stock);
            }

            const response = await api.put(`/products/${productId}/`, formData);
            return response.data;
        }
        
        const response = await api.put(`/products/${productId}/`, productData);
        return response.data;
    } catch (error) {
        handleApiError(error, 'Failed to update product');
    }
};

export const deleteProduct = async (productId) => {
    try {
        await api.delete(`/products/${productId}/`);
        return true;
    } catch (error) {
        handleApiError(error, 'Failed to delete product');
    }
};

export const listProducts = async () => {
    try {
        const response = await api.get('/products/');
        return response.data;
    } catch (error) {
        handleApiError(error, 'Failed to fetch products');
    }
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