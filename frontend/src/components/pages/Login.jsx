import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AuthForm from '../AuthForm';

const Login = () => {
    const [formData, setFormData] = useState({ 
        email: '', 
        password: '',
        rememberMe: false 
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { login, isAuthenticated } = useAuth();

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            const from = location.state?.from?.pathname || '/dashboard';
            navigate(from, { replace: true });
        }
    }, [isAuthenticated, navigate, location]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await login(formData);
            const from = location.state?.from?.pathname || '/dashboard';
            navigate(from, { replace: true });
        } catch (err) {
            let errorMessage = 'Login failed';
            if (err.response?.data) {
                if (typeof err.response.data === 'string') {
                    errorMessage = err.response.data;
                } else if (err.response.data.error) {
                    errorMessage = err.response.data.error;
                } else if (err.response.data.detail) {
                    errorMessage = err.response.data.detail;
                }
            }
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    if (isAuthenticated) {
        return null; // or a loading spinner
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Sign in to your account
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Or{' '}
                        <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
                            create a new account
                        </Link>
                    </p>
                </div>

                <AuthForm
                    type="login"
                    formData={formData}
                    handleChange={handleChange}
                    handleSubmit={handleSubmit}
                    error={error}
                    isLoading={isLoading}
                />

                <div className="text-center">
                    <Link
                        to="/reset-password"
                        className="font-medium text-indigo-600 hover:text-indigo-500"
                    >
                        Forgot your password?
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
