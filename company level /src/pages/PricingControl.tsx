import React, { useState } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import {
  Box,
  Monitor,
  RotateCw,
  Plus,
  Edit2,
  Check,
  Send,
  ZoomIn,
  ZoomOut,
  Maximize2,
  CheckCircle2,
  Layers,
  Clock,
  IndianRupee,
  Sliders,
  Trash2,
} from 'lucide-react';

interface PricingPackage {
  hours: number;
  rate: number;
}

interface ModelPricingConfig {
  id: string;
  sizeKey: 'SMALL' | 'MEDIUM' | 'LARGE' | 'EXTRA LARGE';
  modelCode: string;
  status: 'ACTIVE' | 'INACTIVE';
  baseHourlyRate: number;
  modifyCharge: number;
  packages: PricingPackage[];
  totalUnits: number;
}

interface TerminalNode {
  id: string;
  name: string;
  size: 'S' | 'M' | 'L' | 'XL' | 'KIOSK';
  isScreen?: boolean;
  status?: 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE';
}

const initialModelConfigs: ModelPricingConfig[] = [
  {
    id: 'cfg-small',
    sizeKey: 'SMALL',
    modelCode: 'S MODEL',
    status: 'ACTIVE',
    baseHourlyRate: 16,
    modifyCharge: 5,
    totalUnits: 4,
    packages: [
      { hours: 1, rate: 16 },
      { hours: 3, rate: 42 },
      { hours: 5, rate: 63 },
      { hours: 8, rate: 101 },
      { hours: 12, rate: 127 },
    ],
  },
  {
    id: 'cfg-medium',
    sizeKey: 'MEDIUM',
    modelCode: 'M MODEL',
    status: 'ACTIVE',
    baseHourlyRate: 25,
    modifyCharge: 10,
    totalUnits: 4,
    packages: [
      { hours: 1, rate: 25 },
      { hours: 3, rate: 63 },
      { hours: 5, rate: 99 },
      { hours: 8, rate: 150 },
      { hours: 12, rate: 195 },
    ],
  },
  {
    id: 'cfg-large',
    sizeKey: 'LARGE',
    modelCode: 'L MODEL',
    status: 'ACTIVE',
    baseHourlyRate: 40,
    modifyCharge: 15,
    totalUnits: 3,
    packages: [
      { hours: 1, rate: 40 },
      { hours: 3, rate: 95 },
      { hours: 5, rate: 150 },
      { hours: 8, rate: 220 },
      { hours: 12, rate: 290 },
    ],
  },
  {
    id: 'cfg-xl',
    sizeKey: 'EXTRA LARGE',
    modelCode: 'XL MODEL',
    status: 'ACTIVE',
    baseHourlyRate: 60,
    modifyCharge: 20,
    totalUnits: 1,
    packages: [
      { hours: 1, rate: 60 },
      { hours: 3, rate: 145 },
      { hours: 5, rate: 230 },
      { hours: 8, rate: 340 },
      { hours: 12, rate: 450 },
    ],
  },
];

