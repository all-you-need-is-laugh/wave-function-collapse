import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Log build version or local development
if (import.meta.env.MODE === 'production') {
  console.log(`Build version: ${String(import.meta.env.VITE_COMMIT_HASH)}`);
} else {
  console.log('Build version: local development');
}

const root = document.getElementById('root');
if (!root) {
  throw new Error('Root element not found');
}

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
