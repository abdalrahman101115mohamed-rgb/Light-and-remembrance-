// 5-Minute Combined Azkar & Salawat Engine (نور وذكر)
// 100% Offline, plays every 5 minutes:
// «سُبْحَانَ اللَّهِ، وَالْحَمْدُ لِلَّهِ، وَلَا إِلَهَ إِلَّا اللَّهُ، وَاللَّهُ أَكْبَرُ، وَصَلَّى اللَّهُ عَلَى مُحَمَّدٍ»
// In Sheikh Mishary acoustic tone & high-fidelity voice, with full coordination with Adhan & Iqama.

import { adhanService } from './adhanService';
import { sheikhVoiceService } from './sheikhVoiceService';

export interface AzkarReminderConfig {
  enabled: boolean;
  intervalMinutes: number; // default 5 minutes
  volume: number; // 0.0 to 1.0
  playChime: boolean;
  voiceStyle: 'abdulbasit' | 'mishary' | 'sheikh_reader'; // 'abdulbasit': Sheikh Abdul Basit, 'mishary': Alafasy, 'sheikh_reader': reverent voice
  allowSystemNotification: boolean;
  // Sleep / Quiet Hours (أوقات النوم والسكون)
  quietHoursEnabled: boolean;
  quietStart: string; // e.g. "23:00" (11:00 PM)
  quietEnd: string; // e.g. "05:00" (5:00 AM)
  pauseDuringCallsOrMedia: boolean;
}

export const COMBINED_ZHIKR_TEXT =
  'سُبْحَانَ اللَّهِ ، وَالْحَمْدُ لِلَّهِ ، وَلَا إِلَهَ إِلَّا اللَّهُ ، وَاللَّهُ أَكْبَرُ ، وَصَلَّى اللَّهُ عَلَى نَبِيِّنَا مُحَمَّدٍ ﷺ';

export const COMBINED_ZHIKR_SPOKEN =
  'سُبْحَانَ اللَّهِ ، وَالْحَمْدُ لِلَّهِ ، وَلَا إِلَهَ إِلَّا اللَّهُ ، وَاللَّهُ أَكْبَرُ ، وَصَلَّى اللَّهُ عَلَى مُحَمَّدٍ';

const STORAGE_KEY = 'noor_wa_dhikr_azkar_reminder_v4';

const DEFAULT_CONFIG: AzkarReminderConfig = {
  enabled: true,
  intervalMinutes: 5,
  volume: 0.95,
  playChime: true,
  voiceStyle: 'abdulbasit',
  allowSystemNotification: true,
  quietHoursEnabled: true,
  quietStart: '23:00',
  quietEnd: '05:00',
  pauseDuringCallsOrMedia: true,
};

type Listener = (state: ReminderState) => void;

export interface ReminderState {
  config: AzkarReminderConfig;
  secondsRemaining: number;
  currentZhikrText: string;
  isPlayingAudio: boolean;
  isPausedForAdhan: boolean;
  isPausedForIqama: boolean;
  isInQuietHours: boolean;
  permissionStatus: NotificationPermission | 'unsupported';
  lastRecitedAt: string | null;
}

class SalawatAudioReminderService {
  private config: AzkarReminderConfig = DEFAULT_CONFIG;
  private secondsRemaining: number = 300; // 5 min = 300s
  private timerId: number | null = null;
  private isPlayingAudio: boolean = false;
  private isPausedForAdhan: boolean = false;
  private isPausedForIqama: boolean = false;
  private listeners: Set<Listener> = new Set();
  private audioCtx: AudioContext | null = null;
  private localAudioEl: HTMLAudioElement | null = null;
  private lastRecitedAt: string | null = null;

  constructor() {
    this.loadConfig();
    this.secondsRemaining = this.config.intervalMinutes * 60;
    this.startTimer();

    // Coordinate with Adhan: Pause Azkar when Adhan starts, resume when done
    adhanService.onAdhanStart(() => {
      this.isPausedForAdhan = true;
      this.stopCurrentVoice();
      this.notifyListeners();
    });

    adhanService.onAdhanEnd(() => {
      this.isPausedForAdhan = false;
      this.notifyListeners();
    });

    // Coordinate with Iqama: Pause Azkar when Iqama starts, resume when done
    adhanService.onIqamaStart(() => {
      this.isPausedForIqama = true;
      this.stopCurrentVoice();
      this.notifyListeners();
    });

    adhanService.onIqamaEnd(() => {
      this.isPausedForIqama = false;
      this.notifyListeners();
    });
  }

