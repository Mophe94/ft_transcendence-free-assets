import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './main.css';
import App from './App.tsx';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider.tsx';
import { ThemeProvider } from './context/ThemeProvider.tsx';
import { NotificationProvider } from './context/NotifProvider.tsx';
import { LobbySocketProvider } from './context/LobbySocketContext.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();
createRoot(document.getElementById('root')!).render(
  // <StrictMode>
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <NotificationProvider>
        <ThemeProvider>
          <BrowserRouter>
            <LobbySocketProvider>
              <App />
            </LobbySocketProvider>
          </BrowserRouter>
        </ThemeProvider>
      </NotificationProvider>
    </AuthProvider>
  </QueryClientProvider>
  /* </StrictMode> */
);