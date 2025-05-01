// src/pages/Routes/AppRoutes.jsx
import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LoginPage from '../auth/LoginPage';
import Debug from '../Debug';
// ... rest of your imports


import ProtectedRoute from '../../components/auth/ProtectedRoute';

import MainLayout from '../../layouts/MainLayout';

// Admin pages
import AdminDashboard from '../admin/Dashboard';
import AdminTrainings from '../admin/Trainings';
import AdminGroups from '../admin/Groups';
import AdminLearners from '../admin/Learners';
import AdminAttendance from '../admin/Attendance';
import AdminPayments from '../admin/Payments';
import AdminNotifications from '../admin/Notifications';
import SignupPage from '../auth/Signup';

// Trainer pages
import TrainerDashboard from '../trainer/Dashboard';
import TrainerGroups from '../trainer/Groups';
import TrainerAttendance from '../trainer/Attendance';



// Debug component
/*const DebugAuthState = () => {
  const { isAuthenticated, user, isLoading } = useAuth();

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Auth Debug Info</h1>
      <pre className="bg-gray-100 p-4 rounded">
        {JSON.stringify({ isAuthenticated, user, isLoading }, null, 2)}
      </pre>
      <div className="mt-4">
        <button
          className="bg-red-500 text-white px-4 py-2 rounded mr-2"
          onClick={() => {
            localStorage.removeItem('tweadup_user');
            window.location.href = '/login';
          }}
        >
          Force Logout
        </button>
      </div>
    </div>
  );
};

const AuthRedirect = () => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const location = useLocation();

  console.log("AuthRedirect - Current path:", location.pathname);
  console.log("AuthRedirect - Auth State:", { isAuthenticated, user, isLoading });

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading authentication...</div>;
  }

  if (!isAuthenticated) {
    console.log("Not authenticated, redirecting to login");
    return <Navigate to="/login" replace />;
  }

  if (user?.role === 'ADMIN') {
    console.log("Admin user, redirecting to admin");
    return <Navigate to="/admin" replace />;
  }

  console.log("Trainer user, redirecting to trainer");
  return <Navigate to="/trainer" replace />;
};*/

const AppRoutes = () => {
  const location = useLocation();

  useEffect(() => {
    console.log("Current route:", location.pathname);
  }, [location]);

  return (
    <Routes>
      {/* Debug route - accessible without auth */}
      <Route path="/debug" element={<Debug />} />

      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />

      {/* Route that checks authentication and redirects accordingly */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route path="/signup" element={<SignupPage />} />

      {/* Admin routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRole="ADMIN">
            <MainLayout userRole="ADMIN">
              <Outlet />
            </MainLayout>
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="trainings" element={<AdminTrainings />} />
        <Route path="groups" element={<AdminGroups />} />
        <Route path="learners" element={<AdminLearners />} />
        <Route path="attendance" element={<AdminAttendance />} />
        <Route path="payments" element={<AdminPayments />} />
        <Route path="notifications" element={<AdminNotifications />} />
      </Route>

      {/* Trainer routes */}
      <Route
        path="/trainer"
        element={
          <ProtectedRoute allowedRole="TRAINER">
            <MainLayout userRole="TRAINER">
              <Outlet />
            </MainLayout>
          </ProtectedRoute>
        }
      >
        <Route index element={<TrainerDashboard />} />
        <Route path="groups" element={<TrainerGroups />} />
        <Route path="attendance" element={<TrainerAttendance />} />
      </Route>

      {/* Catch all other routes */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;