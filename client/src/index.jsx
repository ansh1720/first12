import React from 'react';
import ReactDOM from 'react-dom/client';
import './i18n';
import './index.css';
import App from './App';
import 'leaflet/dist/leaflet.css';
import * as serviceWorkerRegistration from './serviceWorkerRegistration'; // ✅

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// ✅ Change unregister() to register()
serviceWorkerRegistration.register();
