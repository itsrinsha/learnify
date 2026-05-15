import React from 'react';
import { 
  Search, 
  Bell, 
  Menu, 
  X, 
  Settings, 
  Globe,
  User,
  ShoppingBag
} from 'lucide-react';

const AdminNavbar = ({ toggleSidebar, isSidebarOpen, title }) => {
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleSidebar}
          className="p-2 rounded-md hover:bg-slate-50 lg:hidden text-slate-500"
        >
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        <h1 className="text-lg font-semibold text-slate-900">
          {title || 'Dashboard'}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative hidden lg:block w-80">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
            <Search size={16} />
          </span>
          <input
            type="text"
            placeholder="Search platform..."
            className="w-full pl-10 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded text-sm focus:ring-1 focus:ring-primary-500 focus:bg-white outline-none transition-all"
          />
        </div>

        <div className="flex items-center gap-2">
          <button className="p-2 text-slate-500 hover:bg-slate-50 rounded-md relative">
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary-600 rounded-full border-2 border-white"></span>
          </button>
          <button className="p-2 text-slate-500 hover:bg-slate-50 rounded-md">
            <Settings size={20} />
          </button>
        </div>

        {/* User Profile */}
        <div className="h-8 w-px bg-slate-200 mx-1 hidden sm:block"></div>
        <div className="flex items-center gap-2 group cursor-pointer">
          <div className="w-8 h-8 rounded bg-primary-100 flex items-center justify-center text-primary-700 overflow-hidden group-hover:ring-2 group-hover:ring-primary-500 transition-all">
            <img 
              src="https://ui-avatars.com/api/?name=Admin+User&background=2563eb&color=fff" 
              alt="Admin" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="hidden sm:block text-right">
            <p className="text-xs font-semibold text-slate-900 group-hover:text-primary-600 transition-colors leading-none">Admin</p>
            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter mt-1">Super Admin</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminNavbar;
