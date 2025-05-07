import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Render the root React component wrapped in Router for routing
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
