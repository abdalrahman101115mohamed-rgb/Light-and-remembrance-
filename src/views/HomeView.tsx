import React, { useState, useEffect } from 'react';
import {
  Moon,
  Sun,
  Sunrise,
  Sunset,
  Clock,
  Sparkles,
  BookOpen,
  Heart,
  Award,
  Layers,
  Share2,
  Bookmark,
  ChevronLeft,
  Volume2,
  Calendar,
  Compass,
  MapPin,
  Utensils,
  Flame,
  CheckCircle2,
  Circle,
  Download
} from 'lucide-react';
import { City } from '../data/cities';
import {
  calculatePrayerTimes,
  getNextPrayer,
  getIftarCountdown,
  getHijriDate,
  formatTimeArabic,
  PrayerTimesResult,
  CalculationMethodKey,
  JuristicMethodKey
} from '../utils/prayerTimes';
import { PWAInstallBanner } from '../components/PWAInstallBanner';
import { SalawatReminderWidget } from '../components/SalawatReminderWidget';

interface Props {
  selectedCity: City;
  calculationMethod: CalculationMethodKey;
  juristicMethod: JuristicMethodKey;
  hijriOffset: number;
  onNavigate: (tab: 'home' | 'quran' | 'hadith' | 'azkar' | 'tasbeeh' | 'khatma' | 'challenges' | 'stories' | 'quiz' | 'cards' | 'settings') => void;
  onOpenAndroidGuide: () => void;
}

