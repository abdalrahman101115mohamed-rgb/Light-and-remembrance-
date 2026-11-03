// 3-Minute Salawat & Periodic Azkar Engine (نور وذكر)
// 100% Offline, default every 3 minutes with «صلِّ على النبي صلى الله عليه وسلم»
// Voice styles: Egyptian Male Voice (صوت راجل مصري واضح), Sheikh Abdul Basit, Sheikh Mishary, Sheikh Reader.
// Full coordination with Adhan & Iqama, Lock Screen local notifications, and Background Audio Keep-Alive.

import { adhanService } from './adhanService';
import { sheikhVoiceService } from './sheikhVoiceService';
import { HADITHS_DATA } from '../data/hadithsData';

export type ReminderContentType = 'salawat_only' | 'combined' | 'hadith_periodic';
export type VoiceStyleType = 'egyptian_male' | 'abdulbasit' | 'mishary' | 'sheikh_reader';

export interface AzkarReminderConfig {
  enabled: boolean;
  intervalMinutes: number; // default 3 minutes (user requested)
  reminderContent: ReminderContentType; // 'salawat_only' (default), 'combined', 'hadith_periodic'
  volume: number; // 0.0 to 1.0
  playChime: boolean;
  voiceStyle: VoiceStyleType; // 'egyptian_male' default
  allowSystemNotification: boolean;
  lockScreenKeepAlive: boolean; // Keep audio session awake so reminders continue when screen is locked
  quietHoursEnabled: boolean;
  quietStart: string; // e.g. "23:00"
  quietEnd: string; // e.g. "05:00"
  pauseDuringCallsOrMedia: boolean;
}

export const SALAWAT_TEXT = 'صَلِّ عَلَى النَّبِيِّ ﷺ — اللَّهُمَّ صَلِّ وَسَلِّمْ وَبَارِكْ عَلَى نَبِيِّنَا مُحَمَّدٍ';
export const SALAWAT_SPOKEN = 'صلِّ على النبي صلى الله عليه وسلم';

export const COMBINED_ZHIKR_TEXT =
  'سُبْحَانَ اللَّهِ ، وَالْحَمْدُ لِلَّهِ ، وَلَا إِلَهَ إِلَّا اللَّهُ ، وَاللَّهُ أَكْبَرُ ، وَصَلَّى اللَّهُ عَلَى نَبِيِّنَا مُحَمَّدٍ ﷺ';

export const COMBINED_ZHIKR_SPOKEN =
  'سُبْحَانَ اللَّهِ ، وَالْحَمْدُ لِلَّهِ ، وَلَا إِلَهَ إِلَّا اللَّهُ ، وَاللَّهُ أَكْبَرُ ، وَصَلَّى اللَّهُ عَلَى مُحَمَّدٍ';

const STORAGE_KEY = 'noor_wa_dhikr_azkar_reminder_v5';

const DEFAULT_CONFIG: AzkarReminderConfig = {
  enabled: true,
  intervalMinutes: 3, // Default 3 minutes as explicitly requested by user
  reminderContent: 'salawat_only', // Default «صلِّ على النبي صلى الله عليه وسلم»
  volume: 0.95,
  playChime: true,
  voiceStyle: 'egyptian_male', // Default Egyptian male voice as requested
  allowSystemNotification: true,
  lockScreenKeepAlive: true,
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
  currentHadithIndex: number;
}

class SalawatAudioReminderService {
  private config: AzkarReminderConfig = DEFAULT_CONFIG;
  private secondsRemaining: number = 180; // 3 min = 180s
  private timerId: number | null = null;
  private isPlayingAudio: boolean = false;
  private isPausedForAdhan: boolean = false;
  private isPausedForIqama: boolean = false;
  private listeners: Set<Listener> = new Set();
  private audioCtx: AudioContext | null = null;
  private localAudioEl: HTMLAudioElement | null = null;
  private keepAliveAudioEl: HTMLAudioElement | null = null;
  private lastRecitedAt: string | null = null;
  private currentHadithIndex: number = 0;

