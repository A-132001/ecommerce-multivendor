import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaLock, FaPhone, FaMapMarkerAlt, FaStore, FaSignInAlt, FaUserPlus, FaKey } from 'react-icons/fa';
import { Container, Form, Button, Alert, Spinner, Card, Row, Col } from 'react-bootstrap';
import GoogleLoginButton from './GoogleButton';

const AuthForm = ({ type, isLoading }) => {
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
    const [password2, setPassword2] = useState('');
    const [errors, setErrors] = useState({});
    const [formError, setFormError] = useState('');

    const validateForm = () => {
        const newErrors = {};

        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        }

        if (type === 'register') {
            if (!formData.name) newErrors.name = 'Full name is required';
            if (password2 !== formData.password) newErrors.password2 = 'Passwords do not match';
            if (!password2) newErrors.password2 = 'Please confirm your password';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error when user types
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }

        // Auto-generate username from email
        if (name === 'email' && type === 'register') {
            setFormData(prev => ({
                ...prev,
                username: value.split('@')[0]
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError('');

        if (!validateForm()) return;

        try {
            if (type === 'login') {
                await login(formData);
                navigate('/');
            } else {
                await register({ ...formData, password2 });
                navigate('/login', {
                    state: {
                        message: 'Registration successful! Please check your email for verification.',
                        variant: 'success'
                    }
                });
            }
        } catch (err) {
            console.error('Auth error:', err);
            const errorMessage = err.response?.data?.detail ||
                err.response?.data?.message ||
                err.message ||
                'An error occurred during authentication';
            setFormError(errorMessage);
        }
    };

    return (

            <Container className="my-auto">
                <Row className="justify-content-center">
                    <Col xs={12} md={10} lg={8} xl={6}>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <Card className="shadow-lg border-0 rounded-4 overflow-hidden" style={{ backdropFilter: 'blur(8px)', backgroundColor: 'rgba(255, 255, 255, 0.85)' }}>
                                <Card.Header className={`bg-warning text-white p-4`}>
                                    <div className="d-flex align-items-center gap-3">
                                        {type === 'login' ? (
                                            <FaSignInAlt size={24} />
                                        ) : (
                                            <FaUserPlus size={24} />
                                        )}
                                        <h2 className="mb-0 fw-bold">
                                            {type === 'login' ? 'Sign In to Your Account' : 'Create New Account'}
                                        </h2>
                                    </div>
                                </Card.Header>

                                <Card.Body className="p-4 p-md-5">
                                    {formError && (
                                        <Alert variant="danger" className="rounded-3">
                                            <div className="d-flex align-items-center gap-2">
                                                <FaExclamationCircle />
                                                {formError}
                                            </div>
                                        </Alert>
                                    )}

                                    <Form onSubmit={handleSubmit}>
                                        {type === 'register' && (
                                            <>
                                                <Form.Group className="mb-3">
                                                    <Form.Label className="d-flex align-items-center gap-2 text-muted">
                                                        <FaUser /> Full Name
                                                    </Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        name="name"
                                                        value={formData.name}
                                                        onChange={handleChange}
                                                        isInvalid={!!errors.name}
                                                        placeholder="John Doe"
                                                        className="py-2"
                                                    />
                                                    <Form.Control.Feedback type="invalid">
                                                        {errors.name}
                                                    </Form.Control.Feedback>
                                                </Form.Group>

                                                <Form.Group className="mb-3">
                                                    <Form.Label className="d-flex align-items-center gap-2 text-muted">
                                                        <FaStore /> Account Type
                                                    </Form.Label>
                                                    <Form.Select
                                                        name="user_type"
                                                        value={formData.user_type}
                                                        onChange={handleChange}
                                                        className="py-2"
                                                    >
                                                        <option value="customer">Customer</option>
                                                        <option value="vendor">Vendor</option>
                                                    </Form.Select>
                                                </Form.Group>

                                                <Form.Group className="mb-3">
                                                    <Form.Label className="d-flex align-items-center gap-2 text-muted">
                                                        <FaPhone /> Phone Number
                                                    </Form.Label>
                                                    <Form.Control
                                                        type="tel"
                                                        name="phone_number"
                                                        value={formData.phone_number}
                                                        onChange={handleChange}
                                                        placeholder="+1234567890"
                                                        className="py-2"
                                                    />
                                                </Form.Group>

                                                <Form.Group className="mb-3">
                                                    <Form.Label className="d-flex align-items-center gap-2 text-muted">
                                                        <FaMapMarkerAlt /> Address
                                                    </Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        name="address"
                                                        value={formData.address}
                                                        onChange={handleChange}
                                                        placeholder="123 Main St, City"
                                                        className="py-2"
                                                    />
                                                </Form.Group>
                                            </>
                                        )}

                                        <Form.Group className="mb-3">
                                            <Form.Label className="d-flex align-items-center gap-2 text-muted">
                                                <FaEnvelope /> Email Address
                                            </Form.Label>
                                            <Form.Control
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                isInvalid={!!errors.email}
                                                placeholder="your@email.com"
                                                className="py-2"
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.email}
                                            </Form.Control.Feedback>
                                        </Form.Group>

                                        <Form.Group className="mb-3">
                                            <Form.Label className="d-flex align-items-center gap-2 text-muted">
                                                <FaLock /> Password
                                            </Form.Label>
                                            <Form.Control
                                                type="password"
                                                name="password"
                                                value={formData.password}
                                                onChange={handleChange}
                                                isInvalid={!!errors.password}
                                                placeholder="At least 8 characters"
                                                className="py-2"
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.password}
                                            </Form.Control.Feedback>
                                        </Form.Group>

                                        {type === 'register' && (
                                            <Form.Group className="mb-4">
                                                <Form.Label className="d-flex align-items-center gap-2 text-muted">
                                                    <FaLock /> Confirm Password
                                                </Form.Label>
                                                <Form.Control
                                                    type="password"
                                                    name="password2"
                                                    value={password2}
                                                    onChange={(e) => setPassword2(e.target.value)}
                                                    isInvalid={!!errors.password2}
                                                    placeholder="Confirm your password"
                                                    className="py-2"
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    {errors.password2}
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        )}

                                        {type === 'login' && (
                                            <div className="d-flex justify-content-between align-items-center mt-4">
                                                <div className="form-check">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        id="rememberMe"
                                                        name="rememberMe"
                                                        checked={formData.rememberMe}
                                                        onChange={handleChange}
                                                    />
                                                    <label className="form-check-label small text-muted" htmlFor="rememberMe">
                                                        Remember me
                                                    </label>
                                                </div>

                                                <Link
                                                    to="/reset-password"
                                                    className="text-decoration-none small d-flex align-items-center gap-2 text-warning"
                                                >
                                                    <FaKey size={14} />
                                                    Forgot password?
                                                </Link>
                                            </div>
                                        )}

                                        <Button
                                            variant="warning"
                                            type="submit"
                                            disabled={isLoading}
                                            className="w-100 py-3 fw-bold mt-4 text-white"
                                            style={{ boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}
                                        >
                                            {isLoading ? (
                                                <>
                                                    <Spinner animation="border" size="sm" className="me-2" />
                                                    {type === 'login' ? 'Signing In...' : 'Registering...'}
                                                </>
                                            ) : (
                                                type === 'login' ? 'Sign In' : 'Register'
                                            )}
                                        </Button>
                                    </Form>

                                    <div className="text-center mt-4 pt-3 border-top">
                                        <p className="small mb-3 text-muted">
                                            {type === 'login' ? "Don't have an account?" : "Already have an account?"}
                                        </p>
                                        <Link
                                            to={type === 'login' ? "/register" : "/login"}
                                            className="btn btn-outline-warning btn-sm d-inline-flex align-items-center gap-2"
                                        >
                                            {type === 'login' ? (
                                                <>
                                                    <FaUserPlus size={14} />
                                                    Register now
                                                </>
                                            ) : (
                                                'Sign in'
                                            )}
                                        </Link>

                                        <div className="mt-4">
                                            <div className="d-flex align-items-center my-3">
                                                <div className="flex-grow-1 border-bottom"></div>
                                                <span className="mx-2 small text-muted">OR</span>
                                                <div className="flex-grow-1 border-bottom"></div>
                                            </div>
                                            <GoogleLoginButton className="w-100" />
                                        </div>
                                    </div>
                                </Card.Body>
                            </Card>
                        </motion.div>
                    </Col>
                </Row>
            </Container>
    );
};

export default AuthForm;