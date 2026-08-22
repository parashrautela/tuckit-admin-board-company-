import React from 'react';
import { Modal } from '../common/Modal';
import { Terminal } from '../../types';
import { Printer, Download, QrCode } from 'lucide-react';

interface PrintQrModalProps {
  isOpen: boolean;
  onClose: () => void;
  terminal: Terminal | null;
}

export const PrintQrModal: React.FC<PrintQrModalProps> = ({
  isOpen,
  onClose,
  terminal,
}) => {
  if (!terminal) return null;

  const qrUrl = `https://tuckit.in/app/store?terminal=${terminal.code}&pin=${terminal.locationPin}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Terminal QR Code — ${terminal.code}`}
      subtitle={`${terminal.siteName} • Location PIN: ${terminal.locationPin}`}
    >
      <div className="flex flex-col items-center justify-center p-6 bg-white border border-zinc-200 rounded-2xl shadow-inner text-center">
        <div className="p-4 bg-orange-500 rounded-2xl mb-4 shadow-md">
          <div className="bg-white p-4 rounded-xl">
            {/* SVG QR Code Simulation with Tuckit Brand Stamp */}
            <svg
              className="w-48 h-48"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="100" height="100" fill="white" />
              {/* Corner markers */}
              <rect x="5" y="5" width="25" height="25" fill="#18181B" rx="4" />
              <rect x="9" y="9" width="17" height="17" fill="white" rx="2" />
              <rect x="13" y="13" width="9" height="9" fill="#F97316" />

              <rect x="70" y="5" width="25" height="25" fill="#18181B" rx="4" />
              <rect x="74" y="9" width="17" height="17" fill="white" rx="2" />
              <rect x="78" y="13" width="9" height="9" fill="#F97316" />

              <rect x="5" y="70" width="25" height="25" fill="#18181B" rx="4" />
              <rect x="9" y="74" width="17" height="17" fill="white" rx="2" />
              <rect x="13" y="78" width="9" height="9" fill="#F97316" />

              {/* Data modules */}
              <rect x="35" y="10" width="8" height="8" fill="#18181B" />
              <rect x="48" y="10" width="6" height="6" fill="#18181B" />
              <rect x="40" y="25" width="20" height="6" fill="#18181B" />
              <rect x="10" y="35" width="8" height="20" fill="#18181B" />
              <rect x="25" y="40" width="12" height="12" fill="#F97316" />
              <rect x="45" y="45" width="15" height="15" fill="#18181B" />
              <rect x="68" y="38" width="22" height="10" fill="#18181B" />
              <rect x="70" y="55" width="12" height="12" fill="#F97316" />
              <rect x="38" y="68" width="14" height="20" fill="#18181B" />
              <rect x="58" y="72" width="12" height="12" fill="#18181B" />
              <rect x="78" y="75" width="12" height="12" fill="#18181B" />

              {/* Center Logo Icon */}
              <circle cx="50" cy="50" r="11" fill="white" />
              <circle cx="50" cy="50" r="9" fill="#F97316" />
              <text x="50" y="54" fontSize="10" fontWeight="900" fill="white" textAnchor="middle">
                T
              </text>
            </svg>
          </div>
        </div>

        <div className="text-sm font-bold text-zinc-900">{terminal.code}</div>
        <div className="text-xs text-zinc-500 font-mono mt-0.5 max-w-xs truncate">{qrUrl}</div>

        <div className="mt-3 px-3 py-1.5 bg-zinc-100 rounded-lg text-[11px] font-semibold text-zinc-600">
          SCAN TO STORE OR PICK UP YOUR BELONGINGS
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 mt-4 border-t border-zinc-100">
        <div className="text-xs text-zinc-400 font-mono">Format: High-Res SVG / PDF Vector</div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-zinc-600 hover:bg-zinc-100 rounded-lg transition-colors"
          >
            Close
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#FFE5C6] hover:bg-[#FFD7A8] text-neutral-900 border border-[#FFC898]/70 text-xs font-bold rounded-lg shadow-xs transition-all"
          >
            <Printer className="h-3.5 w-3.5" />
            <span>Print Terminal QR</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};
