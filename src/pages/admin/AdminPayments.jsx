import React from 'react';
import { 
  Search, 
  Download, 
  Filter, 
  CreditCard, 
  ArrowUpRight, 
  ArrowDownRight,
  MoreHorizontal
} from 'lucide-react';
import StatusBadge from '../../components/admin/StatusBadge';

const payments = [
  { id: 'TXN-78451', student: 'Alex Johnson', instructor: 'Mark Thompson', course: 'React Masterclass', amount: 89.99, commission: 17.99, instructorEarning: 72.00, method: 'Stripe', date: '2024-05-02', status: 'Success' },
  { id: 'TXN-78450', student: 'Maria Garcia', instructor: 'Elena Rodriguez', course: 'UI Design', amount: 59.99, commission: 11.99, instructorEarning: 48.00, method: 'PayPal', date: '2024-05-02', status: 'Success' },
  { id: 'TXN-78449', student: 'David Lee', instructor: 'Dr. Sarah Jenkins', course: 'Python Basics', amount: 49.99, commission: 9.99, instructorEarning: 40.00, method: 'Stripe', date: '2024-05-01', status: 'Pending' },
  { id: 'TXN-78448', student: 'Emma Wilson', instructor: 'Michael Chen', course: 'AWS Certified', amount: 129.99, commission: 25.99, instructorEarning: 104.00, method: 'Razorpay', date: '2024-05-01', status: 'Success' },
];

const AdminPayments = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Payment Transactions</h2>
          <p className="text-slate-500">Monitor all course purchases and platform revenue transactions.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
          <Download className="w-4 h-4" /> Download Statement
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-sm font-medium text-slate-500 mb-1">Gross Revenue (Today)</p>
          <div className="flex items-center gap-3">
            <h3 className="text-2xl font-bold text-slate-900">$1,245.50</h3>
            <span className="flex items-center text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-lg">
              <ArrowUpRight className="w-3 h-3" /> 12%
            </span>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-sm font-medium text-slate-500 mb-1">Admin Commission</p>
          <div className="flex items-center gap-3">
            <h3 className="text-2xl font-bold text-slate-900">$249.10</h3>
            <span className="text-xs font-bold text-slate-400">20% Platform Fee</span>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-sm font-medium text-slate-500 mb-1">Pending Payouts</p>
          <div className="flex items-center gap-3">
            <h3 className="text-2xl font-bold text-slate-900">$12,500.00</h3>
            <span className="flex items-center text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-lg">
              Action Required
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[240px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search transactions, students..." 
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border-transparent focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-xl text-sm transition-all"
            />
          </div>
          <select className="bg-slate-50 border-none text-sm font-medium text-slate-600 rounded-xl focus:ring-0 px-4 py-2">
            <option>Last 30 Days</option>
            <option>Today</option>
            <option>This Week</option>
            <option>Custom Range</option>
          </select>
          <button className="p-2 hover:bg-slate-50 rounded-xl border border-slate-100 text-slate-400">
            <Filter className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Transaction ID</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Details</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Earnings Breakup</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {payments.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                        <CreditCard className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{tx.id}</p>
                        <p className="text-[10px] text-slate-500 uppercase font-bold">{tx.method} • {tx.date}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-bold text-slate-900">{tx.course}</p>
                      <p className="text-xs text-slate-500">By {tx.instructor} • To {tx.student}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-slate-900">${tx.amount}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Admin (20%)</span>
                        <span className="text-xs font-bold text-blue-600">${tx.commission}</span>
                      </div>
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Instructor</span>
                        <span className="text-xs font-bold text-slate-700">${tx.instructorEarning}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={tx.status} />
                  </td>
                  <td className="px-6 py-4">
                    <button className="p-2 hover:bg-slate-100 rounded-lg"><MoreHorizontal className="w-5 h-5 text-slate-400" /></button>
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

export default AdminPayments;
