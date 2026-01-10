import React, { useMemo } from 'react';
import { CircuitParams, CircuitMode } from '../types';
import { formatResistor, formatCapacitor } from '../utils/circuitMath';

interface CircuitControlsProps {
  mode: CircuitMode;
  setMode: (mode: CircuitMode) => void;
  params: CircuitParams;
  onParamChange: (newParams: CircuitParams) => void;
  bistableState: boolean;
  setBistableState: (state: boolean) => void;
  onMonostableTrigger: () => void;
}

const CircuitControls: React.FC<CircuitControlsProps> = ({ 
  mode, 
  setMode, 
  params, 
  onParamChange,
  bistableState,
  setBistableState,
  onMonostableTrigger
}) => {
  
  const handleChange = (key: keyof CircuitParams, value: number) => {
    onParamChange({ ...params, [key]: value });
  };

  // Generate Standard E12 Resistor Series (100Ω to 1MΩ)
  const resistorValues = useMemo(() => {
    const values: number[] = [];
    const base = [1.0, 1.2, 1.5, 1.8, 2.2, 2.7, 3.3, 3.9, 4.7, 5.6, 6.8, 8.2];
    const multipliers = [100, 1000, 10000, 100000]; 
    
    multipliers.forEach(mult => {
      base.forEach(b => values.push(b * mult));
    });
    values.push(1000000); 
    return values;
  }, []);

  // Generate Standard E6 Capacitor Series (1nF to 1000µF)
  const capacitorValues = useMemo(() => {
    const values: number[] = [];
    const base = [1.0, 1.5, 2.2, 3.3, 4.7, 6.8];
    const multipliers = [1e-9, 1e-8, 1e-7, 1e-6, 1e-5, 1e-4]; 
    
    multipliers.forEach(mult => {
      base.forEach(b => values.push(b * mult));
    });
    values.push(0.001); 
    return values;
  }, []);

  const getClosestIndex = (val: number, arr: number[]) => {
    let minDiff = Infinity;
    let idx = 0;
    for (let i = 0; i < arr.length; i++) {
      const diff = Math.abs(val - arr[i]);
      if (diff < minDiff) {
        minDiff = diff;
        idx = i;
      }
    }
    return idx;
  };

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 shadow-lg flex flex-col gap-6">
      
      {/* Mode Selector */}
      <div>
        <h2 className="text-sm font-bold text-slate-400 mb-3 uppercase tracking-wider">Operation Mode</h2>
        <div className="grid grid-cols-3 gap-2 bg-slate-950 p-1 rounded-lg border border-slate-800">
          {[CircuitMode.ASTABLE, CircuitMode.MONOSTABLE, CircuitMode.BISTABLE].map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`text-xs font-bold py-2 px-2 rounded transition-all ${
                mode === m 
                  ? 'bg-blue-600 text-white shadow-lg' 
                  : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
        </svg>
        {mode === CircuitMode.BISTABLE ? 'Controls' : 'Components'}
      </h2>

      {mode === CircuitMode.BISTABLE ? (
        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={() => setBistableState(true)}
            className={`h-16 border rounded-lg font-bold active:scale-95 transition-all
              ${bistableState 
                ? 'bg-emerald-600 text-white border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.5)]' 
                : 'bg-emerald-900/30 text-emerald-400 border-emerald-500/50 hover:bg-emerald-900/50'
              }`}
          >
            TRIGGER (SET)
          </button>
          <button 
            onClick={() => setBistableState(false)}
            className={`h-16 border rounded-lg font-bold active:scale-95 transition-all
              ${!bistableState 
                ? 'bg-red-600 text-white border-red-400 shadow-[0_0_15px_rgba(239,68,68,0.5)]' 
                : 'bg-red-900/30 text-red-400 border-red-500/50 hover:bg-red-900/50'
              }`}
          >
            RESET
          </button>
          <div className="col-span-2 text-xs text-slate-500 text-center mt-2">
            Click buttons to toggle the 555 Flip-Flop state.
          </div>
        </div>
      ) : (
        <>
          {/* R1 Control (Called "R" in Monostable) */}
          <div className="space-y-2">
            <div className="flex justify-between items-end">
              <label className="text-sm font-medium text-slate-400">
                {mode === CircuitMode.MONOSTABLE ? 'Resistor R' : 'Resistor R1'}
              </label>
              <span className="text-lg font-mono text-blue-400">{formatResistor(params.r1)}</span>
            </div>
            <input
              type="range"
              min="0"
              max={resistorValues.length - 1}
              step="1"
              value={getClosestIndex(params.r1, resistorValues)}
              onChange={(e) => handleChange('r1', resistorValues[parseInt(e.target.value)])}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:accent-blue-400"
              title={`Standard E12 Value: ${formatResistor(params.r1)}`}
            />
            <div className="flex justify-between text-[10px] text-slate-600 font-mono">
               <span>100Ω</span>
               <span>1MΩ</span>
            </div>
          </div>

          {/* R2 Control (Hidden in Monostable) */}
          {mode === CircuitMode.ASTABLE && (
            <div className="space-y-2">
              <div className="flex justify-between items-end">
                <label className="text-sm font-medium text-slate-400">Resistor R2</label>
                <span className="text-lg font-mono text-indigo-400">{formatResistor(params.r2)}</span>
              </div>
              <input
                type="range"
                min="0"
                max={resistorValues.length - 1}
                step="1"
                value={getClosestIndex(params.r2, resistorValues)}
                onChange={(e) => handleChange('r2', resistorValues[parseInt(e.target.value)])}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500 hover:accent-indigo-400"
                title={`Standard E12 Value: ${formatResistor(params.r2)}`}
              />
               <div className="flex justify-between text-[10px] text-slate-600 font-mono">
               <span>100Ω</span>
               <span>1MΩ</span>
            </div>
            </div>
          )}

          {/* C Control */}
          <div className="space-y-2">
            <div className="flex justify-between items-end">
              <label className="text-sm font-medium text-slate-400">Capacitor C</label>
              <span className="text-lg font-mono text-pink-400">{formatCapacitor(params.c)}</span>
            </div>
            <input
              type="range"
              min="0"
              max={capacitorValues.length - 1}
              step="1"
              value={getClosestIndex(params.c, capacitorValues)}
              onChange={(e) => handleChange('c', capacitorValues[parseInt(e.target.value)])}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-pink-500 hover:accent-pink-400"
              title={`Standard E6 Value: ${formatCapacitor(params.c)}`}
            />
             <div className="flex justify-between text-[10px] text-slate-600 font-mono">
               <span>1nF</span>
               <span>1000µF</span>
            </div>
          </div>

          {/* Monostable Trigger Button */}
          {mode === CircuitMode.MONOSTABLE && (
            <div className="pt-4 border-t border-slate-800">
               <button 
                onClick={onMonostableTrigger}
                className="w-full h-14 bg-amber-600 hover:bg-amber-500 text-white border-2 border-amber-400 rounded-lg font-bold shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
                TRIGGER PULSE
              </button>
              <p className="text-xs text-slate-500 text-center mt-2">
                Click to trigger the one-shot timer. Watch the LED!
              </p>
            </div>
          )}
        </>
      )}

      <div className="pt-2 text-xs text-slate-500 border-t border-slate-800">
        {mode === CircuitMode.ASTABLE && <p>Adjust R1, R2, C (standard E12/E6 values) to change frequency and duty cycle.</p>}
        {mode === CircuitMode.MONOSTABLE && <p>Adjust R and C to change the output pulse width (One-Shot).</p>}
        {mode === CircuitMode.BISTABLE && <p>In Bistable mode, the 555 acts as a flip-flop controlled by Trigger and Reset inputs.</p>}
      </div>
    </div>
  );
};

export default CircuitControls;