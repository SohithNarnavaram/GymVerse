import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

// Initialize MSW in development
async function enableMocking() {
  if (import.meta.env.MODE !== 'development') {
    return Promise.resolve();
  }

  try {
    const { worker } = await import('./mocks/browser');
    return worker.start({
      onUnhandledRequest: 'bypass',
    });
  } catch (error) {
    console.warn('MSW initialization failed, continuing without mocks:', error);
    return Promise.resolve();
  }
}

// Render app immediately, MSW will start in background
const root = ReactDOM.createRoot(document.getElementById('root')!);

// Enable dark mode by default
document.documentElement.classList.add('dark');

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

// Start MSW in background (non-blocking)
enableMocking().catch(console.error);

