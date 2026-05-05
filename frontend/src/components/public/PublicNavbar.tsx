import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Stethoscope } from 'lucide-react';

export const PublicNavbar: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <Stethoscope className="w-8 h-8 text-blue-600" />
              <span className="font-bold text-xl text-blue-800">RS Kelompok 3</span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <Link 
              to="/" 
              className={`text-sm font-medium transition-colors ${isActive('/') ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
            >
              Beranda
            </Link>
            <Link 
              to="/dokter" 
              className={`text-sm font-medium transition-colors ${isActive('/dokter') ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
            >
              Dokter
            </Link>
            <Link 
              to="/fasilitas" 
              className={`text-sm font-medium transition-colors ${isActive('/fasilitas') ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
            >
              Fasilitas
            </Link>
          </div>

          <div className="flex items-center">
            <Link 
              to="/login"
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-blue-600 bg-white border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
            >
              Login Staff
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};
