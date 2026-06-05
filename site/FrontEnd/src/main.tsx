import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from './context/ThemeProvider.tsx'
import { AuthProvider } from './context/AuthProvider.tsx'
import App from './App.tsx'
import './main.css'
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')!).render(
 <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
 </StrictMode>
)
