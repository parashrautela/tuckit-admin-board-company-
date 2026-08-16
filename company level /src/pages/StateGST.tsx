import React, { useState } from 'react';
import { Landmark, Search, Save, CheckCircle2, ShieldCheck } from 'lucide-react';

interface GSTConfig {
  stateCode: string;
  stateName: string;
  cgst: number;
  sgst: number;
  igst: number;
  status: 'ACTIVE' | 'INACTIVE';
}

const initialGST: GSTConfig[] = [
  { stateCode: '29', stateName: 'Karnataka', cgst: 9, sgst: 9, igst: 18, status: 'ACTIVE' },
  { stateCode: '27', stateName: 'Maharashtra', cgst: 9, sgst: 9, igst: 18, status: 'ACTIVE' },
  { stateCode: '07', stateName: 'Delhi', cgst: 9, sgst: 9, igst: 18, status: 'ACTIVE' },
  { stateCode: '36', stateName: 'Telangana', cgst: 9, sgst: 9, igst: 18, status: 'ACTIVE' },
  { stateCode: '33', stateName: 'Tamil Nadu', cgst: 9, sgst: 9, igst: 18, status: 'ACTIVE' },
  { stateCode: '09', stateName: 'Uttar Pradesh', cgst: 9, sgst: 9, igst: 18, status: 'ACTIVE' },
  { stateCode: '19', stateName: 'West Bengal', cgst: 9, sgst: 9, igst: 18, status: 'ACTIVE' },
  { stateCode: '24', stateName: 'Gujarat', cgst: 9, sgst: 9, igst: 18, status: 'ACTIVE' },
  { stateCode: '08', stateName: 'Rajasthan', cgst: 9, sgst: 9, igst: 18, status: 'ACTIVE' },
  { stateCode: '32', stateName: 'Kerala', cgst: 9, sgst: 9, igst: 18, status: 'ACTIVE' },
];

export const StateGST: React.FC = () => {
  const [gstList, setGstList] = useState<GSTConfig[]>(initialGST);
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState('');

  const toggleStatus = (code: string) => {
    setGstList(prev => prev.map(g => g.stateCode === code ? { ...g, status: g.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' } : g));
    setToast('GST configuration updated successfully.');
    setTimeout(() => setToast(''), 3000);
  };

  const filtered = gstList.filter(g => !search || g.stateName.toLowerCase().includes(search.toLowerCase()) || g.stateCode.includes(search));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-black text-zinc-900 flex items-center gap-2">
            <Landmark className="h-5 w-5 text-primary" /> State GST Tax Rates
          </h1>
          <p className="text-xs text-zinc-500 mt-1">Configure intra-state (CGST+SGST) and inter-state (IGST) taxation rules per regional jurisdiction</p>
        </div>
      </div>

      {toast && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          {toast}
        </div>
      )}

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by state name or GST tin code..."
          className="w-full pl-10 pr-4 h-10 bg-white border border-zinc-200 rounded-xl text-xs font-medium outline-none focus:border-primary"
        />
      </div>

      <div className="bg-white rounded-2xl border border-zinc-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-200 text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                <th className="py-3 px-4">GST CODE</th>
                <th className="py-3 px-4">STATE JURISDICTION</th>
                <th className="py-3 px-4">CGST RATE</th>
                <th className="py-3 px-4">SGST RATE</th>
                <th className="py-3 px-4">IGST RATE</th>
                <th className="py-3 px-4">COMBINED TAX</th>
                <th className="py-3 px-4">STATUS</th>
                <th className="py-3 px-4 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filtered.map(g => (
                <tr key={g.stateCode} className="hover:bg-zinc-50 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-zinc-900">{g.stateCode}</td>
                  <td className="py-3 px-4 font-bold text-zinc-800">{g.stateName}</td>
                  <td className="py-3 px-4 font-mono font-bold text-zinc-700">{g.cgst}%</td>
                  <td className="py-3 px-4 font-mono font-bold text-zinc-700">{g.sgst}%</td>
                  <td className="py-3 px-4 font-mono font-bold text-zinc-700">{g.igst}%</td>
                  <td className="py-3 px-4 font-mono font-black text-primary">{g.cgst + g.sgst}%</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${g.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700' : 'bg-zinc-100 text-zinc-500'}`}>
                      {g.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => toggleStatus(g.stateCode)}
                      className="text-xs font-bold text-primary hover:underline"
                    >
                      {g.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
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
