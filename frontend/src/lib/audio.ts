// Life RPG Sound & Haptics Engine using Native Web Audio API and Navigator Vibrate
// 100% real-time procedural audio synthesis — zero external file dependencies or latency.

class SoundEngine {
  private ctx: AudioContext | null = null;
  private soundEnabled: boolean = true;
  private hapticsEnabled: boolean = true;

  constructor() {
    if (typeof window !== "undefined") {
      const savedSound = localStorage.getItem("sound_enabled");
      this.soundEnabled = savedSound === null ? true : savedSound === "true";

      const savedHaptics = localStorage.getItem("haptics_enabled");
      this.hapticsEnabled = savedHaptics === null ? true : savedHaptics === "true";
    }
  }

  private getAudioContext(): AudioContext | null {
    if (typeof window === "undefined") return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public setSoundEnabled(enabled: boolean) {
    this.soundEnabled = enabled;
    if (typeof window !== "undefined") {
      localStorage.setItem("sound_enabled", String(enabled));
    }
  }

  public isSoundEnabled(): boolean {
    return this.soundEnabled;
  }

  public setHapticsEnabled(enabled: boolean) {
    this.hapticsEnabled = enabled;
    if (typeof window !== "undefined") {
      localStorage.setItem("haptics_enabled", String(enabled));
    }
  }

  public isHapticsEnabled(): boolean {
    return this.hapticsEnabled;
  }

  public vibrate(pattern: number | number[] = 25) {
    if (!this.hapticsEnabled || typeof window === "undefined" || !navigator.vibrate) return;
    try {
      navigator.vibrate(pattern);
    } catch {
      // Ignore if device restricts vibration
    }
  }

  // 1. Magical Quest Complete Chime (E5 -> G#5 -> B5 arpeggio)
  public playQuestComplete() {
    this.vibrate([40, 30, 45]);
    if (!this.soundEnabled) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const notes = [659.25, 830.61, 987.77, 1318.51]; // E5, G#5, B5, E6
    const startTime = ctx.currentTime;

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, startTime + idx * 0.08);

      gain.gain.setValueAtTime(0, startTime + idx * 0.08);
      gain.gain.linearRampToValueAtTime(0.18, startTime + idx * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + idx * 0.08 + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime + idx * 0.08);
      osc.stop(startTime + idx * 0.08 + 0.4);
    });
  }

  // 2. Triumphant Level Up Fanfare
  public playLevelUp() {
    this.vibrate([60, 40, 80, 40, 180]);
    if (!this.soundEnabled) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const startTime = ctx.currentTime;
    // Heroic brass arpeggio: C4, G4, C5, E5, G5, C6
    const chord = [
      { f: 261.63, t: 0.0, d: 0.15 },
      { f: 392.00, t: 0.12, d: 0.15 },
      { f: 523.25, t: 0.24, d: 0.18 },
      { f: 659.25, t: 0.38, d: 0.22 },
      { f: 783.99, t: 0.52, d: 0.25 },
      { f: 1046.50, t: 0.68, d: 0.8 },
    ];

    chord.forEach((note) => {
      // Main oscillator
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(note.f, startTime + note.t);

      gain.gain.setValueAtTime(0, startTime + note.t);
      gain.gain.linearRampToValueAtTime(0.22, startTime + note.t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + note.t + note.d);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime + note.t);
      osc.stop(startTime + note.t + note.d + 0.05);

      // Shimmer harmonic overtone for the triumphant chord finale
      if (note.f >= 783.99) {
        const subOsc = ctx.createOscillator();
        const subGain = ctx.createGain();
        subOsc.type = "sine";
        subOsc.frequency.setValueAtTime(note.f * 2, startTime + note.t);
        subGain.gain.setValueAtTime(0.08, startTime + note.t);
        subGain.gain.exponentialRampToValueAtTime(0.001, startTime + note.t + note.d);
        subOsc.connect(subGain);
        subGain.connect(ctx.destination);
        subOsc.start(startTime + note.t);
        subOsc.stop(startTime + note.t + note.d + 0.05);
      }
    });
  }

  // 3. Sparkling Gold Coin Ring (Purchase & Reward)
  public playCoin() {
    this.vibrate([25, 20, 40]);
    if (!this.soundEnabled) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const startTime = ctx.currentTime;
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = "sine";
    osc1.frequency.setValueAtTime(1864.66, startTime); // A#6
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(2489.02, startTime + 0.06); // D#7

    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(0.18, startTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.45);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(startTime);
    osc1.stop(startTime + 0.25);
    osc2.start(startTime + 0.06);
    osc2.stop(startTime + 0.45);
  }

  // 4. Subtle Tactile Tap
  public playTap() {
    this.vibrate(15);
    if (!this.soundEnabled) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const startTime = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(320, startTime);
    osc.frequency.exponentialRampToValueAtTime(120, startTime + 0.04);

    gain.gain.setValueAtTime(0.1, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.04);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + 0.05);
  }

  // 5. Hero Action / Equip / Open
  public playSwoosh() {
    this.vibrate(20);
    if (!this.soundEnabled) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const startTime = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(220, startTime);
    osc.frequency.linearRampToValueAtTime(540, startTime + 0.08);

    gain.gain.setValueAtTime(0.08, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.12);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + 0.12);
  }
}

export const soundEngine = new SoundEngine();
