import React from 'react';
import { NavLink, Link } from 'react-router-dom';
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
  Clock,
  BookOpen
} from 'lucide-react';

const AdminSidebar = ({ isOpen, toggleSidebar }) => {
  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: Users, label: 'Students', path: '/admin/students' },
    { icon: GraduationCap, label: 'Instructors', path: '/admin/instructors' },
    { icon: CheckCircle, label: 'Courses Approval', path: '/admin/course-approval' },
    { icon: Layers, label: 'Categories', path: '/admin/categories' },
    { icon: CreditCard, label: 'Payments', path: '/admin/payments' },
    { icon: BarChart3, label: 'Reports', path: '/admin/reports' },
    { icon: UserCircle, label: 'Profile', path: '/admin/profile' },
  ];

  return (
    <aside 
      className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="h-16 flex items-center px-6 border-b border-slate-100">
        <Link to="/admin/dashboard" className="flex items-center gap-2">
          <div className="bg-primary-600 p-1.5 rounded">
            <BookOpen className="text-white" size={20} />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900 uppercase">Learnify</span>
        </Link>
      </div>

      <nav className="flex-1 py-6 space-y-1 overflow-y-auto custom-scrollbar">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={() => window.innerWidth < 1024 && toggleSidebar()}
            className={({ isActive }) => `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`}
          >
            <div className="flex items-center gap-3">
              <item.icon className="w-5 h-5" />
              <span className="text-sm font-medium">{item.label}</span>
            </div>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-100">
        <button className="flex items-center gap-3 w-full px-4 py-2.5 rounded-md text-sm font-medium text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors">
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
