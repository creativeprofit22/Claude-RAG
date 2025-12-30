/**
 * useTypewriterSound Hook
 * Library Skin V2: Typewriter Edition
 *
 * Production-quality synthesized typewriter sounds using Web Audio API.
 *
 * Features:
 * - Realistic mechanical typewriter sounds (keystroke, space, backspace, bell, carriage return)
 * - Multiple variations per sound with pitch randomization
 * - ADSR envelopes for realistic attack/decay
 * - Noise components for mechanical textures
 * - Tab visibility handling (auto-mute when hidden)
 * - localStorage preference for mute state
 * - prefers-reduced-motion respect
 * - First interaction gate (audioContext.resume() on user gesture)
 */

import { useCallback, useRef, useEffect, useState } from 'react';
import type { SoundConfig } from './typewriter.types.js';

// Sound types available
export type SoundType =
  | 'keystroke'
  | 'space'
  | 'backspace'
  | 'carriageReturn'
  | 'bell'
  | 'drawerOpen'
  | 'drawerClose';

const DEFAULT_CONFIG: SoundConfig = {
  enabled: true,
  volume: 0.3,
  variationCount: 4,
  pitchVariation: 0.05, // +/- 5%
};

const STORAGE_KEY = 'typewriter-sound-muted';
const DEBOUNCE_MS = 30;

/**
 * Bell harmonic configuration
 */
interface BellHarmonic {
  freq: number;
  gain: number;
  decay: number;
}

/**
 * Create bell harmonics sound with configurable parameters
 */
function playBellHarmonics(
  ctx: AudioContext,
  master: GainNode,
  baseVolume: number,
  fundamentalFreq: number,
  startTime: number,
  harmonics: BellHarmonic[],
  gainMultiplier: number = 1.0
): void {
  harmonics.forEach(({ freq, gain: relGain, decay }) => {
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.value = freq;

    gainNode.gain.setValueAtTime(0, startTime);
    gainNode.gain.linearRampToValueAtTime(baseVolume * relGain * gainMultiplier, startTime + 0.002);
    gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + decay);

    osc.connect(gainNode);
    gainNode.connect(master);

    osc.start(startTime);
    osc.stop(startTime + decay + 0.01);
  });
}

/**
 * Creates Web Audio context for sound synthesis
 */
function createAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;

  try {
    return new (window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  } catch {
    console.warn('Web Audio API not supported');
    return null;
  }
}

/**
 * Check if user prefers reduced motion
 */
function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Get muted state from localStorage
 */
function getStoredMuteState(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return localStorage.getItem(STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}

/**
 * Save muted state to localStorage
 */
function setStoredMuteState(muted: boolean): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, String(muted));
  } catch {
    // Storage not available
  }
}

