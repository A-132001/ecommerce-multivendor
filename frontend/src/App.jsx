import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navigation from './components/Navbar';
import Footer from './components/Footer';
import StorePage from './pages/StorePage';
import DashboardPage from './pages/DashboardPage';
import AuthForm from './components/AuthForm';
import ProductDetailsPage from './pages/ProductDetailsPage';
import Products from './pages/Products';
import ProductManagementTable from './pages/ProductManagementTable';
import EmailVerification from './components/pages/EmailVerification';
import ResetPassword from './components/pages/ResetPassword';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './components/pages/Home';
import Login from './components/pages/Login';
import Register from './components/pages/Register';
import Store from './components/pages/Store';

function App() {
  const [count, setCount] = useState(0);

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
    { path: "/store/:store_id", element: <StorePage /> },
    { path: "/dashboard", element: <DashboardPage /> },
    { path: "/products", element: <Products /> },
    { path: "/product-management", element: <ProductManagementTable /> },
    { path: "/", element: <Navigate to="/login" replace /> },
    { path: "/product/:product_id", element: <ProductDetailsPage /> },

  ];

  return (
    <Router>
      <AuthProvider>
          <div className="min-h-screen bg-gray-50">
            <Navigation />
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
      </AuthProvider>
      <Footer />
    </Router>
  )
}

export default App;
