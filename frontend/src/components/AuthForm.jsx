import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AuthForm = ({ type, onSubmit, isLoading }) => {
    const navigate = useNavigate();
    const { login, register } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        username: '',
        name: '',
        user_type: 'customer',
        phone_number: '',
        address: ''
    });
    const [error, setError] = useState('');
    const [password2, setPassword2] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (name === 'email' && type === 'register') {
            setFormData(prev => ({
                ...prev,
                username: value.split('@')[0]
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            if (type === 'login') {
                const response = await login({
                    email: formData.email,
                    password: formData.password
                });
                console.log('Login response:', response);
                return;
                // if (response.data.access) {
                //     navigate('/');
                // }
            } else {
                if (formData.password !== password2) {
                    setError('Passwords do not match');
                    return;
                }
                const response = await register({
                    ...formData,
                    password2: password2
                });
                if (response.data.message) {
                    navigate('/login', { state: { message: 'Registration successful! Please check your email for verification.' } });
                }
            }
        } catch (err) {
            console.error('Auth error:', err.response?.data);
            setError(err.message || err.response?.data?.detail || err.response?.data?.message || 'An error occurred');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>

                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        {type === 'register' && (
                            <>
                                <div>
                                    <label htmlFor="name" className="sr-only">Full Name</label>
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        required
                                        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                        placeholder="Full Name"
                                        value={formData.name}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="user_type" className="sr-only">User Type</label>
                                    <select
                                        id="user_type"
                                        name="user_type"
                                        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                        value={formData.user_type}
                                        onChange={handleChange}
                                    >
                                        <option value="customer">Customer</option>
                                        <option value="vendor">Vendor</option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="phone_number" className="sr-only">Phone Number</label>
                                    <input
                                        id="phone_number"
                                        name="phone_number"
                                        type="tel"
                                        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                        placeholder="Phone Number"
                                        value={formData.phone_number}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="address" className="sr-only">Address</label>
                                    <input
                                        id="address"
                                        name="address"
                                        type="text"
                                        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                        placeholder="Address"
                                        value={formData.address}
                                        onChange={handleChange}
                                    />
                                </div>
                            </>
                        )}
                        <div>
                            <label htmlFor="email" className="sr-only">Email address</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Email address"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">Password</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>
                        {type === 'register' && (
                            <div>
                                <label htmlFor="password2" className="sr-only">Confirm Password</label>
                                <input
                                    id="password2"
                                    name="password2"
                                    type="password"
                                    required
                                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                    placeholder="Confirm Password"
                                    value={password2}
                                    onChange={(e) => setPassword2(e.target.value)}
                                />
                            </div>
                        )}
                    </div>

                    {error && (
                        <div className="text-red-500 text-sm text-center">
                            {error}
                        </div>
                    )}

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            {isLoading ? (
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            ) : (
                                type === 'login' ? 'Sign in' : 'Sign up'
                            )}
                        </button>
                    </div>

                    <div className="text-sm text-center">
                        {type === 'login' ? (
                            <>
                                <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
                                    Don't have an account? Sign up
                                </Link>
                                <br />
                                <Link to="/reset-password" className="font-medium text-indigo-600 hover:text-indigo-500">
                                    Forgot your password?
                                </Link>
                            </>
                        ) : (
                            <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                                Already have an account? Sign in
                            </Link>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AuthForm;
