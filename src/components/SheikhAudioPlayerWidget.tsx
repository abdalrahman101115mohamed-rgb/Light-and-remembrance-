import React, { useEffect, useState } from 'react';
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  Square,
  SkipForward,
  SkipBack,
  Sliders,
  ChevronDown,
  ChevronUp,
  Sparkles,
  BookOpen
} from 'lucide-react';
import { sheikhVoiceService, NarrationQueueState, SheikhVoiceSettings } from '../utils/sheikhVoiceService';

export const SheikhAudioPlayerWidget: React.FC = () => {
  const [state, setState] = useState<NarrationQueueState>(sheikhVoiceService.getState());
  const [settings, setSettings] = useState<SheikhVoiceSettings>(sheikhVoiceService.getSettings());
  const [showSettings, setShowSettings] = useState<boolean>(false);

  useEffect(() => {
    const unsub = sheikhVoiceService.subscribe(newState => {
      setState(newState);
    });
    return unsub;
  }, []);

  if (!state.isActive) {
    return null;
  }

  const handleTogglePlay = () => {
    if (state.isPlaying) {
      sheikhVoiceService.pause();
    } else {
      sheikhVoiceService.resume();
    }
  };

  const handleStop = () => {
    sheikhVoiceService.stop();
  };

  const handleNext = () => {
    sheikhVoiceService.next();
  };

  const handlePrev = () => {
    sheikhVoiceService.previous();
  };

  const handleRateChange = (rate: number) => {
    const updated = { ...settings, rate };
    setSettings(updated);
    sheikhVoiceService.saveSettings({ rate });
  };

  const progressPercent =
    state.totalChunks > 0
      ? Math.round(((state.currentChunkIndex + 1) / state.totalChunks) * 100)
      : 0;

  return (
    <div className="fixed bottom-16 sm:bottom-4 left-3 right-3 sm:left-auto sm:right-4 sm:max-w-md z-40 animate-in fade-in slide-in-from-bottom duration-300">
      <div className="bg-emerald-950/95 border-2 border-amber-500/50 shadow-2xl backdrop-blur-xl rounded-2xl overflow-hidden text-slate-100 ring-1 ring-amber-400/20">
        {/* Progress Bar Top */}
        <div className="w-full bg-emerald-900/60 h-1.5">
          <div
            className="bg-gradient-to-r from-amber-500 to-amber-300 h-full transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="p-3.5 space-y-2.5">
          {/* Header Row */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-300 shrink-0">
                {state.isPlaying ? (
                  <span className="flex gap-0.5 items-end h-3.5">
                    <span className="w-1 bg-amber-400 rounded-full animate-bounce [animation-delay:-0.3s] h-3"></span>
                    <span className="w-1 bg-amber-400 rounded-full animate-bounce [animation-delay:-0.15s] h-2"></span>
                    <span className="w-1 bg-amber-400 rounded-full animate-bounce h-3.5"></span>
                  </span>
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </div>
              <div className="truncate">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.2 rounded font-bold">
                    صوت الشيخ
                  </span>
                  <span className="text-[11px] text-emerald-300 truncate font-semibold">
                    {state.sourceType === 'story' ? 'قراءة القصة' : 'قراءة الحديث'}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-white truncate max-w-[200px]">
                  {state.title}
                </h4>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-1.5 rounded-lg text-emerald-300 hover:text-amber-300 hover:bg-emerald-800/50 transition"
                title="إعدادات الصوت ونبرة الشيخ"
              >
                <Sliders className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleStop}
                className="p-1.5 rounded-lg text-rose-300 hover:text-rose-200 hover:bg-rose-950/50 transition"
                title="إيقاف نهائي"
              >
                <Square className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Current Snippet Preview */}
          <div className="bg-emerald-900/40 border border-emerald-800/40 rounded-xl p-2 text-[11px] text-emerald-100 line-clamp-2 leading-relaxed">
            {state.currentText || 'جاري القراءة...'}
          </div>

          {/* Controls Row */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-[10px] text-amber-300 font-semibold">
              الفقرة {state.currentChunkIndex + 1} من {state.totalChunks}
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                disabled={state.currentChunkIndex === 0}
                className="p-1.5 rounded-lg bg-emerald-900/60 hover:bg-emerald-800 text-amber-200 disabled:opacity-30 disabled:cursor-not-allowed transition"
                title="الفقرة السابقة"
              >
                <SkipBack className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={handleTogglePlay}
                className="w-8 h-8 rounded-full bg-amber-500 hover:bg-amber-400 text-emerald-950 flex items-center justify-center font-bold shadow-lg transition"
                title={state.isPlaying ? 'إيقاف مؤقت' : 'متابعة'}
              >
                {state.isPlaying ? (
                  <Pause className="w-4 h-4 fill-current" />
                ) : (
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                )}
              </button>

              <button
                onClick={handleNext}
                disabled={state.currentChunkIndex >= state.totalChunks - 1}
                className="p-1.5 rounded-lg bg-emerald-900/60 hover:bg-emerald-800 text-amber-200 disabled:opacity-30 disabled:cursor-not-allowed transition"
                title="الفقرة التالية"
              >
                <SkipForward className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Settings Drawer */}
          {showSettings && (
            <div className="pt-2 border-t border-emerald-800/60 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-amber-200">سرعة ترتيل الشيخ:</span>
                <div className="flex gap-1">
                  {[
                    { label: 'خاشع هادئ (0.75x)', val: 0.75 },
                    { label: 'معتدل (0.82x)', val: 0.82 },
                    { label: 'عادي (0.95x)', val: 0.95 },
                  ].map(speed => (
                    <button
                      key={speed.val}
                      onClick={() => handleRateChange(speed.val)}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold transition ${
                        Math.abs(settings.rate - speed.val) < 0.05
                          ? 'bg-amber-500 text-emerald-950'
                          : 'bg-emerald-900/60 text-emerald-200 hover:bg-emerald-800'
                      }`}
                    >
                      {speed.label.split(' ')[0]}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
