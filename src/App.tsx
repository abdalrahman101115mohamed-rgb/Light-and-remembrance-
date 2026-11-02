import React, { useState, useEffect } from 'react';
import {
  Home,
  BookOpen,
  Heart,
  Sparkles,
  Award,
  Flame,
  Settings as SettingsIcon,
  Share2,
  Smartphone,
  Moon,
  Sun,
  Menu,
  X,
  MapPin,
  HelpCircle,
  Download
} from 'lucide-react';
import { POPULAR_CITIES, City } from './data/cities';
import { CalculationMethodKey, JuristicMethodKey, getHijriDate } from './utils/prayerTimes';
import { HomeView } from './views/HomeView';
import { QuranView } from './views/QuranView';
import { AzkarView } from './views/AzkarView';
import { TasbeehView } from './views/TasbeehView';
import { KhatmaView } from './views/KhatmaView';
import { ChallengesView } from './views/ChallengesView';
import { StoriesView } from './views/StoriesView';
import { QuizView } from './views/QuizView';
import { CardsView } from './views/CardsView';
import { SettingsView } from './views/SettingsView';
import { HadithView } from './views/HadithView';
import { OfflineIndicator } from './components/OfflineIndicator';
import { AndroidBuildGuideModal } from './components/AndroidBuildGuideModal';
import { SheikhAudioPlayerWidget } from './components/SheikhAudioPlayerWidget';
import { usePWAInstall } from './hooks/usePWAInstall';

type TabKey =
  | 'home'
  | 'quran'
  | 'hadith'
  | 'azkar'
  | 'tasbeeh'
  | 'khatma'
  | 'challenges'
  | 'stories'
  | 'quiz'
  | 'cards'
  | 'settings';

interface AppSettings {
  selectedCity: City;
  calculationMethod: CalculationMethodKey;
  juristicMethod: JuristicMethodKey;
  hijriOffset: number;
  notificationsEnabled: boolean;
  prePrayerAlertMinutes: number;
  theme: 'emerald' | 'midnight' | 'light';
  soundEnabled: boolean;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<TabKey>('home');
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState<boolean>(false);
  const [isAndroidGuideOpen, setIsAndroidGuideOpen] = useState<boolean>(false);

  const { isInstallable, isInstalled, install } = usePWAInstall();

