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
          <div className="p-4 bg-zinc-50 border border-zinc-200/90 rounded-2xl shadow-2xs space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-[11px] font-semibold font-mono uppercase tracking-wider text-emerald-700">
                  MQTT / WS Stream Active
                </span>
              </div>
              <span className="text-xs text-zinc-500 font-mono">Sync: {lastCheckedTime}</span>
            </div>

            <div className="grid grid-cols-3 gap-2.5 pt-2.5 border-t border-zinc-200/80">
              <div className="bg-white p-2.5 rounded-xl border border-zinc-200/70 shadow-2xs">
                <div className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">Total Nodes</div>
                <div className="text-base font-bold text-zinc-900 mt-0.5">{totalTerminals}</div>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-zinc-200/70 shadow-2xs">
                <div className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">WS Online</div>
                <div className="text-base font-bold text-emerald-600 mt-0.5">{wsConnectedCount}</div>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-zinc-200/70 shadow-2xs">
                <div className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">Mesh Tunnel</div>
                <div className="text-base font-bold text-zinc-800 mt-0.5">Tailscale</div>
              </div>
            </div>
          </div>

          {/* Quick Hardware Actions */}
          <div className="space-y-3">
            <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider px-0.5">
              Emergency Locker & Hardware Actions
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setShowForceUnlock(true)}
                className="flex items-start gap-3 p-3.5 bg-white hover:bg-zinc-50/70 border border-zinc-200/80 hover:border-zinc-300 rounded-xl text-left shadow-2xs hover:shadow-xs transition-all group"
              >
                <div className="p-2.5 bg-zinc-100/90 text-zinc-600 rounded-xl shrink-0 group-hover:bg-zinc-200/60 group-hover:text-zinc-900 transition-colors border border-zinc-200/50">
                  <KeyRound className="size-5" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-zinc-800 group-hover:text-zinc-900 transition-colors">
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
                className="flex items-start gap-3 p-3.5 bg-white hover:bg-zinc-50/70 border border-zinc-200/80 hover:border-zinc-300 rounded-xl text-left shadow-2xs hover:shadow-xs transition-all group"
              >
                <div className="p-2.5 bg-zinc-100/90 text-zinc-600 rounded-xl shrink-0 group-hover:bg-zinc-200/60 group-hover:text-zinc-900 transition-colors border border-zinc-200/50">
                  <MessageSquare className="size-5" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-zinc-800 group-hover:text-zinc-900 transition-colors">
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
                className="flex items-start gap-3 p-3.5 bg-white hover:bg-zinc-50/70 border border-zinc-200/80 hover:border-zinc-300 rounded-xl text-left shadow-2xs hover:shadow-xs transition-all group"
              >
                <div className="p-2.5 bg-zinc-100/90 text-zinc-600 rounded-xl shrink-0 group-hover:bg-zinc-200/60 group-hover:text-zinc-900 transition-colors border border-zinc-200/50">
                  <RotateCcw className="size-5" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-zinc-800 group-hover:text-zinc-900 transition-colors">
                    Restart Terminal
                  </div>
                  <div className="text-xs text-zinc-500 mt-0.5">
                    Soft kiosk reload or full hardware reboot
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setShowBlacklist(true)}
                className="flex items-start gap-3 p-3.5 bg-white hover:bg-zinc-50/70 border border-zinc-200/80 hover:border-zinc-300 rounded-xl text-left shadow-2xs hover:shadow-xs transition-all group"
              >
                <div className="p-2.5 bg-zinc-100/90 text-zinc-600 rounded-xl shrink-0 group-hover:bg-zinc-200/60 group-hover:text-zinc-900 transition-colors border border-zinc-200/50">
                  <UserX className="size-5" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-zinc-800 group-hover:text-zinc-900 transition-colors">
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
            <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider px-0.5">
              Infrastructure & Node Management
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setShowCreateSite(true)}
                className="flex items-start gap-3 p-3.5 bg-white hover:bg-zinc-50/70 border border-zinc-200/80 hover:border-zinc-300 rounded-xl text-left shadow-2xs hover:shadow-xs transition-all group"
              >
                <div className="p-2.5 bg-zinc-100/90 text-zinc-600 rounded-xl shrink-0 group-hover:bg-zinc-200/60 group-hover:text-zinc-900 transition-colors border border-zinc-200/50">
                  <PlusCircle className="size-5" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-zinc-800 group-hover:text-zinc-900 transition-colors">
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
                className="flex items-start gap-3 p-3.5 bg-white hover:bg-zinc-50/70 border border-zinc-200/80 hover:border-zinc-300 rounded-xl text-left shadow-2xs hover:shadow-xs transition-all group"
              >
                <div className="p-2.5 bg-zinc-100/90 text-zinc-600 rounded-xl shrink-0 group-hover:bg-zinc-200/60 group-hover:text-zinc-900 transition-colors border border-zinc-200/50">
                  <Server className="size-5" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-zinc-800 group-hover:text-zinc-900 transition-colors">
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
                className="flex items-start gap-3 p-3.5 bg-white hover:bg-zinc-50/70 border border-zinc-200/80 hover:border-zinc-300 rounded-xl text-left shadow-2xs hover:shadow-xs transition-all group"
              >
                <div className="p-2.5 bg-zinc-100/90 text-zinc-600 rounded-xl shrink-0 group-hover:bg-zinc-200/60 group-hover:text-zinc-900 transition-colors border border-zinc-200/50">
                  <Monitor className="size-5" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-zinc-800 group-hover:text-zinc-900 transition-colors">
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
                className="flex items-start gap-3 p-3.5 bg-white hover:bg-zinc-50/70 border border-zinc-200/80 hover:border-zinc-300 rounded-xl text-left shadow-2xs hover:shadow-xs transition-all group"
              >
                <div className="p-2.5 bg-zinc-100/90 text-zinc-600 rounded-xl shrink-0 group-hover:bg-zinc-200/60 group-hover:text-zinc-900 transition-colors border border-zinc-200/50">
                  <TerminalIcon className="size-5" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-zinc-800 group-hover:text-zinc-900 transition-colors">
                    Batch Console
                  </div>
                  <div className="text-xs text-zinc-500 mt-0.5">
                    Execute shell diagnostics over cluster
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setShowFileTransfer(true)}
                className="flex items-start gap-3 p-3.5 bg-white hover:bg-zinc-50/70 border border-zinc-200/80 hover:border-zinc-300 rounded-xl text-left shadow-2xs hover:shadow-xs transition-all group sm:col-span-2"
              >
                <div className="p-2.5 bg-zinc-100/90 text-zinc-600 rounded-xl shrink-0 group-hover:bg-zinc-200/60 group-hover:text-zinc-900 transition-colors border border-zinc-200/50">
                  <UploadCloud className="size-5" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-zinc-800 group-hover:text-zinc-900 transition-colors">
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
