import React from 'react';
import { 
  Search, 
  Bell, 
  Menu, 
  X, 
  Settings, 
  Globe,
  User
} from 'lucide-react';

const AdminNavbar = ({ toggleSidebar, isSidebarOpen, title }) => {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm h-16 flex items-center justify-between px-4 lg:px-8">
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleSidebar}
          className="p-2 rounded-lg hover:bg-slate-100 lg:hidden text-slate-600"
        >
          {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
        <h1 className="text-xl font-semibold text-slate-900 hidden sm:block">
          {title || 'Dashboard'}
        </h1>
      </div>

      <div className="flex-1 max-w-md mx-8 hidden md:block">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors w-4 h-4" />
          <input 
            type="text" 
            placeholder="Search anything..." 
            className="w-full bg-slate-100 border-transparent focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-xl py-2 pl-10 pr-4 text-sm transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <button className="p-2 rounded-full hover:bg-slate-100 text-slate-600 relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 border-2 border-white rounded-full"></span>
        </button>
        
        <button className="p-2 rounded-full hover:bg-slate-100 text-slate-600 hidden sm:flex">
          <Globe className="w-5 h-5" />
        </button>

        <div className="h-8 w-px bg-slate-200 mx-2 hidden sm:block"></div>

        <div className="flex items-center gap-3 pl-2 cursor-pointer group">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">Admin User</p>
            <p className="text-xs text-slate-500">Super Admin</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-100 border-2 border-blue-200 flex items-center justify-center text-blue-600 font-bold overflow-hidden">
            <img 
              src="https://ui-avatars.com/api/?name=Admin+User&background=2563eb&color=fff" 
              alt="Admin" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminNavbar;
