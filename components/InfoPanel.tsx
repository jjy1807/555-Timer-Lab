import React, { useEffect, useState, useRef } from 'react';
import { SimulationResults, CircuitMode } from '../types';
import { formatFrequency } from '../utils/circuitMath';

interface InfoPanelProps {
  results: SimulationResults;
  mode: CircuitMode;
  bistableState: boolean;
  triggerCount: number;
}

const InfoPanel: React.FC<InfoPanelProps> = ({ 
  results, 
  mode, 
  bistableState,
  triggerCount
}) => {
  const [ledOn, setLedOn] = useState(false);
  const requestRef = useRef<number>();
  
  // Handle Trigger Signal (Monostable)
  useEffect(() => {
    if (mode === CircuitMode.MONOSTABLE && triggerCount > 0) {
      setLedOn(true);
      const timeout = setTimeout(() => {
        setLedOn(false);
      }, results.timeHigh * 1000);
      return () => clearTimeout(timeout);
    }
  }, [triggerCount, mode, results.timeHigh]);

  // Handle Astable Blinking logic
  useEffect(() => {
    if (mode !== CircuitMode.ASTABLE) {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      // Bistable logic handled in separate effect or state
      return;
    }

    const animate = () => {
      const now = Date.now();
      
      if (results.frequency > 25) {
        setLedOn(true); // Too fast to blink visible
      } else {
        const periodMs = results.period * 1000;
        const timeHighMs = results.timeHigh * 1000;
        if (periodMs > 0) {
            const cycleTime = now % periodMs;
            setLedOn(cycleTime < timeHighMs);
        }
      }
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [mode, results]);

  // Handle Bistable logic
  useEffect(() => {
    if (mode === CircuitMode.BISTABLE) {
      setLedOn(bistableState);
    }
  }, [mode, bistableState]);

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 shadow-lg flex flex-col justify-between">
      <div>
        <h2 className="text-xl font-bold text-slate-100 mb-4 flex items-center gap-2">
           <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          {mode === CircuitMode.BISTABLE ? 'State' : 'Measurements'}
        </h2>
        
        {mode === CircuitMode.ASTABLE && (
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-950 p-3 rounded border border-slate-800">
              <div className="text-slate-500 text-xs uppercase tracking-wider">Frequency</div>
              <div className="text-2xl font-mono text-emerald-400">{formatFrequency(results.frequency)}</div>
            </div>
             <div className="bg-slate-950 p-3 rounded border border-slate-800">
              <div className="text-slate-500 text-xs uppercase tracking-wider">Duty Cycle</div>
              <div className="text-2xl font-mono text-yellow-400">{results.dutyCycle.toFixed(1)}%</div>
            </div>
             <div className="bg-slate-950 p-3 rounded border border-slate-800">
              <div className="text-slate-500 text-xs uppercase tracking-wider">Time High</div>
              <div className="text-xl font-mono text-slate-300">{(results.timeHigh * 1000).toFixed(2)} ms</div>
            </div>
             <div className="bg-slate-950 p-3 rounded border border-slate-800">
              <div className="text-slate-500 text-xs uppercase tracking-wider">Time Low</div>
              <div className="text-xl font-mono text-slate-300">{(results.timeLow * 1000).toFixed(2)} ms</div>
            </div>
          </div>
        )}

        {mode === CircuitMode.MONOSTABLE && (
          <div className="grid grid-cols-1 gap-4">
             <div className="bg-slate-950 p-4 rounded border border-slate-800">
              <div className="text-slate-500 text-xs uppercase tracking-wider mb-1">Output Pulse Width</div>
              <div className="text-4xl font-mono text-emerald-400">{(results.timeHigh * 1000).toFixed(2)} ms</div>
              <div className="text-slate-600 text-xs mt-2">Time the output stays HIGH after a trigger.</div>
            </div>
          </div>
        )}

        {mode === CircuitMode.BISTABLE && (
          <div className="bg-slate-950 p-6 rounded border border-slate-800 flex flex-col items-center">
             <div className="text-slate-500 text-xs uppercase tracking-wider mb-2">Current State</div>
             <div className={`text-4xl font-mono font-bold ${bistableState ? 'text-emerald-400' : 'text-slate-600'}`}>
                {bistableState ? 'SET (1)' : 'RESET (0)'}
             </div>
          </div>
        )}

      </div>

      {/* Visual LED Representation */}
      <div className="mt-6 flex flex-col items-center justify-center bg-slate-950 rounded-lg p-4 border border-slate-800">
        <div className="relative">
           {/* LED Glow effect */}
          <div className={`absolute inset-0 rounded-full blur-xl transition-opacity duration-75 ${ledOn ? 'bg-red-500 opacity-60' : 'bg-transparent opacity-0'}`}></div>
           {/* LED Bulb */}
          <div className={`w-12 h-12 rounded-full border-4 transition-colors duration-75 relative z-10 flex items-center justify-center shadow-inner
            ${ledOn ? 'bg-red-500 border-red-700 shadow-[inset_0_2px_10px_rgba(255,255,255,0.5)]' : 'bg-red-900 border-red-950 opacity-50'}`}>
             {/* Reflection */}
             <div className="absolute top-2 left-3 w-3 h-2 bg-white rounded-full opacity-40 blur-[1px]"></div>
          </div>
        </div>
        <div className="mt-2 text-xs font-mono text-slate-500">OUTPUT STATUS</div>
        <div className={`text-sm font-bold ${ledOn ? 'text-red-500' : 'text-slate-700'}`}>
          {ledOn ? 'HIGH' : 'LOW'}
        </div>
      </div>
    </div>
  );
};

export default InfoPanel;