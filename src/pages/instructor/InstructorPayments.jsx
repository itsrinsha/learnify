import React from 'react';
import { 
  CreditCard, 
  Search, 
  Filter, 
  Download, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  ArrowUpRight,
  ChevronRight,
  TrendingUp,
  Wallet
} from 'lucide-react';

const InstructorPayments = () => {
  const payments = [
    { id: 1, student: 'Alice Johnson', course: 'Advanced React 19', amount: '₹1,999', fee: '₹399', earning: '₹1,600', date: 'May 02, 2026', status: 'Released' },
    { id: 2, student: 'Bob Smith', course: 'Node.js Microservices', amount: '₹2,499', fee: '₹499', earning: '₹2,000', date: 'May 01, 2026', status: 'Pending' },
    { id: 3, student: 'Charlie Brown', course: 'Advanced React 19', amount: '₹1,999', fee: '₹399', earning: '₹1,600', date: 'Apr 30, 2026', status: 'Released' },
    { id: 4, student: 'David Miller', course: 'UI/UX Fundamentals', amount: '₹999', fee: '₹199', earning: '₹800', date: 'Apr 28, 2026', status: 'On Hold' },
    { id: 5, student: 'Eva Green', course: 'Node.js Microservices', amount: '₹2,499', fee: '₹499', earning: '₹2,000', date: 'Apr 25, 2026', status: 'Released' },
  ];

  return (
    <div className="space-y-10 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Payment History</h2>
          <p className="text-slate-500 mt-1 font-medium">Track your course sales and payout status in real-time.</p>
        </div>
        <button className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold text-sm shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all flex items-center gap-3 active:scale-95">
          <Download size={20} />
          Export Statements
        </button>
      </div>

      {/* Payout Mechanism Card */}
      <div className="bg-slate-900 rounded-[3rem] p-10 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600 rounded-full -mr-32 -mt-32 opacity-30 blur-3xl"></div>
        <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
              <Wallet size={16} className="text-blue-400" />
              <span className="text-[10px] font-black uppercase tracking-widest">Payout Wallet</span>
            </div>
            <h3 className="text-3xl font-black leading-tight">Payment Flow & Policy</h3>
            <p className="text-slate-400 text-sm leading-relaxed max-w-md font-medium">
              Funds from student purchases are held by the platform for 14 days to accommodate possible refund requests. 
              After the holding period, payouts are automatically released to your registered account every Friday.
            </p>
            <div className="flex items-center gap-6 pt-2">
              <div className="flex items-center gap-2 text-xs font-bold text-green-400">
                <CheckCircle2 size={16} /> Verified Account
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-blue-400">
                <Clock size={16} /> Next Payout: May 08
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
             <div className="bg-white/5 backdrop-blur-md p-8 rounded-[2rem] border border-white/10 space-y-2">
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Available for Payout</p>
                <h4 className="text-3xl font-black text-white">₹12,400</h4>
                <div className="flex items-center gap-1 text-[10px] font-black text-green-400 uppercase tracking-widest pt-2">
                  <TrendingUp size={12} /> +12% this week
                </div>
             </div>
             <div className="bg-white/5 backdrop-blur-md p-8 rounded-[2rem] border border-white/10 space-y-2">
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Holding Period</p>
                <h4 className="text-3xl font-black text-white">₹4,200</h4>
                <div className="flex items-center gap-1 text-[10px] font-black text-yellow-400 uppercase tracking-widest pt-2">
                  <Clock size={12} /> 4 orders pending
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4 bg-white p-4 rounded-[2rem] border border-slate-200 shadow-sm">
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400">
            <Search size={18} />
          </span>
          <input
            type="text"
            placeholder="Search by student or transaction ID..."
            className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>
        <div className="flex gap-4">
          <select className="px-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-600 outline-none focus:ring-2 focus:ring-blue-500 transition-all">
            <option>All Payout Status</option>
            <option>Released</option>
            <option>Pending</option>
            <option>On Hold</option>
          </select>
          <button className="p-4 bg-slate-100 text-slate-500 rounded-2xl hover:bg-slate-200 transition-all">
            <Filter size={20} />
          </button>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Transaction Details</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Student</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Purchase Amount</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Platform Fee (20%)</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Your Earning</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Payout Status</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {payments.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-6">
                    <p className="text-sm font-black text-slate-900">{row.course}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{row.date}</p>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500 font-bold text-xs">
                        {row.student.charAt(0)}
                      </div>
                      <p className="text-xs font-bold text-slate-600">{row.student}</p>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-sm font-black text-slate-900">{row.amount}</p>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-sm font-bold text-red-500">-{row.fee}</p>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-sm font-black text-green-600">{row.earning}</p>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                      row.status === 'Released' ? 'bg-green-50 text-green-600' : 
                      row.status === 'Pending' ? 'bg-yellow-50 text-yellow-600' : 'bg-red-50 text-red-600'
                    }`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button className="p-2 text-slate-300 hover:text-blue-600 transition-colors">
                      <ArrowUpRight size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InstructorPayments;
