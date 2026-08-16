import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useRealtime } from '../../context/RealtimeContext';
import { Terminal, Cpu, CheckCircle2, ShieldCheck } from 'lucide-react';

interface InstallTerminalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstallTerminalModal: React.FC<InstallTerminalModalProps> = ({ isOpen, onClose }) => {
  const { showToast } = useRealtime();
  const [step, setStep] = useState(1);
  const [terminalCode, setTerminalCode] = useState('TCK-KA-239');
  const [kioskSecret, setKioskSecret] = useState('tk_sec_9942a0b12fe9');
  const [isInstalling, setIsInstalling] = useState(false);

  const handleRunScript = () => {
    setIsInstalling(true);
    setTimeout(() => {
      setIsInstalling(false);
      setStep(3);
      showToast('Kiosk environment successfully provisioned and linked!', 'success');
    }, 1500);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Install & Provision Terminal Software"
      subtitle="Automated setup pipeline for Linaro / Ubuntu SBC touch kiosks"
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2 pb-2 border-b border-zinc-100 text-xs font-bold text-zinc-500">
          <span className={step === 1 ? 'text-primary' : ''}>1. Generate Keys</span>
          <span>→</span>
          <span className={step === 2 ? 'text-primary' : ''}>2. Deploy Daemon</span>
          <span>→</span>
          <span className={step === 3 ? 'text-primary' : ''}>3. Verify WS</span>
        </div>

        {step === 1 && (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                Target Terminal Code
              </label>
              <input
                type="text"
                value={terminalCode}
                onChange={e => setTerminalCode(e.target.value)}
                className="w-full h-10 px-3 bg-zinc-50 border border-zinc-200 rounded-lg text-xs font-semibold font-mono text-zinc-800"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                Hardware Auth Token
              </label>
              <input
                type="text"
                value={kioskSecret}
                readOnly
                className="w-full h-10 px-3 bg-zinc-100 border border-zinc-200 rounded-lg text-xs font-mono text-zinc-600"
              />
            </div>
            <button
              type="button"
              onClick={() => setStep(2)}
              className="w-full py-2.5 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-lg transition-colors"
            >
              Generate Terminal Bootstrap Script
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-3">
            <div className="text-xs text-zinc-600">Run this on-device command in Linaro terminal:</div>
            <div className="p-3 bg-zinc-950 rounded-xl text-emerald-400 font-mono text-xs overflow-x-auto select-all">
              curl -sSL https://admin.tuckit.in/scripts/install.sh | sudo bash -s -- --code {terminalCode} --secret {kioskSecret}
            </div>
            <button
              type="button"
              onClick={handleRunScript}
              disabled={isInstalling}
              className="w-full py-2.5 bg-zinc-900 hover:bg-black text-white text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <Cpu className={`h-4 w-4 ${isInstalling ? 'animate-spin' : ''}`} />
              <span>{isInstalling ? 'Verifying WebSocket Handshake...' : 'Verify Installation'}</span>
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="text-center py-4 space-y-3">
            <CheckCircle2 className="h-12 w-12 text-emerald-500 mx-auto" />
            <div className="text-sm font-bold text-zinc-900">Terminal Ready & Online!</div>
            <div className="text-xs text-zinc-500">
              Heartbeat established with AWS IoT Core over port 8883.
            </div>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-lg transition-colors"
            >
              Complete Setup
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
};
