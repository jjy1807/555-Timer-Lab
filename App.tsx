import React, { useState, useMemo } from 'react';
import { CircuitParams, SimulationResults, WaveformData, CircuitMode } from './types';
import { calculateCircuitValues, generateWaveformData } from './utils/circuitMath';
import CircuitControls from './components/CircuitControls';
import Oscilloscope from './components/Oscilloscope';
import InfoPanel from './components/InfoPanel';
import CircuitDiagram from './components/CircuitDiagram';
import AIAssistant from './components/AIAssistant';

const App: React.FC = () => {
  const [mode, setMode] = useState<CircuitMode>(CircuitMode.ASTABLE);
  const [bistableState, setBistableState] = useState(false);
  const [triggerCount, setTriggerCount] = useState(0); // Counter for monostable triggers
  
  const [params, setParams] = useState<CircuitParams>({
    r1: 4700, 
    r2: 4700,
    c: 0.0001, // 100uF
  });

  // Calculate results reactively
  const results: SimulationResults = useMemo(() => {
    return calculateCircuitValues(mode, params);
  }, [mode, params]);

  // Generate Graph Data
  const waveData: WaveformData[] = useMemo(() => {
    return generateWaveformData(mode, params, results, bistableState);
  }, [mode, params, results, bistableState]);

  const handleMonostableTrigger = () => {
    setTriggerCount(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-8 overflow-y-auto">
      {/* Header */}
      <header className="max-w-7xl mx-auto mb-8 flex justify-between items-center border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
            555 Timer Lab
          </h1>
          <p className="text-slate-400 text-sm mt-1">Interactive Circuit Simulator</p>
        </div>
        <div className="hidden md:block text-right">
          <div className="text-xs text-slate-500 font-mono">MODEL: NE555</div>
          <div className="text-xs text-slate-500 font-mono">MODE: {mode}</div>
        </div>
      </header>

      {/* Main Grid */}
      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Controls & Info (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <CircuitControls 
            mode={mode}
            setMode={setMode}
            params={params} 
            onParamChange={setParams} 
            bistableState={bistableState}
            setBistableState={setBistableState}
            onMonostableTrigger={handleMonostableTrigger}
          />
          <InfoPanel 
            results={results} 
            mode={mode} 
            bistableState={bistableState} 
            triggerCount={triggerCount}
          />
        </div>

        {/* Right Column: Visuals (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-6 h-full">
          
          {/* Top: Oscilloscope */}
          <div className="flex-1 min-h-[300px] flex flex-col">
            <h3 className="text-sm font-bold text-slate-400 mb-2 uppercase tracking-wider">Oscilloscope</h3>
            <Oscilloscope 
              data={waveData} 
              colorOut="#10b981" 
              colorCap="#ec4899" 
            />
          </div>

          {/* Bottom: Circuit Diagram */}
          <div className="flex-1 min-h-[300px] flex flex-col">
            <h3 className="text-sm font-bold text-slate-400 mb-2 uppercase tracking-wider">Circuit Diagram</h3>
            <CircuitDiagram mode={mode} />
          </div>

        </div>
      </main>

      {/* Footer / Instructions */}
      <footer className="max-w-7xl mx-auto mt-12 pt-6 border-t border-slate-800 text-center text-slate-500 text-sm">
        <p>Built with React, Tailwind & Recharts. Powered by Gemini.</p>
        <p className="mt-2 text-xs opacity-50">
          The 555 timer is an integrated circuit (chip) used in a variety of timer, delay, pulse generation, and oscillator applications.
        </p>
      </footer>

      <AIAssistant params={params} results={results} mode={mode} />
    </div>
  );
};

export default App;