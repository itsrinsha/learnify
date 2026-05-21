import React, { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  LayoutDashboard, 
  User as UserIcon, 
  BookOpen, 
  PlusCircle, 
  Users, 
  FileText, 
  Video, 
  MessageSquare, 
  ClipboardCheck, 
  Tag, 
  CreditCard, 
  BarChart3, 
  LogOut,
  Menu,
  X,
  Search,
  Bell,
  Award
} from 'lucide-react';
import { logout } from '../../features/auth/authSlice';

const InstructorLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/instructor/dashboard' },
    { name: 'My Courses', icon: <BookOpen size={20} />, path: '/instructor/courses' },
    { name: 'Exams', icon: <Award size={20} />, path: '/instructor/exams' },
    { name: 'Live Classes', icon: <Video size={20} />, path: '/instructor/live-classes' },
    { name: 'Students', icon: <Users size={20} />, path: '/instructor/students' },
    { name: 'Reviews', icon: <FileText size={20} />, path: '/instructor/reviews' },
    { name: 'Earnings', icon: <BarChart3 size={20} />, path: '/instructor/earnings' },
    { name: 'Messages', icon: <MessageSquare size={20} />, path: '/instructor/messages' },
    { name: 'Verification', icon: <ClipboardCheck size={20} />, path: '/instructor/verify' },
    { name: 'Profile', icon: <UserIcon size={20} />, path: '/instructor/profile' },
  ];

  const getPageTitle = () => {
    const item = menuItems.find(item => item.path === location.pathname || (item.path !== '/instructor/dashboard' && location.pathname.startsWith(item.path)));
    return item ? item.name : 'Instructor Panel';
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/instructor/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="h-16 flex items-center px-6 border-b border-slate-100">
            <Link to="/instructor/dashboard" className="flex items-center gap-2">
              <div className="bg-primary-600 p-1.5 rounded">
                <BookOpen className="text-white" size={20} />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900 uppercase">Learnify</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 py-6 space-y-1">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path || (item.path !== '/instructor/dashboard' && location.pathname.startsWith(item.path));
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`sidebar-link ${isActive ? 'sidebar-link-active' : ''}`}
                >
                  {item.icon}
                  <span className="text-sm font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Profile Summary in Sidebar */}
          <div className="p-4 border-t border-slate-100">
            <div className="flex items-center gap-3 p-2">
              <div className="w-9 h-9 rounded bg-slate-100 flex items-center justify-center text-slate-500 overflow-hidden shrink-0">
                {user?.profileImage ? (
                  <img src={user.profileImage} alt="profile" className="w-full h-full object-cover" />
                ) : (
                  <UserIcon size={18} />
                )}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-slate-900 truncate">{user?.name || 'Instructor'}</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider">{user?.role || 'Instructor'}</p>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="mt-2 flex items-center gap-3 w-full px-4 py-2.5 rounded-md text-sm font-medium text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-4">
            <button 
              className="md:hidden p-2 text-slate-500 hover:bg-slate-50 rounded-md"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <h1 className="text-lg font-semibold text-slate-900">{getPageTitle()}</h1>
          </div>

          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="relative hidden lg:block w-80">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                <Search size={16} />
              </span>
              <input
                type="text"
                placeholder="Search students, courses..."
                className="w-full pl-10 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded text-sm focus:ring-1 focus:ring-primary-500 focus:bg-white outline-none transition-all"
              />
            </div>

            <div className="flex items-center gap-2">
              <button className="p-2 text-slate-500 hover:bg-slate-50 rounded-md relative">
                <Bell size={20} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary-600 rounded-full border-2 border-white"></span>
              </button>
            </div>

            {/* User Profile */}
            <div className="h-8 w-px bg-slate-200 mx-1 hidden sm:block"></div>
            <Link to="/instructor/profile" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded bg-primary-100 flex items-center justify-center text-primary-700 overflow-hidden group-hover:ring-2 group-hover:ring-primary-500 transition-all">
                {user?.profileImage ? (
                  <img src={user.profileImage} alt="profile" className="w-full h-full object-cover" />
                ) : (
                  <UserIcon size={16} />
                )}
              </div>
              <div className="hidden sm:block">
                <p className="text-xs font-semibold text-slate-900 group-hover:text-primary-600 transition-colors">{user?.name}</p>
                <p className="text-[10px] text-primary-600 font-bold uppercase tracking-tighter">
                  {user?.approvalStatus === 'approved' ? 'Verified' : 'Pending'}
                </p>
              </div>
            </Link>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-6 bg-[#f8fafc]">
          <div className="max-w-[1600px] mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default InstructorLayout;
