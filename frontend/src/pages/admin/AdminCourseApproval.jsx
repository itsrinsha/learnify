import React, { useState, useEffect } from 'react';
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
  Tag,
  Loader2
} from 'lucide-react';
import StatusBadge from '../../components/admin/StatusBadge';
import adminService from '../../services/adminService';
import { toast } from 'react-hot-toast';

const AdminCourseApproval = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const data = await adminService.getAllCourses();
      setCourses(data);
    } catch (error) {
      console.error('Failed to fetch courses', error);
      toast.error('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await adminService.updateCourseStatus(id, status);
      toast.success(`Course ${status}`);
      setCourses(courses.map(c => c._id === id ? { ...c, approvalStatus: status } : c));
    } catch (error) {
      toast.error('Failed to update course status');
    }
  };

  const filteredCourses = courses.filter(course => 
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.instructor?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
        <p className="mt-4 text-slate-500 font-medium">Loading courses for approval...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Course Approvals</h2>
          <p className="text-slate-500">Review and approve courses submitted by instructors.</p>
        </div>
      </div>

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
      </div>

      <div className="space-y-4">
        {filteredCourses.map((course) => (
          <div key={course._id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col md:flex-row items-stretch group hover:border-blue-200 transition-colors">
            <div className="md:w-64 lg:w-72 shrink-0 relative overflow-hidden bg-slate-100">
              <img 
                src={course.thumbnail || 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=250&fit=crop'} 
                alt={course.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-4 left-4">
                <StatusBadge status={course.approvalStatus || 'Pending'} />
              </div>
            </div>

            <div className="flex-1 p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider mb-2">
                  <Tag className="w-3 h-3" /> {course.category || 'General'}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">{course.title}</h3>
                <div className="flex flex-wrap items-center gap-y-2 gap-x-6">
                  <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                    <User className="w-4 h-4 text-slate-400" /> {course.instructor?.name || 'Unknown'}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                    <BookOpen className="w-4 h-4 text-slate-400" /> {course.modules?.length || 0} Modules
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                    <Clock className="w-4 h-4 text-slate-400" /> Submitted on {new Date(course.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 border-t border-slate-100">
                <div className="text-2xl font-bold text-slate-900">₹{course.price}</div>
                <div className="flex items-center gap-3">
                  <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-200 transition-colors">
                    <Eye className="w-4 h-4" /> View Details
                  </button>
                  {(course.approvalStatus === 'pending' || !course.approvalStatus) && (
                    <>
                      <button 
                        onClick={() => handleStatusUpdate(course._id, 'rejected')}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 rounded-xl text-sm font-bold text-red-600 hover:bg-red-100 transition-colors border border-red-100"
                      >
                        <XCircle className="w-4 h-4" /> Reject
                      </button>
                      <button 
                        onClick={() => handleStatusUpdate(course._id, 'approved')}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 rounded-xl text-sm font-bold text-white hover:bg-green-700 transition-all shadow-lg shadow-green-900/20"
                      >
                        <CheckCircle className="w-4 h-4" /> Approve
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
        {filteredCourses.length === 0 && (
          <div className="py-20 text-center text-slate-400 font-medium bg-white rounded-2xl border border-dashed border-slate-200">
            No courses pending approval.
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCourseApproval;
