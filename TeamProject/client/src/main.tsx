// client/src/main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { AuthProvider } from './context/AuthContext.tsx';
import { BrowserRouter } from 'react-router-dom'; // 👈 Import BrowserRouter

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* BrowserRouter MUST wrap components using Router features (Link, useNavigate, etc.) */}
    <BrowserRouter>  {/* 👈 Wrap here */}
      {/* AuthProvider can be inside or outside BrowserRouter, usually inside is fine */}
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter> {/* 👈 Wrap here */}
  </React.StrictMode>,
)