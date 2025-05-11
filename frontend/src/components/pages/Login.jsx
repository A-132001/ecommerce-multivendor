import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AuthForm from '../AuthForm';
import { motion } from 'framer-motion';
import { FaSignInAlt, FaUserPlus, FaKey } from 'react-icons/fa';
import { Container, Alert, Spinner } from 'react-bootstrap';

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
    const { login, isAuthenticated, user } = useAuth();

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
            // Navigation is handled by the useEffect when isAuthenticated changes
        } catch (err) {
            let errorMessage = 'Login failed. Please try again.';
            if (err.message.includes('verify your email')) {
                errorMessage = 'Please verify your email before logging in.';
            } else if (err.response?.data?.detail) {
                errorMessage = err.response.data.detail;
            } else if (err.message) {
                errorMessage = err.message;
            }
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    if (isAuthenticated) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <Spinner animation="border" variant="primary" />
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-light min-vh-100 d-flex align-items-center py-5 justify-content-center"
        >
        
  

                    
                    <div className="card-body p-4 p-md-5">
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <Alert variant="danger" className="rounded-3">
                                    {error}
                                </Alert>
                            </motion.div>
                        )}

                        <AuthForm
                            type="login"
                            formData={formData}
                            handleChange={handleChange}
                            handleSubmit={handleSubmit}
                            isLoading={isLoading}
                        />
                    </div>
                </motion.div>
        
   
    );
};

export default Login;