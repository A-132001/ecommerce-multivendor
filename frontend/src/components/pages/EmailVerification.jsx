import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { verifyEmail } from '../../api/api';

const EmailVerification = () => {
    const { uid, token } = useParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState('verifying');
    const [error, setError] = useState('');

    useEffect(() => {
        const verifyUserEmail = async () => {
            try {
                // Make sure uid is properly formatted for base64 decoding
                const formattedUid = uid.replace(/-/g, '+').replace(/_/g, '/');
                const response = await verifyEmail(formattedUid, token);
                setStatus('success');
                setTimeout(() => {
                    navigate('/login', { 
                        state: { message: 'Email verified successfully! You can now log in.' }
                    });
                }, 3000);
            } catch (err) {
                console.error('Verification error:', err);
                setStatus('error');
                setError(err.response?.data?.error || 'Failed to verify email. Please try again.');
            }
        };

        if (uid && token) {
            verifyUserEmail();
        } else {
            setStatus('error');
            setError('Invalid verification link');
        }
    }, [uid, token, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Email Verification
                    </h2>
                </div>
                <div className="mt-8 space-y-6">
                    {status === 'verifying' && (
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                            <p className="mt-4 text-gray-600">Verifying your email...</p>
                        </div>
                    )}
                    {status === 'success' && (
                        <div className="text-center text-green-600">
                            <p>Email verified successfully!</p>
                            <p className="mt-2">Redirecting to login page...</p>
                        </div>
                    )}
                    {status === 'error' && (
                        <div className="text-center text-red-600">
                            <p>{error}</p>
                            <button
                                onClick={() => navigate('/login')}
                                className="mt-4 text-indigo-600 hover:text-indigo-500"
                            >
                                Return to Login
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EmailVerification; 