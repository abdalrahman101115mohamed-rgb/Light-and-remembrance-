import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  BookOpen,
  Bookmark,
  BookmarkCheck,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  Type,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ArrowRight,
  Headphones,
  CheckCircle2,
  Download,
  Check,
  Trash2,
  Gauge,
  Radio,
  Layers
} from 'lucide-react';
import {
  SURAHS_LIST,
  JUZ_LIST,
  RECITERS,
  SurahMeta,
  Ayah,
  Reciter,
  getSurahAyahs,
  getAyahAudioUrl
} from '../data/quranData';
import { quranDownloadManager, QuranDownloadProgress } from '../utils/quranDownloadManager';

export const QuranView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'surahs' | 'juz' | 'bookmarks' | 'downloads'>('surahs');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSurah, setSelectedSurah] = useState<SurahMeta | null>(null);
  const [ayahs, setAyahs] = useState<Ayah[]>([]);
  const [loadingAyahs, setLoadingAyahs] = useState(false);
  const [fontSize, setFontSize] = useState<number>(24);

  // Audio recitation states (Ayah by Ayah)
  const [selectedReciter, setSelectedReciter] = useState<Reciter>(RECITERS[0]); // Mishary Alafasy
  const [playingAyahNumber, setPlayingAyahNumber] = useState<number | null>(null);
  const [isAyahPlaying, setIsAyahPlaying] = useState<boolean>(false);
  const ayahAudioRef = useRef<HTMLAudioElement | null>(null);

  // Full Surah Audio Player (Sheikh Mishary Rashid Alafasy)
  const [isFullSurahPlaying, setIsFullSurahPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [currentSurahTime, setCurrentSurahTime] = useState<number>(0);
  const [surahDuration, setSurahDuration] = useState<number>(0);
  const fullSurahAudioRef = useRef<HTMLAudioElement | null>(null);

  // Download manager state
  const [downloadProgress, setDownloadProgress] = useState<QuranDownloadProgress>(quranDownloadManager.getProgress());
  const [downloadedSet, setDownloadedSet] = useState<Set<number>>(new Set());

  // Bookmarks state: { surahNumber, surahName, ayahNumber, text, timestamp }
  interface BookmarkItem {
    surahNumber: number;
    surahName: string;
    ayahNumber: number;
    text: string;
    timestamp: number;
  }
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [lastRead, setLastRead] = useState<{ surahNumber: number; surahName: string; ayahNumber: number } | null>(null);

  // Load bookmarks & downloads
  useEffect(() => {
    try {
      const savedBm = localStorage.getItem('quran_bookmarks');
      if (savedBm) setBookmarks(JSON.parse(savedBm));

      const savedLast = localStorage.getItem('quran_last_read');
      if (savedLast) setLastRead(JSON.parse(savedLast));

      const savedFont = localStorage.getItem('quran_font_size');
      if (savedFont) setFontSize(Number(savedFont));
    } catch (e) {
      console.warn('Storage read error:', e);
    }

    const unsubDownload = quranDownloadManager.subscribe(p => {
      setDownloadProgress(p);
    });

    quranDownloadManager.refreshDownloadedList().then(set => {
      setDownloadedSet(new Set(set));
    });

    return () => {
      unsubDownload();
      if (fullSurahAudioRef.current) {
        fullSurahAudioRef.current.pause();
      }
      if (ayahAudioRef.current) {
        ayahAudioRef.current.pause();
      }
    };
  }, []);

  // Update downloaded set whenever progress updates
  useEffect(() => {
    quranDownloadManager.refreshDownloadedList().then(set => {
      setDownloadedSet(new Set(set));
    });
  }, [downloadProgress.downloadedCount]);

  // When a surah is selected, load its ayahs
  const openSurah = async (surah: SurahMeta, targetAyah?: number) => {
    setSelectedSurah(surah);
    setLoadingAyahs(true);
    setPlayingAyahNumber(null);
    setIsAyahPlaying(false);
    setIsFullSurahPlaying(false);

    if (ayahAudioRef.current) ayahAudioRef.current.pause();
    if (fullSurahAudioRef.current) fullSurahAudioRef.current.pause();

    try {
      const data = await getSurahAyahs(surah.number);
      setAyahs(data);

      const lastObj = {
        surahNumber: surah.number,
        surahName: surah.name,
        ayahNumber: targetAyah || 1,
      };
      setLastRead(lastObj);
      localStorage.setItem('quran_last_read', JSON.stringify(lastObj));

      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Error loading surah:', err);
    } finally {
      setLoadingAyahs(false);
    }
  };

  const handleBookmarkToggle = (ayah: Ayah) => {
    if (!selectedSurah) return;
    const exists = bookmarks.find(b => b.surahNumber === selectedSurah.number && b.ayahNumber === ayah.numberInSurah);

    let updated: BookmarkItem[];
    if (exists) {
      updated = bookmarks.filter(b => !(b.surahNumber === selectedSurah.number && b.ayahNumber === ayah.numberInSurah));
    } else {
      updated = [
        {
          surahNumber: selectedSurah.number,
          surahName: selectedSurah.name,
          ayahNumber: ayah.numberInSurah,
          text: ayah.text.substring(0, 70) + '...',
          timestamp: Date.now(),
        },
        ...bookmarks,
      ];
    }
    setBookmarks(updated);
    try {
      localStorage.setItem('quran_bookmarks', JSON.stringify(updated));
    } catch (e) {
      console.warn(e);
    }
  };

  const isAyahBookmarked = (ayahNumberInSurah: number) => {
    if (!selectedSurah) return false;
    return bookmarks.some(b => b.surahNumber === selectedSurah.number && b.ayahNumber === ayahNumberInSurah);
  };

  // Full Surah Audio Player for Sheikh Mishary Alafasy
  const togglePlayFullSurah = async () => {
    if (!selectedSurah) return;

    if (isFullSurahPlaying) {
      fullSurahAudioRef.current?.pause();
      setIsFullSurahPlaying(false);
      return;
    }

    // Stop ayah player if active
    if (isAyahPlaying) {
      ayahAudioRef.current?.pause();
      setIsAyahPlaying(false);
      setPlayingAyahNumber(null);
    }

    try {
      const url = await quranDownloadManager.getPlayableAudioUrl(selectedSurah.number);

      if (!fullSurahAudioRef.current) {
        fullSurahAudioRef.current = new Audio();
      }

      const audio = fullSurahAudioRef.current;
      audio.src = url;
      audio.playbackRate = playbackSpeed;

      audio.ontimeupdate = () => {
        setCurrentSurahTime(audio.currentTime);
        setSurahDuration(audio.duration || 0);
      };

      audio.onended = () => {
        setIsFullSurahPlaying(false);
        // Autoplay next surah if available
        if (selectedSurah.number < 114) {
          const nextMeta = SURAHS_LIST.find(s => s.number === selectedSurah.number + 1);
          if (nextMeta) {
            openSurah(nextMeta).then(() => {
              togglePlayFullSurah();
            });
          }
        }
      };

      await audio.play();
      setIsFullSurahPlaying(true);
    } catch (e) {
      console.warn('Playback error:', e);
      setIsFullSurahPlaying(false);
    }
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    if (fullSurahAudioRef.current) {
      fullSurahAudioRef.current.playbackRate = speed;
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (fullSurahAudioRef.current) {
      fullSurahAudioRef.current.currentTime = val;
      setCurrentSurahTime(val);
    }
  };

  const formatSeconds = (sec: number) => {
    if (!sec || isNaN(sec)) return '00:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Individual Ayah Audio Playback
  const playAyahAudio = (ayahNumberInSurah: number) => {
    if (!selectedSurah) return;

    if (isFullSurahPlaying) {
      fullSurahAudioRef.current?.pause();
      setIsFullSurahPlaying(false);
    }

    if (playingAyahNumber === ayahNumberInSurah && isAyahPlaying) {
      ayahAudioRef.current?.pause();
      setIsAyahPlaying(false);
      return;
    }

    const audioUrl = getAyahAudioUrl(selectedReciter, selectedSurah.number, ayahNumberInSurah);

    if (!ayahAudioRef.current) {
      ayahAudioRef.current = new Audio();
    }

    ayahAudioRef.current.src = audioUrl;
    ayahAudioRef.current.play().then(() => {
      setPlayingAyahNumber(ayahNumberInSurah);
      setIsAyahPlaying(true);
    }).catch(err => {
      console.warn('Ayah playback error:', err);
      setIsAyahPlaying(false);
    });

    ayahAudioRef.current.onended = () => {
      if (selectedSurah && ayahNumberInSurah < selectedSurah.numberOfAyahs) {
        playAyahAudio(ayahNumberInSurah + 1);
      } else {
        setIsAyahPlaying(false);
        setPlayingAyahNumber(null);
      }
    };
  };

  const handleDownloadSingleSurah = async (surahNum: number) => {
    await quranDownloadManager.downloadSurah(surahNum);
    const set = await quranDownloadManager.refreshDownloadedList();
    setDownloadedSet(new Set(set));
  };

  // Filter surahs
  const filteredSurahs = SURAHS_LIST.filter(s =>
    s.name.includes(searchQuery.trim()) ||
    s.englishName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.number.toString() === searchQuery.trim()
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 space-y-6">
      {/* If reading a Surah */}
      {selectedSurah ? (
        <div className="space-y-6">
          {/* Top Reading Navigation Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-emerald-900/60 border border-emerald-800/60 rounded-3xl p-3.5 shadow-xl backdrop-blur-md">
            <button
              onClick={() => {
                if (fullSurahAudioRef.current) fullSurahAudioRef.current.pause();
                if (ayahAudioRef.current) ayahAudioRef.current.pause();
                setIsFullSurahPlaying(false);
                setIsAyahPlaying(false);
                setSelectedSurah(null);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-emerald-800/80 hover:bg-emerald-700/80 text-amber-200 text-xs sm:text-sm font-semibold transition"
            >
              <ArrowRight className="w-4 h-4" />
              <span>فهرس السور</span>
            </button>

            <div className="text-center">
              <h2 className="text-lg sm:text-xl font-bold font-quran text-amber-200">
                سورة {selectedSurah.name}
              </h2>
              <span className="text-[11px] text-emerald-200/70">
                {selectedSurah.revelationType} • {selectedSurah.numberOfAyahs} آيات • الجزء {selectedSurah.juz}
              </span>
            </div>

            {/* Font Size Adjuster */}
            <div className="flex items-center gap-1 bg-emerald-950/60 p-1 rounded-2xl border border-emerald-800/40">
              <button
                onClick={() => {
                  const s = Math.max(18, fontSize - 2);
                  setFontSize(s);
                  localStorage.setItem('quran_font_size', s.toString());
                }}
                className="w-8 h-8 rounded-xl bg-emerald-900/70 text-emerald-200 text-xs hover:bg-emerald-800 flex items-center justify-center font-bold"
                title="تصغير الخط"
              >
                A-
              </button>
              <span className="text-xs px-1 text-amber-300 font-mono">{fontSize}</span>
              <button
                onClick={() => {
                  const s = Math.min(42, fontSize + 2);
                  setFontSize(s);
                  localStorage.setItem('quran_font_size', s.toString());
                }}
                className="w-8 h-8 rounded-xl bg-emerald-900/70 text-emerald-200 text-xs hover:bg-emerald-800 flex items-center justify-center font-bold"
                title="تكبير الخط"
              >
                A+
              </button>
            </div>
          </div>

          {/* Full Surah Mishary Alafasy Audio Player Widget with Speed Controls */}
          <div className="p-4 rounded-3xl bg-gradient-to-r from-emerald-950 via-teal-950 to-emerald-900 border-2 border-amber-500/40 shadow-xl space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <button
                  onClick={togglePlayFullSurah}
                  className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-400 hover:from-amber-400 text-emerald-950 flex items-center justify-center shadow-lg transition transform active:scale-95 shrink-0"
                  title={isFullSurahPlaying ? 'إيقاف مؤقت' : 'تشغيل السورة كاملة'}
                >
                  {isFullSurahPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current" />}
                </button>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm sm:text-base text-amber-200 font-quran">
                      تلاوة سورة {selectedSurah.name} كاملة
                    </h3>
                    <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/30 font-bold">
                      الشيخ مشاري العفاسي
                    </span>
                  </div>
                  <p className="text-[11px] text-emerald-300/80">
                    {downloadedSet.has(selectedSurah.number)
                      ? 'مخزنة في ذاكرة الهاتف (تعمل 100% بدون إنترنت) ⚡️'
                      : 'يمكنك تنزيلها مرة واحدة لتشغيلها بدون نت'}
                  </p>
                </div>
              </div>

              {/* Speed & Download Action */}
              <div className="flex items-center gap-2">
                {/* Playback speed selector */}
                <div className="flex items-center gap-1 bg-emerald-900/60 p-1 rounded-xl border border-emerald-800/60 text-xs">
                  <Gauge className="w-3.5 h-3.5 text-amber-400 ml-1" />
                  {[0.75, 1.0, 1.25, 1.5].map(speed => (
                    <button
                      key={speed}
                      onClick={() => handleSpeedChange(speed)}
                      className={`px-2 py-1 rounded-lg font-mono font-bold text-[11px] transition ${
                        playbackSpeed === speed
                          ? 'bg-amber-500 text-emerald-950'
                          : 'text-emerald-200 hover:text-white'
                      }`}
                    >
                      {speed}x
                    </button>
                  ))}
                </div>

                {/* Download status button */}
                {downloadedSet.has(selectedSurah.number) ? (
                  <span className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>مُحمّلة أوفلاين</span>
                  </span>
                ) : (
                  <button
                    onClick={() => handleDownloadSingleSurah(selectedSurah.number)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-bold transition"
                    title="تنزيل السورة للاستماع بدون إنترنت"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>تنزيل أوفلاين</span>
                  </button>
                )}
              </div>
            </div>

            {/* Seek bar */}
            <div className="space-y-1">
              <input
                type="range"
                min="0"
                max={surahDuration || 100}
                value={currentSurahTime}
                onChange={handleSeek}
                className="w-full accent-amber-500 cursor-pointer h-2 bg-emerald-900 rounded-lg"
              />
              <div className="flex items-center justify-between text-[11px] font-mono text-emerald-300/80">
                <span>{formatSeconds(currentSurahTime)}</span>
                <span>{formatSeconds(surahDuration)}</span>
              </div>
            </div>
          </div>

          {/* Reciter Selector Bar (For Ayah-by-Ayah listening) */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-emerald-950/50 border border-emerald-800/40 rounded-2xl p-3">
            <div className="flex items-center gap-2">
              <Headphones className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="text-xs text-emerald-200 font-medium">الاستماع آية بآية:</span>
              <select
                value={selectedReciter.id}
                onChange={e => {
                  const r = RECITERS.find(rec => rec.id === e.target.value) || RECITERS[0];
                  setSelectedReciter(r);
                  if (ayahAudioRef.current) ayahAudioRef.current.pause();
                  setIsAyahPlaying(false);
                  setPlayingAyahNumber(null);
                }}
                className="bg-emerald-900/80 border border-emerald-700/60 rounded-xl px-2.5 py-1 text-xs text-amber-200 focus:outline-none"
              >
                {RECITERS.map(rec => (
                  <option key={rec.id} value={rec.id}>
                    {rec.name} ({rec.subname})
                  </option>
                ))}
              </select>
            </div>

            <div className="text-[11px] text-amber-300/80 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>اضغط على أيقونة الصوت بجانب أي آية للاستماع المباشر</span>
            </div>
          </div>

          {/* Surah Content Box */}
          <div className="relative rounded-3xl bg-gradient-to-b from-emerald-900/30 via-emerald-950/40 to-emerald-950/70 border-2 border-amber-500/30 p-5 sm:p-8 shadow-2xl backdrop-blur-md">
            {/* Islamic Ornamental Header Banner */}
            <div className="text-center py-4 border-b border-amber-500/20 mb-6">
              <div className="inline-block px-8 py-2 rounded-2xl bg-amber-500/10 border border-amber-500/30 mb-4">
                <span className="text-amber-300 font-quran text-lg sm:text-xl font-bold">
                  سُورَةُ {selectedSurah.name}
                </span>
              </div>

              {/* Basmala (Not in Surah At-Tawbah 9) */}
              {selectedSurah.number !== 9 && (
                <div className="font-quran text-2xl sm:text-3xl text-amber-200 drop-shadow-sm py-2">
                  بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                </div>
              )}
            </div>

            {loadingAyahs ? (
              <div className="py-16 text-center space-y-3">
                <div className="inline-block w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
                <p className="text-sm text-emerald-200">جاري تحميل الآيات الكريمة بدقة التشكيل...</p>
              </div>
            ) : ayahs.length === 0 ? (
              <div className="py-12 text-center text-slate-300 space-y-3">
                <p>تعذر تحميل الآيات، يرجى التحقق من اتصالك بالإنترنت في المرة الأولى لحفظ السورة في الذاكرة المحلية.</p>
                <button
                  onClick={() => openSurah(selectedSurah)}
                  className="px-4 py-2 bg-amber-500 text-emerald-950 font-bold rounded-xl text-xs"
                >
                  إعادة المحاولة
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {ayahs.map(ayah => {
                  const isCurrentPlaying = playingAyahNumber === ayah.numberInSurah && isAyahPlaying;
                  const isBookmarked = isAyahBookmarked(ayah.numberInSurah);

                  return (
                    <div
                      key={ayah.number}
                      className={`group p-4 rounded-2xl border transition ${
                        isCurrentPlaying
                          ? 'bg-amber-500/15 border-amber-400/80 shadow-lg'
                          : 'bg-emerald-950/40 border-emerald-800/30 hover:border-amber-500/40 hover:bg-emerald-900/20'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        {/* Ayah Text */}
                        <div
                          className="flex-1 font-quran text-slate-100 leading-loose"
                          style={{ fontSize: `${fontSize}px` }}
                        >
                          {ayah.text}
                          {/* Ayah Number Badge */}
                          <span className="inline-flex items-center justify-center w-7 h-7 mx-2 rounded-full border border-amber-500/60 bg-amber-500/10 text-amber-300 text-xs font-mono font-bold align-middle">
                            {ayah.numberInSurah.toLocaleString('ar-EG')}
                          </span>
                        </div>

                        {/* Actions (Play audio & Bookmark) */}
                        <div className="flex items-center gap-1.5 shrink-0 pt-1">
                          <button
                            onClick={() => playAyahAudio(ayah.numberInSurah)}
                            className={`p-2 rounded-xl transition ${
                              isCurrentPlaying
                                ? 'bg-amber-500 text-emerald-950 shadow-md'
                                : 'bg-emerald-900/60 text-emerald-300 hover:text-amber-300 hover:bg-emerald-800'
                            }`}
                            title={isCurrentPlaying ? 'إيقاف مؤقت' : 'استماع للآية'}
                          >
                            {isCurrentPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                          </button>

                          <button
                            onClick={() => handleBookmarkToggle(ayah)}
                            className={`p-2 rounded-xl transition ${
                              isBookmarked
                                ? 'bg-amber-500/30 text-amber-300 border border-amber-400/50'
                                : 'bg-emerald-900/60 text-emerald-400/60 hover:text-amber-300 hover:bg-emerald-800'
                            }`}
                            title={isBookmarked ? 'إزالة العلامة المرجعية' : 'حفظ كعلامة مرجعية'}
                          >
                            {isBookmarked ? <BookmarkCheck className="w-4 h-4 text-amber-400" /> : <Bookmark className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Bottom Next/Prev Surah Navigator */}
            <div className="flex items-center justify-between pt-6 mt-8 border-t border-emerald-800/60">
              {selectedSurah.number > 1 ? (
                <button
                  onClick={() => openSurah(SURAHS_LIST[selectedSurah.number - 2])}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-900/60 text-amber-200 text-xs sm:text-sm hover:bg-emerald-800 transition"
                >
                  <ChevronRight className="w-4 h-4" />
                  <span>السورة السابقة ({SURAHS_LIST[selectedSurah.number - 2].name})</span>
                </button>
              ) : <div />}

              {selectedSurah.number < 114 && (
                <button
                  onClick={() => openSurah(SURAHS_LIST[selectedSurah.number])}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-900/60 text-amber-200 text-xs sm:text-sm hover:bg-emerald-800 transition"
                >
                  <span>السورة التالية ({SURAHS_LIST[selectedSurah.number].name})</span>
                  <ChevronLeft className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Surah Index / Juz / Bookmarks / Downloads Center View */
        <div className="space-y-5">
          {/* Complete Quran Offline Download Banner */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-950 via-teal-950 to-emerald-900 border-2 border-amber-500/40 p-5 shadow-2xl backdrop-blur-md space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-300 flex items-center justify-center shadow-inner border border-amber-500/30 shrink-0">
                  <Download className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm sm:text-base text-amber-300 font-quran">
                      تنزيل القرآن الكريم كاملاً بصوت الشيخ مشاري العفاسي
                    </h3>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30 font-bold">
                      {downloadedSet.size} / 114 سورة
                    </span>
                  </div>
                  <p className="text-xs text-emerald-200/80 mt-0.5">
                    حمّل المصحف كاملاً مرة واحدة واستمع بدون إنترنت في أي وقت ومكان
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                {downloadProgress.isDownloading ? (
                  <button
                    onClick={() => quranDownloadManager.cancelDownload()}
                    className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md transition"
                  >
                    إيقاف التنزيل
                  </button>
                ) : downloadedSet.size === 114 ? (
                  <span className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-md">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>تم تنزيل المصحف كاملاً (100% أوفلاين)</span>
                  </span>
                ) : (
                  <button
                    onClick={() => quranDownloadManager.downloadFullQuran()}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-emerald-950 font-bold text-xs sm:text-sm shadow-xl transition"
                  >
                    <Download className="w-4 h-4" />
                    <span>{downloadedSet.size > 0 ? 'متابعة تنزيل باقي السور' : 'تنزيل المصحف كاملاً'}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Live Progress Bar if downloading */}
            {downloadProgress.isDownloading && (
              <div className="space-y-1.5 pt-2 border-t border-emerald-800/60">
                <div className="flex items-center justify-between text-xs text-amber-300">
                  <span>
                    جاري تنزيل سورة {downloadProgress.currentSurahName || ''} ({downloadProgress.currentSurahNumber || 0} من 114)...
                  </span>
                  <span className="font-mono font-bold">{downloadProgress.percent}%</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-emerald-950 border border-emerald-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-amber-300 transition-all duration-300"
                    style={{ width: `${downloadProgress.percent}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Last Read Quick Jump Banner */}
          {lastRead && (
            <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-amber-600/30 via-emerald-800/40 to-teal-900/40 border border-amber-500/30 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-amber-500 text-emerald-950">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-amber-300 font-medium">متابعة القراءة من آخر موضع:</span>
                  <p className="font-bold text-sm text-white">سورة {lastRead.surahName} (الآية {lastRead.ayahNumber})</p>
                </div>
              </div>
              <button
                onClick={() => {
                  const target = SURAHS_LIST.find(s => s.number === lastRead.surahNumber);
                  if (target) openSurah(target, lastRead.ayahNumber);
                }}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold text-xs sm:text-sm transition shadow"
              >
                متابعة القراءة
              </button>
            </div>
          )}

          {/* Search & Navigation Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-emerald-400 absolute right-3.5 top-3.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="ابحث عن اسم السورة أو رقمها..."
                className="w-full pl-4 pr-10 py-2.5 rounded-2xl bg-emerald-950/60 border border-emerald-800/60 text-white placeholder-emerald-400/50 text-sm focus:outline-none focus:border-amber-400 shadow-inner"
              />
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-1 bg-emerald-950/60 p-1 rounded-2xl border border-emerald-800/50">
              <button
                onClick={() => setActiveTab('surahs')}
                className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
                  activeTab === 'surahs'
                    ? 'bg-amber-500 text-emerald-950 shadow-md'
                    : 'text-emerald-200/80 hover:text-white'
                }`}
              >
                السور (114)
              </button>
              <button
                onClick={() => setActiveTab('juz')}
                className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
                  activeTab === 'juz'
                    ? 'bg-amber-500 text-emerald-950 shadow-md'
                    : 'text-emerald-200/80 hover:text-white'
                }`}
              >
                الأجزاء (30)
              </button>
              <button
                onClick={() => setActiveTab('bookmarks')}
                className={`flex items-center gap-1 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
                  activeTab === 'bookmarks'
                    ? 'bg-amber-500 text-emerald-950 shadow-md'
                    : 'text-emerald-200/80 hover:text-white'
                }`}
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>العلامات ({bookmarks.length})</span>
              </button>
            </div>
          </div>

          {/* Surahs Grid */}
          {activeTab === 'surahs' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {filteredSurahs.map(surah => {
                const isDownloaded = downloadedSet.has(surah.number);

                return (
                  <div
                    key={surah.number}
                    className="flex items-center justify-between p-3.5 rounded-2xl bg-emerald-900/30 hover:bg-emerald-900/60 border border-emerald-800/50 hover:border-amber-500/40 text-right transition group shadow-md"
                  >
                    <button
                      onClick={() => openSurah(surah)}
                      className="flex-1 flex items-center gap-3 text-right"
                    >
                      <div className="w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-700/50 text-amber-300 font-mono text-sm font-bold flex items-center justify-center group-hover:border-amber-400 group-hover:scale-105 transition">
                        {surah.number}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-white font-quran group-hover:text-amber-200 transition">
                          سورة {surah.name}
                        </h4>
                        <p className="text-[11px] text-emerald-300/60 font-sans">
                          {surah.englishName} • {surah.numberOfAyahs} آية
                        </p>
                      </div>
                    </button>

                    <div className="flex items-center gap-2">
                      {/* Download status / download trigger */}
                      {isDownloaded ? (
                        <span
                          className="p-1.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                          title="تم تحميل السورة وتعمل بدون إنترنت"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </span>
                      ) : (
                        <button
                          onClick={() => handleDownloadSingleSurah(surah.number)}
                          className="p-1.5 rounded-xl bg-emerald-950/60 hover:bg-amber-500 hover:text-emerald-950 text-emerald-300/80 border border-emerald-800 transition"
                          title="تنزيل سورة كاملة بصوت مشاري العفاسي للاستماع بدون نت"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      )}

                      <span className={`text-[10px] px-2 py-0.5 rounded-full border ${
                        surah.revelationType === 'مكية'
                          ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                          : 'bg-teal-500/10 text-teal-300 border-teal-500/30'
                      }`}>
                        {surah.revelationType}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Juz Tab */}
          {activeTab === 'juz' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {JUZ_LIST.map(juz => {
                const targetSurah = SURAHS_LIST.find(s => s.name === juz.startSurah) || SURAHS_LIST[0];
                return (
                  <button
                    key={juz.index}
                    onClick={() => openSurah(targetSurah)}
                    className="flex items-center justify-between p-4 rounded-2xl bg-emerald-900/30 hover:bg-emerald-900/60 border border-emerald-800/50 hover:border-amber-500/40 text-right transition shadow-md"
                  >
                    <div>
                      <span className="text-xs text-amber-300 font-bold">الجزء {juz.index}</span>
                      <p className="font-medium text-sm text-white font-quran mt-0.5">{juz.name}</p>
                    </div>
                    <ChevronLeft className="w-5 h-5 text-emerald-400" />
                  </button>
                );
              })}
            </div>
          )}

          {/* Bookmarks Tab */}
          {activeTab === 'bookmarks' && (
            <div className="space-y-3">
              {bookmarks.length === 0 ? (
                <div className="py-16 text-center text-emerald-300/60 space-y-2">
                  <Bookmark className="w-10 h-10 mx-auto text-emerald-500/40" />
                  <p className="text-sm">لم تقم بإضافة أي علامات مرجعية بعد.</p>
                  <p className="text-xs text-emerald-400/50">اضغط على أيقونة الإشارة المرجعية بجانب أي آية أثناء القراءة للرجوع إليها لاحقاً.</p>
                </div>
              ) : (
                bookmarks.map((bm, idx) => {
                  const surah = SURAHS_LIST.find(s => s.number === bm.surahNumber);
                  return (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-4 rounded-2xl bg-emerald-900/30 border border-emerald-800/40"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-amber-300 font-quran">سورة {bm.surahName}</span>
                          <span className="text-xs text-emerald-300/70">آية {bm.ayahNumber}</span>
                        </div>
                        <p className="text-xs text-emerald-100/80 font-quran mt-1">{bm.text}</p>
                      </div>

                      <button
                        onClick={() => {
                          if (surah) openSurah(surah, bm.ayahNumber);
                        }}
                        className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold text-xs transition shrink-0"
                      >
                        قراءة
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
