import React from 'react';
import { useRealtime } from '../context/RealtimeContext';
import { BarChart3, TrendingUp, Calendar, Download } from 'lucide-react';

export const Reports: React.FC = () => {
  const { bookings, terminals } = useRealtime();
  const totalRevenue = bookings.reduce((s, b) => s + b.amount + (b.extraCharges || 0), 0);
  const avgBookingValue = bookings.length > 0 ? Math.round(totalRevenue / bookings.length) : 0;

  const stateRevenue = bookings.reduce<Record<string, number>>((acc, b) => {
    acc[b.state] = (acc[b.state] || 0) + b.amount;
    return acc;
  }, {});
  const topStates = Object.entries(stateRevenue).sort((a, b) => b[1] - a[1]).slice(0, 8);
  const maxRev = topStates.length > 0 ? topStates[0][1] : 1;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-zinc-900 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" /> Report Analysis
          </h1>
          <p className="text-xs text-zinc-500 mt-1">Revenue trends, utilization metrics, and operational insights</p>
        </div>
        <button className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg">
          <Download className="h-3.5 w-3.5" /> Export Report
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-2xs">
          <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Total Revenue</div>
          <div className="text-2xl font-black text-zinc-900 mt-1">₹{totalRevenue.toLocaleString()}</div>
          <div className="text-[11px] text-emerald-600 font-semibold">↑ +22% vs last period</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-2xs">
          <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Avg Booking Value</div>
          <div className="text-2xl font-black text-primary mt-1">₹{avgBookingValue}</div>
          <div className="text-[11px] text-zinc-500">Per transaction</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-2xs">
          <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Utilization Rate</div>
          <div className="text-2xl font-black text-zinc-900 mt-1">67%</div>
          <div className="text-[11px] text-zinc-500">Avg locker occupancy</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-2xs">
          <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Peak Hour</div>
          <div className="text-2xl font-black text-zinc-900 mt-1">11 AM</div>
          <div className="text-[11px] text-zinc-500">Highest daily check-ins</div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-zinc-200 shadow-2xs p-6">
        <h3 className="text-sm font-bold text-zinc-900 mb-4">Revenue by State</h3>
        <div className="space-y-3">
          {topStates.map(([state, rev]) => (
            <div key={state} className="flex items-center gap-3">
              <span className="text-xs font-semibold text-zinc-700 w-32 truncate">{state}</span>
              <div className="flex-1 h-5 bg-zinc-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-primary to-amber-400 rounded-full transition-all" style={{ width: `${(rev / maxRev) * 100}%` }} />
              </div>
              <span className="text-xs font-bold text-zinc-900 w-20 text-right">₹{rev.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
