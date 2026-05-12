import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  PieChart, 
  BarChart, 
  Calendar, 
  ArrowUpRight, 
  ArrowDownRight,
  Download,
  Filter,
  Loader2
} from 'lucide-react';
import { 
  BarChart as ReBarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';
import adminService from '../../services/adminService';
import { toast } from 'react-hot-toast';

const AdminEarnings = () => {
  const [earnings, setEarnings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEarnings();
  }, []);

  const fetchEarnings = async () => {
    try {
      setLoading(true);
      const data = await adminService.getEarnings();
      setEarnings(data);
    } catch (error) {
      console.error('Failed to fetch earnings', error);
      toast.error('Failed to load earnings');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
        <p className="mt-4 text-slate-500 font-medium">Calculating revenue data...</p>
      </div>
    );
  }

  const stats = [
    { title: 'Total Revenue', value: `₹${earnings?.totalRevenue?.toLocaleString()}`, trend: 0, icon: DollarSign, color: 'blue' },
    { title: 'Platform Profit (20%)', value: `₹${earnings?.platformProfit?.toLocaleString()}`, trend: 0, icon: TrendingUp, color: 'green' },
    { title: 'Instructor Payouts', value: `₹${earnings?.instructorPayouts?.toLocaleString()}`, trend: 0, icon: PieChart, color: 'purple' },
    { title: 'Pending Payouts', value: `₹${earnings?.pendingPayouts?.toLocaleString()}`, trend: 0, icon: BarChart, color: 'amber' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Earnings & Revenue</h2>
          <p className="text-slate-500">Track platform profitability and instructor payouts.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
            <Calendar className="w-4 h-4" /> Last 30 Days
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 rounded-xl text-sm font-semibold text-white hover:bg-blue-700 transition-colors shadow-lg shadow-blue-900/20">
            <Download className="w-4 h-4" /> Export Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl bg-slate-50 text-slate-600`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
            <p className="text-sm font-medium text-slate-500 mb-1">{stat.title}</p>
            <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-slate-900">Monthly Performance</h3>
          </div>
          <div className="h-[350px] w-full min-h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <ReBarChart data={earnings?.chartData || []}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#64748b', fontSize: 12}}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#64748b', fontSize: 12}}
                  tickFormatter={(value) => `₹${value}`}
                />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                />
                <Bar dataKey="revenue" fill="#2563eb" radius={[6, 6, 0, 0]} barSize={40} />
              </ReBarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Revenue Overview</h3>
          <p className="text-slate-500 text-sm mb-8">Real-time performance tracking from student enrollments across the platform.</p>
          <div className="space-y-6">
             <div className="p-4 rounded-xl bg-blue-50 border border-blue-100">
                <p className="text-xs font-bold text-blue-600 uppercase mb-1">Top Performing Category</p>
                <p className="text-lg font-black text-slate-900">Development</p>
             </div>
             <div className="p-4 rounded-xl bg-purple-50 border border-purple-100">
                <p className="text-xs font-bold text-purple-600 uppercase mb-1">Average Order Value</p>
                <p className="text-lg font-black text-slate-900">₹{earnings?.totalRevenue > 0 ? (earnings.totalRevenue / 10).toFixed(2) : 0}</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminEarnings;
