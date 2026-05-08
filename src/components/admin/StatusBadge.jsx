import React from 'react';

const StatusBadge = ({ status }) => {
  const styles = {
    // Account/User Status
    active: 'bg-green-100 text-green-700 border-green-200',
    blocked: 'bg-red-100 text-red-700 border-red-200',
    pending: 'bg-amber-100 text-amber-700 border-amber-200',
    
    // Course Status
    approved: 'bg-blue-100 text-blue-700 border-blue-200',
    rejected: 'bg-red-100 text-red-700 border-red-200',
    
    // Payment/Payout Status
    released: 'bg-green-100 text-green-700 border-green-200',
    on_hold: 'bg-amber-100 text-amber-700 border-amber-200',
    
    // Live Class Status
    live: 'bg-rose-100 text-rose-700 border-rose-200 animate-pulse',
    scheduled: 'bg-blue-100 text-blue-700 border-blue-200',
    completed: 'bg-slate-100 text-slate-700 border-slate-200',
    cancelled: 'bg-red-100 text-red-700 border-red-200',
  };

  const normalizedStatus = status.toLowerCase().replace(' ', '_');
  const styleClass = styles[normalizedStatus] || 'bg-slate-100 text-slate-700 border-slate-200';

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${styleClass} whitespace-nowrap`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

export default StatusBadge;
