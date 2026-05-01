import React from 'react';
import { Outlet } from 'react-router-dom';
import { AdminSidebar } from './AdminSidebar';

export const AdminLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
