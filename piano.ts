import { AudioContext, OscillatorNode, GainNode, BiquadFilterNode } from 'node-web-audio-api';

export async function createRealisticPiano(fundamental: number = 261.63): Promise<void> {
    const audioContext = new AudioContext();
    
    const startTime = audioContext.currentTime;
    
    // Piano harmonics with realistic amplitude ratios and slight inharmonicity
    const harmonics = [
        { freq: fundamental, amp: 1.0, detune: 0 },           // Fundamental
        { freq: fundamental * 2, amp: 0.8, detune: 2 },      // 2nd harmonic (slightly sharp)
        { freq: fundamental * 3, amp: 0.6, detune: 4 },      // 3rd harmonic
        { freq: fundamental * 4, amp: 0.5, detune: 6 },      // 4th harmonic
        { freq: fundamental * 5, amp: 0.4, detune: 8 },      // 5th harmonic
        { freq: fundamental * 6, amp: 0.3, detune: 10 },     // 6th harmonic
        { freq: fundamental * 7, amp: 0.25, detune: 12 },    // 7th harmonic
        { freq: fundamental * 8, amp: 0.2, detune: 14 },     // 8th harmonic
    ];
    
    const oscillators: OscillatorNode[] = [];
    const gains: GainNode[] = [];
    
    // Create oscillators for each harmonic
    harmonics.forEach((harmonic, index) => {
        const osc = new OscillatorNode(audioContext, {
            type: 'sine',
            frequency: harmonic.freq
        });
        
        // Add inharmonicity (pianos aren't perfectly harmonic)
        osc.detune.setValueAtTime(harmonic.detune, startTime);
        
        const gain = new GainNode(audioContext, { gain: 0.0 });
        
        oscillators.push(osc);
        gains.push(gain);
        
        osc.connect(gain);
    });
    
    // Create filter for timbre shaping
    const lowPassFilter = new BiquadFilterNode(audioContext, {
        type: 'lowpass',
        frequency: 3000,
        Q: 1
    });
    
    const highPassFilter = new BiquadFilterNode(audioContext, {
        type: 'highpass',
        frequency: 80,
        Q: 0.5
    });
    
    // Master gain for overall envelope
    const masterGain = new GainNode(audioContext, { gain: 0.0 });
    
    // Connect all harmonic gains to filters to master gain
    gains.forEach(gain => {
        gain.connect(highPassFilter);
    });
    highPassFilter.connect(lowPassFilter);
    lowPassFilter.connect(masterGain);
    masterGain.connect(audioContext.destination);
    
    // Start all oscillators
    oscillators.forEach(osc => osc.start(startTime));
    
    // Individual envelope for each harmonic (higher harmonics decay faster)
    harmonics.forEach((harmonic, index) => {
        const gain = gains[index];
        const peakGain = harmonic.amp * 0.15; // Scale down overall volume
        const decayRate = 1.0 + (index * 0.3); // Higher harmonics decay faster
        
        // Sharp attack
        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(peakGain, startTime + 0.01);
        
        // Exponential decay with more sustain (different for each harmonic)
        gain.gain.exponentialRampToValueAtTime(peakGain * 0.5, startTime + 0.1);
        gain.gain.exponentialRampToValueAtTime(peakGain * 0.3, startTime + 1.0);
        gain.gain.exponentialRampToValueAtTime(peakGain * 0.15, startTime + 3.0);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 5.0 + (index * 0.2));
    });
    
    // Master envelope with extended sustain
    masterGain.gain.setValueAtTime(0, startTime);
    masterGain.gain.linearRampToValueAtTime(1.0, startTime + 0.005); // Very quick attack
    masterGain.gain.exponentialRampToValueAtTime(0.8, startTime + 0.1);
    masterGain.gain.exponentialRampToValueAtTime(0.6, startTime + 1.5);  // Extended sustain
    masterGain.gain.exponentialRampToValueAtTime(0.4, startTime + 3.0);  // More sustain
    masterGain.gain.exponentialRampToValueAtTime(0.001, startTime + 6.0); // Longer release
    
    // Filter movement with more gradual change for sustained sound
    lowPassFilter.frequency.setValueAtTime(3000, startTime);
    lowPassFilter.frequency.exponentialRampToValueAtTime(2000, startTime + 0.5);
    lowPassFilter.frequency.exponentialRampToValueAtTime(1200, startTime + 3.0);
    lowPassFilter.frequency.exponentialRampToValueAtTime(800, startTime + 5.0);
    
    // Return a promise that resolves when the note finishes
    return new Promise(async (resolve) => {
        setTimeout(async () => {
            oscillators.forEach(osc => osc.stop());
            await audioContext.close();
            console.log(`Piano note at ${fundamental.toFixed(2)}Hz finished`);
            resolve();
        }, 7000);
    });
}

// Helper function for delays
export const delay = (ms: number): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, ms));
};

// Common piano note frequencies
export const PianoNotes = {
    C4: 261.63,  // Middle C
    D4: 293.66,
    E4: 329.63,
    F4: 349.23,
    G4: 392.00,
    A4: 440.00,  // Standard tuning reference
    B4: 493.88,
    C5: 523.25,
} as const;