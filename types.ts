export enum CircuitMode {
  ASTABLE = 'ASTABLE',
  MONOSTABLE = 'MONOSTABLE',
  BISTABLE = 'BISTABLE'
}

export interface CircuitParams {
  r1: number; // Ohms (Used as R in Monostable)
  r2: number; // Ohms (Unused in Monostable)
  c: number;  // Farads
}

export interface SimulationResults {
  frequency: number;   // Hz (0 for Monostable/Bistable)
  period: number;      // Seconds (Pulse width for Monostable)
  dutyCycle: number;   // Percentage
  timeHigh: number;    // Seconds
  timeLow: number;     // Seconds
}

export interface WaveformData {
  time: number;
  voltageOut: number;
  voltageCap: number;
  trigger?: number; // Visualization for trigger line
}

export enum MessageRole {
  USER = 'user',
  MODEL = 'model'
}

export interface ChatMessage {
  id: string;
  role: MessageRole;
  text: string;
  timestamp: number;
}