  private loadConfig() {
    try {
      const saved =
        localStorage.getItem(STORAGE_KEY) ||
        localStorage.getItem('noor_wa_dhikr_azkar_reminder_v3');
      if (saved) {
        const parsed = JSON.parse(saved);
        this.config = { ...DEFAULT_CONFIG, ...parsed };
        // If not explicitly set or upgraded, default to Sheikh Abdul Basit as requested
        if (!parsed.voiceStyle || parsed.voiceStyle === 'mishary') {
          this.config.voiceStyle = 'abdulbasit';
        }
      } else {
        this.config = { ...DEFAULT_CONFIG, voiceStyle: 'abdulbasit' };
      }
    } catch {
      this.config = DEFAULT_CONFIG;
    }
  }

  private saveConfig() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.config));
    } catch (e) {
      console.warn('Storage save failed:', e);
    }
  }

  public getConfig(): AzkarReminderConfig {
    return { ...this.config };
  }

  public updateConfig(newConfig: Partial<AzkarReminderConfig>) {
    const wasEnabled = this.config.enabled;
    const prevInterval = this.config.intervalMinutes;

    this.config = { ...this.config, ...newConfig };
    this.saveConfig();

    if (newConfig.intervalMinutes && newConfig.intervalMinutes !== prevInterval) {
      this.secondsRemaining = this.config.intervalMinutes * 60;
    }

    if (!this.config.enabled) {
      this.stopTimer();
      this.stopCurrentVoice();
    } else {
      if (this.timerId === null) {
        this.startTimer();
      }
      // When newly enabled, play the combined remembrance immediately!
      if (!wasEnabled && this.config.enabled) {
        this.playCombinedZhikrNow();
      }
    }

    this.notifyListeners();
  }

  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    listener(this.getState());
    return () => {
      this.listeners.delete(listener);
    };
  }

  public isInsideQuietHours(): boolean {
    if (!this.config.quietHoursEnabled) return false;

    const now = new Date();
    const currMinutes = now.getHours() * 60 + now.getMinutes();

    const [startH, startM] = this.config.quietStart.split(':').map(Number);
    const [endH, endM] = this.config.quietEnd.split(':').map(Number);

    const startTotal = (startH || 0) * 60 + (startM || 0);
    const endTotal = (endH || 0) * 60 + (endM || 0);

    if (startTotal <= endTotal) {
      return currMinutes >= startTotal && currMinutes < endTotal;
    } else {
      return currMinutes >= startTotal || currMinutes < endTotal;
    }
  }

  private isDeviceBusy(): boolean {
    if (!this.config.pauseDuringCallsOrMedia) return false;
    if (this.isPausedForAdhan || this.isPausedForIqama) return true;

    if (typeof navigator !== 'undefined' && 'mediaSession' in navigator) {
      if (navigator.mediaSession.playbackState === 'playing') {
        return true;
      }
    }

    return false;
  }

  public getState(): ReminderState {
    const permissionStatus: NotificationPermission | 'unsupported' =
      typeof window !== 'undefined' && 'Notification' in window
        ? Notification.permission
        : 'unsupported';

    return {
      config: { ...this.config },
      secondsRemaining: this.secondsRemaining,
      currentZhikrText: COMBINED_ZHIKR_TEXT,
      isPlayingAudio: this.isPlayingAudio,
      isPausedForAdhan: this.isPausedForAdhan,
      isPausedForIqama: this.isPausedForIqama,
      isInQuietHours: this.isInsideQuietHours(),
      permissionStatus,
      lastRecitedAt: this.lastRecitedAt,
    };
  }

  private notifyListeners() {
    const state = this.getState();
    this.listeners.forEach(fn => fn(state));
  }

  private startTimer() {
    if (this.timerId !== null) clearInterval(this.timerId);
    if (!this.config.enabled) return;

    this.timerId = window.setInterval(() => {
      if (!this.config.enabled) return;

      if (this.secondsRemaining > 0) {
        this.secondsRemaining -= 1;
        this.notifyListeners();
      } else {
        // Reset 5-minute timer and trigger remembrance
        this.secondsRemaining = this.config.intervalMinutes * 60;
        this.triggerPeriodicZhikr();
      }
    }, 1000);
  }

  private stopTimer() {
    if (this.timerId !== null) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.audioCtx) {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  public playChimeSound(): Promise<void> {
    return new Promise(resolve => {
      try {
        const ctx = this.getAudioContext();
        if (!ctx) return resolve();

        const notes = [523.25, 659.25, 783.99, 1046.5];
        const gainNode = ctx.createGain();
        gainNode.gain.setValueAtTime(this.config.volume * 0.16, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
        gainNode.connect(ctx.destination);

        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);
          osc.connect(gainNode);
          osc.start(ctx.currentTime + idx * 0.08);
          osc.stop(ctx.currentTime + idx * 0.08 + 1.1);
        });

        setTimeout(resolve, 350);
      } catch {
        resolve();
      }
    });
  }

  public async requestNotificationPermission(): Promise<boolean> {
    if (typeof window === 'undefined' || !('Notification' in window)) return false;
    try {
      const perm = await Notification.requestPermission();
      this.notifyListeners();
      return perm === 'granted';
    } catch {
      return false;
    }
  }

  private stopCurrentVoice() {
    if (this.localAudioEl) {
      try {
        this.localAudioEl.pause();
        this.localAudioEl.currentTime = 0;
      } catch {
        // ignore
      }
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // ignore
      }
    }
    this.isPlayingAudio = false;
  }

  // Speak Arabic phrase with soothing, reverent Sheikh cadence
  private async speakPhraseFallback(textToSpeak: string): Promise<void> {
    try {
      this.isPlayingAudio = true;
      this.notifyListeners();
      await sheikhVoiceService.speakPhrase(textToSpeak);
    } catch (e) {
      console.warn('Sheikh voice fallback failed:', e);
    } finally {
      this.isPlayingAudio = false;
      this.notifyListeners();
    }
  }

  private vibrate() {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate([100, 60, 120]);
      } catch {
        // ignore
      }
    }
  }

  private showNotification() {
    if (typeof window === 'undefined' || !('Notification' in window)) return;
    if (Notification.permission !== 'granted') return;

    try {
      new Notification('تطبيق نور وذكر - ذكر الله تعالى والصلاة على النبي ﷺ', {
        body: 'سُبْحَانَ اللَّهِ ، وَالْحَمْدُ لِلَّهِ ، وَلَا إِلَهَ إِلَّا اللَّهُ ، وَاللَّهُ أَكْبَرُ ، وَصَلَّى اللَّهُ عَلَى مُحَمَّدٍ',
        icon: '/icon-192.png',
        badge: '/icon.svg',
        tag: 'noor-wa-dhikr-reminder',
      });
    } catch {
      // ignore
    }
  }

  public triggerPeriodicZhikr() {
    // If quiet hours are active, do not disturb sleep!
    if (this.isInsideQuietHours()) {
      this.notifyListeners();
      return;
    }

    // If device is in call or busy, skip this tick
    if (this.isDeviceBusy()) {
      return;
    }

    this.playCombinedZhikrNow();
  }

  // Play the combined Azkar requested by the user:
  // "سبحان الله والحمد لله والله اكبر ولا إله إلا الله وصلي علي محمد يقولهم كلهم مع بعض بصوت الشيخ المشاري"
  public async playCombinedZhikrNow() {
    if (this.isPausedForAdhan || this.isPausedForIqama) return;

    this.isPlayingAudio = true;
    this.lastRecitedAt = new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
    this.notifyListeners();

    this.vibrate();

    if (this.config.allowSystemNotification) {
      this.showNotification();
    }

    // If user chose Sheikh Reader synthesis directly
    if (this.config.voiceStyle === 'sheikh_reader') {
      if (this.config.playChime) {
        await this.playChimeSound();
      }
      await this.speakPhraseFallback(COMBINED_ZHIKR_SPOKEN);
      this.isPlayingAudio = false;
      this.notifyListeners();
      return;
    }

    // Audio file based on chosen Sheikh (Abdul Basit or Mishary)
    const audioPath =
      this.config.voiceStyle === 'mishary'
        ? '/audio/azkar_combined_mishary_style.mp3'
        : '/audio/azkar_combined_abdulbasit.mp3';

    let audioPlayed = false;
    try {
      if (!this.localAudioEl) {
        this.localAudioEl = new Audio(audioPath);
      } else {
        this.localAudioEl.src = audioPath;
      }
      this.localAudioEl.volume = this.config.volume;

      await new Promise<void>((resolve, reject) => {
        if (!this.localAudioEl) return reject();

        this.localAudioEl.onended = () => {
          audioPlayed = true;
          resolve();
        };

        this.localAudioEl.onerror = () => {
          reject(new Error('Audio load error'));
        };

        this.localAudioEl.play().catch(reject);
      });
    } catch {
      audioPlayed = false;
    }

    // If audio element was blocked by browser or failed, fallback to Sheikh voice + chime
    if (!audioPlayed) {
      if (this.config.playChime) {
        await this.playChimeSound();
      }
      await this.speakPhraseFallback(COMBINED_ZHIKR_SPOKEN);
    }

    this.isPlayingAudio = false;
    this.notifyListeners();
  }
}

export const salawatAudioService = new SalawatAudioReminderService();
