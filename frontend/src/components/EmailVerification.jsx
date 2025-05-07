// frontend/src/components/EmailVerification.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { verifyEmail } from '../api/api';

const EmailVerification = () => {
    const { uid, token } = useParams();
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const verify = async () => {
            try {
                await verifyEmail(uid, token);
                setMessage('Email verified successfully! You can now login.');
                setTimeout(() => navigate('/login'), 3000);
            } catch (err) {
                setError(err.response?.data?.error || 'Verification failed');
            }
        };
        verify();
    }, [uid, token, navigate]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full mx-auto space-y-8 bg-white p-8 rounded-xl shadow-2xl">
                <h2 className="text-center text-3xl font-extrabold text-gray-900">
                    Email Verification
                </h2>
                {message && (
                    <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-md">
                        <p className="text-sm text-green-700">{message}</p>
                    </div>
                )}
                {error && (
                    <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
                        <p className="text-sm text-red-700">{error}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EmailVerification;