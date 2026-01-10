import { GoogleGenAI } from "@google/genai";
import { CircuitParams, SimulationResults, CircuitMode } from "../types";

// Initialize Gemini
// Ensure process.env.API_KEY is available in your environment variables.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getCircuitAdvice = async (
  query: string,
  params: CircuitParams,
  results: SimulationResults,
  history: string[] = [],
  mode: CircuitMode
): Promise<string> => {
  try {
    const model = 'gemini-3-flash-preview';
    
    let modeSpecificContext = '';
    if (mode === CircuitMode.ASTABLE) {
       modeSpecificContext = `
        Mode: ASTABLE (Oscillator)
        - Frequency: ${results.frequency.toFixed(2)} Hz
        - Period: ${results.period.toFixed(4)} s
        - Duty Cycle: ${results.dutyCycle.toFixed(1)}%
       `;
    } else if (mode === CircuitMode.MONOSTABLE) {
       modeSpecificContext = `
        Mode: MONOSTABLE (One-Shot Timer)
        - Pulse Width (Time High): ${results.period.toFixed(4)} s
        - R2 is unused in this mode.
       `;
    } else {
       modeSpecificContext = `
        Mode: BISTABLE (Flip-Flop)
        - This mode uses Trigger and Reset buttons to toggle state.
        - Timing components (R/C) are not primarily used for timing.
       `;
    }

    const circuitContext = `
      Current 555 Timer Configuration:
      ${modeSpecificContext}
      Component Values:
      - R1: ${params.r1} Ohms
      - R2: ${params.r2} Ohms
      - C: ${params.c} Farads
    `;

    const systemInstruction = `
      You are an expert Electronics Lab Assistant specializing in the 555 Timer IC.
      
      Rules:
      1. Explain concepts relevant to the current mode (${mode}).
      2. If Astable, talk about frequency/duty cycle.
      3. If Monostable, talk about pulse width and one-shot behavior.
      4. If Bistable, explain the flip-flop set/reset logic.
      5. Keep answers concise and practical.
      
      Context: ${circuitContext}
    `;

    const response = await ai.models.generateContent({
      model,
      contents: [
        ...history.map(text => ({ role: 'user', parts: [{ text }] })), 
        { role: 'user', parts: [{ text: query }] }
      ],
      config: {
        systemInstruction,
        maxOutputTokens: 300,
      }
    });

    return response.text || "I couldn't generate a response. Please check the circuit parameters.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error connecting to the Lab Assistant. Please verify your API Key.";
  }
};