// Quran Offline Audio Download & Playback Manager (تنزيل القرآن الكريم كاملاً بصوت الشيخ مشاري العفاسي)
// Uses CacheStorage API ('noor-quran-audio-v2') to save full surahs for 100% offline playback.
import { SURAHS_LIST, SurahMeta } from '../data/quranData';

export const CACHE_NAME = 'noor-quran-audio-v2';

// Primary & Fallback high-speed Islamic CDNs for Sheikh Mishary Rashid Alafasy full surahs (128kbps)
export function getMisharySurahAudioUrl(surahNumber: number): string {
  const pad = surahNumber.toString().padStart(3, '0');
  // High availability CDN 1
  return `https://server8.mp3quran.net/afs/${pad}.mp3`;
}

export function getMisharyFallbackUrl(surahNumber: number): string {
  const pad = surahNumber.toString().padStart(3, '0');
  // High availability CDN 2
  return `https://download.quranicaudio.com/quran/mishaari_raashid_al_3afaasee/${pad}.mp3`;
}

export interface QuranDownloadProgress {
  isDownloading: boolean;
  totalSurahs: number;
  downloadedCount: number;
  currentSurahNumber: number | null;
  currentSurahName: string | null;
  percent: number;
  error: string | null;
}

type DownloadListener = (progress: QuranDownloadProgress) => void;

class QuranDownloadManager {
  private listeners: Set<DownloadListener> = new Set();
  private abortController: AbortController | null = null;
  private isDownloading: boolean = false;
  private downloadedSet: Set<number> = new Set();
  private isInitialized: boolean = false;

  constructor() {
    this.refreshDownloadedList();
  }

  public subscribe(listener: DownloadListener): () => void {
    this.listeners.add(listener);
    listener(this.getProgress());
    return () => {
      this.listeners.delete(listener);
    };
  }

  public getProgress(): QuranDownloadProgress {
    const downloadedCount = this.downloadedSet.size;
    const total = 114;
    const percent = Math.round((downloadedCount / total) * 100);

    return {
      isDownloading: this.isDownloading,
      totalSurahs: total,
      downloadedCount,
      currentSurahNumber: null,
      currentSurahName: null,
      percent,
      error: null,
    };
  }

  private notify(override?: Partial<QuranDownloadProgress>) {
    const p = { ...this.getProgress(), ...override };
    this.listeners.forEach(fn => fn(p));
  }

  // Refresh list of surahs already cached offline
  public async refreshDownloadedList(): Promise<Set<number>> {
    if (typeof window === 'undefined' || !('caches' in window)) {
      return this.downloadedSet;
    }

    try {
      const cache = await caches.open(CACHE_NAME);
      const requests = await cache.keys();
      const set = new Set<number>();

      requests.forEach(req => {
        const url = req.url;
        const match = url.match(/\/(\d{3})\.mp3/);
        if (match && match[1]) {
          const num = parseInt(match[1], 10);
          if (num >= 1 && num <= 114) {
            set.add(num);
          }
        }
      });

      this.downloadedSet = set;
      this.isInitialized = true;
      this.notify();
      return set;
    } catch (e) {
      console.warn('Failed to inspect audio cache:', e);
      return this.downloadedSet;
    }
  }

  public isSurahDownloaded(surahNumber: number): boolean {
    return this.downloadedSet.has(surahNumber);
  }

  public getDownloadedCount(): number {
    return this.downloadedSet.size;
  }

  // Download a single Surah and cache permanently in browser
  public async downloadSurah(surahNumber: number): Promise<boolean> {
    if (typeof window === 'undefined' || !('caches' in window)) return false;

    const surahMeta = SURAHS_LIST.find(s => s.number === surahNumber);
    const surahName = surahMeta ? surahMeta.name : `${surahNumber}`;

    this.notify({
      isDownloading: true,
      currentSurahNumber: surahNumber,
      currentSurahName: surahName,
    });

    try {
      const cache = await caches.open(CACHE_NAME);
      const url = getMisharySurahAudioUrl(surahNumber);

      let res: Response | null = null;
      try {
        res = await fetch(url, { mode: 'cors' });
      } catch {
        // Try fallback CDN
        const fallbackUrl = getMisharyFallbackUrl(surahNumber);
        res = await fetch(fallbackUrl, { mode: 'cors' });
      }

      if (res && (res.ok || res.type === 'opaque')) {
        await cache.put(url, res);
        this.downloadedSet.add(surahNumber);
        this.notify({ isDownloading: false });
        return true;
      }
      throw new Error('فشل تنزيل ملف السورة');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'خطأ في التنزيل';
      this.notify({ isDownloading: false, error: msg });
      return false;
    }
  }

