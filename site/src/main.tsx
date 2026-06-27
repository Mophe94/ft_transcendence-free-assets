import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './main.css';
import App from './App.tsx';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider.tsx';
import { ThemeProvider } from './context/ThemeProvider.tsx';

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
  <AuthProvider>
    <ThemeProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </AuthProvider>,
  /* </StrictMode> */
);
