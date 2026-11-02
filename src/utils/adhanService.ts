// Adhan & Iqama Service: Automated Adhan at prayer times, Muezzin selection (Mishary Alafasy default),
// Automatic Iqama calling, Volume control, 100% Offline Audio, and Speech/Tone Fallback
import { CalculationMethodKey, JuristicMethodKey, calculatePrayerTimes, PrayerTimesResult } from './prayerTimes';
import { POPULAR_CITIES, City } from '../data/cities';

export interface Muezzin {
  id: string;
  name: string;
  place: string;
  audioUrl: string;
  fajrUrl?: string;
  description: string;
}

export const MUEZZINS: Muezzin[] = [
  {
    id: 'mishary',
    name: 'أذان الشيخ مشاري راشد العفاسي',
    place: 'الكويت - أداء شجي خاشع ومؤثر',
    audioUrl: '/audio/adhan_mishary.mp3',
    fajrUrl: '/audio/adhan_fajr.mp3',
    description: 'أذان الشيخ مشاري العفاسي المعروف بنبرته العذبة الخاشعة التي تمس القلوب',
  },
  {
    id: 'makkah',
    name: 'أذان الحرم المكي الشريف',
    place: 'مكة المكرمة - الشيخ علي أحمد ملا',
    audioUrl: '/audio/adhan_makkah.mp3',
    fajrUrl: '/audio/adhan_fajr.mp3',
    description: 'الأذان المكي الشهير بنبرته الندية الخاشعة من بيت الله الحرام',
  },
  {
    id: 'fajr_special',
    name: 'أذان الفجر الشريف (الصلاة خير من النوم)',
    place: 'نداء الفجر العذب',
    audioUrl: '/audio/adhan_fajr.mp3',
    fajrUrl: '/audio/adhan_fajr.mp3',
    description: 'أذان خاشع يتضمن عبارة «الصلاة خير من النوم» بصوت ندي مؤثر',
  },
  {
    id: 'takbeerat',
    name: 'تكبيرات الأذان والتنبيه الوقور',
    place: 'تنبيه هادئ ومختصر',
    audioUrl: '/audio/iqamah.mp3',
    description: 'تكبيرات روحانية لطيفة مناسبة لأماكن العمل والتنبيه الخفيف',
  },
];

export interface AdhanConfig {
  enabled: boolean;
  selectedMuezzinId: string;
  volume: number; // 0 to 1
  prayers: {
    fajr: boolean;
    dhuhr: boolean;
    asr: boolean;
    maghrib: boolean;
    isha: boolean;
  };
  playDuaAfterAdhan: boolean;
  vibrate: boolean;
  // Iqama Settings (إقامة الصلاة)
  iqamaEnabled: boolean;
  iqamaDelayMinutes: number; // e.g. 15 minutes after adhan
}

const STORAGE_KEY = 'noor_wa_dhikr_adhan_settings_v3';

const DEFAULT_CONFIG: AdhanConfig = {
  enabled: true,
  selectedMuezzinId: 'mishary',
  volume: 0.95,
  prayers: {
    fajr: true,
    dhuhr: true,
    asr: true,
    maghrib: true,
    isha: true,
  },
  playDuaAfterAdhan: true,
  vibrate: true,
  iqamaEnabled: true,
  iqamaDelayMinutes: 15,
};

type AdhanListener = (state: AdhanState) => void;

export interface AdhanState {
  config: AdhanConfig;
  isPlaying: boolean;
  isIqamaPlaying: boolean;
  currentPrayer: string | null;
  lastPlayedPrayer: string | null;
  lastPlayedDate: string | null;
  nextIqamaTime: string | null; // ISO string or null
  nextIqamaPrayer: string | null;
}

class AdhanService {
  private config: AdhanConfig = DEFAULT_CONFIG;
  private isPlaying: boolean = false;
  private isIqamaPlaying: boolean = false;
  private currentPrayer: string | null = null;
  private lastPlayedPrayer: string | null = null;
  private lastPlayedDate: string | null = null;
  private nextIqamaDate: Date | null = null;
  private nextIqamaPrayer: string | null = null;
  private audioEl: HTMLAudioElement | null = null;
  private iqamaAudioEl: HTMLAudioElement | null = null;
  private audioCtx: AudioContext | null = null;
  private listeners: Set<AdhanListener> = new Set();
  private checkIntervalId: number | null = null;
  private onAdhanStartCallbacks: Set<() => void> = new Set();
  private onAdhanEndCallbacks: Set<() => void> = new Set();
  private onIqamaStartCallbacks: Set<() => void> = new Set();
  private onIqamaEndCallbacks: Set<() => void> = new Set();

