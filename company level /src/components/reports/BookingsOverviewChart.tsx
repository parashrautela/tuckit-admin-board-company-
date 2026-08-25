import React, { useState, useMemo } from 'react';
import { Calendar, ChevronDown } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Select } from '@/components/ui/select';

interface TimePoint {
  date: string;
  web: number;
  terminal: number;
  whatsapp: number;
  total: number;
}

const DEFAULT_TIME_SERIES: TimePoint[] = [
  { date: 'Jul 26', web: 1080, terminal: 940, whatsapp: 310, total: 2330 },
  { date: 'Jul 29', web: 1520, terminal: 1380, whatsapp: 420, total: 3320 },
  { date: 'Aug 03', web: 1140, terminal: 1060, whatsapp: 330, total: 2530 },
  { date: 'Aug 08', web: 1650, terminal: 1520, whatsapp: 490, total: 3660 },
  { date: 'Aug 13', web: 1260, terminal: 1190, whatsapp: 360, total: 2810 },
  { date: 'Aug 18', web: 1780, terminal: 1640, whatsapp: 530, total: 3950 },
  { date: 'Aug 22', web: 1390, terminal: 1310, whatsapp: 390, total: 3090 },
];

export const BookingsOverviewChart: React.FC = () => {
  const [selectedTerminal, setSelectedTerminal] = useState<string>('ALL');
  const [visibleChannels, setVisibleChannels] = useState<{ [key: string]: boolean }>({
    Web: true,
    Terminal: true,
    WhatsApp: true,
    Total: true,
  });
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const toggleChannel = (channel: string) => {
    setVisibleChannels(prev => ({ ...prev, [channel]: !prev[channel] }));
  };

  // Dimensions & Scale mapping
  const width = 900;
  const height = 240;
  const padding = { top: 25, right: 30, bottom: 35, left: 45 };
  const graphWidth = width - padding.left - padding.right;
  const graphHeight = height - padding.top - padding.bottom;
  const maxY = 4000;

  const getCoordinates = (points: number[]) => {
    return points.map((val, i) => ({
      x: padding.left + (i / (points.length - 1)) * graphWidth,
      y: padding.top + (1 - val / maxY) * graphHeight,
    }));
  };

  // Generate smooth cubic bezier spline curve
  const createSplinePath = (coords: { x: number; y: number }[]) => {
    if (!coords.length) return '';
    let d = `M ${coords[0].x} ${coords[0].y}`;
    for (let i = 0; i < coords.length - 1; i++) {
      const p0 = coords[i === 0 ? 0 : i - 1];
      const p1 = coords[i];
      const p2 = coords[i + 1];
      const p3 = coords[i + 2] || p2;
      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;
      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }
    return d;
  };

  const createAreaPath = (coords: { x: number; y: number }[]) => {
    if (!coords.length) return '';
    const linePath = createSplinePath(coords);
    const bottomY = padding.top + graphHeight;
    return `${linePath} L ${coords[coords.length - 1].x} ${bottomY} L ${coords[0].x} ${bottomY} Z`;
  };

  const webCoords = useMemo(() => getCoordinates(DEFAULT_TIME_SERIES.map(d => d.web)), []);
  const terminalCoords = useMemo(() => getCoordinates(DEFAULT_TIME_SERIES.map(d => d.terminal)), []);
  const whatsappCoords = useMemo(() => getCoordinates(DEFAULT_TIME_SERIES.map(d => d.whatsapp)), []);
  const totalCoords = useMemo(() => getCoordinates(DEFAULT_TIME_SERIES.map(d => d.total)), []);

  const yTicks = [
    { value: '4k', y: padding.top },
    { value: '3k', y: padding.top + graphHeight * 0.25 },
    { value: '2k', y: padding.top + graphHeight * 0.5 },
    { value: '1k', y: padding.top + graphHeight * 0.75 },
    { value: '0', y: padding.top + graphHeight },
  ];

  return (
    <Card className="overflow-hidden border border-neutral-200 shadow-2xs">
      <CardHeader className="p-5 pb-3 border-b border-neutral-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <CardTitle className="text-base font-bold text-neutral-900 tracking-tight">Bookings Overview</CardTitle>
          </div>
          <p className="text-xs text-neutral-500 mt-0.5">Compare booking trends across different sources.</p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 text-xs">
          {/* Channel Visibility Toggles */}
          <div className="flex items-center gap-3 bg-neutral-50 px-3 py-1.5 rounded-lg border border-neutral-200">
            <button
              type="button"
              onClick={() => toggleChannel('Web')}
              className={`flex items-center gap-1.5 font-medium transition-opacity ${visibleChannels.Web ? 'opacity-100' : 'opacity-40'}`}
            >
              <span className="size-2 rounded-full bg-[#5B84B1]" />
              <span className="text-neutral-700">Web</span>
            </button>

            <button
              type="button"
              onClick={() => toggleChannel('Terminal')}
              className={`flex items-center gap-1.5 font-medium transition-opacity ${visibleChannels.Terminal ? 'opacity-100' : 'opacity-40'}`}
            >
              <span className="size-2 rounded-full bg-[#E58A3C]" />
              <span className="text-neutral-700">Terminal</span>
            </button>

            <button
              type="button"
              onClick={() => toggleChannel('WhatsApp')}
              className={`flex items-center gap-1.5 font-medium transition-opacity ${visibleChannels.WhatsApp ? 'opacity-100' : 'opacity-40'}`}
            >
              <span className="size-2 rounded-full bg-[#4E9F8E]" />
              <span className="text-neutral-700">WhatsApp</span>
            </button>

            <button
              type="button"
              onClick={() => toggleChannel('Total')}
              className={`flex items-center gap-1.5 font-medium transition-opacity ${visibleChannels.Total ? 'opacity-100' : 'opacity-40'}`}
            >
              <span className="w-3 h-0.5 bg-neutral-400" />
              <span className="text-neutral-700">Total</span>
            </button>
          </div>

          {/* Terminal Scope Dropdown */}
          <Select
            value={selectedTerminal}
            onChange={e => setSelectedTerminal(e.target.value)}
          >
            <option value="ALL">All Terminals</option>
            <option value="MALL-BLR-01">MALL-BLR-01</option>
            <option value="METRO-DEL-04">METRO-DEL-04</option>
            <option value="AIRP-HYD-01">AIRP-HYD-01</option>
          </Select>

          {/* Date Range Badge */}
          <div className="h-8 px-3 bg-white border border-neutral-200 rounded-lg flex items-center gap-1.5 text-neutral-700 font-mono text-xs">
            <Calendar className="size-3.5 text-neutral-400" />
            <span>Jul 26, 2026 - Aug 22, 2026</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-5 flex flex-col gap-6">
        {/* SVG Time-Series Spline Area Chart */}
        <div className="relative w-full overflow-hidden select-none">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-auto overflow-visible"
            onMouseLeave={() => setHoveredIdx(null)}
          >
            <defs>
              {/* Soft Gradient Area Fills */}
              <linearGradient id="grad-web" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#5B84B1" stopOpacity="0.22" />
                <stop offset="100%" stopColor="#5B84B1" stopOpacity="0.01" />
              </linearGradient>
              <linearGradient id="grad-terminal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#E58A3C" stopOpacity="0.22" />
                <stop offset="100%" stopColor="#E58A3C" stopOpacity="0.01" />
              </linearGradient>
              <linearGradient id="grad-whatsapp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4E9F8E" stopOpacity="0.22" />
                <stop offset="100%" stopColor="#4E9F8E" stopOpacity="0.01" />
              </linearGradient>
              <linearGradient id="grad-total" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#94A3B8" stopOpacity="0.10" />
                <stop offset="100%" stopColor="#94A3B8" stopOpacity="0.00" />
              </linearGradient>
            </defs>

            {/* Horizontal Gridlines & Y-Axis Labels */}
            {yTicks.map(t => (
              <g key={t.value}>
                <line
                  x1={padding.left}
                  y1={t.y}
                  x2={width - padding.right}
                  y2={t.y}
                  stroke="#F1F5F9"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
                <text
                  x={padding.left - 8}
                  y={t.y + 4}
                  textAnchor="end"
                  className="text-xs font-mono fill-neutral-500 font-medium"
                >
                  {t.value}
                </text>
              </g>
            ))}

            {/* X-Axis Date Labels */}
            {DEFAULT_TIME_SERIES.map((d, i) => {
              const x = padding.left + (i / (DEFAULT_TIME_SERIES.length - 1)) * graphWidth;
              return (
                <text
                  key={d.date}
                  x={x}
                  y={height - 10}
                  textAnchor="middle"
                  className="text-xs font-mono fill-neutral-500 font-medium"
                >
                  {d.date}
                </text>
              );
            })}

            {/* Area Fills */}
            {visibleChannels.Total && (
              <path d={createAreaPath(totalCoords)} fill="url(#grad-total)" />
            )}
            {visibleChannels.Web && (
              <path d={createAreaPath(webCoords)} fill="url(#grad-web)" />
            )}
            {visibleChannels.Terminal && (
              <path d={createAreaPath(terminalCoords)} fill="url(#grad-terminal)" />
            )}
            {visibleChannels.WhatsApp && (
              <path d={createAreaPath(whatsappCoords)} fill="url(#grad-whatsapp)" />
            )}

            {/* Multi-Line Curves */}
            {visibleChannels.Total && (
              <path
                d={createSplinePath(totalCoords)}
                fill="none"
                stroke="#94A3B8"
                strokeWidth="2"
                strokeDasharray="5 4"
                className="transition-all duration-300"
              />
            )}
            {visibleChannels.Web && (
              <path
                d={createSplinePath(webCoords)}
                fill="none"
                stroke="#5B84B1"
                strokeWidth="2.5"
                className="transition-all duration-300"
              />
            )}
            {visibleChannels.Terminal && (
              <path
                d={createSplinePath(terminalCoords)}
                fill="none"
                stroke="#E58A3C"
                strokeWidth="2.5"
                className="transition-all duration-300"
              />
            )}
            {visibleChannels.WhatsApp && (
              <path
                d={createSplinePath(whatsappCoords)}
                fill="none"
                stroke="#4E9F8E"
                strokeWidth="2.5"
                className="transition-all duration-300"
              />
            )}

            {/* Interactive Data Point Markers on Hover */}
            {DEFAULT_TIME_SERIES.map((_, i) => {
              const isHovered = hoveredIdx === i;
              const x = padding.left + (i / (DEFAULT_TIME_SERIES.length - 1)) * graphWidth;

              return (
                <g key={i}>
                  {/* Invisible Hitbox Area for Smooth Hover Detection */}
                  <rect
                    x={x - (graphWidth / (DEFAULT_TIME_SERIES.length - 1)) / 2}
                    y={padding.top}
                    width={graphWidth / (DEFAULT_TIME_SERIES.length - 1)}
                    height={graphHeight}
                    fill="transparent"
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredIdx(i)}
                  />

                  {/* Vertical Crosshair Line */}
                  {isHovered && (
                    <line
                      x1={x}
                      y1={padding.top}
                      x2={x}
                      y2={padding.top + graphHeight}
                      stroke="#94A3B8"
                      strokeWidth="1"
                      strokeDasharray="3 3"
                    />
                  )}

                  {/* Circle Dots on Lines */}
                  {isHovered && visibleChannels.Web && (
                    <circle cx={webCoords[i].x} cy={webCoords[i].y} r="4.5" fill="#5B84B1" stroke="#FFFFFF" strokeWidth="2" />
                  )}
                  {isHovered && visibleChannels.Terminal && (
                    <circle cx={terminalCoords[i].x} cy={terminalCoords[i].y} r="4.5" fill="#E58A3C" stroke="#FFFFFF" strokeWidth="2" />
                  )}
                  {isHovered && visibleChannels.WhatsApp && (
                    <circle cx={whatsappCoords[i].x} cy={whatsappCoords[i].y} r="4.5" fill="#4E9F8E" stroke="#FFFFFF" strokeWidth="2" />
                  )}
                  {isHovered && visibleChannels.Total && (
                    <circle cx={totalCoords[i].x} cy={totalCoords[i].y} r="4.5" fill="#64748B" stroke="#FFFFFF" strokeWidth="2" />
                  )}
                </g>
              );
            })}
          </svg>

          {/* Floating Tooltip Box */}
          {hoveredIdx !== null && (
            <div
              className="absolute pointer-events-none bg-neutral-900/95 backdrop-blur-xs text-white p-2.5 rounded-xl shadow-lg border border-neutral-800 text-xs z-20 space-y-1.5 transition-all duration-150"
              style={{
                left: `${(padding.left + (hoveredIdx / (DEFAULT_TIME_SERIES.length - 1)) * graphWidth) / width * 100}%`,
                top: '10px',
                transform: hoveredIdx > 4 ? 'translateX(-105%)' : 'translateX(10%)',
              }}
            >
              <div className="font-bold text-xs text-neutral-200 border-b border-neutral-800 pb-1 font-mono">
                {DEFAULT_TIME_SERIES[hoveredIdx].date}, 2026
              </div>
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between gap-3">
                  <span className="flex items-center gap-1.5 text-[#8BB1DB]">
                    <span className="size-2 rounded-full bg-[#5B84B1]" /> Web:
                  </span>
                  <span className="font-mono font-bold">{DEFAULT_TIME_SERIES[hoveredIdx].web.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="flex items-center gap-1.5 text-[#F3AE77]">
                    <span className="size-2 rounded-full bg-[#E58A3C]" /> Terminal:
                  </span>
                  <span className="font-mono font-bold">{DEFAULT_TIME_SERIES[hoveredIdx].terminal.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="flex items-center gap-1.5 text-[#73C3B1]">
                    <span className="size-2 rounded-full bg-[#4E9F8E]" /> WhatsApp:
                  </span>
                  <span className="font-mono font-bold">{DEFAULT_TIME_SERIES[hoveredIdx].whatsapp.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between gap-3 pt-1 border-t border-neutral-800 font-bold text-neutral-200">
                  <span>Total:</span>
                  <span className="font-mono">{DEFAULT_TIME_SERIES[hoveredIdx].total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── Channel Performance Summary KPI Tiles ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-neutral-100">
          {/* Web Bookings Card */}
          <div className="p-4 bg-white rounded-xl border border-neutral-200 shadow-2xs hover:shadow-xs transition-all flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-600 uppercase tracking-wider">
                <span className="size-2 rounded-full bg-[#5B84B1]" />
                <span>Web Bookings</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold font-mono text-neutral-900">26,326</span>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                  +8.1%
                </span>
              </div>
              <p className="text-xs text-neutral-400 font-mono">Jul 26 - Aug 22, 2026</p>
            </div>
            {/* Sparkline Curve */}
            <div className="w-20 h-10">
              <svg viewBox="0 0 80 36" className="w-full h-full">
                <path
                  d="M 2 24 C 15 10, 25 30, 40 16 C 55 4, 65 22, 78 8"
                  fill="none"
                  stroke="#5B84B1"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>

          {/* Terminal Bookings Card */}
          <div className="p-4 bg-white rounded-xl border border-neutral-200 shadow-2xs hover:shadow-xs transition-all flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-600 uppercase tracking-wider">
                <span className="size-2 rounded-full bg-[#E58A3C]" />
                <span>Terminal Bookings</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold font-mono text-neutral-900">24,676</span>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                  +15.2%
                </span>
              </div>
              <p className="text-xs text-neutral-400 font-mono">Jul 26 - Aug 22, 2026</p>
            </div>
            {/* Sparkline Curve */}
            <div className="w-20 h-10">
              <svg viewBox="0 0 80 36" className="w-full h-full">
                <path
                  d="M 2 20 C 15 30, 25 8, 40 22 C 55 12, 65 28, 78 6"
                  fill="none"
                  stroke="#E58A3C"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>

          {/* WhatsApp Bookings Card */}
          <div className="p-4 bg-white rounded-xl border border-neutral-200 shadow-2xs hover:shadow-xs transition-all flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-600 uppercase tracking-wider">
                <span className="size-2 rounded-full bg-[#4E9F8E]" />
                <span>WhatsApp Bookings</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold font-mono text-neutral-900">7,277</span>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                  +5.0%
                </span>
              </div>
              <p className="text-xs text-neutral-400 font-mono">Jul 26 - Aug 22, 2026</p>
            </div>
            {/* Sparkline Curve */}
            <div className="w-20 h-10">
              <svg viewBox="0 0 80 36" className="w-full h-full">
                <path
                  d="M 2 28 C 15 18, 25 24, 40 12 C 55 20, 65 8, 78 14"
                  fill="none"
                  stroke="#4E9F8E"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