export const HomeView: React.FC<Props> = ({
  selectedCity,
  calculationMethod,
  juristicMethod,
  hijriOffset,
  onNavigate,
  onOpenAndroidGuide,
}) => {
  const [now, setNow] = useState<Date>(new Date());
  const [lastRead, setLastRead] = useState<{ surahName: string; ayahNumber: number } | null>(null);

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Load last read
  useEffect(() => {
    try {
      const saved = localStorage.getItem('quran_last_read');
      if (saved) setLastRead(JSON.parse(saved));
    } catch (e) {
      console.warn(e);
    }
  }, []);

  // Compute prayer times
  const prayerTimes: PrayerTimesResult = calculatePrayerTimes(
    now,
    selectedCity.latitude,
    selectedCity.longitude,
    calculationMethod,
    juristicMethod
  );

  const nextPrayer = getNextPrayer(prayerTimes, now);
  const iftarInfo = getIftarCountdown(prayerTimes, now);
  const hijri = getHijriDate(now, hijriOffset);

  // Gregorian date formatted in Arabic
  const gregorianFormatted = now.toLocaleDateString('ar-EG', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 space-y-6">
      {/* PWA Install Banner */}
      <PWAInstallBanner onOpenAndroidGuide={onOpenAndroidGuide} />

      {/* Ramadan Hero Banner with Hanging Animated Lantern and Crescent */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-950 via-teal-950 to-emerald-900 border-2 border-amber-500/40 p-6 sm:p-8 shadow-2xl backdrop-blur-md">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-6 sm:left-12 pointer-events-none animate-lantern opacity-90">
          <svg width="44" height="110" viewBox="0 0 44 110" fill="none" xmlns="http://www.w3.org/2000/svg">
            <line x1="22" y1="0" x2="22" y2="40" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3,3" />
            <circle cx="22" cy="45" r="5" stroke="#f59e0b" strokeWidth="2" />
            <polygon points="12,56 32,56 26,48 18,48" fill="#f59e0b" />
            <polygon points="8,90 36,90 32,56 12,56" fill="#fef08a" fillOpacity="0.95" stroke="#f59e0b" strokeWidth="2" />
            <circle cx="22" cy="73" r="6" fill="#d97706" />
            <polygon points="14,90 30,90 32,98 12,98" fill="#f59e0b" />
          </svg>
        </div>

        <div className="relative z-10 space-y-4">
          {/* Ramadan Day & Dates */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 font-bold text-xs sm:text-sm shadow-inner">
              <Sparkles className="w-4 h-4 text-amber-300 animate-spin" style={{ animationDuration: '6s' }} />
              <span>اليوم {hijri.ramadanDay} من شهر رمضان المبارك 1448 هـ</span>
            </div>

            <button
              onClick={() => onNavigate('settings')}
              className="flex items-center gap-1.5 text-xs text-emerald-200/90 hover:text-amber-300 bg-emerald-900/60 px-3 py-1 rounded-xl border border-emerald-800/50 transition"
            >
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>{selectedCity.name}</span>
            </button>
          </div>

          {/* Gregorian Date */}
          <p className="text-xs text-emerald-200/80">
            {gregorianFormatted}
          </p>

          {/* Main Title Calligraphy */}
          <div className="pt-2">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h1 className="text-3xl sm:text-5xl font-bold font-quran text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-200 drop-shadow-md">
                  نُورٌ وَذِكْر
                </h1>
                <p className="text-xs sm:text-sm text-emerald-100/90 mt-1 max-w-lg">
                  الأذان والإقامة بدون نت، تذكير «صلِّ على النبي ﷺ» كل 3 دقائق، القرآن الكريم كاملاً بصوت الشيخ مشاري العفاسي، وأذكار وأحاديث بصوت راجل مصري
                </p>
              </div>

              {/* Quick APK Launcher Button */}
              <button
                onClick={onOpenAndroidGuide}
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-emerald-950 font-bold text-xs sm:text-sm shadow-xl transition transform active:scale-95"
              >
                <Download className="w-4 h-4" />
                <span>تنزيل APK للأندرويد 📦</span>
              </button>
            </div>
          </div>

          {/* Dual Countdown Pill (Next Prayer & Iftar) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3">
            {/* Next Prayer Countdown with Adhan & Iqama Status */}
            <div className="p-3.5 rounded-2xl bg-emerald-900/50 border border-amber-500/25 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="text-[11px] text-emerald-300/80">الصلاة القادمة:</span>
                  <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded-full border border-amber-500/30 font-bold">
                    الأذان والإقامة آلياً 🔔
                  </span>
                </div>
                <span className="text-sm font-bold text-amber-300 font-quran">
                  صلاة {nextPrayer.name} ({nextPrayer.timeString})
                </span>
              </div>
              <div className="text-left font-mono font-bold text-sm text-white bg-emerald-950/70 px-3 py-1.5 rounded-xl border border-emerald-800/50">
                {nextPrayer.formattedRemaining}
              </div>
            </div>

            {/* Iftar Countdown */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-600/30 to-emerald-900/50 border border-amber-400/40 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Utensils className="w-4 h-4 text-amber-400 shrink-0" />
                <div>
                  <span className="text-[11px] text-amber-200/80 block">موعد الإفطار (المغرب):</span>
                  <span className="text-sm font-bold text-amber-300">
                    {formatTimeArabic(prayerTimes.maghrib)}
                  </span>
                </div>
              </div>
              <div className="text-left font-mono font-bold text-sm text-amber-300 bg-emerald-950/80 px-3 py-1.5 rounded-xl border border-amber-500/30">
                {iftarInfo.formatted}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5-Minute Salawat & Azkar Audio Reminder Widget */}
      <SalawatReminderWidget />

      {/* Prayer Times Horizontal Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs sm:text-sm">
          <h2 className="font-bold text-amber-200 flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400" />
            <span>مواقيت الصلاة اليوم في {selectedCity.name}</span>
          </h2>
          <button
            onClick={() => onNavigate('settings')}
            className="text-xs text-emerald-300 hover:text-amber-300 transition"
          >
            تعديل المدينة والطريقة
          </button>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {[
            { key: 'fajr', name: 'الفجر', time: prayerTimes.fajr, icon: <Moon className="w-4 h-4" /> },
            { key: 'sunrise', name: 'الشروق', time: prayerTimes.sunrise, icon: <Sunrise className="w-4 h-4" /> },
            { key: 'dhuhr', name: 'الظهر', time: prayerTimes.dhuhr, icon: <Sun className="w-4 h-4" /> },
            { key: 'asr', name: 'العصر', time: prayerTimes.asr, icon: <Sun className="w-4 h-4 opacity-75" /> },
            { key: 'maghrib', name: 'المغرب', time: prayerTimes.maghrib, icon: <Sunset className="w-4 h-4" /> },
            { key: 'isha', name: 'العشاء', time: prayerTimes.isha, icon: <Moon className="w-4 h-4" /> },
          ].map(p => {
            const isNext = nextPrayer.key === p.key;
            return (
              <div
                key={p.key}
                className={`p-3 rounded-2xl border text-center transition flex flex-col items-center justify-center space-y-1 ${
                  isNext
                    ? 'bg-amber-500 text-emerald-950 font-bold border-amber-400 shadow-lg scale-102 ring-2 ring-amber-400/50'
                    : 'bg-emerald-900/30 border-emerald-800/40 text-emerald-100 hover:bg-emerald-900/50'
                }`}
              >
                <div className={`p-1.5 rounded-full ${isNext ? 'bg-emerald-950/20 text-emerald-950' : 'bg-emerald-950/60 text-amber-400'}`}>
                  {p.icon}
                </div>
                <span className="text-xs font-semibold">{p.name}</span>
                <span className={`text-xs font-mono font-bold ${isNext ? 'text-emerald-950' : 'text-amber-300'}`}>
                  {formatTimeArabic(p.time)}
                </span>
                {isNext && (
                  <span className="text-[9px] bg-emerald-950 text-amber-300 px-1.5 py-0.5 rounded-full">
                    القادمة
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Navigation Services Grid */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-amber-200">الخدمات الرمضانية الأساسية:</h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* 1. Quran */}
          <button
            onClick={() => onNavigate('quran')}
            className="p-4 rounded-3xl bg-gradient-to-b from-emerald-900/50 to-emerald-950/60 border border-emerald-800/50 hover:border-amber-400 text-right transition group shadow-md"
          >
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-300 flex items-center justify-center mb-2 group-hover:scale-110 transition">
              <BookOpen className="w-5 h-5" />
            </div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-bold text-sm sm:text-base text-white group-hover:text-amber-200">القرآن الكريم</h3>
              <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded-full font-bold">بدون نت</span>
            </div>
            <p className="text-[11px] text-emerald-300/70 mt-0.5">114 سورة كاملة مع التلاوة</p>
          </button>

          {/* 2. Hadith */}
          <button
            onClick={() => onNavigate('hadith')}
            className="p-4 rounded-3xl bg-gradient-to-b from-emerald-900/50 to-emerald-950/60 border border-amber-500/40 hover:border-amber-300 text-right transition group shadow-md ring-1 ring-amber-500/20"
          >
            <div className="w-10 h-10 rounded-2xl bg-teal-500/20 text-teal-300 flex items-center justify-center mb-2 group-hover:scale-110 transition">
              <Bookmark className="w-5 h-5" />
            </div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-bold text-sm sm:text-base text-amber-300 group-hover:text-amber-200">الأحاديث النبوية</h3>
              <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded-full font-bold">بدون نت</span>
            </div>
            <p className="text-[11px] text-emerald-300/70 mt-0.5">الأربعين النووية وفضل الصلاة على النبي</p>
          </button>

          {/* 3. Azkar */}
          <button
            onClick={() => onNavigate('azkar')}
            className="p-4 rounded-3xl bg-gradient-to-b from-emerald-900/50 to-emerald-950/60 border border-emerald-800/50 hover:border-amber-400 text-right transition group shadow-md"
          >
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center mb-2 group-hover:scale-110 transition">
              <Heart className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm sm:text-base text-white group-hover:text-amber-200">الأذكار والأدعية</h3>
            <p className="text-[11px] text-emerald-300/70 mt-0.5">أدعية الصباح والمساء والشفاء</p>
          </button>

          {/* 3. Tasbeeh */}
          <button
            onClick={() => onNavigate('tasbeeh')}
            className="p-4 rounded-3xl bg-gradient-to-b from-emerald-900/50 to-emerald-950/60 border border-emerald-800/50 hover:border-amber-400 text-right transition group shadow-md"
          >
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-300 flex items-center justify-center mb-2 group-hover:scale-110 transition">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm sm:text-base text-white group-hover:text-amber-200">المسبحة الإلكترونية</h3>
            <p className="text-[11px] text-emerald-300/70 mt-0.5">عداد ذكي مع اهتزاز وصوت</p>
          </button>

          {/* 4. Khatma */}
          <button
            onClick={() => onNavigate('khatma')}
            className="p-4 rounded-3xl bg-gradient-to-b from-emerald-900/50 to-emerald-950/60 border border-emerald-800/50 hover:border-amber-400 text-right transition group shadow-md"
          >
            <div className="w-10 h-10 rounded-2xl bg-teal-500/20 text-teal-300 flex items-center justify-center mb-2 group-hover:scale-110 transition">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm sm:text-base text-white group-hover:text-amber-200">الورد وختمة رمضان</h3>
            <p className="text-[11px] text-emerald-300/70 mt-0.5">تنظيم قراءة الأجزاء والنسبة</p>
          </button>

          {/* 5. Challenges */}
          <button
            onClick={() => onNavigate('challenges')}
            className="p-4 rounded-3xl bg-gradient-to-b from-emerald-900/50 to-emerald-950/60 border border-emerald-800/50 hover:border-amber-400 text-right transition group shadow-md"
          >
            <div className="w-10 h-10 rounded-2xl bg-orange-500/20 text-orange-300 flex items-center justify-center mb-2 group-hover:scale-110 transition">
              <Flame className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm sm:text-base text-white group-hover:text-amber-200">تحديات 30 يوماً</h3>
            <p className="text-[11px] text-emerald-300/70 mt-0.5">مهام روحية يومية خفيفة</p>
          </button>

          {/* 6. Stories */}
          <button
            onClick={() => onNavigate('stories')}
            className="p-4 rounded-3xl bg-gradient-to-b from-emerald-900/50 to-emerald-950/60 border border-emerald-800/50 hover:border-amber-400 text-right transition group shadow-md"
          >
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center mb-2 group-hover:scale-110 transition">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm sm:text-base text-white group-hover:text-amber-200">قصص الأنبياء</h3>
            <p className="text-[11px] text-emerald-300/70 mt-0.5">للأطفال والعائلة والعبر</p>
          </button>

          {/* 7. Quiz */}
          <button
            onClick={() => onNavigate('quiz')}
            className="p-4 rounded-3xl bg-gradient-to-b from-emerald-900/50 to-emerald-950/60 border border-emerald-800/50 hover:border-amber-400 text-right transition group shadow-md"
          >
            <div className="w-10 h-10 rounded-2xl bg-yellow-500/20 text-yellow-300 flex items-center justify-center mb-2 group-hover:scale-110 transition">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm sm:text-base text-white group-hover:text-amber-200">المسابقة الرمضانية</h3>
            <p className="text-[11px] text-emerald-300/70 mt-0.5">أسئلة فقهية وثقافية شيقة</p>
          </button>

          {/* 8. Cards */}
          <button
            onClick={() => onNavigate('cards')}
            className="p-4 rounded-3xl bg-gradient-to-b from-emerald-900/50 to-emerald-950/60 border border-emerald-800/50 hover:border-amber-400 text-right transition group shadow-md"
          >
            <div className="w-10 h-10 rounded-2xl bg-rose-500/20 text-rose-300 flex items-center justify-center mb-2 group-hover:scale-110 transition">
              <Share2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm sm:text-base text-white group-hover:text-amber-200">بطاقات التهنئة</h3>
            <p className="text-[11px] text-emerald-300/70 mt-0.5">تصميم ومشاركة عبر واتساب</p>
          </button>
        </div>
      </div>

      {/* Daily Spiritual Gem Card */}
      <div className="rounded-3xl bg-gradient-to-r from-emerald-900/40 via-teal-900/40 to-emerald-950/60 border border-amber-500/30 p-5 space-y-3 shadow-lg">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>نفحة رمضانية لليوم {hijri.ramadanDay}:</span>
          </span>
          <button
            onClick={() => onNavigate('cards')}
            className="text-[11px] text-amber-300 hover:text-white flex items-center gap-1"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>مشاركة كبطاقة</span>
          </button>
        </div>

        <p className="font-quran text-base sm:text-lg text-white leading-relaxed text-justify">
          «مَنْ صَامَ رَمَضَانَ إِيمَانًا وَاحْتِسَابًا غُفِرَ لَهُ مَا تَقَدَّمَ مِنْ ذَنْبِهِ، وَمَنْ قَامَ لَيْلَةَ الْقَدْرِ إِيمَانًا وَاحْتِسَابًا غُفِرَ لَهُ مَا تَقَدَّمَ مِنْ ذَنْبِهِ.»
        </p>

        <p className="text-[11px] text-emerald-300/70 text-left font-sans">
          صحيح البخاري ومسلم
        </p>
      </div>
    </div>
  );
};