  constructor() {
    this.loadConfig();
    this.startPrayerWatcher();
  }

  private loadConfig() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        this.config = { ...DEFAULT_CONFIG, ...JSON.parse(saved) };
      }
    } catch {
      this.config = DEFAULT_CONFIG;
    }
  }

  public saveConfig() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.config));
    } catch (e) {
      console.warn('Adhan save config failed:', e);
    }
  }

  public getConfig(): AdhanConfig {
    return { ...this.config };
  }

  public updateConfig(newConfig: Partial<AdhanConfig>) {
    this.config = { ...this.config, ...newConfig };
    this.saveConfig();
    if (this.audioEl) {
      this.audioEl.volume = this.config.volume;
    }
    if (this.iqamaAudioEl) {
      this.iqamaAudioEl.volume = this.config.volume;
    }
    this.notify();
  }

  public subscribe(listener: AdhanListener): () => void {
    this.listeners.add(listener);
    listener(this.getState());
    return () => {
      this.listeners.delete(listener);
    };
  }

  public onAdhanStart(cb: () => void): () => void {
    this.onAdhanStartCallbacks.add(cb);
    return () => this.onAdhanStartCallbacks.delete(cb);
  }

  public onAdhanEnd(cb: () => void): () => void {
    this.onAdhanEndCallbacks.add(cb);
    return () => this.onAdhanEndCallbacks.delete(cb);
  }

  public onIqamaStart(cb: () => void): () => void {
    this.onIqamaStartCallbacks.add(cb);
    return () => this.onIqamaStartCallbacks.delete(cb);
  }

  public onIqamaEnd(cb: () => void): () => void {
    this.onIqamaEndCallbacks.add(cb);
    return () => this.onIqamaEndCallbacks.delete(cb);
  }

  public getState(): AdhanState {
    return {
      config: { ...this.config },
      isPlaying: this.isPlaying,
      isIqamaPlaying: this.isIqamaPlaying,
      currentPrayer: this.currentPrayer,
      lastPlayedPrayer: this.lastPlayedPrayer,
      lastPlayedDate: this.lastPlayedDate,
      nextIqamaTime: this.nextIqamaDate ? this.nextIqamaDate.toISOString() : null,
      nextIqamaPrayer: this.nextIqamaPrayer,
    };
  }

  private notify() {
    const s = this.getState();
    this.listeners.forEach(fn => fn(s));
  }

  // Monitor prayer times and scheduled Iqama continuously every 4 seconds
  private startPrayerWatcher() {
    if (this.checkIntervalId !== null) clearInterval(this.checkIntervalId);

    this.checkIntervalId = window.setInterval(() => {
      this.checkCurrentTimeAgainstPrayers();
      this.checkCurrentTimeAgainstIqama();
    }, 4000);
  }

  // Check if now matches any prayer time
  private checkCurrentTimeAgainstPrayers() {
    if (!this.config.enabled || this.isPlaying || this.isIqamaPlaying) return;

    try {
      const appSettingsStr = localStorage.getItem('ramadan_app_settings');
      let city: City = POPULAR_CITIES[0];
      let calcMethod: CalculationMethodKey = 'Makkah';
      let juristic: JuristicMethodKey = 'Standard';

      if (appSettingsStr) {
        const parsed = JSON.parse(appSettingsStr);
        if (parsed.selectedCity) city = parsed.selectedCity;
        if (parsed.calculationMethod) calcMethod = parsed.calculationMethod;
        if (parsed.juristicMethod) juristic = parsed.juristicMethod;
      }

      const now = new Date();
      const prayerTimes: PrayerTimesResult = calculatePrayerTimes(
        now,
        city.latitude,
        city.longitude,
        calcMethod,
        juristic
      );

      const prayersList: Array<{ key: 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha'; name: string; time: Date }> = [
        { key: 'fajr', name: 'الفجر', time: prayerTimes.fajr },
        { key: 'dhuhr', name: 'الظهر', time: prayerTimes.dhuhr },
        { key: 'asr', name: 'العصر', time: prayerTimes.asr },
        { key: 'maghrib', name: 'المغرب', time: prayerTimes.maghrib },
        { key: 'isha', name: 'العشاء', time: prayerTimes.isha },
      ];

      const todayStr = now.toDateString();

      for (const p of prayersList) {
        if (!this.config.prayers[p.key]) continue;

        // Check if now is within 1 minute of prayer start time (0 to 60 seconds after)
        const diffSeconds = (now.getTime() - p.time.getTime()) / 1000;
        if (diffSeconds >= 0 && diffSeconds < 60) {
          const recordKey = `${todayStr}_${p.key}`;
          if (this.lastPlayedDate === recordKey) {
            continue;
          }

          // Trigger Adhan!
          this.lastPlayedDate = recordKey;
          this.playAdhan(p.name, p.key);

          // Schedule Iqama if enabled
          if (this.config.iqamaEnabled) {
            const delayMs = this.config.iqamaDelayMinutes * 60 * 1000;
            this.nextIqamaDate = new Date(now.getTime() + delayMs);
            this.nextIqamaPrayer = p.name;
            this.notify();
          }
          break;
        }
      }
    } catch (e) {
      console.warn('Prayer watcher error:', e);
    }
  }

  // Check if scheduled Iqama has arrived
  private checkCurrentTimeAgainstIqama() {
    if (!this.config.iqamaEnabled || !this.nextIqamaDate || this.isPlaying || this.isIqamaPlaying) return;

    const now = new Date();
    const diffSeconds = (now.getTime() - this.nextIqamaDate.getTime()) / 1000;

    if (diffSeconds >= 0 && diffSeconds < 90) {
      const prayerName = this.nextIqamaPrayer || 'الصلاة';
      this.nextIqamaDate = null;
      this.nextIqamaPrayer = null;
      this.playIqama(prayerName);
    }
  }

  // Synthesized authentic Adhan melody using Web Audio API (Offline Fallback)
  private playSynthesizedAdhanOffline(): Promise<void> {
    return new Promise(resolve => {
      try {
        const AudioContextClass =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (!AudioContextClass) return resolve();

        this.audioCtx = new AudioContextClass();
        const ctx = this.audioCtx;
        if (ctx.state === 'suspended') ctx.resume();

        // Authentic Maqam Bayati melody
        const adhanMelody = [
          { f: 293.66, d: 0.8 },
          { f: 349.23, d: 0.7 },
          { f: 392.00, d: 1.2 },
          { f: 349.23, d: 0.5 },
          { f: 293.66, d: 1.5 },
          { f: 293.66, d: 0.8 },
          { f: 349.23, d: 0.7 },
          { f: 392.00, d: 1.4 },
          { f: 440.00, d: 0.9 },
          { f: 392.00, d: 1.8 },
        ];

        let currTime = ctx.currentTime + 0.1;
        const mainGain = ctx.createGain();
        mainGain.gain.setValueAtTime(this.config.volume * 0.4, ctx.currentTime);
        mainGain.connect(ctx.destination);

        adhanMelody.forEach(note => {
          const osc = ctx.createOscillator();
          const noteGain = ctx.createGain();

          osc.type = 'triangle';
          osc.frequency.setValueAtTime(note.f, currTime);

          noteGain.gain.setValueAtTime(0, currTime);
          noteGain.gain.linearRampToValueAtTime(0.35, currTime + 0.08);
          noteGain.gain.exponentialRampToValueAtTime(0.001, currTime + note.d);

          osc.connect(noteGain);
          noteGain.connect(mainGain);

          osc.start(currTime);
          osc.stop(currTime + note.d + 0.1);

          currTime += note.d + 0.15;
        });

        setTimeout(() => {
          resolve();
        }, (currTime - ctx.currentTime) * 1000);
      } catch {
        resolve();
      }
    });
  }

  // Play Adhan
  public async playAdhan(prayerName: string = 'الظهر', prayerKey: string = 'dhuhr') {
    this.isPlaying = true;
    this.currentPrayer = prayerName;
    this.lastPlayedPrayer = prayerName;
    this.notify();

    // 1. Notify that Adhan has started (pauses Azkar)
    this.onAdhanStartCallbacks.forEach(cb => cb());

    // 2. Mobile vibration
    if (this.config.vibrate && typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate([400, 150, 400, 150, 600]);
      } catch {
        // ignore
      }
    }

    // 3. System Notification
    this.showAdhanNotification(prayerName);

    // 4. Find Muezzin (Mishary Alafasy as default)
    const muezzin = MUEZZINS.find(m => m.id === this.config.selectedMuezzinId) || MUEZZINS[0];
    const url = prayerKey === 'fajr' && muezzin.fajrUrl ? muezzin.fajrUrl : muezzin.audioUrl;

    try {
      if (!this.audioEl) {
        this.audioEl = new Audio();
      }

      this.audioEl.src = url;
      this.audioEl.volume = this.config.volume;

      const onComplete = () => {
        this.stopAdhan();
      };

      this.audioEl.onended = onComplete;
      this.audioEl.onerror = async () => {
        console.warn('Local/remote audio playback error, falling back to synthesized Adhan...');
        await this.playSynthesizedAdhanOffline();
        this.stopAdhan();
      };

      await this.audioEl.play();
    } catch {
      await this.playSynthesizedAdhanOffline();
      this.stopAdhan();
    }
  }

  // Play Iqama (إقامة الصلاة - قد قامت الصلاة)
  public async playIqama(prayerName: string = 'الظهر') {
    if (this.isPlaying) {
      this.stopAdhan();
    }

    this.isIqamaPlaying = true;
    this.notify();

    // Pause Azkar during Iqama
    this.onIqamaStartCallbacks.forEach(cb => cb());

    // Vibration
    if (this.config.vibrate && typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate([200, 100, 200, 100, 200]);
      } catch {
        // ignore
      }
    }

    // Notification
    this.showIqamaNotification(prayerName);

    try {
      if (!this.iqamaAudioEl) {
        this.iqamaAudioEl = new Audio();
      }

      this.iqamaAudioEl.src = '/audio/iqamah.mp3';
      this.iqamaAudioEl.volume = this.config.volume;

      const onComplete = () => {
        this.stopIqama();
      };

      this.iqamaAudioEl.onended = onComplete;
      this.iqamaAudioEl.onerror = () => {
        this.stopIqama();
      };

      await this.iqamaAudioEl.play();
    } catch {
      this.stopIqama();
    }
  }

  // Stop currently playing Adhan
  public stopAdhan() {
    if (this.audioEl) {
      try {
        this.audioEl.pause();
        this.audioEl.currentTime = 0;
      } catch {
        // ignore
      }
    }

    if (this.audioCtx && this.audioCtx.state !== 'closed') {
      try {
        this.audioCtx.close();
      } catch {
        // ignore
      }
      this.audioCtx = null;
    }

    this.isPlaying = false;
    this.currentPrayer = null;
    this.notify();

    // Notify listeners that Adhan has ended
    this.onAdhanEndCallbacks.forEach(cb => cb());
  }

  // Stop currently playing Iqama
  public stopIqama() {
    if (this.iqamaAudioEl) {
      try {
        this.iqamaAudioEl.pause();
        this.iqamaAudioEl.currentTime = 0;
      } catch {
        // ignore
      }
    }

    this.isIqamaPlaying = false;
    this.notify();

    // Notify listeners that Iqama has ended
    this.onIqamaEndCallbacks.forEach(cb => cb());
  }

  // Show Adhan notification
  private showAdhanNotification(prayerName: string) {
    if (typeof window === 'undefined' || !('Notification' in window)) return;
    if (Notification.permission !== 'granted') return;

    try {
      new Notification(`حان الآن موعد أذان صلاة ${prayerName}`, {
        body: `«حي على الصلاة ، حي على الفلاح» — تطبيق نور وذكر`,
        icon: '/icon-192.png',
        badge: '/icon.svg',
        tag: 'adhan-alert',
      });
    } catch {
      // ignore
    }
  }

  // Show Iqama notification
  private showIqamaNotification(prayerName: string) {
    if (typeof window === 'undefined' || !('Notification' in window)) return;
    if (Notification.permission !== 'granted') return;

    try {
      new Notification(`قد قامت صلاة ${prayerName}`, {
        body: `«قد قامت الصلاة قد قامت الصلاة، الله أكبر الله أكبر لا إله إلا الله»`,
        icon: '/icon-192.png',
        badge: '/icon.svg',
        tag: 'iqama-alert',
      });
    } catch {
      // ignore
    }
  }

  public testAdhanNow(muezzinId?: string) {
    if (muezzinId) {
      this.updateConfig({ selectedMuezzinId: muezzinId });
    }
    this.playAdhan('الظهر (تجربة الأذان)', 'dhuhr');
  }

  public testIqamaNow(prayerName: string = 'الظهر (تجربة الإقامة)') {
    this.playIqama(prayerName);
  }

  public scheduleManualIqama(prayerName: string, minutesFromNow: number = 15) {
    this.nextIqamaDate = new Date(Date.now() + minutesFromNow * 60 * 1000);
    this.nextIqamaPrayer = prayerName;
    this.notify();
  }

  public cancelScheduledIqama() {
    this.nextIqamaDate = null;
    this.nextIqamaPrayer = null;
    this.notify();
  }
}

export const adhanService = new AdhanService();
