// frontend/src/components/EmailVerification.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { verifyEmail } from '../../api/api';
import { motion } from 'framer-motion';
import { Container, Card, Alert, Button, Spinner } from 'react-bootstrap';
import { FaEnvelope, FaCheckCircle, FaArrowLeft, FaTimesCircle } from 'react-icons/fa';

const EmailVerification = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { uid, token } = useParams();
    const { message, email, verificationUrl, variant } = location.state || {};
    
    const [status, setStatus] = useState(uid && token ? 'verifying' : 'instructions');
    const [verificationMessage, setVerificationMessage] = useState('');

    useEffect(() => {
        const verifyUserEmail = async () => {
            if (!uid || !token) return;
            
            try {
                await verifyEmail(uid, token);
                setStatus('success');
                setVerificationMessage('Email verified successfully! Redirecting to login...');
                setTimeout(() => navigate('/login'), 3000);
            } catch (error) {
                setStatus('error');
                setVerificationMessage(error.response?.data?.error || 'Failed to verify email. The link may have expired.');
            }
        };

        verifyUserEmail();
    }, [uid, token, navigate]);

    // If we're verifying the email (clicked from email)
    if (uid && token) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-light min-vh-100 d-flex align-items-center py-5"
            >
                <Container className="col-md-8 col-lg-6 col-xl-5">
                    <Card className="shadow-lg border-0 rounded-4 overflow-hidden">
                        <Card.Header className="bg-warning text-white p-4">
                            <div className="d-flex align-items-center gap-3">
                                <FaEnvelope size={24} />
                                <h2 className="mb-0">Email Verification</h2>
                            </div>
                        </Card.Header>

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
                                    <p className="text-muted">{verificationMessage}</p>
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
                                        {verificationMessage}
                                    </Alert>
                                    <Button
                                        variant="warning"
                                        className="mt-3"
                                        onClick={() => navigate('/login')}
                                    >
                                        <FaArrowLeft className="me-2" />
                                        Back to Login
                                    </Button>
                                </motion.div>
                            )}
                        </Card.Body>
                    </Card>
                </Container>
            </motion.div>
        );
    }

    // If we're showing instructions (after registration)
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-light min-vh-100 d-flex align-items-center py-5"
        >
            <Container className="col-md-8 col-lg-6 col-xl-5">
                <Card className="shadow-lg border-0 rounded-4 overflow-hidden">
                    <Card.Header className="bg-warning text-white p-4">
                        <div className="d-flex align-items-center gap-3">
                            <FaEnvelope size={24} />
                            <h2 className="mb-0">Verify Your Email</h2>
                        </div>
                    </Card.Header>

                    <Card.Body className="p-4 p-md-5 text-center">
                        {message && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <Alert variant={variant || 'success'} className="rounded-3">
                                    <div className="d-flex align-items-center gap-2">
                                        <FaCheckCircle size={18} />
                                        {message}
                                    </div>
                                </Alert>
                            </motion.div>
                        )}

                        <div className="py-4">
                            <h4 className="mb-3">Next Steps:</h4>
                            <ol className="text-start mb-4">
                                <li className="mb-2">Check your email inbox ({email})</li>
                                <li className="mb-2">Click the verification link in the email</li>
                                <li className="mb-2">Return to login after verification</li>
                            </ol>

                            <div className="mt-4">
                                <p className="text-muted mb-3">
                                    Didn't receive the email? Check your spam folder or request a new verification link.
                                </p>
                                <Button
                                    variant="outline-warning"
                                    className="me-2"
                                    onClick={() => navigate('/login')}
                                >
                                    <FaArrowLeft className="me-2" />
                                    Back to Login
                                </Button>
                            </div>
                        </div>
                    </Card.Body>
                </Card>
            </Container>
        </motion.div>
    );
};

export default EmailVerification;