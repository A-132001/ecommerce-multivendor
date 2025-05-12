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
    const [errorList, setErrorList] = useState([]);
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
        setErrorList([]);
        setIsLoading(true);

        try {
            await login(formData);
            // Navigation is handled by the useEffect when isAuthenticated changes
        } catch (err) {
            let errorMessage = 'Login failed. Please try again.';
            let errors = [];
            if (err.response?.data) {
                const data = err.response.data;
                if (typeof data === 'string') {
                    errors.push(data);
                } else if (data.error) {
                    errors.push(data.error);
                } else if (data.detail) {
                    errors.push(data.detail);
                } else {
                    // Collect all field errors
                    for (const key in data) {
                        if (Array.isArray(data[key])) {
                            errors = errors.concat(data[key]);
                        } else if (typeof data[key] === 'string') {
                            errors.push(data[key]);
                        }
                    }
                }
            } else if (err.message) {
                errors.push(err.message);
            } else {
                errors.push(errorMessage);
            }
            setError(errors[0] || errorMessage);
            setErrorList(errors.length > 1 ? errors : []);
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
            transition={{ duration: 0.5 }}
            style={{
                minHeight: '100vh',
                width: '100%',
                backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(/imgs/auth-form.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed',
                display: 'flex',
                alignItems: 'center',
                padding: '2rem 0'
            }}
        >
  

                    
                    <div className="card-body p-4 p-md-5">
                        {(error || errorList.length > 0) && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <Alert variant="danger" className="rounded-3">
                                    {error && <div>{error}</div>}
                                    {errorList.length > 0 && (
                                        <ul className="mb-0">
                                            {errorList.map((err, idx) => (
                                                <li key={idx}>{err}</li>
                                            ))}
                                        </ul>
                                    )}
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