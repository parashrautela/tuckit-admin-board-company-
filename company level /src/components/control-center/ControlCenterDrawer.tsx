import React, { useState } from 'react';
import { Drawer } from '../common/Drawer';
import { useRealtime } from '../../context/RealtimeContext';
import {
  KeyRound,
  MessageSquare,
  RotateCcw,
  UserX,
  PlusCircle,
  Terminal as TerminalIcon,
  UploadCloud,
  Search,
  Zap,
  Activity,
  Server,
  ShieldAlert,
  Monitor,
} from 'lucide-react';
import { ForceUnlockModal } from './ForceUnlockModal';
import { SmsUnlockModal } from './SmsUnlockModal';
import { TerminalRebootModal } from './TerminalRebootModal';
import { BlacklistUserModal } from '../modals/BlacklistUserModal';
import { CreateSiteModal } from '../modals/CreateSiteModal';
import { InstallTerminalModal } from '../modals/InstallTerminalModal';
import { BatchConsoleModal } from '../modals/BatchConsoleModal';
import { FileTransferModal } from '../modals/FileTransferModal';
import { RemoteAssistanceModal } from './RemoteAssistanceModal';

interface ControlCenterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ControlCenterDrawer: React.FC<ControlCenterDrawerProps> = ({ isOpen, onClose }) => {
  const { totalTerminals, onlineDevices, wsConnectedCount, lastCheckedTime, showToast } = useRealtime();

  // Submodals
  const [showForceUnlock, setShowForceUnlock] = useState(false);
  const [showSmsUnlock, setShowSmsUnlock] = useState(false);
  const [showReboot, setShowReboot] = useState(false);
  const [showBlacklist, setShowBlacklist] = useState(false);
  const [showCreateSite, setShowCreateSite] = useState(false);
  const [showInstallTerminal, setShowInstallTerminal] = useState(false);
  const [showBatchConsole, setShowBatchConsole] = useState(false);
  const [showFileTransfer, setShowFileTransfer] = useState(false);
  const [showRemoteAssistance, setShowRemoteAssistance] = useState(false);

