import React from 'react';
import { Building2 } from 'lucide-react';

export const FutureFirst: React.FC = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-xl font-black text-zinc-900 flex items-center gap-2"><Building2 className="h-5 w-5 text-primary" /> Future First Locker Management</h1>
      <p className="text-xs text-zinc-500 mt-1">Partner locker stations with advanced reservation capabilities</p>
    </div>
    <div className="bg-white rounded-2xl border border-zinc-200 shadow-2xs p-12 text-center">
      <Building2 className="h-12 w-12 text-zinc-300 mx-auto mb-4" />
      <h3 className="text-sm font-bold text-zinc-700">Future First Module</h3>
      <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">Dedicated partner locker management for Future First installations. Contact engineering team for module activation and configuration.</p>
    </div>
  </div>
);