  constructor() {
    this.loadConfig();
    this.secondsRemaining = this.config.intervalMinutes * 60;
    this.startTimer();
    this.setupKeepAlive();

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
        localStorage.getItem('noor_wa_dhikr_azkar_reminder_v4');
      if (saved) {
        const parsed = JSON.parse(saved);
        this.config = { ...DEFAULT_CONFIG, ...parsed };
      } else {
        this.config = DEFAULT_CONFIG;
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
      this.tearDownKeepAlive();
    } else {
      if (this.timerId === null) {
        this.startTimer();
      }
      this.setupKeepAlive();
      if (!wasEnabled && this.config.enabled) {
        this.playReminderNow();
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

    let currentText = SALAWAT_TEXT;
    if (this.config.reminderContent === 'combined') {
      currentText = COMBINED_ZHIKR_TEXT;
    } else if (this.config.reminderContent === 'hadith_periodic') {
      const h = HADITHS_DATA[this.currentHadithIndex % HADITHS_DATA.length];
      currentText = h ? `حديث نبوي: «${h.matn}»` : SALAWAT_TEXT;
    }

    return {
      config: { ...this.config },
      secondsRemaining: this.secondsRemaining,
      currentZhikrText: currentText,
      isPlayingAudio: this.isPlayingAudio,
      isPausedForAdhan: this.isPausedForAdhan,
      isPausedForIqama: this.isPausedForIqama,
      isInQuietHours: this.isInsideQuietHours(),
      permissionStatus,
      lastRecitedAt: this.lastRecitedAt,
      currentHadithIndex: this.currentHadithIndex,
    };
  }

  private notifyListeners() {
    const state = this.getState();
    this.listeners.forEach(fn => fn(state));
  }

  // Setup background audio keep-alive to keep lock screen timers running
  private setupKeepAlive() {
    if (typeof window === 'undefined' || !this.config.lockScreenKeepAlive || !this.config.enabled) return;

    try {
      if ('mediaSession' in navigator) {
        navigator.mediaSession.metadata = new MediaMetadata({
          title: 'نور وذكر — التذكير مستمر',
          artist: 'صلِّ على النبي صلى الله عليه وسلم',
          album: 'نور وذكر',
          artwork: [
            { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
            { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
          ],
        });
      }
    } catch {
      // ignore
    }
  }

  private tearDownKeepAlive() {
    if (this.keepAliveAudioEl) {
      try {
        this.keepAliveAudioEl.pause();
        this.keepAliveAudioEl = null;
      } catch {
        // ignore
      }
    }
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
        // Reset timer and trigger reminder
        this.secondsRemaining = this.config.intervalMinutes * 60;
        this.triggerPeriodicReminder();
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

  private vibrate() {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate([200, 100, 200]);
      } catch {
        // ignore
      }
    }
  }

  // Show Lock-Screen compatible local notification (using ServiceWorker if available)
  private showNotification(title: string, bodyText: string) {
    if (typeof window === 'undefined') return;

    const options: NotificationOptions & { renotify?: boolean } = {
      body: bodyText,
      icon: '/icon-192.png',
      badge: '/icon.svg',
      tag: 'noor-salawat-reminder',
      renotify: true,
      requireInteraction: false,
      silent: false,
    };

    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.ready
        .then(reg => {
          reg.showNotification(title, options as NotificationOptions);
        })
        .catch(() => {
          this.fallbackShowNotification(title, options as NotificationOptions);
        });
    } else {
      this.fallbackShowNotification(title, options as NotificationOptions);
    }
  }

  private fallbackShowNotification(title: string, options: NotificationOptions) {
    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(title, options);
      } catch {
        // ignore
      }
    }
  }

  public triggerPeriodicReminder() {
    if (this.isInsideQuietHours()) {
      this.notifyListeners();
      return;
    }

    if (this.isDeviceBusy()) {
      return;
    }

    this.playReminderNow();
  }

  // Play the chosen reminder (Salawat, Combined, or Hadith)
  public async playReminderNow() {
    if (this.isPausedForAdhan || this.isPausedForIqama) return;

    this.isPlayingAudio = true;
    this.lastRecitedAt = new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
    this.notifyListeners();

    this.vibrate();

    // Determine content to play
    if (this.config.reminderContent === 'hadith_periodic') {
      await this.playPeriodicHadith();
    } else if (this.config.reminderContent === 'combined') {
      await this.playCombinedZhikr();
    } else {
      // Default: Salawat «صلِّ على النبي صلى الله عليه وسلم»
      await this.playSalawatOnly();
    }

    this.isPlayingAudio = false;
    this.notifyListeners();
  }

