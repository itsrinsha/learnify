import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  CheckCircle, 
  XCircle, 
  Eye, 
  Play, 
  Clock, 
  BookOpen,
  User,
  Tag
} from 'lucide-react';
import StatusBadge from '../../components/admin/StatusBadge';

const coursesData = [
  { 
    id: 1, 
    title: 'Advanced React Architecture', 
    instructor: 'Mark Thompson', 
    category: 'Development',
    price: '$89.99',
    lessons: 42,
    submittedDate: '2024-05-01',
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=250&fit=crop',
    status: 'Pending'
  },
  { 
    id: 2, 
    title: 'Mastering Figma for UI/UX', 
    instructor: 'Elena Rodriguez', 
    category: 'Design',
    price: '$59.99',
    lessons: 28,
    submittedDate: '2024-05-02',
    thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=250&fit=crop',
    status: 'Pending'
  },
  { 
    id: 3, 
    title: 'Complete Python Bootcamp', 
    instructor: 'Dr. Sarah Jenkins', 
    category: 'Development',
    price: '$74.99',
    lessons: 115,
    submittedDate: '2024-04-28',
    thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=250&fit=crop',
    status: 'Approved'
  },
];

const AdminCourseApproval = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Course Approvals</h2>
          <p className="text-slate-500">Review and approve courses submitted by instructors.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center gap-4">
        <div className="flex-1 min-w-[240px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input 
            type="text" 
            placeholder="Search courses or instructors..." 
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border-transparent focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-xl text-sm transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select className="bg-slate-50 border-none text-sm font-medium text-slate-600 rounded-xl focus:ring-0 px-4 py-2">
            <option>All Categories</option>
            <option>Development</option>
            <option>Design</option>
            <option>Business</option>
          </select>
        </div>
        <select className="bg-slate-50 border-none text-sm font-medium text-slate-600 rounded-xl focus:ring-0 px-4 py-2">
          <option>Status: Pending</option>
          <option>Status: Approved</option>
          <option>Status: Rejected</option>
        </select>
      </div>

      {/* Courses List */}
      <div className="space-y-4">
       
      </div>
    </div>
  );
};

export default AdminCourseApproval;
