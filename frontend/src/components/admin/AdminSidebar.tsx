import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, Users, UserCog, FileText, 
  Stethoscope, Pill, Bed, CreditCard, 
  Building2, CalendarClock, LogOut, HeartPulse 
} from 'lucide-react';

export const AdminSidebar: React.FC = () => {
  const { user, logout } = useAuth();

  const menuItems = [
    { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard', roles: ['ADMIN', 'DOKTER', 'PERAWAT'] },
    { path: '/admin/pasien', icon: Users, label: 'Data Pasien', roles: ['ADMIN', 'DOKTER', 'PERAWAT'] },
    { path: '/admin/pegawai', icon: UserCog, label: 'Pegawai', roles: ['ADMIN'] },
    { path: '/admin/pendaftaran', icon: FileText, label: 'Pendaftaran', roles: ['ADMIN', 'PERAWAT'] },
    { path: '/admin/pemeriksaan', icon: Stethoscope, label: 'Pemeriksaan', roles: ['ADMIN', 'DOKTER', 'PERAWAT'] },
    { path: '/admin/obat', icon: Pill, label: 'Obat', roles: ['ADMIN', 'PERAWAT'] },
    { path: '/admin/kamar', icon: Bed, label: 'Kamar', roles: ['ADMIN', 'PERAWAT'] },
    { path: '/admin/pembayaran', icon: CreditCard, label: 'Pembayaran', roles: ['ADMIN'] },
    { path: '/admin/fasilitas', icon: Building2, label: 'Fasilitas', roles: ['ADMIN'] },
    { path: '/admin/jadwal-dokter', icon: CalendarClock, label: 'Jadwal Dokter', roles: ['ADMIN', 'DOKTER'] },
  ];

  const filteredMenu = menuItems.filter(item => 
    !user || item.roles.includes(user.role)
  );

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen fixed left-0 top-0 z-40">
      {/* Header */}
      <div className="h-16 bg-blue-600 flex items-center px-6 shrink-0">
        <HeartPulse className="w-8 h-8 text-white mr-3" />
        <span className="font-bold text-lg text-white">RS Kelompok 2</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {filteredMenu.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 border-l-4 border-transparent'
                }`
              }
            >
              <Icon className="w-5 h-5 mr-3 shrink-0" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer / User Profile */}
      <div className="border-t border-gray-200 p-4 shrink-0 bg-gray-50">
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold mr-3 shrink-0">
            {user?.nama.substring(0, 2).toUpperCase() || 'AD'}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-bold text-gray-900 truncate">{user?.nama}</p>
            <p className="text-xs text-gray-500 truncate">{user?.role}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </button>
      </div>
    </div>
  );
};