export const PricingControl: React.FC = () => {
  // Terminal selector state
  const [selectedState, setSelectedState] = useState('DELHI');
  const [selectedCity, setSelectedCity] = useState('CHANDNI CHOWK');
  const [selectedTerminal, setSelectedTerminal] = useState('OMXFFDELB');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [cashFlowEnabled, setCashFlowEnabled] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [selectedModelKey, setSelectedModelKey] = useState<string | null>(null);

  // Pricing configuration state
  const [configs, setConfigs] = useState<ModelPricingConfig[]>(initialModelConfigs);
  const [editingConfigId, setEditingConfigId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState('1:50:12 AM');

  // Terminal Bay Layout Matrix
  const bayColumns = [
    // Column 1 (Left): S1, S2, M3, M4
    [
      { id: 'S1', name: 'S1', size: 'S', status: 'AVAILABLE' },
      { id: 'S2', name: 'S2', size: 'S', status: 'AVAILABLE' },
      { id: 'M3', name: 'M3', size: 'M', status: 'AVAILABLE' },
      { id: 'M4', name: 'M4', size: 'M', status: 'AVAILABLE' },
    ],
    // Column 2 (Center): S5, KIOSK Node, M6, M7
    [
      { id: 'S5', name: 'S5', size: 'S', status: 'AVAILABLE' },
      { id: 'KIOSK', name: 'KIOSK', size: 'KIOSK', isScreen: true },
      { id: 'M6', name: 'M6', size: 'M', status: 'AVAILABLE' },
      { id: 'M7', name: 'M7', size: 'M', status: 'MAINTENANCE' },
    ],
    // Column 3 (Right): L-8, L-9, L-10, XL11
    [
      { id: 'L-8', name: 'L-8', size: 'L', status: 'AVAILABLE' },
      { id: 'L-9', name: 'L-9', size: 'L', status: 'AVAILABLE' },
      { id: 'L-10', name: 'L-10', size: 'L', status: 'AVAILABLE' },
      { id: 'XL11', name: 'XL11', size: 'XL', status: 'AVAILABLE' },
    ],
  ];

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      const now = new Date();
      setLastUpdated(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      showToast('Telemetry and pricing synchronized with edge terminal');
    }, 600);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleUpdateBaseRate = (configId: string, value: number) => {
    setConfigs(prev =>
      prev.map(c => (c.id === configId ? { ...c, baseHourlyRate: value } : c))
    );
  };

  const handleUpdateModifyCharge = (configId: string, value: number) => {
    setConfigs(prev =>
      prev.map(c => (c.id === configId ? { ...c, modifyCharge: value } : c))
    );
  };

  const handleUpdatePackageRate = (configId: string, pkgIndex: number, newRate: number) => {
    setConfigs(prev =>
      prev.map(c => {
        if (c.id !== configId) return c;
        const nextPackages = [...c.packages];
        nextPackages[pkgIndex] = { ...nextPackages[pkgIndex], rate: newRate };
        return { ...c, packages: nextPackages };
      })
    );
  };

  const handleAddPackage = (configId: string) => {
    setConfigs(prev =>
      prev.map(c => {
        if (c.id !== configId) return c;
        const lastHours = c.packages.length > 0 ? c.packages[c.packages.length - 1].hours : 1;
        const newHours = lastHours + (lastHours >= 12 ? 12 : 4);
        const newRate = Math.round(newHours * c.baseHourlyRate * 0.85);
        return {
          ...c,
          packages: [...c.packages, { hours: newHours, rate: newRate }],
        };
      })
    );
    showToast('Added new pricing package tier');
  };

  const handleRemovePackage = (configId: string, pkgIndex: number) => {
    setConfigs(prev =>
      prev.map(c => {
        if (c.id !== configId) return c;
        return {
          ...c,
          packages: c.packages.filter((_, idx) => idx !== pkgIndex),
        };
      })
    );
  };

  const handleReleaseSetting = (config: ModelPricingConfig) => {
    const now = new Date();
    setLastUpdated(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    setEditingConfigId(null);
    showToast(`Released & deployed ${config.sizeKey} pricing rules to kiosk ${selectedTerminal}`);
  };

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto pb-12">
      {/* ── Top Bar: Global Hub Identifier & Terminal Switcher ── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-4 sm:px-6 rounded-2xl border border-neutral-200 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-700 shrink-0">
            <Layers className="size-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block">
              INVENTORY LOGIC - GLOBAL HUB
            </span>
            <div className="flex items-center gap-2 text-sm font-bold text-neutral-900 tracking-tight mt-0.5">
              <span>{selectedState}</span>
              <span className="text-neutral-300">/</span>
              <span>{selectedCity}</span>
              <span className="text-neutral-300">/</span>
              <span className="font-mono text-primary-600">{selectedTerminal}</span>
            </div>
          </div>
        </div>

        {/* Filter Dropdowns */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <Select
            value={selectedState}
            onChange={e => setSelectedState(e.target.value)}
            className="w-32 bg-white text-xs font-semibold"
          >
            <option value="DELHI">DELHI</option>
            <option value="KARNATAKA">KARNATAKA</option>
            <option value="MAHARASHTRA">MAHARASHTRA</option>
            <option value="TAMIL NADU">TAMIL NADU</option>
          </Select>

          <Select
            value={selectedCity}
            onChange={e => setSelectedCity(e.target.value)}
            className="w-44 bg-white text-xs font-semibold"
          >
            <option value="CHANDNI CHOWK">CHANDNI CHOWK</option>
            <option value="MG ROAD METRO">MG ROAD METRO</option>
            <option value="CST MUMBAI">CST MUMBAI</option>
            <option value="INDIRANAGAR HUB">INDIRANAGAR HUB</option>
          </Select>

          <Select
            value={selectedTerminal}
            onChange={e => setSelectedTerminal(e.target.value)}
            className="w-36 bg-white font-mono text-xs font-semibold"
          >
            <option value="OMXFFDELB">OMXFFDELB</option>
            <option value="BLR-MTR-01">BLR-MTR-01</option>
            <option value="MUM-CST-03">MUM-CST-03</option>
            <option value="DEL-CP-02">DEL-CP-02</option>
          </Select>

          <Button
            variant="outline"
            size="icon"
            onClick={handleRefresh}
            className="size-9 rounded-lg border-neutral-300 hover:bg-neutral-100 text-neutral-700"
            title="Sync Telemetry"
          >
            <RotateCw className={`size-4 ${isRefreshing ? 'animate-spin text-primary-600' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold rounded-xl flex items-center gap-2.5 animate-in fade-in slide-in-from-top-1">
          <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ── Main Workspace: 2 Columns ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ── Left Column (4 cols): Physical Locker Bay Schematic + Summary ── */}
        <div className="lg:col-span-4 flex flex-col gap-5">
          {/* Hardware Bay Canvas */}
          <Card className="border border-neutral-200 bg-white shadow-2xs overflow-hidden">
            <CardHeader className="p-4 pb-3 border-b border-neutral-100 flex flex-row items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="size-7 rounded-lg bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-700">
                  <Layers className="size-3.5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block">ARCHITECTURE</span>
                  <span className="font-mono text-xs font-bold text-neutral-900">
                    {selectedTerminal} · 12 NODES
                  </span>
                </div>
              </div>

              {/* Payments Cash Flow Toggle & Fee */}
              <div className="flex items-center gap-2.5">
                <div className="text-right">
                  <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider block leading-none">
                    PAYMENTS
                  </span>
                  <span className="text-[10px] font-medium text-neutral-600 block leading-tight">Cash Flow</span>
                </div>
                <button
                  type="button"
                  onClick={() => setCashFlowEnabled(!cashFlowEnabled)}
                  className={`w-9 h-5 rounded-full transition-colors relative p-0.5 ${
                    cashFlowEnabled ? 'bg-primary-500' : 'bg-neutral-300'
                  }`}
                >
                  <div
                    className={`size-4 rounded-full bg-white transition-transform ${
                      cashFlowEnabled ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
                <div className="border-l border-neutral-200 pl-2 text-right">
                  <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider block leading-none">
                    CASH FEE
                  </span>
                  <span className="text-[10px] font-bold font-mono text-neutral-900 leading-tight">₹20 / Trans</span>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6 flex flex-col items-center justify-center bg-neutral-50/40">
              {/* Locker Grid Bay */}
              <div
                className="w-full max-w-[280px] p-4 bg-white border border-neutral-200/90 rounded-2xl shadow-sm grid grid-cols-3 gap-3 transition-transform duration-200"
                style={{ transform: `scale(${zoomLevel / 100})` }}
              >
                {bayColumns.map((col, colIdx) => (
                  <div key={colIdx} className="flex flex-col gap-2.5">
                    {col.map(node => {
                      if (node.isScreen) {
                        return (
                          <div
                            key={node.id}
                            className="h-16 rounded-xl bg-neutral-900 border border-neutral-800 flex flex-col items-center justify-center text-white shadow-md relative group cursor-pointer"
                          >
                            <div className="size-2 rounded-full bg-blue-500 animate-ping absolute top-1.5 right-1.5" />
                            <Monitor className="size-5 text-neutral-200" />
                            <span className="text-[9px] font-mono font-bold text-neutral-400 mt-1">HOST</span>
                          </div>
                        );
                      }

                      const isXL = node.size === 'XL';
                      const isSelected =
                        (node.size === 'S' && selectedModelKey === 'SMALL') ||
                        (node.size === 'M' && selectedModelKey === 'MEDIUM') ||
                        (node.size === 'L' && selectedModelKey === 'LARGE') ||
                        (node.size === 'XL' && selectedModelKey === 'EXTRA LARGE');

                      const isMaintenance = node.status === 'MAINTENANCE';

                      return (
                        <button
                          key={node.id}
                          type="button"
                          onClick={() => {
                            if (node.size === 'S') setSelectedModelKey('SMALL');
                            if (node.size === 'M') setSelectedModelKey('MEDIUM');
                            if (node.size === 'L') setSelectedModelKey('LARGE');
                            if (node.size === 'XL') setSelectedModelKey('EXTRA LARGE');
                          }}
                          className={`rounded-xl border flex flex-col items-center justify-center transition-all cursor-pointer font-mono font-bold select-none ${
                            isXL ? 'h-36' : 'h-14'
                          } ${
                            isSelected
                              ? 'bg-primary-50 border-primary-500 text-primary-700 shadow-md ring-2 ring-primary-500/20'
                              : isMaintenance
                              ? 'bg-rose-50/60 border-rose-300 text-rose-700 hover:bg-rose-50'
                              : 'bg-neutral-50 hover:bg-neutral-100/80 border-neutral-200 text-neutral-800'
                          }`}
                        >
                          <span className="text-xs">{node.name}</span>
                          <span className="text-[9px] font-medium text-neutral-400 uppercase mt-0.5">
                            {node.size}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>

              {/* Viewport Zoom Controls */}
              <div className="flex items-center gap-2 mt-5 bg-white border border-neutral-200/90 rounded-xl px-2 py-1 shadow-2xs">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setZoomLevel(prev => Math.max(75, prev - 10))}
                  className="size-6 text-neutral-600 hover:text-neutral-900"
                  title="Zoom Out"
                >
                  <ZoomOut className="size-3.5" />
                </Button>
                <span className="text-xs font-mono font-bold text-neutral-700 min-w-[36px] text-center">
                  {zoomLevel}%
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setZoomLevel(prev => Math.min(125, prev + 10))}
                  className="size-6 text-neutral-600 hover:text-neutral-900"
                  title="Zoom In"
                >
                  <ZoomIn className="size-3.5" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Technical Summary */}
          <Card className="border border-neutral-200 bg-white shadow-2xs">
            <CardHeader className="p-4 pb-3 border-b border-neutral-100">
              <CardTitle className="text-xs font-bold text-neutral-600 uppercase tracking-wider">
                TECHNICAL SUMMARY
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-3 pb-3 border-b border-neutral-100">
                <div>
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                    TOTAL NODES
                  </span>
                  <span className="text-xl font-extrabold font-mono text-neutral-900">12</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                    CATEGORIES
                  </span>
                  <span className="text-xl font-extrabold font-mono text-primary-600">4</span>
                </div>
              </div>

              <div className="space-y-2.5">
                {configs.map(cfg => (
                  <div
                    key={cfg.id}
                    onClick={() => setSelectedModelKey(cfg.sizeKey)}
                    className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
                      selectedModelKey === cfg.sizeKey ? 'bg-primary-50 border border-primary-200' : 'hover:bg-neutral-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`size-2 rounded-full ${
                          cfg.sizeKey === 'SMALL'
                            ? 'bg-blue-500'
                            : cfg.sizeKey === 'MEDIUM'
                            ? 'bg-emerald-500'
                            : cfg.sizeKey === 'LARGE'
                            ? 'bg-amber-500'
                            : 'bg-purple-500'
                        }`}
                      />
                      <span className="text-xs font-bold text-neutral-800 uppercase tracking-wider">
                        {cfg.sizeKey}
                      </span>
                    </div>
                    <span className="text-xs font-mono font-bold text-neutral-600">
                      {cfg.totalUnits} Units
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ── Right Column (8 cols): Pricing Settings Console ── */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Console Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-200">
            <div>
              <h2 className="text-xl font-extrabold text-neutral-900 uppercase tracking-tight">
                PRICING SETTINGS
              </h2>
              <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider mt-0.5">
                CONFIGURE PRICING FOR SELECTED TERMINAL
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Badge
                variant="outline"
                className="bg-emerald-50 border-emerald-300 text-emerald-800 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 px-2.5 py-1"
              >
                <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>SYNCHRONIZED</span>
              </Badge>
              <span className="text-[11px] font-mono text-neutral-500 font-semibold">
                LAST UPDATE: {lastUpdated}
              </span>
            </div>
          </div>

          {/* Model Pricing Cards List */}
          <div className="space-y-6">
            {configs.map(config => {
              const isEditing = editingConfigId === config.id;
              const isHighlighted = selectedModelKey === config.sizeKey;

              return (
                <Card
                  key={config.id}
                  className={`border transition-all shadow-2xs overflow-hidden ${
                    isHighlighted
                      ? 'border-primary-500 ring-2 ring-primary-500/20 bg-white'
                      : 'border-neutral-200/90 bg-white'
                  }`}
                >
                  {/* Card Header */}
                  <CardHeader className="p-5 pb-4 border-b border-neutral-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-xl bg-neutral-100 border border-neutral-200 text-neutral-800 flex items-center justify-center shrink-0 shadow-2xs">
                        <Box className="size-5" strokeWidth={1.8} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-extrabold text-neutral-900 uppercase tracking-tight">
                            {config.sizeKey}
                          </h3>
                          <Badge
                            variant="secondary"
                            className="text-[10px] font-mono font-bold text-neutral-600 bg-neutral-100 border-neutral-200"
                          >
                            {config.modelCode}
                          </Badge>
                          <Badge
                            variant="outline"
                            className="bg-emerald-50 border-emerald-300 text-emerald-800 text-[10px] font-bold uppercase tracking-wider"
                          >
                            • ACTIVE
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingConfigId(isEditing ? null : config.id)}
                        className={`text-xs font-bold uppercase tracking-wider rounded-xl ${
                          isEditing
                            ? 'bg-neutral-900 text-white hover:bg-neutral-800 border-neutral-900'
                            : 'bg-white hover:bg-neutral-100 text-neutral-800 border-neutral-300'
                        }`}
                      >
                        <Edit2 className="size-3.5 mr-1.5" />
                        {isEditing ? 'DONE EDITING' : 'EDIT CONFIGURATION'}
                      </Button>

                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleAddPackage(config.id)}
                        className="text-xs font-bold uppercase tracking-wider rounded-xl bg-white hover:bg-neutral-100 text-neutral-800 border-neutral-300"
                      >
                        <Plus className="size-3.5 mr-1" />
                        ADD PACKAGE
                      </Button>
                    </div>
                  </CardHeader>

                  <CardContent className="p-6 space-y-6 bg-white">
                    {/* 2 Column Settings Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                      {/* Left Sub-Column (5 cols): Base Rate & Modify Charge */}
                      <div className="md:col-span-5 space-y-5">
                        {/* Base Hourly Rate */}
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider">
                              BASE HOURLY RATE
                            </label>
                          </div>
                          <span className="text-[11px] text-neutral-500 block mb-2 font-medium">
                            FOUNDATIONAL COST (INR)
                          </span>
                          <div className="relative">
                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 font-bold text-sm">
                              ₹
                            </span>
                            <Input
                              type="number"
                              disabled={!isEditing}
                              value={config.baseHourlyRate}
                              onChange={e => handleUpdateBaseRate(config.id, Number(e.target.value))}
                              className={`pl-8 h-11 text-base font-mono font-bold text-right pr-4 rounded-xl border ${
                                isEditing
                                  ? 'border-primary-400 bg-white shadow-2xs'
                                  : 'border-neutral-200 bg-neutral-50/50 text-neutral-900'
                              }`}
                            />
                          </div>
                        </div>

                        {/* Modify Booking Charge */}
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider">
                              MODIFY BOOKING CHARGE
                            </label>
                          </div>
                          <span className="text-[11px] text-neutral-500 block mb-2 font-medium">
                            ONE TIME CHARGE
                          </span>
                          <div className="relative">
                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 font-bold text-sm">
                              ₹
                            </span>
                            <Input
                              type="number"
                              disabled={!isEditing}
                              value={config.modifyCharge}
                              onChange={e => handleUpdateModifyCharge(config.id, Number(e.target.value))}
                              className={`pl-8 h-11 text-base font-mono font-bold text-right pr-4 rounded-xl border ${
                                isEditing
                                  ? 'border-primary-400 bg-white shadow-2xs'
                                  : 'border-neutral-200 bg-neutral-50/50 text-neutral-900'
                              }`}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Right Sub-Column (7 cols): Pricing Packages */}
                      <div className="md:col-span-7 space-y-3">
                        <div className="mb-2">
                          <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider block">
                            PRICING PACKAGES
                          </label>
                          <span className="text-[11px] text-neutral-500 block mt-0.5 font-medium">
                            DURATION-BASED FIXED OPTIONS
                          </span>
                        </div>

                        <div className="space-y-2.5">
                          {config.packages.map((pkg, idx) => (
                            <div
                              key={idx}
                              className="p-3 px-4 rounded-xl bg-neutral-50/60 border border-neutral-200/80 flex items-center justify-between gap-3 shadow-2xs"
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <Clock className="size-4 text-neutral-500" />
                                <span className="font-mono font-bold text-xs text-neutral-900">
                                  {pkg.hours} HRS
                                </span>
                              </div>

                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
                                  FIXED RATE
                                </span>
                                {isEditing ? (
                                  <div className="relative w-24">
                                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400 text-xs font-bold">
                                      ₹
                                    </span>
                                    <Input
                                      type="number"
                                      value={pkg.rate}
                                      onChange={e =>
                                        handleUpdatePackageRate(config.id, idx, Number(e.target.value))
                                      }
                                      className="pl-6 h-8 text-xs font-mono font-bold text-right pr-2 rounded-lg border-primary-400 bg-white"
                                    />
                                  </div>
                                ) : (
                                  <span className="font-mono font-extrabold text-sm text-neutral-900 min-w-[50px] text-right">
                                    ₹ {pkg.rate}
                                  </span>
                                )}

                                {isEditing && config.packages.length > 1 && (
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleRemovePackage(config.id, idx)}
                                    className="size-7 text-neutral-400 hover:text-rose-600"
                                    title="Remove tier"
                                  >
                                    <Trash2 className="size-3.5" />
                                  </Button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Bottom Card Action */}
                    <div className="pt-4 border-t border-neutral-100 flex items-center justify-end">
                      <Button
                        type="button"
                        variant="default"
                        onClick={() => handleReleaseSetting(config)}
                        className="px-6 py-2.5 h-10 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all active:scale-[0.98] flex items-center gap-2"
                      >
                        <Send className="size-3.5" />
                        <span>RELEASE SETTING</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
