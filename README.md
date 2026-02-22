# 555 Timer Lab

An interactive, browser-based simulator for the legendary 555 Timer IC. This application allows users to experiment with Astable, Monostable, and Bistable modes, visualizing the output waveforms in real-time.

![555 Timer Lab Screenshot](https://picsum.photos/seed/555timer/800/400)

## Features

- **Interactive Circuit Simulation**: Real-time calculation of frequency, duty cycle, and pulse width.
- **Multiple Modes**:
  - **Astable**: Continuous oscillation (square wave generation).
  - **Monostable**: One-shot pulse generation triggered by user input.
  - **Bistable**: Flip-flop behavior with Set/Reset controls.
- **Visual Oscilloscope**: Live graphing of Output voltage and Capacitor voltage.
- **Dynamic Circuit Diagram**: Visual representation of the circuit configuration.
- **AI Assistant**: Integrated Gemini AI to explain circuit concepts and answer electronics questions.
- **Responsive Design**: Works on desktop and tablet devices.

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS
- **Visualization**: Recharts
- **AI Integration**: Google Gemini API (@google/genai)

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/555-timer-lab.git
   cd 555-timer-lab
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env.local` (if applicable)
   - You will need a Google Gemini API key for the AI assistant features.

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:3000`.

## Usage

1. **Select Mode**: Choose between Astable, Monostable, or Bistable using the tabs in the control panel.
2. **Adjust Parameters**: Use the sliders or input fields to change Resistance (R1, R2) and Capacitance (C) values.
3. **Trigger/Reset**: In Monostable mode, use the "Trigger" button. In Bistable mode, use "Set" and "Reset".
4. **Ask AI**: Use the AI Assistant panel to ask questions like "How does the capacitor charge?" or "What is the duty cycle?".

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built as a demonstration of modern web technologies and AI integration.
- Inspired by the versatility of the NE555 timer chip.
