import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { WaveformData } from '../types';

interface OscilloscopeProps {
  data: WaveformData[];
  colorOut: string;
  colorCap: string;
}

const Oscilloscope: React.FC<OscilloscopeProps> = ({ data, colorOut, colorCap }) => {
  return (
    <div className="w-full h-full bg-black rounded-lg border border-slate-700 p-2 relative shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]">
       {/* Grid overlay effect for that retro scope look */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,18,20,0)_1px,transparent_1px),linear-gradient(90deg,rgba(18,18,20,0)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none opacity-20"></div>
      
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 10,
            bottom: 25, // Increased from 0 to 25 to allow space for the X-axis label
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
          <XAxis 
            dataKey="time" 
            // Changed position to 'bottom' (below axis) and added offset to prevent clipping
            label={{ value: 'Time (ms)', position: 'bottom', offset: 5, fill: '#94a3b8' }} 
            tick={{ fill: '#94a3b8', fontSize: 12 }}
            tickFormatter={(val) => val.toFixed(1)}
          />
          <YAxis 
            domain={[0, 10]} 
            width={40} // Fixed width to ensure Y-axis labels don't shift layout
            label={{ value: 'Voltage (V)', angle: -90, position: 'insideLeft', fill: '#94a3b8', offset: 10 }} 
            tick={{ fill: '#94a3b8', fontSize: 12 }}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f1f5f9' }}
            itemStyle={{ fontSize: '12px' }}
            labelStyle={{ color: '#94a3b8', marginBottom: '5px' }}
            formatter={(value: number) => value.toFixed(2) + ' V'}
          />
          <ReferenceLine y={6} stroke="#ef4444" strokeDasharray="3 3" label={{ position: 'right', value: '2/3 Vcc', fill: '#ef4444', fontSize: 10 }} />
          <ReferenceLine y={3} stroke="#ef4444" strokeDasharray="3 3" label={{ position: 'right', value: '1/3 Vcc', fill: '#ef4444', fontSize: 10 }} />
          
          <Line 
            type="monotone" 
            dataKey="voltageOut" 
            stroke={colorOut} 
            strokeWidth={3} 
            dot={false} 
            isAnimationActive={false} // Disable animation for instant updates when sliders move
          />
           <Line 
            type="monotone" 
            dataKey="voltageCap" 
            stroke={colorCap} 
            strokeWidth={2} 
            dot={false} 
            strokeDasharray="5 5"
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
      
      {/* Scope Overlay Text */}
      <div className="absolute top-2 right-4 text-xs font-mono text-emerald-500 opacity-80 pointer-events-none">
        <div>CH1: OUTPUT ({colorOut})</div>
        <div>CH2: CAPACITOR ({colorCap})</div>
      </div>
    </div>
  );
};

export default Oscilloscope;