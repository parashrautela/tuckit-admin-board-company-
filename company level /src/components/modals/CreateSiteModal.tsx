import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useRealtime } from '../../context/RealtimeContext';
import { Terminal } from '../../types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Plus } from 'lucide-react';

interface CreateSiteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateSiteModal: React.FC<CreateSiteModalProps> = ({ isOpen, onClose }) => {
  const { addSiteAndTerminal } = useRealtime();
  const [siteName, setSiteName] = useState('');
  const [state, setState] = useState('Karnataka');
  const [city, setCity] = useState('Bangalore');
  const [siteType, setSiteType] = useState<Terminal['siteType']>('Mall');
  const [address, setAddress] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!siteName || !city) return;
    addSiteAndTerminal(siteName, state, city, siteType);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Site & Deploy Terminal"
      subtitle="Register new geographical facility and allocate hardware terminal code"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-neutral-700">
            Site / Facility Name
          </label>
          <Input
            type="text"
            value={siteName}
            onChange={e => setSiteName(e.target.value)}
            placeholder="e.g. Nexus Grand Central Level 2"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-neutral-700">
              State
            </label>
            <Select
              value={state}
              onChange={e => setState(e.target.value)}
              containerClassName="w-full"
            >
              <option value="Karnataka">Karnataka</option>
              <option value="Maharashtra">Maharashtra</option>
              <option value="Telangana">Telangana</option>
              <option value="Delhi">Delhi</option>
              <option value="Tamil Nadu">Tamil Nadu</option>
              <option value="Uttar Pradesh">Uttar Pradesh</option>
              <option value="Kerala">Kerala</option>
              <option value="Gujarat">Gujarat</option>
              <option value="Rajasthan">Rajasthan</option>
              <option value="Goa">Goa</option>
            </Select>
          </div>
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-neutral-700">
              City
            </label>
            <Input
              type="text"
              value={city}
              onChange={e => setCity(e.target.value)}
              placeholder="e.g. Bangalore"
              required
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-neutral-700">
            Venue / Site Category
          </label>
          <Select
            value={siteType}
            onChange={e => setSiteType(e.target.value as Terminal['siteType'])}
            containerClassName="w-full"
          >
            <option value="Mall">Mall & Shopping Center</option>
            <option value="Metro">Metro Station</option>
            <option value="Railway">Railway Station</option>
            <option value="Airport">Airport Terminal</option>
            <option value="Campus">University / Campus</option>
            <option value="Temple">Temple / Religious Shrine</option>
            <option value="Commercial">Commercial Hub</option>
          </Select>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-neutral-700">
            Address & Physical Landmark
          </label>
          <textarea
            value={address}
            onChange={e => setAddress(e.target.value)}
            placeholder="Ground Floor, Near North Entry Gate..."
            rows={2}
            className="flex w-full rounded-md border border-neutral-200 bg-white p-3 text-sm shadow-xs text-neutral-900 placeholder:text-neutral-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
          />
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-100">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            size="sm"
          >
            <Plus className="h-4 w-4" />
            <span>Create & Register Terminal</span>
          </Button>
        </div>
      </form>
    </Modal>
  );
};
