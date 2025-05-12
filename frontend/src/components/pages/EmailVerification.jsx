// frontend/src/components/EmailVerification.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { verifyEmail } from '../../api/api';
import { motion } from 'framer-motion';
import { Container, Card, Alert, Spinner } from 'react-bootstrap';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const EmailVerification = () => {
    const { uid, token } = useParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState('verifying'); // 'verifying', 'success', 'error'
    const [message, setMessage] = useState('');

    useEffect(() => {
        const verifyUserEmail = async () => {
            try {
                await verifyEmail(uid, token);
                setStatus('success');
                setMessage('Email verified successfully! Redirecting to login...');
                setTimeout(() => navigate('/login'), 3000);
            } catch (error) {
                setStatus('error');
                setMessage(error.response?.data?.error || 'Failed to verify email. The link may have expired.');
            }
        };

        verifyUserEmail();
    }, [uid, token, navigate]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-light min-vh-100 d-flex align-items-center py-5"
        >
            <Container className="col-md-8 col-lg-6 col-xl-5">
                <Card className="shadow-lg border-0 rounded-4 overflow-hidden">
                    <Card.Body className="p-4 p-md-5 text-center">
                        {status === 'verifying' && (
                            <div className="py-5">
                                <Spinner animation="border" variant="primary" />
                                <p className="mt-3">Verifying your email...</p>
                            </div>
                        )}

                        {status === 'success' && (
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="py-4"
                            >
                                <FaCheckCircle size={64} className="text-success mb-3" />
                                <h3 className="mb-3">Email Verified!</h3>
                                <p className="text-muted">{message}</p>
                            </motion.div>
                        )}

                        {status === 'error' && (
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="py-4"
                            >
                                <FaTimesCircle size={64} className="text-danger mb-3" />
                                <h3 className="mb-3">Verification Failed</h3>
                                <Alert variant="danger" className="mt-3">
                                    {message}
                                </Alert>
                                <button
                                    className="btn btn-primary mt-3"
                                    onClick={() => navigate('/login')}
                                >
                                    Go to Login
                                </button>
                            </motion.div>
                        )}
                    </Card.Body>
                </Card>
            </Container>
        </motion.div>
    );
};

export default EmailVerification;