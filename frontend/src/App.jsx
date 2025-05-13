// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navigation from './components/Navbar';
import Footer from './components/Footer';
import StorePage from './pages/StorePage';
import DashboardPage from './pages/DashboardPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import Products from './pages/Products';
import ProductManagementTable from './pages/ProductManagementTable';
import EmailVerification from './components/pages/EmailVerification';
import ResetPassword from './components/pages/ResetPassword';
import Profile from './components/pages/Profile';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './components/pages/Home';
import Login from './components/pages/Login';
import Register from './components/pages/Register';
import Store from './components/pages/Store';
import ListStores from './components/pages/listStores';
import NewVendor from './pages/NewVendor';
import CartPage from './pages/CartPage'; 

function App() {
  const publicRoutes = [
    { path: '/', element: <Home /> },
    { path: '/login', element: <Login /> },
    { path: '/register', element: <Register /> },
    { path: '/verify-email', element: <EmailVerification /> },
    { path: '/verify-email/:uid/:token', element: <EmailVerification /> },
    { path: '/reset-password', element: <ResetPassword /> },
    { path: '/api/auth/verify-email/:uid/:token', element: <EmailVerification /> },
    { path: '/api/auth/reset-password/:uid/:token', element: <ResetPassword /> },
  ];

  const protectedRoutes = [
    { path: '/profile', element: <Profile /> },
    { path: '/new-vendor', element: <NewVendor /> },
    { path: '/list-stores', element: <ListStores /> },
    { path: '/store', element: <Store /> },
    { path: '/store/:store_id', element: <StorePage /> },
    { path: '/dashboard', element: <DashboardPage /> },
    { path: '/products', element: <Products /> },
    { path: '/product-management', element: <ProductManagementTable /> },
    { path: '/product/:product_id', element: <ProductDetailsPage /> },
    { path: '/cart', element: <CartPage /> }, // Add cart route
  ];

  return (
    <Router>
      <AuthProvider>
        <Navigation />
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
        <Footer />
      </AuthProvider>
    </Router>
  );
}

export default App;