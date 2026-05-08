import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  GraduationCap, 
  CheckCircle, 
  Layers, 
  Tag, 
  Video, 
  CreditCard, 
  TrendingUp, 
  UserX, 
  BarChart3, 
  UserCircle, 
  LogOut,
  ChevronRight,
  Clock
} from 'lucide-react';

const AdminSidebar = ({ isOpen, toggleSidebar }) => {
  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: Users, label: 'Students', path: '/admin/students' },
    { icon: GraduationCap, label: 'Instructors', path: '/admin/instructors' },
    { icon: CheckCircle, label: 'Course Approval', path: '/admin/course-approval' },
    { icon: Layers, label: 'Categories', path: '/admin/categories' },
    { icon: Tag, label: 'Offers', path: '/admin/offers' },
    { icon: Video, label: 'Live Classes', path: '/admin/live-classes' },
    { icon: Clock, label: 'Availability', path: '/admin/availability' },
    { icon: CreditCard, label: 'Payments', path: '/admin/payments' },
    { icon: TrendingUp, label: 'Earnings', path: '/admin/earnings' },
    { icon: UserX, label: 'User Blocks', path: '/admin/user-blocks' },
    { icon: BarChart3, label: 'Reports', path: '/admin/reports' },
    { icon: UserCircle, label: 'Admin Profile', path: '/admin/profile' },
  ];

  return (
    <aside 
      className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-slate-300 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="flex items-center justify-between h-20 px-6 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <GraduationCap className="text-white w-5 h-5" />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">Learnify<span className="text-blue-500">.</span></span>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto max-h-[calc(100vh-160px)] custom-scrollbar">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={() => window.innerWidth < 1024 && toggleSidebar()}
            className={({ isActive }) => `
              flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-200 group
              ${isActive 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
                : 'hover:bg-slate-800 hover:text-white'}
            `}
          >
            <div className="flex items-center gap-3">
              <item.icon className={`w-5 h-5 ${isOpen ? 'opacity-100' : ''}`} />
              <span className="font-medium">{item.label}</span>
            </div>
            <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-50 transition-opacity" />
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button className="flex items-center gap-3 w-full px-3 py-2.5 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors duration-200">
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
