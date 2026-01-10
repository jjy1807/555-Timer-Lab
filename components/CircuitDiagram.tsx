import React from 'react';
import { CircuitMode } from '../types';

interface CircuitDiagramProps {
  mode: CircuitMode;
}

const CircuitDiagram: React.FC<CircuitDiagramProps> = ({ mode }) => {
  // Schematic Symbol Helpers
  
  // Vertical Resistor
  const ResistorV = ({ x, y, label, color = "#60a5fa" }: { x: number, y: number, label: string, color?: string }) => (
    <g>
      <path 
        d={`M ${x} ${y} v 5 l -6 4 l 12 8 l -12 8 l 12 8 l -6 4 v 5`} 
        fill="none" 
        stroke={color} 
        strokeWidth="2"
      />
      <text x={x - 15} y={y + 25} fill={color} textAnchor="end" fontSize="12" fontFamily="monospace" fontWeight="bold">{label}</text>
    </g>
  );

  // Vertical Capacitor
  const CapacitorV = ({ x, y, label, color = "#ec4899" }: { x: number, y: number, label: string, color?: string }) => (
    <g>
      <line x1={x} y1={y} x2={x} y2={y + 18} stroke={color} strokeWidth="2" />
      <line x1={x - 10} y1={y + 18} x2={x + 10} y2={y + 18} stroke={color} strokeWidth="2" />
      <line x1={x - 10} y1={y + 24} x2={x + 10} y2={y + 24} stroke={color} strokeWidth="2" />
      <line x1={x} y1={y + 24} x2={x} y2={y + 42} stroke={color} strokeWidth="2" />
      <text x={x - 15} y={y + 25} fill={color} textAnchor="end" fontSize="12" fontFamily="monospace" fontWeight="bold">{label}</text>
    </g>
  );

  // Ground Symbol
  const Ground = ({ x, y }: { x: number, y: number }) => (
    <g>
      <line x1={x} y1={y} x2={x} y2={y + 10} stroke="#94a3b8" strokeWidth="2" />
      <line x1={x - 12} y1={y + 10} x2={x + 12} y2={y + 10} stroke="#94a3b8" strokeWidth="2" />
      <line x1={x - 7} y1={y + 15} x2={x + 7} y2={y + 15} stroke="#94a3b8" strokeWidth="2" />
      <line x1={x - 2} y1={y + 20} x2={x + 2} y2={y + 20} stroke="#94a3b8" strokeWidth="2" />
    </g>
  );

  // VCC Label
  const VccLabel = ({ x, y }: { x: number, y: number }) => (
    <g>
       <line x1={x} y1={y} x2={x} y2={y - 15} stroke="#ef4444" strokeWidth="2" />
       <circle cx={x} cy={y - 15} r="3" fill="#ef4444" />
       <text x={x} y={y - 22} textAnchor="middle" fill="#ef4444" fontSize="12" fontWeight="bold">+Vcc</text>
    </g>
  );

  // Connection Dot
  const ConnectionDot = ({ x, y }: { x: number, y: number }) => (
    <circle cx={x} cy={y} r="3" fill="#cbd5e1" />
  );

  return (
    <div className="w-full h-full flex items-center justify-center p-4 bg-slate-900 border border-slate-700 rounded-xl shadow-lg overflow-hidden relative select-none">
      <div className="absolute top-2 left-4 flex flex-col">
        <span className="text-xs font-bold text-slate-500 tracking-wider">SCHEMATIC</span>
        <span className="text-sm font-mono text-blue-400 font-bold">{mode} MODE</span>
      </div>
      
      <svg viewBox="0 0 500 350" className="w-full h-full max-w-lg">
        <defs>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* 555 Block Body */}
        <g transform="translate(200, 80)">
          <rect x="0" y="0" width="140" height="180" rx="4" fill="#1e293b" stroke="#475569" strokeWidth="2" />
          <text x="70" y="90" textAnchor="middle" fill="#334155" fontSize="48" fontWeight="bold" opacity="0.5">555</text>
          
          {/* Pin Labels on Block */}
          {/* Left Side */}
          <text x="10" y="50" fill="#94a3b8" fontSize="10" alignmentBaseline="middle">7 (Dis)</text>
          <text x="10" y="90" fill="#94a3b8" fontSize="10" alignmentBaseline="middle">6 (Thr)</text>
          <text x="10" y="130" fill="#94a3b8" fontSize="10" alignmentBaseline="middle">2 (Trig)</text>
          
          {/* Top/Bottom/Right Labels are handled near wires below for clearer routing */}
        </g>

        {/* --- COMMON CONNECTIONS --- */}
        
        {/* VCC Top Rail */}
        <line x1="100" y1="40" x2="400" y2="40" stroke="#ef4444" strokeWidth="2" />
        <VccLabel x={300} y={40} />

        {/* GND Bottom Rail */}
        <line x1="100" y1="310" x2="400" y2="310" stroke="#94a3b8" strokeWidth="2" />
        <Ground x={300} y={310} />

        {/* Pin 8 (VCC) - Top Right */}
        <line x1="300" y1="80" x2="300" y2="40" stroke="#ef4444" strokeWidth="2" />
        <text x="300" y="95" textAnchor="middle" fill="#94a3b8" fontSize="10">8 (Vcc)</text>
        <ConnectionDot x={300} y={40} />

        {/* Pin 1 (GND) - Bottom Right */}
        <line x1="300" y1="260" x2="300" y2="310" stroke="#94a3b8" strokeWidth="2" />
        <text x="300" y="250" textAnchor="middle" fill="#94a3b8" fontSize="10">1 (GND)</text>
        <ConnectionDot x={300} y={310} />

        {/* Pin 4 (Reset) - Top Left-ish */}
        <text x="240" y="95" textAnchor="middle" fill="#94a3b8" fontSize="10">4 (Rst)</text>
        
        {/* Pin 3 (Output) - Right Side */}
        <line x1="340" y1="170" x2="420" y2="170" stroke="#10b981" strokeWidth="3" />
        <text x="330" y="173" textAnchor="end" fill="#94a3b8" fontSize="10">3 (Out)</text>
        <text x="430" y="173" textAnchor="start" fill="#10b981" fontSize="14" fontWeight="bold">OUTPUT</text>

        {/* Pin 5 (Control) - Bottom Left-ish */}
        <text x="240" y="250" textAnchor="middle" fill="#555" fontSize="10">5 (Ctl)</text>

        {/* --- MODE SPECIFIC WIRING --- */}

        {mode === CircuitMode.ASTABLE && (
          <>
            {/* R1 from VCC to Pin 7 */}
            <line x1="140" y1="40" x2="140" y2="80" stroke="#60a5fa" strokeWidth="2" />
            <ConnectionDot x={140} y={40} />
            <ResistorV x={140} y={80} label="R1" />
            <line x1="140" y1="122" x2="140" y2="130" stroke="#60a5fa" strokeWidth="2" />
            
            {/* Pin 7 Connection (Discharge) */}
            <line x1="140" y1="130" x2="200" y2="130" stroke="#60a5fa" strokeWidth="2" />
            <ConnectionDot x={140} y={130} />

            {/* R2 from Pin 7 to Pin 6/2 */}
            <ResistorV x={140} y={130} label="R2" color="#818cf8" />
            <line x1="140" y1="172" x2="140" y2="210" stroke="#818cf8" strokeWidth="2" />

            {/* Pin 6 Connection (Threshold) */}
            <line x1="140" y1="170" x2="200" y2="170" stroke="#818cf8" strokeWidth="2" />
            <ConnectionDot x={140} y={170} />

            {/* Pin 2 Connection (Trigger) - Tied to Pin 6 */}
            <line x1="140" y1="210" x2="200" y2="210" stroke="#818cf8" strokeWidth="2" />
            <ConnectionDot x={140} y={210} />
            
            {/* Line connecting Pin 6 wire down to Pin 2 wire */}
            <ConnectionDot x={160} y={170} />
            <ConnectionDot x={160} y={210} />


            {/* Capacitor C from Pin 2/6 to GND */}
            <line x1="140" y1="210" x2="140" y2="230" stroke="#ec4899" strokeWidth="2" />
            <CapacitorV x={140} y={230} label="C" />
            <line x1="140" y1="272" x2="140" y2="310" stroke="#ec4899" strokeWidth="2" />
            <ConnectionDot x={140} y={310} />
            
            {/* Reset tied to VCC */}
            <line x1="240" y1="80" x2="240" y2="40" stroke="#f43f5e" strokeWidth="2" />
            <ConnectionDot x={240} y={40} />
          </>
        )}

        {mode === CircuitMode.MONOSTABLE && (
          <>
            {/* R (R1) from VCC to Pin 7 & 6 */}
            <line x1="140" y1="40" x2="140" y2="80" stroke="#60a5fa" strokeWidth="2" />
            <ConnectionDot x={140} y={40} />
            <ResistorV x={140} y={80} label="R" />
            <line x1="140" y1="122" x2="140" y2="170" stroke="#60a5fa" strokeWidth="2" />
            
            {/* Pin 7 Connection */}
            <line x1="140" y1="130" x2="200" y2="130" stroke="#60a5fa" strokeWidth="2" />
            <ConnectionDot x={140} y={130} />

            {/* Pin 6 Connection */}
            <line x1="140" y1="170" x2="200" y2="170" stroke="#60a5fa" strokeWidth="2" />
            <ConnectionDot x={140} y={170} />

            {/* Capacitor C from Pin 6/7 to GND */}
            <line x1="140" y1="170" x2="140" y2="230" stroke="#ec4899" strokeWidth="2" />
            <CapacitorV x={140} y={230} label="C" />
            <line x1="140" y1="272" x2="140" y2="310" stroke="#ec4899" strokeWidth="2" />
            <ConnectionDot x={140} y={310} />

            {/* Trigger Input (Pin 2) */}
            <line x1="200" y1="210" x2="100" y2="210" stroke="#fbbf24" strokeWidth="2" />
            <circle cx="100" cy="210" r="4" fill="none" stroke="#fbbf24" strokeWidth="2" />
            <text x="90" y="215" textAnchor="end" fill="#fbbf24" fontSize="12" fontWeight="bold">TRIG</text>
            
             {/* Reset tied to VCC */}
            <line x1="240" y1="80" x2="240" y2="40" stroke="#f43f5e" strokeWidth="2" />
            <ConnectionDot x={240} y={40} />
          </>
        )}

        {mode === CircuitMode.BISTABLE && (
          <>
            {/* Pin 6 (Threshold) Grounded */}
            <line x1="200" y1="170" x2="170" y2="170" stroke="#94a3b8" strokeWidth="2" />
            <line x1="170" y1="170" x2="170" y2="310" stroke="#94a3b8" strokeWidth="2" />
            <ConnectionDot x={170} y={310} />
            <text x="165" y="165" textAnchor="end" fill="#94a3b8" fontSize="10">GND</text>
            
            {/* Pin 2 (Trigger) Input - SET */}
            <line x1="200" y1="210" x2="100" y2="210" stroke="#10b981" strokeWidth="2" />
            <circle cx="100" cy="210" r="4" fill="none" stroke="#10b981" strokeWidth="2" />
            <text x="90" y="215" textAnchor="end" fill="#10b981" fontSize="12" fontWeight="bold">SET (Trig)</text>

            {/* Pin 4 (Reset) Input - RESET */}
            <line x1="240" y1="80" x2="240" y2="50" stroke="#f43f5e" strokeWidth="2" />
            <line x1="240" y1="50" x2="100" y2="50" stroke="#f43f5e" strokeWidth="2" />
            <circle cx="100" cy="50" r="4" fill="none" stroke="#f43f5e" strokeWidth="2" />
            <text x="90" y="55" textAnchor="end" fill="#f43f5e" fontSize="12" fontWeight="bold">RESET</text>

            {/* Pin 7 N/C */}
            <text x="190" y="130" textAnchor="end" fill="#555" fontSize="10">NC</text>
          </>
        )}

      </svg>
    </div>
  );
};

export default CircuitDiagram;