import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { useRealtime } from '../../context/RealtimeContext';
import { Monitor, RefreshCw, Smartphone, Wifi, Power, Play, Square, MousePointer } from 'lucide-react';

interface RemoteAssistanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  terminalCode?: string;
}

export const RemoteAssistanceModal: React.FC<RemoteAssistanceModalProps> = ({
  isOpen,
  onClose,
  terminalCode = 'HKBKCBELB',
}) => {
  const { terminals, showToast } = useRealtime();
  const [selectedCode, setSelectedCode] = useState(terminalCode);
  const [isStreaming, setIsStreaming] = useState(true);
  const [touchLogs, setTouchLogs] = useState<string[]>(['WebSocket stream connected to kiosk Linaro display server (1080x1920)']);
  const [kioskScreen, setKioskScreen] = useState<'HOME' | 'SIZE_SELECT' | 'PAYMENT' | 'PIN_ENTRY'>('HOME');

  useEffect(() => {
    if (terminalCode) setSelectedCode(terminalCode);
  }, [terminalCode]);

  const handleScreenClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 1080);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 1920);

    const log = `Touch input sent: (X=${x}, Y=${y}) -> Action dispatched`;
    setTouchLogs(prev => [log, ...prev.slice(0, 5)]);

    if (kioskScreen === 'HOME') setKioskScreen('SIZE_SELECT');
    else if (kioskScreen === 'SIZE_SELECT') setKioskScreen('PAYMENT');
    else if (kioskScreen === 'PAYMENT') setKioskScreen('PIN_ENTRY');
    else setKioskScreen('HOME');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Interactive Remote Assistance & Touch Stream"
      subtitle={`Live screen mirroring & remote mouse pointer control for terminal ${selectedCode}`}
      maxWidth="4xl"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Screen Simulation Canvas */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="flex items-center justify-between w-full mb-2">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-xs font-mono font-bold text-emerald-600">LIVE WEBRTC / WS STREAM</span>
            </div>
            <span className="text-xs font-mono text-zinc-400">1080 × 1920 | 60 FPS</span>
          </div>

          {/* Kiosk Screen Frame */}
          <div
            onClick={handleScreenClick}
            className="relative w-full max-w-[320px] aspect-[9/16] bg-zinc-950 rounded-3xl border-4 border-zinc-800 shadow-2xl overflow-hidden cursor-crosshair group select-none flex flex-col justify-between p-4"
          >
            {/* Kiosk Header */}
            <div className="flex items-center justify-between text-white border-b border-zinc-800 pb-2">
              <div className="flex items-center gap-1.5">
                <div className="h-6 w-6 rounded bg-primary flex items-center justify-center font-black text-xs text-white">T</div>
                <span className="font-black text-xs">TUCKIT KIOSK</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-400">ONLINE</span>
            </div>

            {/* Kiosk Dynamic Content */}
            <div className="text-center py-6">
              {kioskScreen === 'HOME' && (
                <div className="space-y-4">
                  <div className="text-lg font-black text-white">Welcome to Tuckit</div>
                  <p className="text-xs text-zinc-400">Smart Luggage & Phone Lockers</p>
                  <div className="p-3 bg-primary text-white text-xs font-bold rounded-2xl shadow-lg animate-pulse-subtle">
                    Touch Here to Deposit
                  </div>
                </div>
              )}
              {kioskScreen === 'SIZE_SELECT' && (
                <div className="space-y-3">
                  <div className="text-sm font-bold text-white">Select Locker Size</div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2.5 bg-zinc-800 rounded-xl text-white text-xs font-bold border border-primary">SMALL (₹50)</div>
                    <div className="p-2.5 bg-zinc-800 rounded-xl text-white text-xs font-bold">MEDIUM (₹80)</div>
                    <div className="p-2.5 bg-zinc-800 rounded-xl text-white text-xs font-bold">LARGE (₹120)</div>
                    <div className="p-2.5 bg-zinc-800 rounded-xl text-white text-xs font-bold">XL (₹180)</div>
                  </div>
                </div>
              )}
              {kioskScreen === 'PAYMENT' && (
                <div className="space-y-3">
                  <div className="text-sm font-bold text-white">Scan UPI QR to Pay</div>
                  <div className="h-28 w-28 bg-white rounded-xl mx-auto flex items-center justify-center text-zinc-900 font-bold text-xs">
                    [ UPI QR CODE ]
                  </div>
                  <div className="text-xs text-emerald-400 font-bold">Awaiting Payment...</div>
                </div>
              )}
              {kioskScreen === 'PIN_ENTRY' && (
                <div className="space-y-3">
                  <div className="text-sm font-bold text-white">Locker #04 Unlocked!</div>
                  <div className="p-3 bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold rounded-xl border border-emerald-500/30">
                    Door Solenoid Open. Please place luggage and shut door.
                  </div>
                </div>
              )}
            </div>

            {/* Kiosk Footer */}
            <div className="text-[10px] text-zinc-500 font-mono text-center pt-2 border-t border-zinc-800">
              Terminal: {selectedCode} | Click anywhere to interact
            </div>
          </div>
        </div>

        {/* Right Telemetry & Controls */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-200 space-y-3">
            <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">Terminal Select & State</h4>
            <select
              value={selectedCode}
              onChange={e => setSelectedCode(e.target.value)}
              className="w-full h-9 px-3 bg-white border border-zinc-200 rounded-xl text-xs font-mono font-bold text-zinc-800 outline-none focus:border-primary"
            >
              {terminals.map(t => (
                <option key={t.id} value={t.code}>{t.code} — {t.siteName} ({t.city})</option>
              ))}
            </select>
          </div>

          <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-200 space-y-2">
            <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">Remote Commands</h4>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setKioskScreen('HOME')}
                className="p-2.5 bg-white hover:bg-zinc-100 border border-zinc-200 rounded-xl text-xs font-bold text-zinc-800 transition-colors"
              >
                Reset to Home
              </button>
              <button
                type="button"
                onClick={() => showToast(`Reload command sent to ${selectedCode}`, 'info')}
                className="p-2.5 bg-white hover:bg-zinc-100 border border-zinc-200 rounded-xl text-xs font-bold text-zinc-800 transition-colors"
              >
                Reload WebApp
              </button>
            </div>
          </div>

          <div className="p-4 bg-zinc-950 text-white rounded-2xl border border-zinc-800 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
              <span className="flex items-center gap-1.5"><MousePointer className="h-3.5 w-3.5 text-primary" /> Input Dispatch Log</span>
            </div>
            <div className="space-y-1 font-mono text-[11px] text-zinc-300 max-h-32 overflow-y-auto custom-scrollbar">
              {touchLogs.map((log, idx) => (
                <div key={idx} className="text-emerald-400">❯ {log}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
