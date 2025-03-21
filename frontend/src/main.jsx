import React from 'react';
import { createRoot } from 'react-dom/client';
// import { ThemeProvider } from '@material-tailwind/react';
import './index.css';
import App from './App';

const root = createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    {/* <ThemeProvider> */}
      <App />
    {/* </ThemeProvider> */}
  </React.StrictMode>
);