  return (
    <>
      <Drawer
        isOpen={isOpen}
        onClose={onClose}
        title="Hardware & Operations Control Center"
        subtitle="Real-time remote telemetry, hardware solenoid overrides & IoT management"
        width="lg"
      >
        <div className="space-y-6">
          {/* Live Node Summary Banner */}
          <div className="p-4 bg-zinc-950 text-white rounded-2xl border border-zinc-800 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-xs font-bold font-mono uppercase tracking-wider text-emerald-400">
                  MQTT / WS STREAM ACTIVE
                </span>
              </div>
              <span className="text-xs text-zinc-400 font-mono">Sync: {lastCheckedTime}</span>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-zinc-800">
              <div className="bg-zinc-900/80 p-2.5 rounded-xl border border-zinc-800">
                <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Total Nodes</div>
                <div className="text-lg font-black text-white">{totalTerminals}</div>
              </div>
              <div className="bg-zinc-900/80 p-2.5 rounded-xl border border-zinc-800">
                <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider">WS Online</div>
                <div className="text-lg font-black text-emerald-400">{wsConnectedCount}</div>
              </div>
              <div className="bg-zinc-900/80 p-2.5 rounded-xl border border-zinc-800">
                <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Mesh Tunnel</div>
                <div className="text-lg font-black text-sky-400">Tailscale</div>
              </div>
            </div>
          </div>

          {/* Quick Hardware Actions */}
          <div className="space-y-3">
            <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider px-1">
              Emergency Locker & Hardware Actions
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setShowForceUnlock(true)}
                className="flex items-start gap-3 p-3.5 bg-white hover:bg-orange-50/50 border border-zinc-200 hover:border-primary/50 rounded-xl text-left shadow-2xs hover:shadow-md transition-all group"
              >
                <div className="p-2.5 bg-orange-100 text-primary rounded-xl shrink-0 group-hover:scale-110 transition-transform">
                  <KeyRound className="size-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-zinc-900 group-hover:text-primary transition-colors">
                    Force Unlock Locker
                  </div>
                  <div className="text-xs text-zinc-500 mt-0.5">
                    Direct solenoid unlatch pulse to physical terminal
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setShowSmsUnlock(true)}
                className="flex items-start gap-3 p-3.5 bg-white hover:bg-purple-50/50 border border-zinc-200 hover:border-purple-300 rounded-xl text-left shadow-2xs hover:shadow-md transition-all group"
              >
                <div className="p-2.5 bg-purple-100 text-purple-700 rounded-xl shrink-0 group-hover:scale-110 transition-transform">
                  <MessageSquare className="size-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-zinc-900 group-hover:text-purple-700 transition-colors">
                    Unlock via SMS
                  </div>
                  <div className="text-xs text-zinc-500 mt-0.5">
                    Dispatch one-time fallback link to customer
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setShowReboot(true)}
                className="flex items-start gap-3 p-3.5 bg-white hover:bg-zinc-100 border border-zinc-200 hover:border-zinc-300 rounded-xl text-left shadow-2xs hover:shadow-md transition-all group"
              >
                <div className="p-2.5 bg-zinc-100 text-zinc-800 rounded-xl shrink-0 group-hover:scale-110 transition-transform">
                  <RotateCcw className="size-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-zinc-900">Restart Terminal</div>
                  <div className="text-xs text-zinc-500 mt-0.5">
                    Soft kiosk reload or full hardware reboot
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setShowBlacklist(true)}
                className="flex items-start gap-3 p-3.5 bg-white hover:bg-red-50/50 border border-zinc-200 hover:border-red-300 rounded-xl text-left shadow-2xs hover:shadow-md transition-all group"
              >
                <div className="p-2.5 bg-red-100 text-red-600 rounded-xl shrink-0 group-hover:scale-110 transition-transform">
                  <UserX className="size-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-zinc-900 group-hover:text-red-600 transition-colors">
                    Block / Blacklist User
                  </div>
                  <div className="text-xs text-zinc-500 mt-0.5">
                    Restrict mobile number across network
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Site Deployment & DevOps Actions */}
          <div className="space-y-3">
            <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider px-1">
              Infrastructure & Node Management
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setShowCreateSite(true)}
                className="flex items-start gap-3 p-3.5 bg-white hover:bg-emerald-50/50 border border-zinc-200 hover:border-emerald-300 rounded-xl text-left shadow-2xs hover:shadow-md transition-all group"
              >
                <div className="p-2.5 bg-emerald-100 text-emerald-700 rounded-xl shrink-0 group-hover:scale-110 transition-transform">
                  <PlusCircle className="size-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-zinc-900 group-hover:text-emerald-700 transition-colors">
                    Create New Site
                  </div>
                  <div className="text-xs text-zinc-500 mt-0.5">
                    Deploy station code to new mall or metro
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setShowInstallTerminal(true)}
                className="flex items-start gap-3 p-3.5 bg-white hover:bg-sky-50/50 border border-zinc-200 hover:border-sky-300 rounded-xl text-left shadow-2xs hover:shadow-md transition-all group"
              >
                <div className="p-2.5 bg-sky-100 text-sky-700 rounded-xl shrink-0 group-hover:scale-110 transition-transform">
                  <Server className="size-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-zinc-900 group-hover:text-sky-700 transition-colors">
                    Install Terminal
                  </div>
                  <div className="text-xs text-zinc-500 mt-0.5">
                    Generate Linaro SBC deployment scripts
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setShowRemoteAssistance(true)}
                className="flex items-start gap-3 p-3.5 bg-white hover:bg-amber-50/50 border border-zinc-200 hover:border-amber-300 rounded-xl text-left shadow-2xs hover:shadow-md transition-all group"
              >
                <div className="p-2.5 bg-amber-100 text-amber-700 rounded-xl shrink-0 group-hover:scale-110 transition-transform">
                  <Monitor className="size-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-zinc-900 group-hover:text-amber-700 transition-colors">
                    Remote Assistance
                  </div>
                  <div className="text-xs text-zinc-500 mt-0.5">
                    Live screen stream & touch mirror
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setShowBatchConsole(true)}
                className="flex items-start gap-3 p-3.5 bg-white hover:bg-zinc-100 border border-zinc-200 hover:border-zinc-300 rounded-xl text-left shadow-2xs hover:shadow-md transition-all group"
              >
                <div className="p-2.5 bg-zinc-900 text-emerald-400 rounded-xl shrink-0 group-hover:scale-110 transition-transform">
                  <TerminalIcon className="size-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-zinc-900">Batch Console</div>
                  <div className="text-xs text-zinc-500 mt-0.5">
                    Execute shell diagnostics over cluster
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setShowFileTransfer(true)}
                className="flex items-start gap-3 p-3.5 bg-white hover:bg-indigo-50/50 border border-zinc-200 hover:border-indigo-300 rounded-xl text-left shadow-2xs hover:shadow-md transition-all group sm:col-span-2"
              >
                <div className="p-2.5 bg-indigo-100 text-indigo-700 rounded-xl shrink-0 group-hover:scale-110 transition-transform">
                  <UploadCloud className="size-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-zinc-900 group-hover:text-indigo-700 transition-colors">
                    Update Software / File Transfer (S3 Pipeline)
                  </div>
                  <div className="text-xs text-zinc-500 mt-0.5">
                    Deploy builds & patches across nationwide kiosk clusters
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </Drawer>

      {/* Embedded Action Modals */}
      <ForceUnlockModal isOpen={showForceUnlock} onClose={() => setShowForceUnlock(false)} />
      <SmsUnlockModal isOpen={showSmsUnlock} onClose={() => setShowSmsUnlock(false)} />
      <TerminalRebootModal isOpen={showReboot} onClose={() => setShowReboot(false)} />
      <BlacklistUserModal isOpen={showBlacklist} onClose={() => setShowBlacklist(false)} />
      <CreateSiteModal isOpen={showCreateSite} onClose={() => setShowCreateSite(false)} />
      <InstallTerminalModal isOpen={showInstallTerminal} onClose={() => setShowInstallTerminal(false)} />
      <BatchConsoleModal isOpen={showBatchConsole} onClose={() => setShowBatchConsole(false)} />
      <FileTransferModal isOpen={showFileTransfer} onClose={() => setShowFileTransfer(false)} />
      <RemoteAssistanceModal isOpen={showRemoteAssistance} onClose={() => setShowRemoteAssistance(false)} />
    </>
  );
};
