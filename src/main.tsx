import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { StoreSettingsProvider } from './context/StoreSettingsContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <StoreSettingsProvider>
      <App />
    </StoreSettingsProvider>
  </React.StrictMode>
);

// Register Progressive Web App Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((reg) => {
        console.log('SBA Silver PWA Service Worker registered:', reg.scope);
      })
      .catch((err) => {
        console.warn('Service Worker registration error:', err);
      });
  });
}

