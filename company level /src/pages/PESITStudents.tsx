import React, { useState, useMemo } from 'react';
import { useRealtime } from '../context/RealtimeContext';
import { StatusBadge } from '../components/common/StatusBadge';
import { Modal } from '../components/common/Modal';
import {
  GraduationCap,
  Search,
  Plus,
  Radio,
  UserCheck,
  CheckCircle2,
  Calendar,
  Layers,
  Phone,
  Mail,
  SlidersHorizontal,
} from 'lucide-react';

interface StudentRecord {
  id: string;
  enrollmentNumber: string;
  name: string;
  department: string;
  year: string;
  phone: string;
  email: string;
  rfidCard: string;
  assignedTerminal: string;
  assignedLocker: string;
  status: 'ACTIVE' | 'PENDING_APPROVAL' | 'EXPIRED';
}

const initialStudents: StudentRecord[] = [
  { id: 'STU-01', enrollmentNumber: '1PI20CS042', name: 'Arun Kumar', department: 'Computer Science & Engineering', year: '4th Year', phone: '+91 9845012345', email: 'arun.k@pes.edu', rfidCard: 'RFID-994182', assignedTerminal: 'PESIT-RR-01', assignedLocker: 'LKR-02', status: 'ACTIVE' },
  { id: 'STU-02', enrollmentNumber: '1PI21EC088', name: 'Priya Sharma', department: 'Electronics & Communication', year: '3rd Year', phone: '+91 9711223344', email: 'priya.s@pes.edu', rfidCard: 'RFID-994183', assignedTerminal: 'PESIT-RR-01', assignedLocker: 'LKR-05', status: 'ACTIVE' },
  { id: 'STU-03', enrollmentNumber: '1PI22ME014', name: 'Rohit Verma', department: 'Mechanical Engineering', year: '2nd Year', phone: '+91 9988776655', email: 'rohit.v@pes.edu', rfidCard: 'RFID-994184', assignedTerminal: 'PESIT-EC-01', assignedLocker: 'LKR-01', status: 'PENDING_APPROVAL' },
  { id: 'STU-04', enrollmentNumber: '1PI20IS099', name: 'Sneha Patel', department: 'Information Science & Engineering', year: '4th Year', phone: '+91 9123456780', email: 'sneha.p@pes.edu', rfidCard: 'RFID-994185', assignedTerminal: 'PESIT-RR-02', assignedLocker: 'LKR-08', status: 'ACTIVE' },
  { id: 'STU-05', enrollmentNumber: '1PI23BT007', name: 'Karthik Rao', department: 'Biotechnology', year: '1st Year', phone: '+91 9448011223', email: 'karthik.r@pes.edu', rfidCard: 'RFID-994186', assignedTerminal: 'PESIT-EC-02', assignedLocker: 'LKR-04', status: 'EXPIRED' },
];