  // Download entire Holy Quran (All 114 Surahs by Sheikh Mishary Alafasy) in background
  public async downloadFullQuran(): Promise<void> {
    if (this.isDownloading) return;
    if (typeof window === 'undefined' || !('caches' in window)) {
      alert('ميزة التنزيل الأوفلاين غير مدعومة في متصفحك الحالي.');
      return;
    }

    this.isDownloading = true;
    this.abortController = new AbortController();

    const cache = await caches.open(CACHE_NAME);
    const total = 114;

    for (let i = 1; i <= total; i++) {
      if (this.abortController?.signal.aborted) {
        break;
      }

      if (this.downloadedSet.has(i)) {
        continue;
      }

      const surahMeta = SURAHS_LIST.find(s => s.number === i);
      const surahName = surahMeta ? surahMeta.name : `${i}`;

      this.notify({
        isDownloading: true,
        currentSurahNumber: i,
        currentSurahName: surahName,
        downloadedCount: this.downloadedSet.size,
        percent: Math.round((this.downloadedSet.size / total) * 100),
      });

      try {
        const url = getMisharySurahAudioUrl(i);
        let res: Response | null = null;

        try {
          res = await fetch(url, { signal: this.abortController.signal, mode: 'cors' });
        } catch {
          const fallbackUrl = getMisharyFallbackUrl(i);
          res = await fetch(fallbackUrl, { signal: this.abortController.signal, mode: 'cors' });
        }

        if (res && (res.ok || res.type === 'opaque')) {
          await cache.put(url, res);
          this.downloadedSet.add(i);
        }
      } catch (err: unknown) {
        if (this.abortController?.signal.aborted) {
          break;
        }
        console.warn(`Error downloading surah ${i}:`, err);
      }
    }

    this.isDownloading = false;
    this.abortController = null;
    this.notify({ isDownloading: false });
  }

  public cancelDownload() {
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }
    this.isDownloading = false;
    this.notify({ isDownloading: false });
  }

  // Delete a downloaded surah from cache
  public async deleteSurahDownload(surahNumber: number): Promise<boolean> {
    if (typeof window === 'undefined' || !('caches' in window)) return false;

    try {
      const cache = await caches.open(CACHE_NAME);
      const url = getMisharySurahAudioUrl(surahNumber);
      await cache.delete(url);
      this.downloadedSet.delete(surahNumber);
      this.notify();
      return true;
    } catch {
      return false;
    }
  }

  // Clear all cached Quran audio
  public async clearAllDownloads(): Promise<boolean> {
    if (typeof window === 'undefined' || !('caches' in window)) return false;

    try {
      await caches.delete(CACHE_NAME);
      this.downloadedSet.clear();
      this.notify();
      return true;
    } catch {
      return false;
    }
  }

  // Get playable URL for a surah (either blob URL from cache, or direct URL)
  public async getPlayableAudioUrl(surahNumber: number): Promise<string> {
    const targetUrl = getMisharySurahAudioUrl(surahNumber);

    if (typeof window !== 'undefined' && 'caches' in window) {
      try {
        const cache = await caches.open(CACHE_NAME);
        const match = await cache.match(targetUrl);
        if (match) {
          const blob = await match.blob();
          return URL.createObjectURL(blob);
        }
      } catch (e) {
        console.warn('Cache match failed:', e);
      }
    }

    return targetUrl;
  }
}

export const quranDownloadManager = new QuranDownloadManager();
