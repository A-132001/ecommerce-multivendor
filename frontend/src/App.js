import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';

// Pages
import Home from './components/pages/Home';
import Login from './components/pages/Login';
import Register from './components/pages/Register';
import EmailVerification from './components/pages/EmailVerification';
import ResetPassword from './components/pages/ResetPassword';
import Store from './components/pages/Store';

// Public routes
const publicRoutes = [
    { path: '/', element: <Home /> },
    { path: '/login', element: <Login /> },
    { path: '/register', element: <Register /> },
    { path: '/verify-email/:uid/:token', element: <EmailVerification /> },
    { path: '/reset-password', element: <ResetPassword /> },
];

// Protected routes
const protectedRoutes = [
    { path: '/store', element: <Store /> },
];

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="min-h-screen bg-gray-50">
                    <Navbar />
                    <main className="container mx-auto px-4 py-8">
                        <Routes>
                            {publicRoutes.map(({ path, element }) => (
                                <Route key={path} path={path} element={element} />
                            ))}
                            {protectedRoutes.map(({ path, element }) => (
                                <Route
                                    key={path}
                                    path={path}
                                    element={<ProtectedRoute>{element}</ProtectedRoute>}
                                />
                            ))}
                            <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
                    </main>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;
