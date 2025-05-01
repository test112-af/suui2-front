// src/layouts/MainLayout.tsx
import React, { ReactNode } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface MainLayoutProps {
  userRole: 'ADMIN' | 'TRAINER';
  children: ReactNode; // Add this missing type definition
}

const MainLayout: React.FC<MainLayoutProps> = ({ userRole, children }) => {
  const { user, logout } = useAuth();

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md flex flex-col h-full">
        <div className="p-4">
          <h2 className="text-xl font-bold">TweadUp</h2>
          <p className="text-gray-500">{userRole.charAt(0).toUpperCase() + userRole.slice(1).toLowerCase()} Panel</p>
        </div>
        <div className="p-4 border-t">
          <p className="text-sm text-gray-600">Logged in as:</p>
          <p className="font-medium">{user?.name}</p>
        </div>
        <nav className="mt-4 flex-1">
          {/* Navigation links specific to role */}
          {userRole === 'ADMIN' && (
            <div>
              <a href="/admin" className="block px-4 py-2 hover:bg-gray-100">Dashboard</a>
              <a href="/admin/trainings" className="block px-4 py-2 hover:bg-gray-100">Trainings</a>
              <a href="/admin/groups" className="block px-4 py-2 hover:bg-gray-100">Groups</a>
              <a href="/admin/learners" className="block px-4 py-2 hover:bg-gray-100">Learners</a>
              <a href="/admin/attendance" className="block px-4 py-2 hover:bg-gray-100">Attendance</a>
              <a href="/admin/payments" className="block px-4 py-2 hover:bg-gray-100">Payments</a>
              <a href="/admin/notifications" className="block px-4 py-2 hover:bg-gray-100">Notifications</a>
            </div>
          )}
          {userRole === 'TRAINER' && (
            <div>
              <a href="/trainer" className="block px-4 py-2 hover:bg-gray-100">Dashboard</a>
              <a href="/trainer/groups" className="block px-4 py-2 hover:bg-gray-100">Groups</a>
              <a href="/trainer/attendance" className="block px-4 py-2 hover:bg-gray-100">Attendance</a>
            </div>
          )}
        </nav>
        <div className="p-4 border-t">
          <button
            onClick={logout}
            className="w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 overflow-auto p-6">
        {children}
      </div>
    </div>
  );
};

export default MainLayout;