export const PESITStudents: React.FC = () => {
  const { showToast } = useRealtime();
  const [students, setStudents] = useState<StudentRecord[]>(initialStudents);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [deptFilter, setDeptFilter] = useState('ALL');
  const [createModal, setCreateModal] = useState(false);

  const [form, setForm] = useState({
    enrollmentNumber: '',
    name: '',
    department: 'Computer Science & Engineering',
    year: '1st Year',
    phone: '',
    email: '',
    rfidCard: '',
    assignedTerminal: 'PESIT-RR-01',
    assignedLocker: 'LKR-01',
  });

  const filtered = useMemo(() => {
    return students.filter(s => {
      if (statusFilter !== 'ALL' && s.status !== statusFilter) return false;
      if (deptFilter !== 'ALL' && s.department !== deptFilter) return false;
      if (
        search &&
        !s.enrollmentNumber.toLowerCase().includes(search.toLowerCase()) &&
        !s.name.toLowerCase().includes(search.toLowerCase()) &&
        !s.rfidCard.toLowerCase().includes(search.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }, [students, search, statusFilter, deptFilter]);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.enrollmentNumber || !form.name) return;

    const newStudent: StudentRecord = {
      id: `STU-${String(students.length + 1).padStart(2, '0')}`,
      ...form,
      status: 'ACTIVE',
    };

    setStudents(prev => [newStudent, ...prev]);
    setCreateModal(false);
    showToast(`Student ${form.name} registered and RFID linked!`, 'success');
    setForm({
      enrollmentNumber: '',
      name: '',
      department: 'Computer Science & Engineering',
      year: '1st Year',
      phone: '',
      email: '',
      rfidCard: '',
      assignedTerminal: 'PESIT-RR-01',
      assignedLocker: 'LKR-01',
    });
  };

  const handleApprove = (id: string) => {
    setStudents(prev => prev.map(s => (s.id === id ? { ...s, status: 'ACTIVE' } : s)));
    showToast('Student locker reservation approved!', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-2xs p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-purple-600 rounded-xl text-white shadow-sm">
            <GraduationCap className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-zinc-900 tracking-tight">Student Management & RFID Directory</h1>
              <span className="px-2 py-0.5 bg-purple-100 text-purple-800 text-[10px] font-black rounded-full uppercase">
                PESIT CAMPUS
              </span>
            </div>
            <p className="text-xs text-zinc-500 mt-0.5">
              Hostel student directory, contactless RFID smart-card bindings, and locker assignments
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setCreateModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm shrink-0"
        >
          <Plus className="h-4 w-4" /> Enroll Student
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-2xs p-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by Roll / Enrollment #, Name, or RFID ID..."
            className="w-full pl-10 pr-4 h-9 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium outline-none focus:bg-white focus:border-primary"
          />
        </div>

        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="h-9 px-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-semibold text-zinc-800"
        >
          <option value="ALL">All Status</option>
          <option value="ACTIVE">Active</option>
          <option value="PENDING_APPROVAL">Pending Approval</option>
          <option value="EXPIRED">Expired</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-200 text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                <th className="py-3 px-4">ROLL / ENROLLMENT #</th>
                <th className="py-3 px-4">STUDENT NAME</th>
                <th className="py-3 px-4">DEPARTMENT / YEAR</th>
                <th className="py-3 px-4">RFID SMART CARD</th>
                <th className="py-3 px-4">ASSIGNED LOCKER</th>
                <th className="py-3 px-4">STATUS</th>
                <th className="py-3 px-4 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filtered.map(s => (
                <tr key={s.id} className="hover:bg-zinc-50 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-zinc-900">{s.enrollmentNumber}</td>
                  <td className="py-3 px-4">
                    <div className="font-bold text-zinc-900">{s.name}</div>
                    <div className="text-[11px] text-zinc-400 font-mono">{s.phone}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-zinc-700">{s.department}</div>
                    <div className="text-[11px] text-purple-700 font-bold">{s.year}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-mono text-zinc-800 bg-zinc-100 px-2 py-0.5 rounded-md border border-zinc-200 font-bold text-[11px]">
                      {s.rfidCard}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-mono font-bold text-primary">{s.assignedTerminal}</span>
                    <span className="text-zinc-500 ml-1.5">({s.assignedLocker})</span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        s.status === 'ACTIVE'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : s.status === 'PENDING_APPROVAL'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-zinc-100 text-zinc-600'
                      }`}
                    >
                      {s.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    {s.status === 'PENDING_APPROVAL' ? (
                      <button
                        type="button"
                        onClick={() => handleApprove(s.id)}
                        className="px-2.5 py-1 bg-purple-600 hover:bg-purple-700 text-white text-[11px] font-bold rounded-lg transition-colors"
                      >
                        Approve
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => showToast(`Credentials re-sent to ${s.name}`, 'info')}
                        className="text-purple-700 hover:underline font-bold text-xs"
                      >
                        Re-issue
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Enroll Student Modal */}
      <Modal
        isOpen={createModal}
        onClose={() => setCreateModal(false)}
        title="Enroll Student & Bind RFID Smart Card"
        maxWidth="md"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
              Enrollment / Roll Number *
            </label>
            <input
              type="text"
              required
              value={form.enrollmentNumber}
              onChange={e => setForm(p => ({ ...p, enrollmentNumber: e.target.value }))}
              placeholder="e.g. 1PI20CS042"
              className="w-full h-10 px-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-mono font-bold outline-none focus:border-purple-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
              Full Student Name *
            </label>
            <input
              type="text"
              required
              value={form.name}
              onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
              placeholder="e.g. Aarav Sharma"
              className="w-full h-10 px-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs outline-none focus:border-purple-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">Department</label>
              <select
                value={form.department}
                onChange={e => setForm(p => ({ ...p, department: e.target.value }))}
                className="w-full h-10 px-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium"
              >
                <option value="Computer Science & Engineering">CSE</option>
                <option value="Electronics & Communication">ECE</option>
                <option value="Information Science & Engineering">ISE</option>
                <option value="Mechanical Engineering">Mechanical</option>
                <option value="Biotechnology">Biotechnology</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">Year</label>
              <select
                value={form.year}
                onChange={e => setForm(p => ({ ...p, year: e.target.value }))}
                className="w-full h-10 px-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium"
              >
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">Mobile Number</label>
              <input
                type="text"
                value={form.phone}
                onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                placeholder="+91 9845012345"
                className="w-full h-10 px-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">RFID UID *</label>
              <input
                type="text"
                required
                value={form.rfidCard}
                onChange={e => setForm(p => ({ ...p, rfidCard: e.target.value }))}
                placeholder="RFID-994188"
                className="w-full h-10 px-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-mono font-bold"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-100">
            <button
              type="button"
              onClick={() => setCreateModal(false)}
              className="px-4 py-2 text-xs font-bold text-zinc-600 hover:bg-zinc-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all"
            >
              Enroll & Link RFID
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
