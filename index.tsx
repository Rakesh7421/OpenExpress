

import React from 'react';
import ReactDOM from 'react-dom/client';
// FIX: Ensure App is correctly imported as a module. Assuming a build process might output .js, but sticking to .tsx should be correct with a proper setup. The error was likely due to App.tsx being empty. With content, the original import is correct.
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);