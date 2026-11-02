import React, { useState, useEffect } from 'react';
import {
  Volume2,
  Play,
  Pause,
  Clock,
  Sparkles,
  RotateCcw,
  Settings,
  Moon,
  ShieldCheck,
  CheckCircle2,
  Headphones,
  Sliders,
  Flame,
  BellRing
} from 'lucide-react';
import {
  salawatAudioService,
  ReminderState,
  COMBINED_ZHIKR_TEXT
} from '../utils/salawatAudioReminder';
import { adhanService, AdhanState } from '../utils/adhanService';

export const SalawatReminderWidget: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const [state, setState] = useState<ReminderState>(salawatAudioService.getState());
  const [adhanState, setAdhanState] = useState<AdhanState>(adhanService.getState());
  const [showSettings, setShowSettings] = useState<boolean>(false);

  useEffect(() => {
    const unsubReminder = salawatAudioService.subscribe(newState => {
      setState(newState);
    });
    const unsubAdhan = adhanService.subscribe(newAdhanState => {
      setAdhanState(newAdhanState);
    });
    return () => {
      unsubReminder();
      unsubAdhan();
    };
  }, []);

  const {
    config,
    secondsRemaining,
    isPlayingAudio,
    isPausedForAdhan,
    isPausedForIqama,
    isInQuietHours,
    permissionStatus,
    lastRecitedAt
  } = state;

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const timeFormatted = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  const toggleEnabled = () => {
    salawatAudioService.updateConfig({ enabled: !config.enabled });
  };

  const handleTestVoice = async () => {
    await salawatAudioService.playCombinedZhikrNow();
  };

  const handleIntervalChange = (val: number) => {
    salawatAudioService.updateConfig({ intervalMinutes: val });
  };

  const handleVolumeChange = (newVol: number) => {
    salawatAudioService.updateConfig({ volume: newVol });
  };

  const handleRequestNotification = async () => {
    await salawatAudioService.requestNotificationPermission();
  };

  if (compact) {
    return (
      <div className="flex items-center justify-between p-3 rounded-2xl bg-emerald-900/50 border border-amber-500/30 shadow-md">
        <div className="flex items-center gap-2.5">
          <div className={`p-2 rounded-xl ${isPlayingAudio ? 'bg-amber-500 text-emerald-950 animate-bounce' : 'bg-amber-500/20 text-amber-300'}`}>
            <Volume2 className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-200">الأذكار مجتمعة كل {config.intervalMinutes} دقائق</span>
              {isPlayingAudio && (
                <span className="text-[10px] bg-amber-500 text-emerald-950 px-1.5 py-0.2 rounded-full font-bold animate-pulse">
                  جاري النطق بصوت {config.voiceStyle === 'abdulbasit' ? 'الشيخ عبد الباسط ⭐️' : config.voiceStyle === 'mishary' ? 'الشيخ مشاري 🔊' : 'الشيخ القارئ 🎙️'}
                </span>
              )}
              {isInQuietHours && (
                <span className="text-[10px] bg-indigo-500/30 text-indigo-200 px-1.5 py-0.2 rounded-full font-bold">
                  وضع السكون 🌙
                </span>
              )}
            </div>
            <p className="text-[11px] text-emerald-300/80 font-mono">
              {config.enabled ? (isInQuietHours ? 'هادئ أثناء النوم' : `الذكر القادم بعد: ${timeFormatted}`) : 'الأذكار متوقفة مؤقتاً'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handleTestVoice}
            disabled={isPlayingAudio}
            className="px-2.5 py-1 rounded-xl bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold text-xs transition"
            title="تجربة صوت الشيخ مشاري الآن"
          >
            استمع الآن
          </button>
          <button
            onClick={toggleEnabled}
            className={`p-1.5 rounded-xl border transition ${
              config.enabled
                ? 'bg-emerald-800 text-amber-300 border-emerald-700'
                : 'bg-emerald-950 text-slate-400 border-emerald-900'
            }`}
            title={config.enabled ? 'إيقاف الأذكار' : 'تشغيل الأذكار'}
          >
            {config.enabled ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    );
  }

  // Full Rich Widget
  const totalSeconds = config.intervalMinutes * 60;
  const progressPercent = Math.max(0, Math.min(100, ((totalSeconds - secondsRemaining) / totalSeconds) * 100));

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-teal-950 to-emerald-900 border-2 border-amber-500/40 p-5 sm:p-6 shadow-2xl backdrop-blur-md">
      {/* Decorative background glow */}
      <div className="absolute -top-12 -left-12 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 -right-12 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header bar */}
      <div className="relative z-10 flex items-center justify-between gap-2 pb-3 border-b border-amber-500/20">
        <div className="flex items-center gap-2.5">
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-inner ${
            isPlayingAudio ? 'bg-amber-500 text-emerald-950 animate-pulse' : 'bg-gradient-to-tr from-amber-500/30 to-amber-400/20 text-amber-300 border border-amber-500/30'
          }`}>
            <Volume2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm sm:text-base text-amber-300 font-quran">
                الأذكار الصوتية المجمعة (بصوت الشيخ مشاري)
              </h3>
              <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/30 font-bold">
                كل {config.intervalMinutes} دقائق
              </span>
            </div>
            <p className="text-[11px] text-emerald-300/80">
              يقول كل 5 دقائق: «سبحان الله والحمد لله ولا إله إلا الله والله أكبر وصلى الله على محمد» مجتمعة
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`p-2 rounded-xl border transition ${
              showSettings ? 'bg-amber-500 text-emerald-950 border-amber-400' : 'bg-emerald-900/60 text-amber-300 border-amber-500/30 hover:bg-emerald-800'
            }`}
            title="إعدادات الصوت وأوقات السكون"
          >
            <Settings className="w-4 h-4" />
          </button>

          <button
            onClick={toggleEnabled}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs transition shadow-md border ${
              config.enabled
                ? 'bg-amber-500 text-emerald-950 border-amber-400 hover:bg-amber-400'
                : 'bg-emerald-900/60 text-slate-300 border-emerald-700 hover:bg-emerald-800'
            }`}
          >
            {config.enabled ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span>إيقاف مؤقت</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>تشغيل الأذكار</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Adhan/Iqama coordination warning banner */}
      {isPausedForAdhan && (
        <div className="relative z-10 mt-3 p-3 rounded-2xl bg-amber-500/20 border border-amber-400/50 flex items-center gap-2 text-amber-200 text-xs animate-pulse">
          <BellRing className="w-4 h-4 text-amber-400 shrink-0" />
          <span>الأذان يرفع الآن — تم إيقاف الذكر الصوتي مؤقتاً لتعظيم نداء الصلاة وسيعود تلقائياً بعد الأذان.</span>
        </div>
      )}

      {isPausedForIqama && (
        <div className="relative z-10 mt-3 p-3 rounded-2xl bg-emerald-500/20 border border-emerald-400/50 flex items-center gap-2 text-emerald-200 text-xs animate-pulse">
          <Flame className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>إقامة الصلاة جارية الآن — تم إيقاف الذكر مؤقتاً لسماع الإقامة.</span>
        </div>
      )}

      {/* Quiet hours banner */}
      {isInQuietHours && !isPausedForAdhan && (
        <div className="relative z-10 mt-3 p-2.5 rounded-2xl bg-indigo-950/60 border border-indigo-700/50 flex items-center justify-between text-indigo-200 text-xs">
          <div className="flex items-center gap-2">
            <Moon className="w-4 h-4 text-indigo-400" />
            <span>وضع السكون الليلي مفعّل ({config.quietStart} إلى {config.quietEnd}) حتى لا يزعج نومك.</span>
          </div>
          <span className="text-[10px] bg-indigo-500/20 px-2 py-0.5 rounded-full font-bold">هادئ</span>
        </div>
      )}

      {/* Main Combined Remembrance Card */}
      <div className="relative z-10 my-4 p-4 rounded-2xl bg-emerald-950/80 border border-amber-500/30 text-center space-y-3 shadow-inner">
        <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-amber-400">
          <Sparkles className="w-3.5 h-3.5" />
          <span>الباقيات الصالحات والصلاة على النبي ﷺ (تُنطق كلها مجتمعة)</span>
        </div>

        <p className="text-base sm:text-lg font-bold font-quran text-amber-100 leading-loose tracking-wide py-1 px-2 bg-gradient-to-r from-amber-500/10 via-amber-500/20 to-amber-500/10 rounded-xl border border-amber-500/20">
          « سُبْحَانَ اللَّهِ ، وَالْحَمْدُ لِلَّهِ ، وَلَا إِلَهَ إِلَّا اللَّهُ ، وَاللَّهُ أَكْبَرُ ، وَصَلَّى اللَّهُ عَلَى نَبِيِّنَا مُحَمَّدٍ ﷺ »
        </p>

        {/* Live Audio & Recitation Status */}
        <div className="flex flex-wrap items-center justify-between text-xs text-emerald-300/80 pt-1 border-t border-emerald-900/80">
          <div className="flex items-center gap-1.5">
            <Headphones className="w-3.5 h-3.5 text-amber-400" />
            <span>
              نبرة الصوت:{' '}
              <strong className="text-amber-300">
                {config.voiceStyle === 'abdulbasit'
                  ? 'الشيخ عبد الباسط عبد الصمد (أوفلاين) ⭐️'
                  : config.voiceStyle === 'mishary'
                  ? 'الشيخ مشاري العفاسي (تسجيل أوفلاين)'
                  : 'صوت الشيخ القارئ الخاشع (أوفلاين)'}
              </strong>
            </span>
          </div>
          {lastRecitedAt && (
            <span className="font-mono text-[11px] text-amber-300/70">
              آخر نطق: {lastRecitedAt}
            </span>
          )}
        </div>
      </div>

      {/* Countdown Progress Bar & Actions */}
      <div className="relative z-10 space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold">
          <div className="flex items-center gap-1.5 text-amber-300">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>موعد التذكير الصوتي القادم:</span>
          </div>
          <span className="font-mono font-bold text-amber-200 text-sm tracking-wider">
            {config.enabled ? (isInQuietHours ? 'معلق أثناء النوم' : timeFormatted) : 'متوقف'}
          </span>
        </div>

        {/* Progress line */}
        <div className="w-full h-2 rounded-full bg-emerald-950 border border-emerald-800 overflow-hidden">
          <div
            className={`h-full transition-all duration-1000 ${
              isPlayingAudio ? 'bg-amber-400 animate-pulse' : 'bg-gradient-to-r from-emerald-500 via-amber-500 to-amber-400'
            }`}
            style={{ width: `${config.enabled && !isInQuietHours ? progressPercent : 0}%` }}
          />
        </div>

        {/* Quick action buttons */}
        <div className="flex items-center justify-between gap-2 pt-2">
          <button
            onClick={handleTestVoice}
            disabled={isPlayingAudio}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl font-bold text-xs sm:text-sm transition shadow-md ${
              isPlayingAudio
                ? 'bg-amber-400 text-emerald-950 animate-pulse cursor-wait'
                : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-emerald-950'
            }`}
          >
            <Play className="w-4 h-4 fill-current" />
            <span>{isPlayingAudio ? 'جاري نطق الذكر الشامل الآن...' : 'استمع للذكر الشامل الآن بصوت الشيخ مشاري'}</span>
          </button>
        </div>
      </div>

      {/* Slide-out Settings Drawer */}
      {showSettings && (
        <div className="relative z-10 mt-4 p-4 rounded-2xl bg-emerald-950/90 border border-emerald-800/80 space-y-4 text-xs text-slate-200">
          <div className="flex items-center justify-between pb-2 border-b border-emerald-800">
            <span className="font-bold text-amber-300 flex items-center gap-1.5 text-sm">
              <Sliders className="w-4 h-4" />
              <span>إعدادات الأذكار الصوتية التلقائية:</span>
            </span>
            <button
              onClick={() => setShowSettings(false)}
              className="text-xs text-slate-400 hover:text-white"
            >
              إغلاق
            </button>
          </div>

          {/* Time Interval Selector */}
          <div className="space-y-1.5">
            <span className="text-amber-200 font-bold block">الفترة الزمنية بين كل نطق:</span>
            <div className="grid grid-cols-4 gap-2">
              {[3, 5, 10, 15].map(mins => (
                <button
                  key={mins}
                  onClick={() => handleIntervalChange(mins)}
                  className={`py-2 rounded-xl text-center font-bold border transition ${
                    config.intervalMinutes === mins
                      ? 'bg-amber-500 text-emerald-950 border-amber-400 shadow-md'
                      : 'bg-emerald-900/60 text-slate-300 border-emerald-800 hover:bg-emerald-800'
                  }`}
                >
                  {mins} دقائق {mins === 5 && '⭐️'}
                </button>
              ))}
            </div>
          </div>

          {/* Voice Style Selector */}
          <div className="space-y-1.5">
            <label className="text-amber-200 font-bold block">اختيار صوت الشيخ للتذكير بالأذكار:</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              <button
                onClick={() => salawatAudioService.updateConfig({ voiceStyle: 'abdulbasit' })}
                className={`p-2.5 rounded-xl border text-right font-bold transition flex flex-col gap-0.5 ${
                  config.voiceStyle === 'abdulbasit'
                    ? 'bg-amber-500 text-emerald-950 border-amber-400 shadow-md ring-2 ring-amber-300'
                    : 'bg-emerald-900/60 text-slate-300 border-emerald-800 hover:bg-emerald-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>الشيخ عبد الباسط ⭐️</span>
                  {config.voiceStyle === 'abdulbasit' && (
                    <span className="text-[9px] bg-emerald-950 text-amber-300 px-1.5 py-0.2 rounded font-bold">مُفعّل</span>
                  )}
                </div>
                <span className="text-[10px] opacity-80 font-normal">صوت خاشع بمقام الرست وصدى المساجد</span>
              </button>

              <button
                onClick={() => salawatAudioService.updateConfig({ voiceStyle: 'mishary' })}
                className={`p-2.5 rounded-xl border text-right font-bold transition flex flex-col gap-0.5 ${
                  config.voiceStyle === 'mishary'
                    ? 'bg-amber-500 text-emerald-950 border-amber-400 shadow-md ring-2 ring-amber-300'
                    : 'bg-emerald-900/60 text-slate-300 border-emerald-800 hover:bg-emerald-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>الشيخ مشاري العفاسي</span>
                  {config.voiceStyle === 'mishary' && (
                    <span className="text-[9px] bg-emerald-950 text-amber-300 px-1.5 py-0.2 rounded font-bold">مُفعّل</span>
                  )}
                </div>
                <span className="text-[10px] opacity-80 font-normal">تسجيل صوتي مع صدى روحاني</span>
              </button>

              <button
                onClick={() => salawatAudioService.updateConfig({ voiceStyle: 'sheikh_reader' })}
                className={`p-2.5 rounded-xl border text-right font-bold transition flex flex-col gap-0.5 ${
                  config.voiceStyle === 'sheikh_reader'
                    ? 'bg-amber-500 text-emerald-950 border-amber-400 shadow-md ring-2 ring-amber-300'
                    : 'bg-emerald-900/60 text-slate-300 border-emerald-800 hover:bg-emerald-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>صوت الشيخ القارئ 🎙️</span>
                  {config.voiceStyle === 'sheikh_reader' && (
                    <span className="text-[9px] bg-emerald-950 text-amber-300 px-1.5 py-0.2 rounded font-bold">مُفعّل</span>
                  )}
                </div>
                <span className="text-[10px] opacity-80 font-normal">تلاوة خاشعة هادئة</span>
              </button>
            </div>
          </div>

          {/* Volume Slider */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-amber-200 font-bold">مستوى صوت النطق:</span>
              <span className="font-mono text-amber-300 font-bold">{Math.round(config.volume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="1.0"
              step="0.05"
              value={config.volume}
              onChange={e => handleVolumeChange(parseFloat(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer h-2 bg-emerald-900 rounded-lg"
            />
          </div>

          {/* Sleep / Quiet Hours */}
          <div className="p-3 rounded-xl bg-emerald-900/40 border border-emerald-800/70 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-amber-200 flex items-center gap-1.5">
                <Moon className="w-4 h-4 text-indigo-300" />
                <span>إيقاف الأذكار أثناء النوم (أوقات السكون):</span>
              </span>
              <button
                onClick={() => salawatAudioService.updateConfig({ quietHoursEnabled: !config.quietHoursEnabled })}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition border ${
                  config.quietHoursEnabled
                    ? 'bg-indigo-600 text-white border-indigo-500'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                {config.quietHoursEnabled ? 'مفعّل' : 'معطل'}
              </button>
            </div>

            {config.quietHoursEnabled && (
              <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
                <div>
                  <label className="text-[11px] text-emerald-300/80 block mb-1">وقت النوم (البدء):</label>
                  <input
                    type="time"
                    value={config.quietStart}
                    onChange={e => salawatAudioService.updateConfig({ quietStart: e.target.value })}
                    className="w-full bg-emerald-950 border border-emerald-800 rounded-xl px-2.5 py-1.5 text-white font-mono text-xs text-center"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-emerald-300/80 block mb-1">وقت الاستيقاظ (الانتهاء):</label>
                  <input
                    type="time"
                    value={config.quietEnd}
                    onChange={e => salawatAudioService.updateConfig({ quietEnd: e.target.value })}
                    className="w-full bg-emerald-950 border border-emerald-800 rounded-xl px-2.5 py-1.5 text-white font-mono text-xs text-center"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Notifications Permission */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-1.5 text-xs text-emerald-200">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>إشعارات الخلفية وتنبيهات القفل:</span>
            </div>
            {permissionStatus === 'granted' ? (
              <span className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>مفعلة</span>
              </span>
            ) : (
              <button
                onClick={handleRequestNotification}
                className="px-2.5 py-1 rounded-lg bg-amber-500 text-emerald-950 font-bold text-[11px]"
              >
                منح الصلاحية
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
