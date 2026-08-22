import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useRealtime } from '../../context/RealtimeContext';
import { UploadCloud, CheckCircle2, Loader2, Server, ArrowRight } from 'lucide-react';

interface FileTransferModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const pipelineSteps = [
  'Upload source file to AWS S3 storage...',
  'Download file from AWS S3 to target device...',
  'Verify file exists at target location...',
  'Extract archive on destination device...',
];

export const FileTransferModal: React.FC<FileTransferModalProps> = ({ isOpen, onClose }) => {
  const { showToast } = useRealtime();
  const [sourcePath, setSourcePath] = useState('/home/linaro/Desktop/Tuckit/release-v1.2.04.tar.gz');
  const [destinationPath, setDestinationPath] = useState('/opt/tuckit/app/');
  const [isUploading, setIsUploading] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    setCurrentStepIndex(0);

    let step = 0;
    const interval = setInterval(() => {
      step += 1;
      if (step < pipelineSteps.length) {
        setCurrentStepIndex(step);
      } else {
        clearInterval(interval);
        setIsUploading(false);
        showToast('Software patch successfully deployed across kiosks via AWS S3', 'success');
        onClose();
      }
    }, 900);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Terminal Software Update & S3 Pipeline"
      subtitle="Push assets, UI builds, audio prompts, and patches to remote terminals via AWS S3"
    >
      <form onSubmit={handleUpload} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
            Source Archive File / S3 URL
          </label>
          <input
            type="text"
            value={sourcePath}
            onChange={e => setSourcePath(e.target.value)}
            className="w-full h-10 px-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-mono text-zinc-800 focus:bg-white focus:border-primary outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
            Destination Path on Remote Kiosks
          </label>
          <input
            type="text"
            value={destinationPath}
            onChange={e => setDestinationPath(e.target.value)}
            className="w-full h-10 px-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-mono text-zinc-800 focus:bg-white focus:border-primary outline-none"
            required
          />
        </div>

        {isUploading && (
          <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-200 space-y-3 animate-in fade-in">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-900 flex items-center gap-2">
                <Server className="h-4 w-4 text-primary" /> Multi-Kiosk AWS S3 Relay
              </span>
              <span className="text-xs font-mono text-primary font-bold">
                Step {currentStepIndex + 1} of {pipelineSteps.length}
              </span>
            </div>

            <div className="space-y-2 pt-1">
              {pipelineSteps.map((step, idx) => {
                const isDone = idx < currentStepIndex;
                const isCurrent = idx === currentStepIndex;
                return (
                  <div
                    key={step}
                    className={`flex items-center gap-2.5 text-xs font-mono ${
                      isDone
                        ? 'text-emerald-700 font-bold'
                        : isCurrent
                        ? 'text-primary font-bold'
                        : 'text-zinc-400'
                    }`}
                  >
                    {isDone ? (
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    ) : isCurrent ? (
                      <Loader2 className="h-3.5 w-3.5 text-primary animate-spin shrink-0" />
                    ) : (
                      <div className="h-3.5 w-3.5 rounded-full border border-zinc-300 shrink-0" />
                    )}
                    <span>{step}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-zinc-600 hover:bg-zinc-100 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isUploading}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#FFE5C6] hover:bg-[#FFD7A8] text-neutral-900 border border-[#FFC898]/70 text-xs font-bold rounded-xl shadow-xs transition-all"
          >
            <UploadCloud className="h-3.5 w-3.5 text-neutral-700" />
            <span>{isUploading ? 'Executing Pipeline...' : 'Deploy via S3 Pipeline'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
