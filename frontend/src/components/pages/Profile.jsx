import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { updateUser } from '../../api/api';
import { motion } from 'framer-motion';
import { Container, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaStore, FaSave } from 'react-icons/fa';

const Profile = () => {
    const { user, setUser } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        username: '',
        phone_number: '',
        address: '',
        user_type: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                username: user.username || '',
                phone_number: user.phone_number || '',
                address: user.address || '',
                user_type: user.user_type || ''
            });
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setIsLoading(true);

        try {
            const response = await updateUser(formData);
            setUser(response.data);
            setSuccess('Profile updated successfully!');
        } catch (err) {
            console.error(err);
            let errorMessage = 'Failed to update profile.';
            if (err.response?.data) {
                const data = err.response.data;
                if (typeof data === 'string') {
                    errorMessage = data;
                } else if (data.error) {
                    errorMessage = data.error;
                } else if (data.detail) {
                    errorMessage = data.detail;
                } else {
                    // Collect all field errors
                    const errors = [];
                    for (const key in data) {
                        if (Array.isArray(data[key])) {
                            errors.push(...data[key]);
                        } else if (typeof data[key] === 'string') {
                            errors.push(data[key]);
                        }
                    }
                    errorMessage = errors.join(', ');
                }
            }
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    if (!user) {
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
            className="bg-light min-vh-100 py-5"
        >
            <Container className="col-md-8 col-lg-6 col-xl-5">
                <Card className="shadow-lg border-0 rounded-4 overflow-hidden">
                    <Card.Header className="bg-warning text-white p-4">
                        <div className="d-flex align-items-center gap-3">
                            <FaUser size={24} />
                            <h2 className="mb-0">Profile Settings</h2>
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
                                <Alert variant="success" className="rounded-3">
                                    {success}
                                </Alert>
                            </motion.div>
                        )}

                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3">
                                <Form.Label className="d-flex align-items-center gap-2 text-muted">
                                    <FaUser /> Full Name
                                </Form.Label>
                                <Form.Control
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="John Doe"
                                    className="py-2"
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label className="d-flex align-items-center gap-2 text-muted">
                                    <FaEnvelope /> Email Address
                                </Form.Label>
                                <Form.Control
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="your@email.com"
                                    className="py-2"
                                    disabled
                                />
                                <Form.Text className="text-muted">
                                    Email cannot be changed
                                </Form.Text>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label className="d-flex align-items-center gap-2 text-muted">
                                    <FaStore /> Account Type
                                </Form.Label>
                                <Form.Control
                                    type="text"
                                    value={formData.user_type === 'customer' ? 'Customer' : 'Shop Owner'}
                                    className="py-2"
                                    disabled
                                />
                                <Form.Text className="text-muted">
                                    Account type cannot be changed
                                </Form.Text>
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

                            <Form.Group className="mb-4">
                                <Form.Label className="d-flex align-items-center gap-2 text-muted">
                                    <FaMapMarkerAlt /> Address
                                </Form.Label>
                                <Form.Control
                                    as="textarea"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    placeholder="123 Main St, City"
                                    className="py-2"
                                    rows={3}
                                />
                            </Form.Group>

                            <Button
                                variant="warning"
                                type="submit"
                                disabled={isLoading}
                                className="w-100 py-3 fw-bold text-white"
                            >
                                {isLoading ? (
                                    <>
                                        <Spinner animation="border" size="sm" className="me-2" />
                                        Saving Changes...
                                    </>
                                ) : (
                                    <>
                                        <FaSave className="me-2" />
                                        Save Changes
                                    </>
                                )}
                            </Button>
                        </Form>
                    </Card.Body>
                </Card>
            </Container>
        </motion.div>
    );
};

export default Profile; 