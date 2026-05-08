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
  Bell
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
    { name: 'My Profile', icon: <UserIcon size={20} />, path: '/instructor/profile' },
    { name: 'My Courses', icon: <BookOpen size={20} />, path: '/instructor/courses' },
    { name: 'Add Course', icon: <PlusCircle size={20} />, path: '/instructor/add-course' },
    { name: 'Students', icon: <Users size={20} />, path: '/instructor/students' },
    { name: 'Reviews / Schedules', icon: <FileText size={20} />, path: '/instructor/reviews' },
    { name: 'Live Classes', icon: <Video size={20} />, path: '/instructor/live-classes' },
    { name: 'Messages', icon: <MessageSquare size={20} />, path: '/instructor/messages' },
    { name: 'Attendance', icon: <ClipboardCheck size={20} />, path: '/instructor/attendance' },
    { name: 'Offers', icon: <Tag size={20} />, path: '/instructor/offers' },
    { name: 'Payments', icon: <CreditCard size={20} />, path: '/instructor/payments' },
    { name: 'Earnings', icon: <BarChart3 size={20} />, path: '/instructor/earnings' },
  ];

  const getPageTitle = () => {
    const item = menuItems.find(item => item.path === location.pathname || location.pathname.startsWith(item.path));
    return item ? item.name : 'Instructor Panel';
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/instructor/login');
  };

  const DefaultAvatar = () => (
    <div className="w-full h-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
      <UserIcon size={20} />
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 flex items-center gap-2 border-b border-slate-50">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <BookOpen className="text-white" size={24} />
            </div>
            <span className="text-2xl font-bold tracking-tight text-slate-900">Learnify</span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto custom-scrollbar">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  location.pathname === item.path
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-100'
                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {item.icon}
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-slate-100">
            <button 
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 transition-all"
            >
              <LogOut size={20} />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="h-20 bg-white border-b border-slate-200 sticky top-0 z-40 px-4 md:px-10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              className="md:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-xl"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">{getPageTitle()}</h1>
          </div>

          <div className="flex items-center gap-4 md:gap-8">
            {/* Search */}
            <div className="relative hidden lg:block w-72">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400">
                <Search size={18} />
              </span>
              <input
                type="text"
                placeholder="Search students, courses..."
                className="w-full pl-12 pr-4 py-3 bg-slate-100 border-none rounded-2xl text-sm focus:ring-2 focus:ring-blue-500 transition-all outline-none"
              />
            </div>

            {/* Notifications */}
            <button className="p-2.5 text-slate-500 hover:bg-slate-100 rounded-2xl relative border border-slate-100 transition-all">
              <Bell size={22} />
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </button>

            {/* Instructor Profile */}
            <div className="flex items-center gap-4 pl-6 border-l border-slate-200">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-black text-slate-900 leading-none">{user?.name || 'Instructor'}</p>
                <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mt-1">
                  {user?.approvalStatus === 'approved' ? 'Verified Instructor' : 'Pending Approval'}
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 font-bold border-2 border-white shadow-md overflow-hidden cursor-pointer hover:scale-105 transition-all">
                {user?.profileImage ? (
                  <img src={user.profileImage} alt="profile" className="w-full h-full object-cover" />
                ) : (
                  <DefaultAvatar />
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="p-4 md:p-10 max-w-[1600px] mx-auto w-full">
          <Outlet />
        </main>
      </div>

      {/* Overlay for mobile sidebar */}
      {!isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsSidebarOpen(true)}
        ></div>
      )}
    </div>
  );
};

export default InstructorLayout;
