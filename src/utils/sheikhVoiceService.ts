// Sheikh Voice Service (خدمة صوت الشيخ الخاشع)
// Delivers reverent, dignified Arabic speech recitation for Hadiths, Islamic Stories, and Azkar
// 100% Offline, using Web Speech API fine-tuned for a Sheikh vocal profile + Web Audio spiritual preludes.

import { adhanService } from './adhanService';

export interface SheikhVoiceSettings {
  pitch: number; // 0.80 - 1.10 (Default: 0.88 for deep, solemn Sheikh timbre)
  rate: number; // 0.70 - 1.00 (Default: 0.82 for deliberate, tranquil recitation pace)
  volume: number; // 0.0 - 1.0 (Default: 1.0)
  playPreludeChime: boolean; // Gentle reverent harmonic bell before starting
}

export interface NarrationQueueState {
  isActive: boolean;
  isPlaying: boolean;
  activeId: string | null; // e.g., story ID or hadith ID
  title: string;
  sourceType: 'hadith' | 'story' | 'dhikr' | null;
  currentChunkIndex: number;
  totalChunks: number;
  currentText: string;
}

type StateListener = (state: NarrationQueueState) => void;

const STORAGE_SETTINGS_KEY = 'noor_wa_dhikr_sheikh_voice_v1';

const DEFAULT_SETTINGS: SheikhVoiceSettings = {
  pitch: 0.88,
  rate: 0.82,
  volume: 1.0,
  playPreludeChime: true,
};

class SheikhVoiceService {
  private settings: SheikhVoiceSettings = DEFAULT_SETTINGS;
  private audioCtx: AudioContext | null = null;
  private listeners: Set<StateListener> = new Set();

  private queue: string[] = [];
  private currentChunkIndex: number = 0;
  private activeId: string | null = null;
  private activeTitle: string = '';
  private activeSourceType: 'hadith' | 'story' | 'dhikr' | null = null;
  private isPlaying: boolean = false;
  private isPaused: boolean = false;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private cachedVoices: SpeechSynthesisVoice[] = [];

  constructor() {
    this.loadSettings();
    this.initVoiceList();

    // Automatically stop/pause narration when Adhan or Iqama begins
    adhanService.onAdhanStart(() => {
      if (this.isPlaying) {
        this.pause();
      }
    });

    adhanService.onIqamaStart(() => {
      if (this.isPlaying) {
        this.pause();
      }
    });
  }

