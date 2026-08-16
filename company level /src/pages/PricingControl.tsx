import React, { useState } from 'react';
import { IndianRupee, Save, Plus, Edit2, CheckCircle2, ShieldAlert } from 'lucide-react';

interface PricingTier {
  id: string;
  venueType: string;
  size: string;
  initialHours: number;
  initialRate: number;
  excessHourlyRate: number;
  maxDailyCap: number;
  status: 'ACTIVE' | 'DRAFT';
}

const initialTiers: PricingTier[] = [
  { id: 'PRC-01', venueType: 'Mall', size: 'SMALL', initialHours: 2, initialRate: 50, excessHourlyRate: 25, maxDailyCap: 250, status: 'ACTIVE' },
  { id: 'PRC-02', venueType: 'Mall', size: 'MEDIUM', initialHours: 2, initialRate: 80, excessHourlyRate: 40, maxDailyCap: 400, status: 'ACTIVE' },
  { id: 'PRC-03', venueType: 'Mall', size: 'LARGE', initialHours: 2, initialRate: 120, excessHourlyRate: 60, maxDailyCap: 600, status: 'ACTIVE' },
  { id: 'PRC-04', venueType: 'Mall', size: 'XL', initialHours: 2, initialRate: 180, excessHourlyRate: 90, maxDailyCap: 900, status: 'ACTIVE' },
  { id: 'PRC-05', venueType: 'Metro', size: 'SMALL', initialHours: 1, initialRate: 30, excessHourlyRate: 20, maxDailyCap: 200, status: 'ACTIVE' },
  { id: 'PRC-06', venueType: 'Metro', size: 'MEDIUM', initialHours: 1, initialRate: 50, excessHourlyRate: 30, maxDailyCap: 300, status: 'ACTIVE' },
  { id: 'PRC-07', venueType: 'Metro', size: 'LARGE', initialHours: 1, initialRate: 80, excessHourlyRate: 50, maxDailyCap: 500, status: 'ACTIVE' },
  { id: 'PRC-08', venueType: 'Railway', size: 'LARGE', initialHours: 3, initialRate: 100, excessHourlyRate: 35, maxDailyCap: 350, status: 'ACTIVE' },
  { id: 'PRC-09', venueType: 'Railway', size: 'XL', initialHours: 3, initialRate: 150, excessHourlyRate: 50, maxDailyCap: 500, status: 'ACTIVE' },
  { id: 'PRC-10', venueType: 'Airport', size: 'LARGE', initialHours: 4, initialRate: 300, excessHourlyRate: 100, maxDailyCap: 1200, status: 'ACTIVE' },
  { id: 'PRC-11', venueType: 'Airport', size: 'XL', initialHours: 4, initialRate: 450, excessHourlyRate: 150, maxDailyCap: 1800, status: 'ACTIVE' },
  { id: 'PRC-12', venueType: 'Campus', size: '2 PHONE', initialHours: 1, initialRate: 20, excessHourlyRate: 10, maxDailyCap: 100, status: 'ACTIVE' },
];

export const PricingControl: React.FC = () => {
  const [tiers, setTiers] = useState<PricingTier[]>(initialTiers);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<PricingTier>>({});
  const [saveSuccess, setSaveSuccess] = useState(false);

  const startEdit = (tier: PricingTier) => {
    setEditingId(tier.id);
    setEditForm({ ...tier });
  };

  const saveEdit = () => {
    if (!editingId) return;
    setTiers(prev => prev.map(t => t.id === editingId ? { ...t, ...editForm } as PricingTier : t));
    setEditingId(null);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-black text-zinc-900 flex items-center gap-2">
            <IndianRupee className="h-5 w-5 text-primary" /> Pricing & Rate Matrix
          </h1>
          <p className="text-xs text-zinc-500 mt-1">Configure venue-specific base rates, excess hour penalties, and 24-hr daily maximum caps</p>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          Pricing rules successfully updated and synchronized to edge terminals!
        </div>
      )}

      <div className="bg-white rounded-2xl border border-zinc-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-200 text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                <th className="py-3 px-4">RULE ID</th>
                <th className="py-3 px-4">VENUE TYPE</th>
                <th className="py-3 px-4">LOCKER SIZE</th>
                <th className="py-3 px-4">BASE WINDOW</th>
                <th className="py-3 px-4">BASE RATE</th>
                <th className="py-3 px-4">EXCESS / HOUR</th>
                <th className="py-3 px-4">MAX DAILY CAP</th>
                <th className="py-3 px-4">STATUS</th>
                <th className="py-3 px-4 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {tiers.map(t => {
                const isEditing = editingId === t.id;
                return (
                  <tr key={t.id} className="hover:bg-zinc-50 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-zinc-900">{t.id}</td>
                    <td className="py-3 px-4 font-bold text-zinc-800">{t.venueType}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 bg-zinc-100 text-zinc-700 rounded-md font-bold text-[10px]">
                        {t.size}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono">
                      {isEditing ? (
                        <input
                          type="number"
                          value={editForm.initialHours || 0}
                          onChange={e => setEditForm(p => ({ ...p, initialHours: Number(e.target.value) }))}
                          className="w-16 p-1 border rounded bg-white text-xs font-mono font-bold"
                        />
                      ) : (
                        `${t.initialHours} Hours`
                      )}
                    </td>
                    <td className="py-3 px-4 font-black text-zinc-900">
                      {isEditing ? (
                        <input
                          type="number"
                          value={editForm.initialRate || 0}
                          onChange={e => setEditForm(p => ({ ...p, initialRate: Number(e.target.value) }))}
                          className="w-20 p-1 border rounded bg-white text-xs font-mono font-bold text-primary"
                        />
                      ) : (
                        `₹${t.initialRate}`
                      )}
                    </td>
                    <td className="py-3 px-4 font-mono text-zinc-700">
                      {isEditing ? (
                        <input
                          type="number"
                          value={editForm.excessHourlyRate || 0}
                          onChange={e => setEditForm(p => ({ ...p, excessHourlyRate: Number(e.target.value) }))}
                          className="w-20 p-1 border rounded bg-white text-xs font-mono font-bold"
                        />
                      ) : (
                        `₹${t.excessHourlyRate} / hr`
                      )}
                    </td>
                    <td className="py-3 px-4 font-black text-emerald-600">
                      {isEditing ? (
                        <input
                          type="number"
                          value={editForm.maxDailyCap || 0}
                          onChange={e => setEditForm(p => ({ ...p, maxDailyCap: Number(e.target.value) }))}
                          className="w-20 p-1 border rounded bg-white text-xs font-mono font-bold text-emerald-600"
                        />
                      ) : (
                        `₹${t.maxDailyCap}`
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-full">
                        {t.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {isEditing ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={saveEdit}
                            className="px-2.5 py-1 bg-primary text-white text-[11px] font-bold rounded-lg hover:bg-orange-600 flex items-center gap-1"
                          >
                            <Save className="h-3 w-3" /> Save
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingId(null)}
                            className="px-2.5 py-1 border border-zinc-200 text-zinc-600 text-[11px] font-bold rounded-lg hover:bg-zinc-100"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => startEdit(t)}
                          className="p-1 text-zinc-400 hover:text-primary rounded-md"
                          title="Edit Pricing Tier"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
