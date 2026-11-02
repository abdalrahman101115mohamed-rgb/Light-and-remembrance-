import React, { useState, useEffect } from 'react';
import {
  BellRing,
  Volume2,
  Play,
  Square,
  Sparkles,
  Clock,
  CheckCircle2,
  BookmarkCheck,
  Flame
} from 'lucide-react';
import { adhanService, AdhanState, MUEZZINS } from '../utils/adhanService';

export const AdhanSettingsWidget: React.FC = () => {
  const [state, setState] = useState<AdhanState>(adhanService.getState());

  useEffect(() => {
    const unsub = adhanService.subscribe(newState => {
      setState(newState);
    });
    return () => unsub();
  }, []);

  const { config, isPlaying, isIqamaPlaying, currentPrayer, nextIqamaTime, nextIqamaPrayer } = state;

  const handleToggleEnabled = () => {
    adhanService.updateConfig({ enabled: !config.enabled });
  };

  const handleToggleIqama = () => {
    adhanService.updateConfig({ iqamaEnabled: !config.iqamaEnabled });
  };

  const handleIqamaDelayChange = (delay: number) => {
    adhanService.updateConfig({ iqamaDelayMinutes: delay });
  };

  const handleMuezzinSelect = (id: string) => {
    adhanService.updateConfig({ selectedMuezzinId: id });
  };

  const handleVolumeChange = (vol: number) => {
    adhanService.updateConfig({ volume: vol });
  };

  const handlePrayerToggle = (prayerKey: 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha') => {
    adhanService.updateConfig({
      prayers: {
        ...config.prayers,
        [prayerKey]: !config.prayers[prayerKey],
      },
    });
  };

  const handleTestAdhan = () => {
    if (isPlaying) {
      adhanService.stopAdhan();
    } else {
      adhanService.testAdhanNow();
    }
  };

  const handleTestIqama = () => {
    if (isIqamaPlaying) {
      adhanService.stopIqama();
    } else {
      adhanService.testIqamaNow('الظهر (تجربة الإقامة)');
    }
  };

  const selectedMuezzin = MUEZZINS.find(m => m.id === config.selectedMuezzinId) || MUEZZINS[0];

  return (
    <div className="rounded-3xl bg-emerald-950/50 border border-emerald-800/50 p-5 sm:p-6 space-y-5 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-emerald-800/60">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-2xl ${
            isPlaying ? 'bg-amber-500 text-emerald-950 animate-bounce' : 'bg-amber-500/20 text-amber-300'
          }`}>
            <BellRing className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm sm:text-base text-amber-200 font-quran">
                الأذان التلقائي وإقامة الصلاة
              </h3>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                config.enabled ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'
              }`}>
                {config.enabled ? 'مفعل تلقائياً' : 'معطل'}
              </span>
            </div>
            <p className="text-xs text-emerald-300/80">
              يرفع الأذان عند دخول وقت الصلاة، وتُقام الصلاة آلياً بصوت الشيخ مشاري العفاسي
            </p>
          </div>
        </div>

        <button
          onClick={handleToggleEnabled}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition border ${
            config.enabled
              ? 'bg-amber-500 text-emerald-950 border-amber-400 shadow-md hover:bg-amber-400'
              : 'bg-emerald-900/40 text-slate-300 border-emerald-800 hover:bg-emerald-900'
          }`}
        >
          {config.enabled ? 'تعطيل الأذان' : 'تفعيل الأذان'}
        </button>
      </div>

      {/* Now Playing Banner if Adhan or Iqama is active */}
      {isPlaying && (
        <div className="p-3.5 rounded-2xl bg-amber-500/20 border border-amber-400/50 flex items-center justify-between gap-3 text-amber-200 text-xs animate-pulse">
          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-amber-400" />
            <span className="font-bold">يرفع الآن: أذان صلاة {currentPrayer}</span>
          </div>
          <button
            onClick={() => adhanService.stopAdhan()}
            className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-500 text-emerald-950 font-bold hover:bg-amber-400"
          >
            <Square className="w-3.5 h-3.5 fill-current" />
            <span>إيقاف الأذان</span>
          </button>
        </div>
      )}

      {isIqamaPlaying && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/25 border border-emerald-400/50 flex items-center justify-between gap-3 text-emerald-200 text-xs animate-pulse">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-emerald-400" />
            <span className="font-bold">تقام الصلاة الآن: «قد قامت الصلاة قد قامت الصلاة»</span>
          </div>
          <button
            onClick={() => adhanService.stopIqama()}
            className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-400 text-emerald-950 font-bold hover:bg-emerald-300"
          >
            <Square className="w-3.5 h-3.5 fill-current" />
            <span>إيقاف الإقامة</span>
          </button>
        </div>
      )}

      {/* Scheduled Iqama Banner */}
      {nextIqamaTime && !isIqamaPlaying && (
        <div className="p-3 rounded-2xl bg-emerald-900/50 border border-emerald-700/60 flex items-center justify-between gap-2 text-xs text-emerald-200">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-300" />
            <span>موعد إقامة صلاة {nextIqamaPrayer}: {new Date(nextIqamaTime).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
          <button
            onClick={() => adhanService.playIqama(nextIqamaPrayer || 'الصلاة')}
            className="px-2.5 py-1 rounded-xl bg-amber-500 text-emerald-950 font-bold text-[11px] hover:bg-amber-400"
          >
            أقم الصلاة الآن
          </button>
        </div>
      )}

      {/* Muezzin Selection */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>صوت المؤذن (أوفلاين 100% بدون إنترنت):</span>
          </label>
          <span className="text-[11px] text-emerald-300/70">{selectedMuezzin.place}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {MUEZZINS.map(m => {
            const isSelected = m.id === config.selectedMuezzinId;
            return (
              <button
                key={m.id}
                onClick={() => handleMuezzinSelect(m.id)}
                className={`p-3 rounded-2xl border text-right transition flex items-start gap-2.5 ${
                  isSelected
                    ? 'bg-emerald-800/80 border-amber-400 text-amber-200 shadow-md ring-1 ring-amber-400/30'
                    : 'bg-emerald-950/40 border-emerald-800/40 text-emerald-200/80 hover:bg-emerald-900/40'
                }`}
              >
                <div className={`w-4 h-4 rounded-full border mt-0.5 flex items-center justify-center shrink-0 ${
                  isSelected ? 'border-amber-400 bg-amber-500' : 'border-emerald-700'
                }`}>
                  {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-emerald-950" />}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-bold text-xs sm:text-sm text-white">{m.name}</h4>
                    {m.id === 'mishary' && (
                      <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded-md font-bold">
                        موصى به
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-emerald-300/70 mt-0.5">{m.description}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Iqama Configuration Section */}
      <div className="p-4 rounded-2xl bg-emerald-950/70 border border-emerald-800/60 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookmarkCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-xs sm:text-sm font-bold text-emerald-200">
              إقامة الصلاة التلقائية (قد قامت الصلاة)
            </span>
          </div>
          <button
            onClick={handleToggleIqama}
            className={`px-2.5 py-1 rounded-xl text-xs font-bold transition border ${
              config.iqamaEnabled
                ? 'bg-emerald-600 text-white border-emerald-500'
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
          >
            {config.iqamaEnabled ? 'مفعلة آلياً' : 'معطلة'}
          </button>
        </div>

        <p className="text-xs text-emerald-300/70">
          تُقام الصلاة تلقائياً بعد رفع الأذان بمدة محددة لتذكيرك بالصلاة في وقتها وسماع «قد قامت الصلاة».
        </p>

        {config.iqamaEnabled && (
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-emerald-900/80">
            <span className="text-xs text-amber-300 font-semibold">المدة الفاصلة بين الأذان والإقامة:</span>
            <div className="flex items-center gap-1">
              {[5, 10, 15, 20, 25].map(min => (
                <button
                  key={min}
                  onClick={() => handleIqamaDelayChange(min)}
                  className={`px-2 py-1 rounded-lg text-xs font-mono font-bold transition ${
                    config.iqamaDelayMinutes === min
                      ? 'bg-amber-500 text-emerald-950 shadow'
                      : 'bg-emerald-900/60 text-slate-300 hover:bg-emerald-800'
                  }`}
                >
                  {min} د
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Test Buttons & Volume */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
        {/* Test Adhan */}
        <button
          onClick={handleTestAdhan}
          className={`flex items-center justify-center gap-1.5 p-3 rounded-2xl font-bold text-xs transition shadow-md ${
            isPlaying
              ? 'bg-rose-600 text-white hover:bg-rose-500'
              : 'bg-gradient-to-r from-amber-500 to-amber-600 text-emerald-950 hover:from-amber-400'
          }`}
        >
          {isPlaying ? (
            <>
              <Square className="w-4 h-4 fill-current" />
              <span>إيقاف الأذان</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              <span>تجربة الأذان الآن</span>
            </>
          )}
        </button>

        {/* Test Iqama */}
        <button
          onClick={handleTestIqama}
          className={`flex items-center justify-center gap-1.5 p-3 rounded-2xl font-bold text-xs transition border ${
            isIqamaPlaying
              ? 'bg-rose-600 text-white border-rose-500'
              : 'bg-emerald-900/70 text-emerald-200 border-emerald-700/60 hover:bg-emerald-800'
          }`}
        >
          {isIqamaPlaying ? (
            <>
              <Square className="w-4 h-4 fill-current" />
              <span>إيقاف الإقامة</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current text-amber-400" />
              <span>تجربة الإقامة الآن</span>
            </>
          )}
        </button>

        {/* Volume Slider */}
        <div className="bg-emerald-950/60 p-2.5 rounded-2xl border border-emerald-800/50 flex flex-col justify-center space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-amber-300 font-semibold flex items-center gap-1">
              <Volume2 className="w-3.5 h-3.5" />
              <span>مستوى الصوت:</span>
            </span>
            <span className="font-mono text-amber-200 font-bold">{Math.round(config.volume * 100)}%</span>
          </div>
          <input
            type="range"
            min="0.1"
            max="1.0"
            step="0.05"
            value={config.volume}
            onChange={e => handleVolumeChange(parseFloat(e.target.value))}
            className="w-full accent-amber-500 cursor-pointer h-1.5"
          />
        </div>
      </div>

      {/* Individual Prayer Toggles */}
      <div className="pt-2 border-t border-emerald-800/60">
        <span className="text-xs font-bold text-amber-300 block mb-2">
          تفعيل الأذان لكل صلاة على حدة:
        </span>
        <div className="grid grid-cols-5 gap-1.5 text-center text-xs">
          {[
            { key: 'fajr', label: 'الفجر' },
            { key: 'dhuhr', label: 'الظهر' },
            { key: 'asr', label: 'العصر' },
            { key: 'maghrib', label: 'المغرب' },
            { key: 'isha', label: 'العشاء' },
          ].map(p => {
            const isEnabled = config.prayers[p.key as keyof typeof config.prayers];
            return (
              <button
                key={p.key}
                onClick={() => handlePrayerToggle(p.key as any)}
                className={`py-2 px-1 rounded-xl transition border font-semibold text-xs ${
                  isEnabled
                    ? 'bg-emerald-800/90 text-amber-300 border-amber-500/40 shadow-sm'
                    : 'bg-emerald-950/60 text-slate-500 border-emerald-900'
                }`}
              >
                <span className="block mb-0.5">{p.label}</span>
                <span className="text-[10px] opacity-75">{isEnabled ? 'مفعل' : 'صامت'}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