  private loadSettings() {
    try {
      const saved = localStorage.getItem(STORAGE_SETTINGS_KEY);
      if (saved) {
        this.settings = { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
      }
    } catch {
      this.settings = DEFAULT_SETTINGS;
    }
  }

  public saveSettings(newSettings: Partial<SheikhVoiceSettings>) {
    this.settings = { ...this.settings, ...newSettings };
    try {
      localStorage.setItem(STORAGE_SETTINGS_KEY, JSON.stringify(this.settings));
    } catch (e) {
      console.warn('Failed to save sheikh voice settings', e);
    }
  }

  public getSettings(): SheikhVoiceSettings {
    return { ...this.settings };
  }

  private initVoiceList() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    const populate = () => {
      this.cachedVoices = window.speechSynthesis.getVoices();
    };

    populate();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = populate;
    }
  }

  // Find optimal Arabic voice (preferring male, dignified sounding voices)
  public getBestArabicVoice(): SpeechSynthesisVoice | null {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;

    const voices = this.cachedVoices.length > 0 ? this.cachedVoices : window.speechSynthesis.getVoices();
    const arabicVoices = voices.filter(v => v.lang.startsWith('ar') || v.name.toLowerCase().includes('arabic'));

    if (arabicVoices.length === 0) return null;

    // Prefer renowned male Arabic voice profiles if available on Android / Chrome / iOS
    const preferredNames = [
      'tarik', 'maged', 'naayf', 'tariq', 'shakir', 'salim', 'google ar', 'microsoft', 'arabic (saudi'
    ];

    for (const pref of preferredNames) {
      const match = arabicVoices.find(v => v.name.toLowerCase().includes(pref));
      if (match) return match;
    }

    // Default to Saudi / Egyptian Arabic if available
    const saudiVoice = arabicVoices.find(v => v.lang.toLowerCase() === 'ar-sa');
    if (saudiVoice) return saudiVoice;

    return arabicVoices[0];
  }

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.audioCtx) {
      const AudioCtxClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  // Spiritual harmonic chime with gentle acoustic decay
  public playPreludeChime(): Promise<void> {
    return new Promise(resolve => {
      try {
        const ctx = this.getAudioContext();
        if (!ctx) return resolve();

        // Tranquil harmonic chord (F# / A# / C# - soothing spiritual resonance)
        const freqs = [370.0, 466.16, 554.37];
        const gainNode = ctx.createGain();
        gainNode.gain.setValueAtTime(this.settings.volume * 0.12, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.2);
        gainNode.connect(ctx.destination);

        freqs.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.05);
          osc.connect(gainNode);
          osc.start(ctx.currentTime + idx * 0.05);
          osc.stop(ctx.currentTime + idx * 0.05 + 1.15);
        });

        setTimeout(resolve, 320);
      } catch {
        resolve();
      }
    });
  }

  public subscribe(listener: StateListener): () => void {
    this.listeners.add(listener);
    listener(this.getState());
    return () => {
      this.listeners.delete(listener);
    };
  }

  public getState(): NarrationQueueState {
    return {
      isActive: this.activeId !== null,
      isPlaying: this.isPlaying,
      activeId: this.activeId,
      title: this.activeTitle,
      sourceType: this.activeSourceType,
      currentChunkIndex: this.currentChunkIndex,
      totalChunks: this.queue.length,
      currentText: this.queue[this.currentChunkIndex] || '',
    };
  }

  private notify() {
    const st = this.getState();
    this.listeners.forEach(fn => fn(st));
  }

  // Stop any active recitation
  public stop() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // ignore
      }
    }
    this.queue = [];
    this.currentChunkIndex = 0;
    this.activeId = null;
    this.activeTitle = '';
    this.activeSourceType = null;
    this.isPlaying = false;
    this.isPaused = false;
    this.currentUtterance = null;
    this.notify();
  }

  public pause() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      if (this.isPlaying && !this.isPaused) {
        window.speechSynthesis.pause();
        this.isPlaying = false;
        this.isPaused = true;
        this.notify();
      }
    }
  }

  public resume() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      if (this.isPaused) {
        window.speechSynthesis.resume();
        this.isPlaying = true;
        this.isPaused = false;
        this.notify();
        return;
      }
    }
    if (this.activeId && this.queue.length > 0 && !this.isPlaying) {
      this.speakCurrentChunk();
    }
  }

  // Next paragraph / chunk
  public next() {
    if (this.currentChunkIndex < this.queue.length - 1) {
      this.currentChunkIndex++;
      this.speakCurrentChunk();
    } else {
      this.stop();
    }
  }

  // Previous paragraph / chunk
  public previous() {
    if (this.currentChunkIndex > 0) {
      this.currentChunkIndex--;
      this.speakCurrentChunk();
    } else {
      this.speakCurrentChunk();
    }
  }

  public jumpToChunk(index: number) {
    if (index >= 0 && index < this.queue.length) {
      this.currentChunkIndex = index;
      this.speakCurrentChunk();
    }
  }

  // Start reading a Story (structured paragraphs with title & morals)
  public async playStory(
    storyId: string,
    title: string,
    paragraphs: string[],
    moralLessons?: string[]
  ) {
    // If currently playing this story, toggle pause/play
    if (this.activeId === storyId) {
      if (this.isPlaying) {
        this.pause();
      } else {
        this.resume();
      }
      return;
    }

    this.stop();

    const chunks: string[] = [];
    chunks.push(`قصة ${title}`);
    paragraphs.forEach(p => {
      const clean = p.trim();
      if (clean) chunks.push(clean);
    });

    if (moralLessons && moralLessons.length > 0) {
      chunks.push(`من الدروس والعبر المستفادة: ${moralLessons.join('، و ')}`);
    }

    this.queue = chunks;
    this.currentChunkIndex = 0;
    this.activeId = storyId;
    this.activeTitle = title;
    this.activeSourceType = 'story';
    this.isPlaying = true;
    this.isPaused = false;
    this.notify();

    if (this.settings.playPreludeChime) {
      await this.playPreludeChime();
    }

    this.speakCurrentChunk();
  }

  // Start reading a single Hadith
  public async playHadith(hadithId: string, title: string, matn: string, rawi?: string, source?: string) {
    if (this.activeId === hadithId) {
      if (this.isPlaying) {
        this.pause();
      } else {
        this.resume();
      }
      return;
    }

    this.stop();

    const chunks: string[] = [];
    // Dignified Islamic opening
    chunks.push(`عن ${rawi || 'رسول الله ﷺ'} قال: «${matn}»`);
    if (source) {
      chunks.push(`رواه ${source}`);
    }

    this.queue = chunks;
    this.currentChunkIndex = 0;
    this.activeId = hadithId;
    this.activeTitle = title;
    this.activeSourceType = 'hadith';
    this.isPlaying = true;
    this.isPaused = false;
    this.notify();

    if (this.settings.playPreludeChime) {
      await this.playPreludeChime();
    }

    this.speakCurrentChunk();
  }

  // General speech method for Dhikr or single phrase
  public async speakPhrase(text: string): Promise<void> {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (this.settings.playPreludeChime) {
      await this.playPreludeChime();
    }

    return new Promise(resolve => {
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'ar-SA';
        utterance.rate = this.settings.rate;
        utterance.pitch = this.settings.pitch;
        utterance.volume = this.settings.volume;

        const voice = this.getBestArabicVoice();
        if (voice) utterance.voice = voice;

        utterance.onend = () => resolve();
        utterance.onerror = () => resolve();

        window.speechSynthesis.speak(utterance);
      } catch {
        resolve();
      }
    });
  }

  // Internal: speak the chunk at currentChunkIndex
  private speakCurrentChunk() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    if (this.currentChunkIndex >= this.queue.length) {
      this.stop();
      return;
    }

    window.speechSynthesis.cancel();

    const chunkText = this.queue[this.currentChunkIndex];
    const utterance = new SpeechSynthesisUtterance(chunkText);
    utterance.lang = 'ar-SA';
    utterance.rate = this.settings.rate;
    utterance.pitch = this.settings.pitch;
    utterance.volume = this.settings.volume;

    const voice = this.getBestArabicVoice();
    if (voice) utterance.voice = voice;

    utterance.onend = () => {
      // Small natural pause between paragraphs for respect and comprehension
      if (this.currentChunkIndex < this.queue.length - 1 && this.isPlaying) {
        setTimeout(() => {
          if (this.isPlaying && !this.isPaused) {
            this.currentChunkIndex++;
            this.notify();
            this.speakCurrentChunk();
          }
        }, 500);
      } else {
        this.stop();
      }
    };

    utterance.onerror = () => {
      this.stop();
    };

    this.currentUtterance = utterance;
    this.isPlaying = true;
    this.isPaused = false;
    this.notify();

    window.speechSynthesis.speak(utterance);
  }
}

export const sheikhVoiceService = new SheikhVoiceService();
