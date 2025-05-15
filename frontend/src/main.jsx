import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import { GoogleOAuthProvider } from '@react-oauth/google';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './main.css';
import App from './App.jsx';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext.jsx';

createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId="739013148958-bv9lerlkjl3rnlcj6jrtad2s70bnh4u2.apps.googleusercontent.com">
    <AuthProvider>
      <CartProvider>
              <App />
      </CartProvider>
    </AuthProvider>
  </GoogleOAuthProvider>
);
