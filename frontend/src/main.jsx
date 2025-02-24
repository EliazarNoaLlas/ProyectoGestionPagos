import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';  // Importante para los estilos de Tailwind

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);