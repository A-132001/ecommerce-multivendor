import React, { useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { requestPasswordReset, resetPassword } from '../../api/api';
import { FaLock, FaEnvelope, FaCheckCircle, FaArrowLeft } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { Container, Form, Button, Alert, Spinner, Card } from 'react-bootstrap';

const ResetPassword = () => {
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { uid, token } = useParams();
    const location = useLocation();

    const isResetForm = !!uid && !!token;

    const validatePassword = (password) => {
        return password.length >= 8;
    };

    const handleRequestReset = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        
        if (!email) {
            setError('Email is required');
            return;
        }

        setIsLoading(true);
        try {
            await requestPasswordReset(email);
            setSuccess('Password reset instructions have been sent to your email.');
            setEmail('');
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to send reset instructions. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!newPassword || !confirmPassword) {
            setError('Please fill in all fields');
            return;
        }

        if (!validatePassword(newPassword)) {
            setError('Password must be at least 8 characters');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setIsLoading(true);
        try {
            await resetPassword({
                uid,
                token,
                new_password: newPassword,
                new_password2: confirmPassword
            });
            setSuccess('Password has been reset successfully. Redirecting to login...');
            setTimeout(() => navigate('/login'), 3000);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to reset password. The link may have expired.');
        } finally {
            setIsLoading(false);
        }
    };

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
                padding: '2rem 0',
            }}
   
        >
  
            <Container className="col-md-8 col-lg-6 col-xl-5" >
                <Card className="shadow-lg border-0 rounded-4 overflow-hidden">
                    <Card.Header className="bg-warning text-white p-4">
                        <div className="d-flex align-items-center gap-3">
                            <FaLock size={24} />
                            <h2 className="mb-0">
                                {isResetForm ? 'Reset Your Password' : 'Forgot Password?'}
                            </h2>
                        </div>
                    </Card.Header>

                    <Card.Body className="p-4 p-md-5">
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

                        {success && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <Alert variant="success" className="rounded-3 d-flex align-items-center gap-2">
                                    <FaCheckCircle size={18} />
                                    {success}
                                </Alert>
                            </motion.div>
                        )}

                        <Form onSubmit={isResetForm ? handleResetPassword : handleRequestReset}>
                            {!isResetForm ? (
                                <Form.Group className="mb-4">
                                    <Form.Label className="d-flex align-items-center gap-2">
                                        <FaEnvelope /> Email Address
                                    </Form.Label>
                                    <Form.Control
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="your@email.com"
                                        required
                                    />
                                </Form.Group>
                            ) : (
                                <>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="d-flex align-items-center gap-2">
                                            <FaLock /> New Password
                                        </Form.Label>
                                        <Form.Control
                                            type="password"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            placeholder="At least 8 characters"
                                            required
                                            isInvalid={newPassword && !validatePassword(newPassword)}
                                        />
                                        <Form.Text className="text-muted">
                                            Password must be at least 8 characters
                                        </Form.Text>
                                    </Form.Group>

                                    <Form.Group className="mb-4">
                                        <Form.Label className="d-flex align-items-center gap-2">
                                            <FaLock /> Confirm Password
                                        </Form.Label>
                                        <Form.Control
                                            type="password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            placeholder="Confirm your password"
                                            required
                                            isInvalid={confirmPassword && newPassword !== confirmPassword}
                                        />
                                    </Form.Group>
                                </>
                            )}

                            <Button
                                variant="warning"
                                type="submit"
                                disabled={isLoading}
                                className="w-100 py-3 fw-bold mt-3"
                            >
                                {isLoading ? (
                                    <Spinner animation="border" size="sm" />
                                ) : isResetForm ? (
                                    'Reset Password'
                                ) : (
                                    'Send Reset Link'
                                )}
                            </Button>

                            <div className="text-center mt-4 pt-3 border-top">
                                <Button 
                                    variant="link" 
                                    onClick={() => navigate('/login')}
                                    className="text-decoration-none d-flex align-items-center justify-content-center gap-2"
                                >
                                    <FaArrowLeft /> Back to Login
                                </Button>
                            </div>
                        </Form>
                    </Card.Body>
                </Card>
            </Container>
        </motion.div>
    );
};

export default ResetPassword;