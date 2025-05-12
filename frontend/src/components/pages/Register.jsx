import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AuthForm from '../AuthForm';
import { motion } from 'framer-motion';


const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        username: '',
        password: '',
        password2: '',
        userType: 'customer',
        phone_number: '',
        address: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { register, isAuthenticated } = useAuth();

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard', { replace: true });
        }
    }, [isAuthenticated, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
            // Auto-generate username from email
            ...(name === 'email' ? { username: value.split('@')[0] } : {})
        }));
    };

    const validateForm = () => {
        if (formData.password !== formData.password2) {
            setError('Passwords do not match');
            return false;
        }
        if (formData.password.length < 8) {
            setError('Password must be at least 8 characters long');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        try {
            await register(formData);
            // Show success message and redirect to login
            navigate('/login', { 
                state: { 
                    message: 'Registration successful! Please check your email for verification.' 
                }
            });
        } catch (err) {
            let errorMessage = 'Registration failed';
            if (err.response?.data) {
                if (typeof err.response.data === 'string') {
                    errorMessage = err.response.data;
                } else if (err.response.data.error) {
                    errorMessage = err.response.data.error;
                } else if (typeof err.response.data === 'object') {
                    // Handle multiple validation errors
                    const errors = Object.values(err.response.data).flat();
                    errorMessage = errors.join('. ');
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
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    style={{
                        minHeight: '100vh',
                        width: '100%',
                        backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(/imgs/auth-form.jpg)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundAttachment: 'fixed',
                        // display: 'flex',
                        // alignItems: 'center',
                        padding: '2rem 0'
                    }}
                >
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Create your account
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Already have an account?{' '}
                        <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                            Sign in
                        </Link>
                    </p>
                  
                </div>

                <AuthForm
                    type="register"
                    formData={formData}
                    handleChange={handleChange}
                    handleSubmit={handleSubmit}
                    error={error}
                    isLoading={isLoading}
                />
            </div>
       
        </motion.div>
    );
};

export default Register;
