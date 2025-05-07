import React, { useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { requestPasswordReset, resetPassword } from '../../api/api';

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

    const handleRequestReset = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setIsLoading(true);

        try {
            await requestPasswordReset(email);
            setSuccess('Password reset instructions have been sent to your email.');
            setEmail('');
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to send reset instructions');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

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
            setSuccess('Password has been reset successfully');
            setTimeout(() => navigate('/login'), 3000);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to reset password');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        {isResetForm ? 'Reset Your Password' : 'Forgot Your Password?'}
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        {isResetForm 
                            ? 'Enter your new password below'
                            : 'Enter your email address and we will send you instructions to reset your password.'
                        }
                    </p>
                </div>

                {error && (
                    <div className="rounded-md bg-red-50 p-4">
                        <div className="text-sm text-red-700">{error}</div>
                    </div>
                )}

                {success && (
                    <div className="rounded-md bg-green-50 p-4">
                        <div className="text-sm text-green-700">{success}</div>
                    </div>
                )}

                <form className="mt-8 space-y-6" onSubmit={isResetForm ? handleResetPassword : handleRequestReset}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        {!isResetForm ? (
                            <div>
                                <label htmlFor="email" className="sr-only">Email address</label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                    placeholder="Email address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        ) : (
                            <>
                                <div className="mb-4">
                                    <label htmlFor="new-password" className="sr-only">New Password</label>
                                    <input
                                        id="new-password"
                                        name="new-password"
                                        type="password"
                                        required
                                        className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                        placeholder="New password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="confirm-password" className="sr-only">Confirm Password</label>
                                    <input
                                        id="confirm-password"
                                        name="confirm-password"
                                        type="password"
                                        required
                                        className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                        placeholder="Confirm new password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    />
                                </div>
                            </>
                        )}
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                        >
                            {isLoading ? 'Processing...' : (isResetForm ? 'Reset Password' : 'Send Reset Instructions')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword; 