import { CircuitParams, SimulationResults, WaveformData, CircuitMode } from '../types';

export const calculateCircuitValues = (mode: CircuitMode, params: CircuitParams): SimulationResults => {
  const { r1, r2, c } = params;

  if (mode === CircuitMode.ASTABLE) {
    // tHigh = 0.693 * (R1 + R2) * C
    // tLow = 0.693 * R2 * C
    const timeHigh = 0.693 * (r1 + r2) * c;
    const timeLow = 0.693 * r2 * c;
    const period = timeHigh + timeLow;
    const frequency = period > 0 ? 1 / period : 0;
    const dutyCycle = period > 0 ? (timeHigh / period) * 100 : 0;

    return { frequency, period, dutyCycle, timeHigh, timeLow };
  } 
  else if (mode === CircuitMode.MONOSTABLE) {
    // tHigh = 1.1 * R1 * C
    const timeHigh = 1.1 * r1 * c;
    // Frequency/Period don't strictly apply, but we use period to store pulse width for display convenience
    return { 
      frequency: 0, 
      period: timeHigh, // Using period field to store pulse width broadly
      dutyCycle: 0, 
      timeHigh, 
      timeLow: 0 
    };
  } 
  else {
    // BISTABLE
    return { frequency: 0, period: 0, dutyCycle: 0, timeHigh: 0, timeLow: 0 };
  }
};

export const generateWaveformData = (
  mode: CircuitMode, 
  params: CircuitParams, 
  results: SimulationResults, 
  bistableState: boolean = false
): WaveformData[] => {
  const data: WaveformData[] = [];
  const Vcc = 9;
  
  if (mode === CircuitMode.ASTABLE) {
    const { period, timeHigh } = results;
    if (period === 0) return data;
    
    // Show 2 cycles
    const cyclesToShow = 2;
    const pointsPerCycle = 50;
    const totalTime = period * cyclesToShow;
    const step = totalTime / (pointsPerCycle * cyclesToShow);
    const V_upper = (2/3) * Vcc;
    const V_lower = (1/3) * Vcc;
    const tauCharge = (params.r1 + params.r2) * params.c;
    const tauDischarge = params.r2 * params.c;

    for (let t = 0; t <= totalTime; t += step) {
      const timeInPeriod = t % period;
      let vOut = 0;
      let vCap = 0;

      if (timeInPeriod < timeHigh) {
        vOut = Vcc;
        vCap = Vcc - (Vcc - V_lower) * Math.exp(-timeInPeriod / tauCharge);
      } else {
        vOut = 0;
        const dt = timeInPeriod - timeHigh;
        vCap = V_upper * Math.exp(-dt / tauDischarge);
      }

      data.push({
        time: parseFloat((t * 1000).toFixed(2)),
        voltageOut: vOut,
        voltageCap: vCap
      });
    }
  } 
  else if (mode === CircuitMode.MONOSTABLE) {
    const pulseWidth = results.timeHigh;
    // Show a window of roughly 3x pulse width to show before/during/after
    const totalTime = pulseWidth * 2.5;
    const points = 100;
    const step = totalTime / points;
    const triggerTime = totalTime * 0.1; // Trigger happens at 10% mark
    const tau = params.r1 * params.c; // Charge through R1

    for (let t = 0; t <= totalTime; t += step) {
      let vOut = 0;
      let vCap = 0;
      let trig = Vcc;

      // Simulate Trigger Pulse (active low)
      if (t > triggerTime && t < triggerTime + (totalTime * 0.05)) {
        trig = 0;
      }

      if (t >= triggerTime && t < (triggerTime + pulseWidth)) {
        vOut = Vcc;
        const dt = t - triggerTime;
        // Cap charges from 0 to 2/3 Vcc
        // Vc(t) = Vcc * (1 - e^-t/RC)
        vCap = Vcc * (1 - Math.exp(-dt / tau));
        // Clamp at 2/3 Vcc roughly for visual transition (though ideally it resets exactly when it hits 2/3)
        if (vCap > (2/3)*Vcc) vCap = (2/3)*Vcc; 
      } else {
        vOut = 0;
        vCap = 0; // Discharges instantly in ideal monostable model when Q=Low (Discharge pin grounded)
      }

      data.push({
        time: parseFloat((t * 1000).toFixed(2)),
        voltageOut: vOut,
        voltageCap: vCap,
        trigger: trig
      });
    }
  }
  else if (mode === CircuitMode.BISTABLE) {
    // Flat line based on current state
    const points = 50;
    for (let i = 0; i < points; i++) {
      data.push({
        time: i,
        voltageOut: bistableState ? Vcc : 0,
        voltageCap: 0 // Not relevant in bistable usually
      });
    }
  }

  return data;
};

// ... keep existing format functions ...
export const formatResistor = (ohms: number): string => {
  if (ohms >= 1000000) return `${(ohms / 1000000).toFixed(1)}MΩ`;
  if (ohms >= 1000) return `${(ohms / 1000).toFixed(1)}kΩ`;
  return `${ohms.toFixed(0)}Ω`;
};

export const formatCapacitor = (farads: number): string => {
  if (farads >= 0.000001) return `${(farads * 1000000).toFixed(1)}µF`;
  if (farads >= 0.000000001) return `${(farads * 1000000000).toFixed(1)}nF`;
  return `${(farads * 1000000000000).toFixed(1)}pF`;
};

export const formatFrequency = (hz: number): string => {
  if (hz >= 1000000) return `${(hz / 1000000).toFixed(2)} MHz`;
  if (hz >= 1000) return `${(hz / 1000).toFixed(2)} kHz`;
  return `${hz.toFixed(2)} Hz`;
};