  // App Settings State
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const saved = localStorage.getItem('ramadan_app_settings');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn(e);
    }
    return {
      selectedCity: POPULAR_CITIES[0], // Makkah
      calculationMethod: 'Makkah',
      juristicMethod: 'Standard',
      hijriOffset: 0,
      notificationsEnabled: false,
      prePrayerAlertMinutes: 10,
      theme: 'emerald',
      soundEnabled: true,
    };
  });

  const updateSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
    try {
      localStorage.setItem('ramadan_app_settings', JSON.stringify(newSettings));
    } catch (e) {
      console.warn(e);
    }
  };

  const hijri = getHijriDate(new Date(), settings.hijriOffset);

  // Theme wrapper class
  const themeClass =
    settings.theme === 'midnight'
      ? 'bg-slate-950 text-slate-100'
      : settings.theme === 'light'
      ? 'bg-emerald-50 text-slate-900'
      : 'bg-emerald-950 text-slate-100';

  const navClass =
    settings.theme === 'light'
      ? 'bg-white/95 border-emerald-200 text-emerald-950 shadow-emerald-900/10'
      : 'bg-emerald-950/95 border-emerald-800/80 text-emerald-100 shadow-black/40';

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-300 pb-20 sm:pb-8 bg-islamic-pattern ${themeClass}`}>
      {/* Offline Toast Indicator */}
      <OfflineIndicator />

      {/* Floating Sheikh Audio Player for Hadiths and Stories */}
      <SheikhAudioPlayerWidget />

      {/* Android Build Guide Modal */}
      <AndroidBuildGuideModal
        isOpen={isAndroidGuideOpen}
        onClose={() => setIsAndroidGuideOpen(false)}
      />

      {/* Top Application Header */}
      <header className="sticky top-0 z-40 backdrop-blur-md border-b border-amber-500/20 bg-emerald-950/85 transition-all">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo & Title */}
          <div
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-3 cursor-pointer select-none group"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 p-0.5 shadow-md flex items-center justify-center transform group-hover:scale-105 transition">
              <img src="/icon.svg" alt="نور وذكر" className="w-full h-full rounded-[14px]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-lg font-quran text-amber-300 tracking-wide">
                  نُورٌ وَذِكْر
                </h1>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/30 font-mono font-bold">
                  {hijri.ramadanDay} رمضان
                </span>
              </div>
              <p className="text-[11px] text-emerald-300/70 font-sans">
                الأذان والقرآن والأذكار الصوتية
              </p>
            </div>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-2">
            {/* Quick city tag */}
            <button
              onClick={() => setActiveTab('settings')}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-900/60 hover:bg-emerald-800/60 text-xs text-amber-200 border border-emerald-800/50 transition"
              title="تغيير المدينة"
            >
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>{settings.selectedCity.name}</span>
            </button>

            {/* In-App PWA Install Button (if installable and not installed) */}
            {isInstallable && !isInstalled && (
              <button
                onClick={install}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-emerald-950 font-bold text-xs shadow-md transition"
                title="تثبيت التطبيق على جهازك"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">تثبيت التطبيق</span>
              </button>
            )}

            {/* Android APK Direct Button */}
            <button
              onClick={() => setIsAndroidGuideOpen(true)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-amber-400/10 text-amber-300 hover:text-white hover:bg-emerald-800/60 border border-amber-500/40 text-xs font-bold transition shadow-sm"
              title="تنزيل وتثبيت ملف APK لهواتف الأندرويد"
            >
              <Smartphone className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">تنزيل APK</span>
            </button>

            {/* Settings button */}
            <button
              onClick={() => setActiveTab('settings')}
              className={`p-2 rounded-xl border transition ${
                activeTab === 'settings'
                  ? 'bg-amber-500 text-emerald-950 border-amber-400'
                  : 'bg-emerald-900/60 text-emerald-200 hover:text-white border-emerald-800/50'
              }`}
              title="الإعدادات"
            >
              <SettingsIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Desktop / Tablet Sub-Navbar */}
        <div className="hidden md:flex border-t border-emerald-800/40 bg-emerald-950/40 px-4">
          <div className="max-w-5xl mx-auto w-full flex items-center justify-between gap-1 py-1.5 overflow-x-auto text-xs font-semibold">
            {[
              { key: 'home', label: 'الرئيسية', icon: <Home className="w-4 h-4" /> },
              { key: 'quran', label: 'القرآن الكريم', icon: <BookOpen className="w-4 h-4" /> },
              { key: 'hadith', label: 'الأحاديث النبوية', icon: <BookOpen className="w-4 h-4 text-amber-400" /> },
              { key: 'azkar', label: 'الأذكار والأدعية', icon: <Heart className="w-4 h-4" /> },
              { key: 'tasbeeh', label: 'المسبحة', icon: <Sparkles className="w-4 h-4" /> },
              { key: 'khatma', label: 'الورد والختمة', icon: <Award className="w-4 h-4" /> },
              { key: 'challenges', label: 'تحديات رمضان', icon: <Flame className="w-4 h-4" /> },
              { key: 'stories', label: 'قصص الأنبياء', icon: <BookOpen className="w-4 h-4" /> },
              { key: 'quiz', label: 'المسابقة', icon: <HelpCircle className="w-4 h-4" /> },
              { key: 'cards', label: 'بطاقات التهنئة', icon: <Share2 className="w-4 h-4" /> },
            ].map(item => (
              <button
                key={item.key}
                onClick={() => setActiveTab(item.key as TabKey)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition ${
                  activeTab === item.key
                    ? 'bg-amber-500 text-emerald-950 font-bold shadow-sm'
                    : 'text-emerald-200/80 hover:text-white hover:bg-emerald-900/40'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Body View */}
      <main className="flex-1 py-4">
        {activeTab === 'home' && (
          <HomeView
            selectedCity={settings.selectedCity}
            calculationMethod={settings.calculationMethod}
            juristicMethod={settings.juristicMethod}
            hijriOffset={settings.hijriOffset}
            onNavigate={tab => setActiveTab(tab)}
            onOpenAndroidGuide={() => setIsAndroidGuideOpen(true)}
          />
        )}
        {activeTab === 'quran' && <QuranView />}
        {activeTab === 'hadith' && <HadithView />}
        {activeTab === 'azkar' && <AzkarView />}
        {activeTab === 'tasbeeh' && <TasbeehView />}
        {activeTab === 'khatma' && <KhatmaView />}
        {activeTab === 'challenges' && <ChallengesView currentRamadanDay={hijri.ramadanDay} />}
        {activeTab === 'stories' && <StoriesView />}
        {activeTab === 'quiz' && <QuizView />}
        {activeTab === 'cards' && <CardsView />}
        {activeTab === 'settings' && (
          <SettingsView
            settings={settings}
            onUpdateSettings={updateSettings}
            onOpenAndroidGuide={() => setIsAndroidGuideOpen(true)}
          />
        )}
      </main>

      {/* Mobile Sticky Bottom Navigation Bar */}
      <nav className={`md:hidden fixed bottom-0 left-0 right-0 z-40 border-t backdrop-blur-lg px-2 py-1.5 shadow-2xl ${navClass}`}>
        <div className="flex items-center justify-around">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition ${
              activeTab === 'home' ? 'text-amber-400 font-bold' : 'text-emerald-300/70 hover:text-emerald-100'
            }`}
          >
            <Home className="w-5 h-5 mb-0.5" />
            <span className="text-[10px]">الرئيسية</span>
          </button>

          <button
            onClick={() => setActiveTab('quran')}
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition ${
              activeTab === 'quran' ? 'text-amber-400 font-bold' : 'text-emerald-300/70 hover:text-emerald-100'
            }`}
          >
            <BookOpen className="w-5 h-5 mb-0.5" />
            <span className="text-[10px]">القرآن</span>
          </button>

          <button
            onClick={() => setActiveTab('hadith')}
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition ${
              activeTab === 'hadith' ? 'text-amber-400 font-bold' : 'text-emerald-300/70 hover:text-emerald-100'
            }`}
          >
            <BookOpen className="w-5 h-5 mb-0.5" />
            <span className="text-[10px]">الأحاديث</span>
          </button>

          <button
            onClick={() => setActiveTab('azkar')}
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition ${
              activeTab === 'azkar' ? 'text-amber-400 font-bold' : 'text-emerald-300/70 hover:text-emerald-100'
            }`}
          >
            <Heart className="w-5 h-5 mb-0.5" />
            <span className="text-[10px]">الأذكار</span>
          </button>

          {/* More Drawer Button */}
          <button
            onClick={() => setIsMoreMenuOpen(true)}
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition ${
              isMoreMenuOpen || ['tasbeeh', 'khatma', 'challenges', 'stories', 'quiz', 'cards', 'settings'].includes(activeTab)
                ? 'text-amber-400 font-bold'
                : 'text-emerald-300/70 hover:text-emerald-100'
            }`}
          >
            <Menu className="w-5 h-5 mb-0.5" />
            <span className="text-[10px]">المزيد</span>
          </button>
        </div>
      </nav>

      {/* Mobile "More" Drawer Modal */}
      {isMoreMenuOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/70 backdrop-blur-sm">
          <div
            className="w-full bg-emerald-950 border-t-2 border-amber-500/40 rounded-t-3xl p-6 text-white shadow-2xl space-y-4 max-h-[80vh] overflow-y-auto animate-in slide-in-from-bottom"
          >
            <div className="flex items-center justify-between pb-3 border-b border-emerald-800/60">
              <div>
                <h3 className="font-bold text-base text-amber-300 font-quran">
                  أقسام تطبيق «نور وذكر»
                </h3>
                <p className="text-[11px] text-emerald-300/70">الأذان والقرآن والأذكار الصوتية بدون نت</p>
              </div>
              <button
                onClick={() => setIsMoreMenuOpen(false)}
                className="p-1.5 rounded-xl text-emerald-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => { setActiveTab('tasbeeh'); setIsMoreMenuOpen(false); }}
                className="flex items-center gap-3 p-3.5 rounded-2xl bg-emerald-900/40 border border-emerald-800/50 text-right hover:border-amber-400 transition"
              >
                <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-white">المسبحة الإلكترونية</h4>
                  <p className="text-[10px] text-emerald-300/70">تسبيح ذكي بالأصوات</p>
                </div>
              </button>

              <button
                onClick={() => { setActiveTab('khatma'); setIsMoreMenuOpen(false); }}
                className="flex items-center gap-3 p-3.5 rounded-2xl bg-emerald-900/40 border border-emerald-800/50 text-right hover:border-amber-400 transition"
              >
                <div className="p-2 rounded-xl bg-teal-500/20 text-teal-300 shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-white">الورد وختمة رمضان</h4>
                  <p className="text-[10px] text-emerald-300/70">جدول الأجزاء</p>
                </div>
              </button>

              <button
                onClick={() => { setActiveTab('challenges'); setIsMoreMenuOpen(false); }}
                className="flex items-center gap-3 p-3.5 rounded-2xl bg-emerald-900/40 border border-emerald-800/50 text-right hover:border-amber-400 transition"
              >
                <div className="p-2 rounded-xl bg-orange-500/20 text-orange-300 shrink-0">
                  <Flame className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-white">تحديات 30 يوماً</h4>
                  <p className="text-[10px] text-emerald-300/70">مهام يومية مباركة</p>
                </div>
              </button>

              <button
                onClick={() => { setActiveTab('stories'); setIsMoreMenuOpen(false); }}
                className="flex items-center gap-3 p-3.5 rounded-2xl bg-emerald-900/40 border border-emerald-800/50 text-right hover:border-amber-400 transition"
              >
                <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-300 shrink-0">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-white">قصص الأنبياء</h4>
                  <p className="text-[10px] text-emerald-300/70">للأطفال والعائلة</p>
                </div>
              </button>

              <button
                onClick={() => { setActiveTab('quiz'); setIsMoreMenuOpen(false); }}
                className="flex items-center gap-3 p-3.5 rounded-2xl bg-emerald-900/40 border border-emerald-800/50 text-right hover:border-amber-400 transition"
              >
                <div className="p-2 rounded-xl bg-yellow-500/20 text-yellow-300 shrink-0">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-white">المسابقة الرمضانية</h4>
                  <p className="text-[10px] text-emerald-300/70">فقه ومعلومات</p>
                </div>
              </button>

              <button
                onClick={() => { setActiveTab('cards'); setIsMoreMenuOpen(false); }}
                className="flex items-center gap-3 p-3.5 rounded-2xl bg-emerald-900/40 border border-emerald-800/50 text-right hover:border-amber-400 transition"
              >
                <div className="p-2 rounded-xl bg-rose-500/20 text-rose-300 shrink-0">
                  <Share2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-white">بطاقات التهنئة</h4>
                  <p className="text-[10px] text-emerald-300/70">تصميم ومشاركة</p>
                </div>
              </button>

              <button
                onClick={() => { setActiveTab('settings'); setIsMoreMenuOpen(false); }}
                className="col-span-2 flex items-center gap-3 p-3.5 rounded-2xl bg-emerald-900/40 border border-emerald-800/50 text-right hover:border-amber-400 transition"
              >
                <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300 shrink-0">
                  <SettingsIcon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-white">الإعدادات والتذكير الصوتي</h4>
                  <p className="text-[10px] text-emerald-300/70">ضبط نطق الأذكار كل 5 دقائق والمواقيت</p>
                </div>
              </button>
            </div>

            {/* Android APK download button in drawer */}
            <div className="pt-2">
              <button
                onClick={() => { setIsMoreMenuOpen(false); setIsAndroidGuideOpen(true); }}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-emerald-950 font-bold text-xs sm:text-sm shadow-md transition"
              >
                <Smartphone className="w-4 h-4" />
                <span>تنزيل وتثبيت ملف APK لهواتف الأندرويد 📦</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
