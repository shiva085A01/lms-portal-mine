import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { AppRoutes } from './routes/AppRoutes.jsx';
import { AIAssistantWidget } from './components/common/AIAssistantWidget.jsx';
import './index.css';
import { Toaster } from 'react-hot-toast';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <AppRoutes />
          <AIAssistantWidget />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'rgba(24, 21, 19, 0.95)',
                backdropFilter: 'blur(16px)',
                color: '#f5efe6',
                border: '1px solid rgba(217, 93, 57, 0.25)',
                boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.45)',
                borderRadius: '0.85rem',
                fontSize: '0.875rem',
              },
            }}
          />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
