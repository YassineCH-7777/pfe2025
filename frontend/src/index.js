import React from 'react';
import ReactDOM from 'react-dom/client'; // Utilisez 'react-dom/client' pour React 18
import App from './App';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root')); // Créez un root avec React 18
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);