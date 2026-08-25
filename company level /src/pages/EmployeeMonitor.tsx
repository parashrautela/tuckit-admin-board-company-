import React, { useState } from 'react';
import { Activity, MapPin, Clock, Smartphone, Battery, ShieldAlert } from 'lucide-react';

interface EmployeeShift {
  id: string;
  name: string;
  region: string;
  checkInTime: string;
  lastPing: string;
  batteryLevel: number;
  currentKiosk: string;
  status: 'ACTIVE_ON_DUTY' | 'IDLE' | 'OFF_SHIFT';
}

const initialShifts: EmployeeShift[] = [
  { id: 'EMP-101', name: 'Ramesh Verma', region: 'Bengaluru Central', checkInTime: '08:30 AM', lastPing: '2 mins ago', batteryLevel: 88, currentKiosk: 'MALL-BLR-01 (Nexus Mall)', status: 'ACTIVE_ON_DUTY' },
  { id: 'EMP-102', name: 'Vikas Dubey', region: 'Delhi Metro Blue Line', checkInTime: '09:00 AM', lastPing: 'Just now', batteryLevel: 94, currentKiosk: 'METRO-DEL-02 (Rajiv Chowk)', status: 'ACTIVE_ON_DUTY' },
  { id: 'EMP-103', name: 'Pooja Hegde', region: 'Mumbai Airport', checkInTime: '07:45 AM', lastPing: '5 mins ago', batteryLevel: 42, currentKiosk: 'AIRP-BOM-01 (T2 Arrivals)', status: 'ACTIVE_ON_DUTY' },
  { id: 'EMP-104', name: 'Karthik Raja', region: 'Chennai Central', checkInTime: '10:15 AM', lastPing: '12 mins ago', batteryLevel: 65, currentKiosk: 'RAIL-CHE-01 (Platform 1)', status: 'IDLE' },
  { id: 'EMP-105', name: 'Sunil Mehta', region: 'Hyderabad HiTech', checkInTime: '—', lastPing: 'Yesterday', batteryLevel: 0, currentKiosk: '—', status: 'OFF_SHIFT' },
];

export const EmployeeMonitor: React.FC = () => {
  const [shifts] = useState<EmployeeShift[]>(initialShifts);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 flex items-center gap-2">
              <Activity className="size-6 text-primary-600" /> Real-time Field Employee Monitor
            </h1>
            <span className="px-2.5 py-0.5 bg-emerald-600 text-white text-xs font-bold rounded-full">
              LIVE RADAR
            </span>
          </div>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">Live tracking of active ground field personnel, battery telemetry, and kiosk check-ins</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {shifts.map(s => (
          <div key={s.id} className="bg-white rounded-2xl border border-zinc-200 shadow-2xs p-5 hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold font-mono text-zinc-500 uppercase">{s.id}</span>
              <span
                className={`px-2.5 py-0.5 text-xs font-bold rounded-full ${
                  s.status === 'ACTIVE_ON_DUTY'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                    : s.status === 'IDLE'
                    ? 'bg-amber-50 text-amber-700 border border-amber-200/60'
                    : 'bg-zinc-100 text-zinc-600'
                }`}
              >
                {s.status.replace(/_/g, ' ')}
              </span>
            </div>

            <div className="mt-3">
              <h3 className="text-base font-bold text-zinc-900">{s.name}</h3>
              <p className="text-xs text-primary-700 font-semibold mt-0.5">{s.region}</p>
            </div>

            <div className="mt-4 p-3.5 bg-zinc-50 rounded-xl border border-zinc-100 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-zinc-600 font-medium flex items-center gap-1.5"><Clock className="size-4 text-zinc-400" /> Check In:</span>
                <span className="font-mono font-bold text-zinc-800 text-xs">{s.checkInTime}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-600 font-medium flex items-center gap-1.5"><Smartphone className="size-4 text-zinc-400" /> App Ping:</span>
                <span className="font-bold text-emerald-700 text-xs">{s.lastPing}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-600 font-medium flex items-center gap-1.5"><Battery className="size-4 text-zinc-400" /> Device Battery:</span>
                <span className={`font-mono font-bold text-xs ${s.batteryLevel > 50 ? 'text-emerald-700' : s.batteryLevel > 20 ? 'text-amber-700' : 'text-rose-600'}`}>
                  {s.batteryLevel}%
                </span>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-zinc-100 flex items-center gap-1.5 text-xs text-zinc-700 font-medium truncate">
              <MapPin className="size-4 text-primary-600 shrink-0" />
              <span className="truncate">{s.currentKiosk}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