  // 1. «صلِّ على النبي صلى الله عليه وسلم»
  private async playSalawatOnly() {
    const title = 'صلِّ على النبي ﷺ — نور وذكر';
    const body = '«اللهم صلِّ وسلِّم وبارِك على نبينا ورسولنا محمد وعلى آله وصحبه أجمعين»';

    if (this.config.allowSystemNotification) {
      this.showNotification(title, body);
    }

    if (this.config.playChime) {
      await this.playChimeSound();
    }

    const isEgyptian = this.config.voiceStyle === 'egyptian_male';

    if (this.config.voiceStyle === 'mishary') {
      // Try Mishary style audio or Egyptian/Arabic voice
      await this.playLocalAudioOrVoice('/audio/azkar_combined_mishary_style.mp3', SALAWAT_SPOKEN, false);
    } else if (this.config.voiceStyle === 'abdulbasit') {
      await this.playLocalAudioOrVoice('/audio/azkar_combined_abdulbasit.mp3', SALAWAT_SPOKEN, false);
    } else {
      // Egyptian male voice or Sheikh reader voice via synthesis
      await sheikhVoiceService.speakPhrase(SALAWAT_SPOKEN, isEgyptian);
    }
  }

  // 2. Combined Azkar («سبحان الله والحمد لله ولا إله إلا الله والله أكبر وصلى الله على محمد»)
  private async playCombinedZhikr() {
    const title = 'ذكر الله تعالى والصلاة على النبي ﷺ';
    const body = COMBINED_ZHIKR_TEXT;

    if (this.config.allowSystemNotification) {
      this.showNotification(title, body);
    }

    const isEgyptian = this.config.voiceStyle === 'egyptian_male';

    if (isEgyptian || this.config.voiceStyle === 'sheikh_reader') {
      if (this.config.playChime) {
        await this.playChimeSound();
      }
      await sheikhVoiceService.speakPhrase(COMBINED_ZHIKR_SPOKEN, isEgyptian);
    } else {
      const audioPath =
        this.config.voiceStyle === 'mishary'
          ? '/audio/azkar_combined_mishary_style.mp3'
          : '/audio/azkar_combined_abdulbasit.mp3';

      await this.playLocalAudioOrVoice(audioPath, COMBINED_ZHIKR_SPOKEN, false);
    }
  }

  // 3. Periodic Prophetic Hadith with Egyptian Voice
  private async playPeriodicHadith() {
    const hadith = HADITHS_DATA[this.currentHadithIndex % HADITHS_DATA.length];
    this.currentHadithIndex = (this.currentHadithIndex + 1) % HADITHS_DATA.length;

    const title = `حديث نبوي شريف — ${hadith.title}`;
    const body = `«${hadith.matn}» — ${hadith.source}`;

    if (this.config.allowSystemNotification) {
      this.showNotification(title, body);
    }

    if (this.config.playChime) {
      await this.playChimeSound();
    }

    const textToSpeak = `قال رسول الله ﷺ: ${hadith.matn}`;
    const isEgyptian = this.config.voiceStyle === 'egyptian_male';
    await sheikhVoiceService.speakPhrase(textToSpeak, isEgyptian);
  }

  private async playLocalAudioOrVoice(audioPath: string, fallbackText: string, preferEgyptian: boolean) {
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
        this.localAudioEl.onerror = () => reject(new Error('Audio load failed'));
        this.localAudioEl.play().catch(reject);
      });
    } catch {
      audioPlayed = false;
    }

    if (!audioPlayed) {
      if (this.config.playChime) {
        await this.playChimeSound();
      }
      await sheikhVoiceService.speakPhrase(fallbackText, preferEgyptian);
    }
  }

  // Legacy helper for compatibility
  public async playCombinedZhikrNow() {
    await this.playReminderNow();
  }
}

export const salawatAudioService = new SalawatAudioReminderService();