export function useTypewriterSound(config: Partial<SoundConfig> = {}) {
  const settings = { ...DEFAULT_CONFIG, ...config };
  const audioContext = useRef<AudioContext | null>(null);
  const masterGain = useRef<GainNode | null>(null);
  const lastPlayTime = useRef<Map<SoundType, number>>(new Map());
  const isInitialized = useRef(false);
  const hasUserInteracted = useRef(false);

  // State for mute and visibility
  const [isMuted, setIsMuted] = useState(() => getStoredMuteState());
  const [isVisible, setIsVisible] = useState(true);
  const [volume, setVolumeState] = useState(settings.volume);

  /**
   * Create a noise buffer for mechanical textures
   */
  const createNoiseBuffer = useCallback((ctx: AudioContext, duration: number): AudioBuffer => {
    const sampleRate = ctx.sampleRate;
    const bufferSize = Math.floor(sampleRate * duration);
    const buffer = ctx.createBuffer(1, bufferSize, sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    return buffer;
  }, []);

  /**
   * Create a filtered noise source
   */
  const createFilteredNoise = useCallback((
    ctx: AudioContext,
    duration: number,
    filterType: BiquadFilterType,
    frequency: number,
    Q: number = 1
  ): { source: AudioBufferSourceNode; filter: BiquadFilterNode } => {
    const buffer = createNoiseBuffer(ctx, duration);
    const source = ctx.createBufferSource();
    source.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = filterType;
    filter.frequency.value = frequency;
    filter.Q.value = Q;

    source.connect(filter);

    return { source, filter };
  }, [createNoiseBuffer]);

  /**
   * Generate mechanical keystroke sound
   * Sharp attack with quick decay, metallic character
   */
  const playKeystroke = useCallback((pitchMultiplier: number): void => {
    const ctx = audioContext.current;
    const master = masterGain.current;
    if (!ctx || !master) return;

    const now = ctx.currentTime;
    const baseVolume = volume * 0.4;

    // === Component 1: Initial click (metal hammer strike) ===
    const clickOsc = ctx.createOscillator();
    const clickGain = ctx.createGain();
    const clickFilter = ctx.createBiquadFilter();

    clickOsc.type = 'square';
    clickOsc.frequency.setValueAtTime(1200 * pitchMultiplier, now);
    clickOsc.frequency.exponentialRampToValueAtTime(400 * pitchMultiplier, now + 0.008);

    clickFilter.type = 'bandpass';
    clickFilter.frequency.value = 2000;
    clickFilter.Q.value = 2;

    // Sharp ADSR: Attack 1ms, Decay 15ms
    clickGain.gain.setValueAtTime(0, now);
    clickGain.gain.linearRampToValueAtTime(baseVolume * 0.6, now + 0.001);
    clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.015);

    clickOsc.connect(clickFilter);
    clickFilter.connect(clickGain);
    clickGain.connect(master);

    clickOsc.start(now);
    clickOsc.stop(now + 0.02);

    // === Component 2: Mechanical thud (body resonance) ===
    const thudOsc = ctx.createOscillator();
    const thudGain = ctx.createGain();

    thudOsc.type = 'sine';
    thudOsc.frequency.setValueAtTime(180 * pitchMultiplier, now);
    thudOsc.frequency.exponentialRampToValueAtTime(100, now + 0.025);

    thudGain.gain.setValueAtTime(0, now);
    thudGain.gain.linearRampToValueAtTime(baseVolume * 0.3, now + 0.002);
    thudGain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

    thudOsc.connect(thudGain);
    thudGain.connect(master);

    thudOsc.start(now);
    thudOsc.stop(now + 0.035);

    // === Component 3: High-frequency click transient ===
    const { source: noiseSource, filter: noiseFilter } = createFilteredNoise(ctx, 0.015, 'highpass', 3000, 1);
    const noiseGain = ctx.createGain();

    noiseGain.gain.setValueAtTime(0, now);
    noiseGain.gain.linearRampToValueAtTime(baseVolume * 0.15, now + 0.0005);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.008);

    noiseFilter.connect(noiseGain);
    noiseGain.connect(master);

    noiseSource.start(now);
    noiseSource.stop(now + 0.015);
  }, [createFilteredNoise, volume]);

  /**
   * Generate space bar sound
   * Deeper thunk, distinct from letter keys
   */
  const playSpace = useCallback((pitchMultiplier: number): void => {
    const ctx = audioContext.current;
    const master = masterGain.current;
    if (!ctx || !master) return;

    const now = ctx.currentTime;
    const baseVolume = volume * 0.45;

    // === Component 1: Deep thunk ===
    const thunkOsc = ctx.createOscillator();
    const thunkGain = ctx.createGain();

    thunkOsc.type = 'sine';
    thunkOsc.frequency.setValueAtTime(120 * pitchMultiplier, now);
    thunkOsc.frequency.exponentialRampToValueAtTime(60, now + 0.05);

    thunkGain.gain.setValueAtTime(0, now);
    thunkGain.gain.linearRampToValueAtTime(baseVolume * 0.5, now + 0.003);
    thunkGain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

    thunkOsc.connect(thunkGain);
    thunkGain.connect(master);

    thunkOsc.start(now);
    thunkOsc.stop(now + 0.07);

    // === Component 2: Mechanical click (softer than keystroke) ===
    const clickOsc = ctx.createOscillator();
    const clickGain = ctx.createGain();

    clickOsc.type = 'triangle';
    clickOsc.frequency.setValueAtTime(800 * pitchMultiplier, now);
    clickOsc.frequency.exponentialRampToValueAtTime(300, now + 0.012);

    clickGain.gain.setValueAtTime(0, now);
    clickGain.gain.linearRampToValueAtTime(baseVolume * 0.25, now + 0.002);
    clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);

    clickOsc.connect(clickGain);
    clickGain.connect(master);

    clickOsc.start(now);
    clickOsc.stop(now + 0.03);

    // === Component 3: Mechanical rattliness ===
    const { source: noiseSource, filter: noiseFilter } = createFilteredNoise(ctx, 0.04, 'bandpass', 1500, 2);
    const noiseGain = ctx.createGain();

    noiseGain.gain.setValueAtTime(0, now);
    noiseGain.gain.linearRampToValueAtTime(baseVolume * 0.1, now + 0.005);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

    noiseFilter.connect(noiseGain);
    noiseGain.connect(master);

    noiseSource.start(now);
    noiseSource.stop(now + 0.04);
  }, [createFilteredNoise, volume]);

  /**
   * Generate backspace sound
   * Softer, no strike sound - just mechanical release
   */
  const playBackspace = useCallback((pitchMultiplier: number): void => {
    const ctx = audioContext.current;
    const master = masterGain.current;
    if (!ctx || !master) return;

    const now = ctx.currentTime;
    const baseVolume = volume * 0.25;

    // === Component 1: Soft mechanical release ===
    const releaseOsc = ctx.createOscillator();
    const releaseGain = ctx.createGain();

    releaseOsc.type = 'sine';
    releaseOsc.frequency.setValueAtTime(300 * pitchMultiplier, now);
    releaseOsc.frequency.exponentialRampToValueAtTime(150, now + 0.02);

    releaseGain.gain.setValueAtTime(0, now);
    releaseGain.gain.linearRampToValueAtTime(baseVolume * 0.4, now + 0.005);
    releaseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);

    releaseOsc.connect(releaseGain);
    releaseGain.connect(master);

    releaseOsc.start(now);
    releaseOsc.stop(now + 0.03);

    // === Component 2: Light friction noise (carriage moving back) ===
    const { source: noiseSource, filter: noiseFilter } = createFilteredNoise(ctx, 0.03, 'lowpass', 2000, 1);
    const noiseGain = ctx.createGain();

    noiseGain.gain.setValueAtTime(0, now);
    noiseGain.gain.linearRampToValueAtTime(baseVolume * 0.15, now + 0.005);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);

    noiseFilter.connect(noiseGain);
    noiseGain.connect(master);

    noiseSource.start(now);
    noiseSource.stop(now + 0.03);
  }, [createFilteredNoise, volume]);

  /**
   * Generate bell sound
   * High-frequency sine with harmonic overtones, longer decay
   */
  const playBell = useCallback((): void => {
    const ctx = audioContext.current;
    const master = masterGain.current;
    if (!ctx || !master) return;

    const now = ctx.currentTime;
    const baseVolume = volume * 0.35;
    const fundamentalFreq = 2200;

    // Bell harmonics (approximating a real bell spectrum)
    const harmonics: BellHarmonic[] = [
      { freq: fundamentalFreq, gain: 1.0, decay: 0.8 },       // Fundamental
      { freq: fundamentalFreq * 2.0, gain: 0.5, decay: 0.6 }, // 2nd harmonic
      { freq: fundamentalFreq * 3.0, gain: 0.25, decay: 0.4 },// 3rd harmonic
      { freq: fundamentalFreq * 4.2, gain: 0.15, decay: 0.3 },// Inharmonic
      { freq: fundamentalFreq * 5.4, gain: 0.1, decay: 0.25 },// Inharmonic
    ];

    playBellHarmonics(ctx, master, baseVolume, fundamentalFreq, now, harmonics);

    // === Add subtle strike transient ===
    const strikeOsc = ctx.createOscillator();
    const strikeGain = ctx.createGain();

    strikeOsc.type = 'triangle';
    strikeOsc.frequency.setValueAtTime(4000, now);
    strikeOsc.frequency.exponentialRampToValueAtTime(2000, now + 0.01);

    strikeGain.gain.setValueAtTime(0, now);
    strikeGain.gain.linearRampToValueAtTime(baseVolume * 0.2, now + 0.001);
    strikeGain.gain.exponentialRampToValueAtTime(0.001, now + 0.015);

    strikeOsc.connect(strikeGain);
    strikeGain.connect(master);

    strikeOsc.start(now);
    strikeOsc.stop(now + 0.02);
  }, [volume]);

  /**
   * Generate carriage return sound
   * Swoosh (filtered noise sweep) followed by bell
   */
  const playCarriageReturn = useCallback((): void => {
    const ctx = audioContext.current;
    const master = masterGain.current;
    if (!ctx || !master) return;

    const now = ctx.currentTime;
    const baseVolume = volume * 0.4;
    const swooshDuration = 0.25;

    // === Component 1: Carriage swoosh (filtered noise with frequency sweep) ===
    const noiseBuffer = createNoiseBuffer(ctx, swooshDuration + 0.1);
    const swooshSource = ctx.createBufferSource();
    swooshSource.buffer = noiseBuffer;

    const swooshFilter = ctx.createBiquadFilter();
    swooshFilter.type = 'bandpass';
    swooshFilter.Q.value = 3;
    // Sweep from low to high frequency (simulating carriage moving)
    swooshFilter.frequency.setValueAtTime(300, now);
    swooshFilter.frequency.exponentialRampToValueAtTime(2500, now + swooshDuration * 0.7);
    swooshFilter.frequency.exponentialRampToValueAtTime(800, now + swooshDuration);

    const swooshGain = ctx.createGain();
    swooshGain.gain.setValueAtTime(0, now);
    swooshGain.gain.linearRampToValueAtTime(baseVolume * 0.35, now + 0.02);
    swooshGain.gain.setValueAtTime(baseVolume * 0.35, now + swooshDuration * 0.6);
    swooshGain.gain.exponentialRampToValueAtTime(0.001, now + swooshDuration);

    swooshSource.connect(swooshFilter);
    swooshFilter.connect(swooshGain);
    swooshGain.connect(master);

    swooshSource.start(now);
    swooshSource.stop(now + swooshDuration + 0.05);

    // === Component 2: Mechanical clunk at start ===
    const clunkOsc = ctx.createOscillator();
    const clunkGain = ctx.createGain();

    clunkOsc.type = 'sine';
    clunkOsc.frequency.setValueAtTime(200, now);
    clunkOsc.frequency.exponentialRampToValueAtTime(80, now + 0.04);

    clunkGain.gain.setValueAtTime(0, now);
    clunkGain.gain.linearRampToValueAtTime(baseVolume * 0.4, now + 0.003);
    clunkGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    clunkOsc.connect(clunkGain);
    clunkGain.connect(master);

    clunkOsc.start(now);
    clunkOsc.stop(now + 0.06);

    // === Component 3: Stop clunk at end ===
    const stopClunkOsc = ctx.createOscillator();
    const stopClunkGain = ctx.createGain();

    stopClunkOsc.type = 'triangle';
    stopClunkOsc.frequency.setValueAtTime(250, now + swooshDuration - 0.02);
    stopClunkOsc.frequency.exponentialRampToValueAtTime(100, now + swooshDuration + 0.02);

    stopClunkGain.gain.setValueAtTime(0, now + swooshDuration - 0.02);
    stopClunkGain.gain.linearRampToValueAtTime(baseVolume * 0.3, now + swooshDuration - 0.015);
    stopClunkGain.gain.exponentialRampToValueAtTime(0.001, now + swooshDuration + 0.03);

    stopClunkOsc.connect(stopClunkGain);
    stopClunkGain.connect(master);

    stopClunkOsc.start(now + swooshDuration - 0.02);
    stopClunkOsc.stop(now + swooshDuration + 0.04);

    // === Component 4: Bell ring at end (the payoff moment) ===
    const bellDelay = swooshDuration - 0.05;
    const bellFundamental = 2400;
    const bellHarmonics: BellHarmonic[] = [
      { freq: bellFundamental, gain: 1.0, decay: 0.6 },
      { freq: bellFundamental * 2.0, gain: 0.4, decay: 0.4 },
      { freq: bellFundamental * 3.2, gain: 0.2, decay: 0.3 },
    ];

    playBellHarmonics(ctx, master, baseVolume, bellFundamental, now + bellDelay, bellHarmonics, 0.5);
  }, [createNoiseBuffer, volume]);

  /**
   * Generate drawer open sound (for drawer UI)
   */
  const playDrawerOpen = useCallback((): void => {
    const ctx = audioContext.current;
    const master = masterGain.current;
    if (!ctx || !master) return;

    const now = ctx.currentTime;
    const baseVolume = volume * 0.3;

    // Sliding friction + click
    const { source: noiseSource, filter: noiseFilter } = createFilteredNoise(ctx, 0.15, 'lowpass', 1500, 1);
    const noiseGain = ctx.createGain();

    noiseGain.gain.setValueAtTime(0, now);
    noiseGain.gain.linearRampToValueAtTime(baseVolume * 0.2, now + 0.02);
    noiseGain.gain.linearRampToValueAtTime(baseVolume * 0.15, now + 0.1);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    noiseFilter.connect(noiseGain);
    noiseGain.connect(master);

    noiseSource.start(now);
    noiseSource.stop(now + 0.15);

    // Stop thunk
    const thunkOsc = ctx.createOscillator();
    const thunkGain = ctx.createGain();

    thunkOsc.type = 'sine';
    thunkOsc.frequency.setValueAtTime(150, now + 0.12);
    thunkOsc.frequency.exponentialRampToValueAtTime(80, now + 0.18);

    thunkGain.gain.setValueAtTime(0, now + 0.12);
    thunkGain.gain.linearRampToValueAtTime(baseVolume * 0.35, now + 0.125);
    thunkGain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

    thunkOsc.connect(thunkGain);
    thunkGain.connect(master);

    thunkOsc.start(now + 0.12);
    thunkOsc.stop(now + 0.21);
  }, [createFilteredNoise, volume]);

  /**
   * Generate drawer close sound (for drawer UI)
   */
  const playDrawerClose = useCallback((): void => {
    const ctx = audioContext.current;
    const master = masterGain.current;
    if (!ctx || !master) return;

    const now = ctx.currentTime;
    const baseVolume = volume * 0.3;

    // Sliding + softer close
    const { source: noiseSource, filter: noiseFilter } = createFilteredNoise(ctx, 0.12, 'lowpass', 1200, 1);
    const noiseGain = ctx.createGain();

    noiseGain.gain.setValueAtTime(baseVolume * 0.15, now);
    noiseGain.gain.linearRampToValueAtTime(baseVolume * 0.1, now + 0.08);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    noiseFilter.connect(noiseGain);
    noiseGain.connect(master);

    noiseSource.start(now);
    noiseSource.stop(now + 0.12);

    // Softer close thunk
    const thunkOsc = ctx.createOscillator();
    const thunkGain = ctx.createGain();

    thunkOsc.type = 'sine';
    thunkOsc.frequency.setValueAtTime(180, now + 0.09);
    thunkOsc.frequency.exponentialRampToValueAtTime(90, now + 0.14);

    thunkGain.gain.setValueAtTime(0, now + 0.09);
    thunkGain.gain.linearRampToValueAtTime(baseVolume * 0.25, now + 0.095);
    thunkGain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

    thunkOsc.connect(thunkGain);
    thunkGain.connect(master);

    thunkOsc.start(now + 0.09);
    thunkOsc.stop(now + 0.17);
  }, [createFilteredNoise, volume]);

  /**
   * Initialize audio context on first user interaction
   */
  const initAudio = useCallback(() => {
    if (isInitialized.current) return;

    audioContext.current = createAudioContext();
    if (!audioContext.current) return;

    // Create master gain for volume control
    masterGain.current = audioContext.current.createGain();
    masterGain.current.gain.value = isMuted ? 0 : 1;
    masterGain.current.connect(audioContext.current.destination);

    isInitialized.current = true;
    hasUserInteracted.current = true;

    // Resume context if suspended (browser autoplay policy)
    if (audioContext.current.state === 'suspended') {
      audioContext.current.resume();
    }
  }, [isMuted]);

  /**
   * Handle visibility change - auto-mute when tab is hidden
   */
  useEffect(() => {
    if (typeof document === 'undefined') return;

    const handleVisibilityChange = () => {
      const visible = document.visibilityState === 'visible';
      setIsVisible(visible);

      // Auto-mute when tab is hidden
      if (masterGain.current) {
        masterGain.current.gain.value = (visible && !isMuted) ? 1 : 0;
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isMuted]);

  /**
   * Sync mute state with master gain
   */
  useEffect(() => {
    if (masterGain.current) {
      masterGain.current.gain.value = (isVisible && !isMuted) ? 1 : 0;
    }
  }, [isMuted, isVisible]);

  /**
   * Play a sound with debouncing and pitch variation
   */
  const playSound = useCallback(
    (type: SoundType) => {
      // Check all conditions that should prevent sound
      if (!settings.enabled) return;
      if (isMuted) return;
      if (!isVisible) return;
      if (prefersReducedMotion()) return;
      if (!hasUserInteracted.current) return;

      // Initialize on first play (user interaction requirement)
      initAudio();

      // Additional check after init
      if (!audioContext.current || !masterGain.current) return;

      // Resume context if needed
      if (audioContext.current.state === 'suspended') {
        audioContext.current.resume();
      }

      // Debounce check
      const now = Date.now();
      const lastPlay = lastPlayTime.current.get(type) || 0;

      if (now - lastPlay < DEBOUNCE_MS) return;
      lastPlayTime.current.set(type, now);

      // Calculate pitch variation for varied sounds
      const pitchMultiplier =
        1 + (Math.random() * 2 - 1) * settings.pitchVariation;

      // Play the appropriate sound
      switch (type) {
        case 'keystroke':
          playKeystroke(pitchMultiplier);
          break;
        case 'space':
          playSpace(pitchMultiplier);
          break;
        case 'backspace':
          playBackspace(pitchMultiplier);
          break;
        case 'bell':
          playBell();
          break;
        case 'carriageReturn':
          playCarriageReturn();
          break;
        case 'drawerOpen':
          playDrawerOpen();
          break;
        case 'drawerClose':
          playDrawerClose();
          break;
      }
    },
    [
      settings.enabled,
      settings.pitchVariation,
      isMuted,
      isVisible,
      initAudio,
      playKeystroke,
      playSpace,
      playBackspace,
      playBell,
      playCarriageReturn,
      playDrawerOpen,
      playDrawerClose,
    ]
  );

  /**
   * Mute/unmute all sounds (persisted to localStorage)
   */
  const setMuted = useCallback((muted: boolean) => {
    setIsMuted(muted);
    setStoredMuteState(muted);

    if (masterGain.current) {
      masterGain.current.gain.value = (isVisible && !muted) ? 1 : 0;
    }
  }, [isVisible]);

  /**
   * Toggle mute state
   */
  const toggleMute = useCallback(() => {
    setMuted(!isMuted);
  }, [isMuted, setMuted]);

  /**
   * Set volume (0-1)
   */
  const setVolume = useCallback((newVolume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    setVolumeState(clampedVolume);
  }, []);

  /**
   * Register user interaction (required for audio context)
   */
  const registerInteraction = useCallback(() => {
    hasUserInteracted.current = true;

    // Resume suspended audio context
    if (audioContext.current?.state === 'suspended') {
      audioContext.current.resume();
    }
  }, []);

  /**
   * Preload sounds (no-op for synthesized sounds, but keeps API consistent)
   */
  const preloadSounds = useCallback(() => {
    // Synthesized sounds don't need preloading
    // This function exists for API compatibility
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioContext.current?.state !== 'closed') {
        audioContext.current?.close();
      }
    };
  }, []);

  return {
    playSound,
    setMuted,
    toggleMute,
    setVolume,
    preloadSounds,
    initAudio,
    registerInteraction,
    // State accessors
    isMuted,
    volume,
    isVisible,
  };
}
