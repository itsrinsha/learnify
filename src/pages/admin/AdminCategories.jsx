import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  BookOpen,
  Calendar,
  Layers
} from 'lucide-react';
import StatusBadge from '../../components/admin/StatusBadge';

const categoriesData = [
  { id: 1, name: 'Web Development', description: 'HTML, CSS, JS, React, and Backend technologies.', courses: 245, status: 'Active', created: '2024-01-10' },
  { id: 2, name: 'Data Science', description: 'Python, R, Machine Learning, and Data Analysis.', courses: 182, status: 'Active', created: '2024-01-12' },
  { id: 3, name: 'UI/UX Design', description: 'User Experience, Interface Design, and Prototyping.', courses: 156, status: 'Active', created: '2024-01-15' },
  { id: 4, name: 'Business & Finance', description: 'Marketing, Finance, and Entrepreneurship.', courses: 98, status: 'Active', created: '2024-02-05' },
  { id: 5, name: 'Personal Development', description: 'Soft skills, productivity, and life coaching.', courses: 64, status: 'Inactive', created: '2024-02-20' },
];

const AdminCategories = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Category Management</h2>
          <p className="text-slate-500">Organize and manage course categories on the platform.</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 rounded-xl text-sm font-bold text-white hover:bg-blue-700 transition-all shadow-lg shadow-blue-900/20">
          <Plus className="w-5 h-5" /> Add New Category
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-4">
        <div className="flex-1 w-full relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input 
            type="text" 
            placeholder="Search categories..." 
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-transparent focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-xl text-sm transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select className="w-full md:w-auto bg-slate-50 border-none text-sm font-medium text-slate-600 rounded-xl focus:ring-0 px-4 py-2.5">
          <option>All Status</option>
          <option>Active</option>
          <option>Inactive</option>
        </select>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categoriesData.map((category) => (
          <div key={category.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all group">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Layers className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={category.status} />
                  <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                    <MoreVertical className="w-5 h-5 text-slate-400" />
                  </button>
                </div>
              </div>

              <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">{category.name}</h3>
              <p className="text-sm text-slate-500 line-clamp-2 mb-6 h-10">{category.description}</p>

              <div className="flex items-center gap-4 py-4 border-y border-slate-50">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-slate-400" />
                  <span className="text-sm font-bold text-slate-700">{category.courses} <span className="text-slate-400 font-medium">Courses</span></span>
                </div>
                <div className="flex items-center gap-2 border-l border-slate-100 pl-4">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span className="text-xs text-slate-500">{category.created}</span>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50/50 flex items-center justify-end gap-3 border-t border-slate-100">
              <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="Edit">
                <Edit2 className="w-4 h-4" />
              </button>
              <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" title="Delete">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminCategories;
