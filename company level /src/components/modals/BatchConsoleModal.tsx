import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useRealtime } from '../../context/RealtimeContext';
import { Terminal as TerminalIcon, Play, RefreshCw } from 'lucide-react';

interface BatchConsoleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BatchConsoleModal: React.FC<BatchConsoleModalProps> = ({ isOpen, onClose }) => {
  const { terminals, showToast } = useRealtime();
  const [command, setCommand] = useState('systemctl status tuckit-kiosk.service');
  const [targetScope, setTargetScope] = useState<'all' | 'online' | 'state'>('online');
  const [selectedState, setSelectedState] = useState('Karnataka');
  const [outputLogs, setOutputLogs] = useState<string[]>([
    '[2026-08-17 01:45:00] Batch console initialized.',
    '[2026-08-17 01:45:01] 223 online IoT nodes reachable via Tailscale overlay.',
  ]);
  const [isRunning, setIsRunning] = useState(false);

  const handleExecute = (e: React.FormEvent) => {
    e.preventDefault();
    setIsRunning(true);
    setOutputLogs(prev => [...prev, `> Executing "${command}" on ${targetScope === 'state' ? selectedState : targetScope} terminals...`]);
    setTimeout(() => {
      setIsRunning(false);
      setOutputLogs(prev => [
        ...prev,
        `✓ [TCK-KA-001] tuckit-kiosk.service - Active: active (running) since Sun 2026-08-16 06:00:00 IST`,
        `✓ [TCK-KA-002] tuckit-kiosk.service - Active: active (running)`,
        `✓ [TCK-KA-004] tuckit-kiosk.service - Active: active (running)`,
        `✓ Finished command dispatch across targeted nodes. 0 errors.`,
      ]);
      showToast('Batch command executed across cluster', 'success');
    }, 1200);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Cluster Batch Shell Console"
      subtitle="Broadcast synchronized shell diagnostics to deployed Linux SBC kiosks"
      maxWidth="2xl"
    >
      <form onSubmit={handleExecute} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
              Target Scope
            </label>
            <select
              value={targetScope}
              onChange={e => setTargetScope(e.target.value as any)}
              className="w-full h-10 px-3 bg-zinc-50 border border-zinc-200 rounded-lg text-xs font-semibold"
            >
              <option value="online">All Online Devices (223 nodes)</option>
              <option value="state">By State Cluster</option>
              <option value="all">All Configured (238 nodes)</option>
            </select>
          </div>
          {targetScope === 'state' && (
            <div>
              <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                Select State
              </label>
              <select
                value={selectedState}
                onChange={e => setSelectedState(e.target.value)}
                className="w-full h-10 px-3 bg-zinc-50 border border-zinc-200 rounded-lg text-xs font-semibold"
              >
                <option value="Karnataka">Karnataka (57 nodes)</option>
                <option value="Maharashtra">Maharashtra (28 nodes)</option>
                <option value="Telangana">Telangana (25 nodes)</option>
                <option value="Uttar Pradesh">Uttar Pradesh (22 nodes)</option>
                <option value="Kerala">Kerala (21 nodes)</option>
              </select>
            </div>
          )}
        </div>

        <div>
          <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
            Shell Command
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={command}
              onChange={e => setCommand(e.target.value)}
              className="flex-1 h-10 px-3 bg-zinc-950 text-emerald-400 font-mono text-xs rounded-lg border border-zinc-800 outline-none"
              placeholder="e.g. uptime, free -m, journalctl -u tuckit -n 20"
              required
            />
            <button
              type="submit"
              disabled={isRunning}
              className="px-4 bg-[#FFE5C6] hover:bg-[#FFD7A8] text-neutral-900 border border-[#FFC898]/70 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Play className={`h-3.5 w-3.5 ${isRunning ? 'animate-spin' : ''}`} />
              <span>{isRunning ? 'Broadcasting...' : 'Run'}</span>
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
            Live Streamed Output
          </label>
          <div className="h-44 bg-zinc-950 text-zinc-300 font-mono text-[11px] p-3 rounded-xl overflow-y-auto custom-scrollbar space-y-1">
            {outputLogs.map((log, idx) => (
              <div key={idx} className={log.startsWith('✓') ? 'text-emerald-400' : log.startsWith('>') ? 'text-amber-400' : ''}>
                {log}
              </div>
            ))}
          </div>
        </div>
      </form>
    </Modal>
  );
};
