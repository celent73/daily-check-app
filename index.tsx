
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// @ts-ignore
if (window.logToScreen) window.logToScreen('Index.tsx executing...');

const rootElement = document.getElementById('root');
if (!rootElement) {
  // @ts-ignore
  if (window.logToScreen) window.logToScreen('ERROR: Root not found');
  throw new Error("Could not find root element to mount to");
}

// @ts-ignore
if (window.logToScreen) window.logToScreen('Root element found. Creating React Root...');

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// @ts-ignore
if (window.logToScreen) window.logToScreen('Render called.');
