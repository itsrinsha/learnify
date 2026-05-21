import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Clock, 
  LogOut,
  Mail,
  RefreshCcw,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { logout, fetchProfile } from '../../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';

const InstructorPendingApproval = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading } = useSelector((state) => state.auth);

  const handleRefresh = () => {
    dispatch(fetchProfile());
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/instructor/login');
  };

  if (user?.approvalStatus === 'approved') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-[3rem] p-12 max-w-2xl w-full text-center shadow-xl border border-slate-100">
          <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 size={48} />
          </div>
          <h1 className="text-3xl font-black text-slate-900 mb-4">Account Approved!</h1>
          <p className="text-slate-500 mb-10 text-lg">Congratulations! Your instructor account has been approved. You can now start creating courses and sharing your knowledge.</p>
          <button 
            onClick={() => navigate('/instructor/dashboard')}
            className="px-10 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 flex items-center gap-2 mx-auto"
          >
            Go to Instructor Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (user?.approvalStatus === 'rejected') {
    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-[3rem] p-12 max-w-2xl w-full text-center shadow-xl border border-slate-100">
            <div className="w-24 h-24 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-8">
              <AlertCircle size={48} />
            </div>
            <h1 className="text-3xl font-black text-slate-900 mb-4">Application Rejected</h1>
            <p className="text-slate-500 mb-10 text-lg">Unfortunately, your application was not approved at this time. You can review your details and resubmit for verification.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                onClick={() => navigate('/instructor/verify')}
                className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-100"
                >
                Update & Resubmit
                </button>
                <button 
                onClick={handleLogout}
                className="px-8 py-4 bg-white border border-slate-200 text-slate-600 rounded-2xl font-bold hover:bg-slate-50 transition-all"
                >
                Logout
                </button>
            </div>
          </div>
        </div>
      );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-3xl w-full">
        {/* Main Card */}
        <div className="bg-white rounded-[3rem] overflow-hidden shadow-2xl border border-slate-100 relative">
          {/* Top Decoration */}
          <div className="h-4 bg-blue-600 w-full"></div>
          
          <div className="p-10 md:p-16">
            <div className="flex flex-col items-center text-center space-y-8">
              {/* Animated Icon Container */}
              <div className="relative">
                <div className="absolute inset-0 bg-blue-100 rounded-full scale-150 blur-2xl opacity-50 animate-pulse"></div>
                <div className="w-24 h-24 bg-blue-600 text-white rounded-[2rem] flex items-center justify-center relative z-10 rotate-3">
                  <Clock size={48} className="animate-spin-slow" style={{ animationDuration: '8s' }} />
                </div>
              </div>

              <div className="space-y-4">
                <h1 className="text-4xl font-black text-slate-900 tracking-tight">Application Submitted!</h1>
                <p className="text-slate-500 text-lg max-w-lg mx-auto leading-relaxed">
                  Thanks for submitting your details. After admin approval, you can start your work.
                </p>
              </div>

              {/* Status Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-xl py-8">
                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex items-start gap-4 text-left">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-sm shrink-0">
                    <Clock size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">Wait Time</h3>
                    <p className="text-sm text-slate-500">Usually 24-48 hours</p>
                  </div>
                </div>
                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex items-start gap-4 text-left">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-sm shrink-0">
                    <Mail size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">Email Update</h3>
                    <p className="text-sm text-slate-500">We'll notify you via email</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 w-full justify-center pt-4">
                <button 
                  onClick={handleRefresh}
                  disabled={loading}
                  className="flex-1 max-w-[200px] py-4 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all active:scale-95 disabled:opacity-50"
                >
                  <RefreshCcw size={18} className={loading ? 'animate-spin' : ''} />
                  Check Status
                </button>
                <button 
                  onClick={handleLogout}
                  className="flex-1 max-w-[200px] py-4 bg-white border border-slate-200 text-slate-600 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-50 transition-all active:scale-95"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <p className="text-center text-slate-400 text-sm mt-8">
          Need help? Contact our support at <span className="text-blue-600 font-bold">support@learnify.com</span>
        </p>
      </div>
    </div>
  );
};

export default InstructorPendingApproval;
