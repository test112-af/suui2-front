// src/App.tsx
import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import AppRoutes from './pages/Routes/AppRoutes';

const App: React.FC = () => {
  useEffect(() => {
    // Debug information
    console.log("App initialized");
    console.log("LocalStorage content:", localStorage.getItem('tweadup_user'));
    
    // Uncomment this line to force logout on app start (for testing)
     localStorage.removeItem('tweadup_user');
  }, []);

  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;