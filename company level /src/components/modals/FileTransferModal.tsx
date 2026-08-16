import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useRealtime } from '../../context/RealtimeContext';
import { UploadCloud, FileCode, CheckCircle2 } from 'lucide-react';

interface FileTransferModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FileTransferModal: React.FC<FileTransferModalProps> = ({ isOpen, onClose }) => {
  const { showToast } = useRealtime();
  const [sourcePath, setSourcePath] = useState('/home/linaro/Desktop/Tuckit/release-v1.2.04.tar.gz');
  const [destinationPath, setDestinationPath] = useState('/opt/tuckit/app/');
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    let p = 0;
    const interval = setInterval(() => {
      p += 25;
      setProgress(p);
      if (p >= 100) {
        clearInterval(interval);
        setIsUploading(false);
        showToast('Archive payload synchronized to AWS S3 & target nodes', 'success');
        onClose();
      }
    }, 400);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Terminal File Transfer & Patch Pipeline"
      subtitle="Push assets, UI builds, audio prompts, and patches to remote terminals via AWS S3"
    >
      <form onSubmit={handleUpload} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
            Source Archive File / URL
          </label>
          <input
            type="text"
            value={sourcePath}
            onChange={e => setSourcePath(e.target.value)}
            className="w-full h-10 px-3 bg-zinc-50 border border-zinc-200 rounded-lg text-xs font-mono text-zinc-800 focus:bg-white focus:border-primary outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
            Destination Path on Remote Kiosk
          </label>
          <input
            type="text"
            value={destinationPath}
            onChange={e => setDestinationPath(e.target.value)}
            className="w-full h-10 px-3 bg-zinc-50 border border-zinc-200 rounded-lg text-xs font-mono text-zinc-800 focus:bg-white focus:border-primary outline-none"
            required
          />
        </div>

        {isUploading && (
          <div className="space-y-1.5 pt-2">
            <div className="flex justify-between text-xs text-zinc-500 font-mono">
              <span>Uploading to S3 Edge Gateway...</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-zinc-200 h-2 rounded-full overflow-hidden">
              <div
                className="bg-primary h-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-zinc-600 hover:bg-zinc-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isUploading}
            className="flex items-center gap-1.5 px-4 py-2 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-lg shadow-sm transition-all"
          >
            <UploadCloud className="h-3.5 w-3.5" />
            <span>{isUploading ? 'Dispatching...' : 'Upload & Deploy Patch'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
