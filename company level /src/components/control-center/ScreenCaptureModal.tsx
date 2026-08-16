import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Terminal } from '../../types';
import { Camera, RefreshCw, Smartphone, Monitor } from 'lucide-react';

interface ScreenCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  terminal: Terminal | null;
}

export const ScreenCaptureModal: React.FC<ScreenCaptureModalProps> = ({
  isOpen,
  onClose,
  terminal,
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [capturedAt, setCapturedAt] = useState(() => new Date().toLocaleTimeString());

  if (!terminal) return null;

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setCapturedAt(new Date().toLocaleTimeString());
      setIsRefreshing(false);
    }, 900);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Live Screen & Hardware Frame — ${terminal.code}`}
      subtitle={`${terminal.siteName} • Device: ${terminal.deviceType} • FW: ${terminal.firmwareVersion}`}
      maxWidth="2xl"
    >
      <div className="space-y-4">
        {/* Terminal Screen Simulation Frame */}
        <div className="relative rounded-2xl bg-zinc-950 p-4 border-4 border-zinc-800 shadow-2xl overflow-hidden">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-zinc-800 text-zinc-400 text-xs">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-mono text-zinc-300">STREAM // 1080x1920 @ 60FPS</span>
            </div>
            <div className="font-mono">FRAME CAPTURED AT {capturedAt}</div>
          </div>

          {/* Kiosk Touchscreen Simulated UI */}
          <div className="bg-gradient-to-b from-orange-500 to-amber-600 rounded-xl p-8 text-white min-h-[300px] flex flex-col justify-between shadow-inner">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-2xl font-black tracking-tight">TUCKIT</div>
                <div className="text-xs text-orange-100 uppercase tracking-wider font-semibold">
                  Self-Service Smart Locker Station
                </div>
              </div>
              <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-mono">
                PIN: {terminal.locationPin}
              </div>
            </div>

            <div className="my-6 grid grid-cols-2 gap-4">
              <div className="bg-white text-zinc-900 p-4 rounded-xl shadow-lg flex flex-col items-center justify-center text-center">
                <div className="h-10 w-10 bg-orange-100 rounded-full flex items-center justify-center text-primary font-black mb-2">
                  STORE
                </div>
                <div className="font-bold text-sm">Keep Baggage</div>
                <div className="text-[11px] text-zinc-500">Scan QR or Tap Here</div>
              </div>
              <div className="bg-white/10 border border-white/30 text-white p-4 rounded-xl backdrop-blur-md flex flex-col items-center justify-center text-center">
                <div className="h-10 w-10 bg-white/20 rounded-full flex items-center justify-center text-white font-black mb-2">
                  PICK UP
                </div>
                <div className="font-bold text-sm">Retrieve Luggage</div>
                <div className="text-[11px] text-orange-100">Passcode or Mobile OTP</div>
              </div>
            </div>

            <div className="flex justify-between items-center text-[11px] text-orange-100 pt-2 border-t border-white/20 font-mono">
              <span>{terminal.siteName}</span>
              <span>Online • WS Synced</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="text-xs text-zinc-500">
            Hardware Health: <span className="font-bold text-emerald-600">Optimal (38°C)</span> • Network:{' '}
            <span className="font-bold text-zinc-700">{terminal.networkType}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-bold rounded-lg transition-colors"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{isRefreshing ? 'Capturing...' : 'Capture Frame'}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-lg transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
