import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css'

import '@fortawesome/fontawesome-free/css/all.min.css'

import './main.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId="739013148958-rduugjmic8o3ghov6hhvoscc1sjb6sgn.apps.googleusercontent.com">
    <App />
  </GoogleOAuthProvider>
)
