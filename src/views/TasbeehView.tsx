import React, { useState, useEffect } from 'react';
import { RotateCcw, Volume2, VolumeX, Smartphone, Plus, Check, Award, History, Sparkles } from 'lucide-react';
import { playTasbeehClick, playCelebrationSound, triggerHaptic } from '../utils/soundEffects';

interface DhikrPreset {
  id: string;
  text: string;
  target: number;
}

const DEFAULT_PRESETS: DhikrPreset[] = [
  { id: 'subhanallah', text: 'سُبْحَانَ اللَّهِ', target: 33 },
  { id: 'alhamdulillah', text: 'الْحَمْدُ لِلَّهِ', target: 33 },
  { id: 'allahuakbar', text: 'اللَّهُ أَكْبَرُ', target: 34 },
  { id: 'lailahaillallah', text: 'لَا إِلَهَ إِلَّا اللَّهُ', target: 100 },
  { id: 'astaghfirullah', text: 'أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ', target: 100 },
  { id: 'salawat', text: 'اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَى نَبِيِّنَا مُحَمَّدٍ', target: 100 },
  { id: 'hawqala', text: 'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ', target: 100 },
  { id: 'subhan_bihamdihi', text: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ ، سُبْحَانَ اللَّهِ الْعَظِيمِ', target: 100 },
  { id: 'hasbiyallah', text: 'حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ', target: 100 },
];

export const TasbeehView: React.FC = () => {
  const [selectedDhikr, setSelectedDhikr] = useState<DhikrPreset>(DEFAULT_PRESETS[0]);
  const [count, setCount] = useState<number>(0);
  const [roundsCompleted, setRoundsCompleted] = useState<number>(0);
  const [totalLifetimeCount, setTotalLifetimeCount] = useState<number>(0);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [vibrateEnabled, setVibrateEnabled] = useState<boolean>(true);
  const [showAddCustom, setShowAddCustom] = useState<boolean>(false);
  const [customText, setCustomText] = useState<string>('');
  const [customTarget, setCustomTarget] = useState<number>(33);
  const [presets, setPresets] = useState<DhikrPreset[]>(DEFAULT_PRESETS);
  const [isPressing, setIsPressing] = useState<boolean>(false);

  // Load from localStorage
  useEffect(() => {
    try {
      const savedCount = localStorage.getItem('tasbeeh_count');
      if (savedCount) setCount(parseInt(savedCount, 10));

      const savedTotal = localStorage.getItem('tasbeeh_total');
      if (savedTotal) setTotalLifetimeCount(parseInt(savedTotal, 10));

      const savedRounds = localStorage.getItem('tasbeeh_rounds');
      if (savedRounds) setRoundsCompleted(parseInt(savedRounds, 10));

      const savedSound = localStorage.getItem('tasbeeh_sound');
      if (savedSound !== null) setSoundEnabled(savedSound === 'true');

      const savedVibrate = localStorage.getItem('tasbeeh_vibrate');
      if (savedVibrate !== null) setVibrateEnabled(savedVibrate === 'true');

      const savedCustom = localStorage.getItem('tasbeeh_custom_presets');
      if (savedCustom) {
        setPresets([...DEFAULT_PRESETS, ...JSON.parse(savedCustom)]);
      }
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }, []);

  // Save changes
  const saveState = (newCount: number, newTotal: number, newRounds: number) => {
    try {
      localStorage.setItem('tasbeeh_count', newCount.toString());
      localStorage.setItem('tasbeeh_total', newTotal.toString());
      localStorage.setItem('tasbeeh_rounds', newRounds.toString());
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
  };

  const handleIncrement = () => {
    if (soundEnabled) playTasbeehClick();
    if (vibrateEnabled) triggerHaptic(35);

    const nextCount = count + 1;
    const nextTotal = totalLifetimeCount + 1;

    if (selectedDhikr.target > 0 && nextCount >= selectedDhikr.target) {
      // Completed a round!
      if (vibrateEnabled) triggerHaptic(120);
      playCelebrationSound();
      const nextRounds = roundsCompleted + 1;
      setCount(0);
      setRoundsCompleted(nextRounds);
      setTotalLifetimeCount(nextTotal);
      saveState(0, nextTotal, nextRounds);
    } else {
      setCount(nextCount);
      setTotalLifetimeCount(nextTotal);
      saveState(nextCount, nextTotal, roundsCompleted);
    }
  };

  const handleReset = () => {
    if (window.confirm('هل تريد إعادة تصفير العداد الحالي؟')) {
      setCount(0);
      saveState(0, totalLifetimeCount, roundsCompleted);
    }
  };

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customText.trim()) return;
    const newPreset: DhikrPreset = {
      id: `custom_${Date.now()}`,
      text: customText.trim(),
      target: Number(customTarget) || 33,
    };
    const updated = [...presets, newPreset];
    setPresets(updated);
    setSelectedDhikr(newPreset);
    setCount(0);
    try {
      const customOnly = updated.filter(p => !DEFAULT_PRESETS.some(dp => dp.id === p.id));
      localStorage.setItem('tasbeeh_custom_presets', JSON.stringify(customOnly));
    } catch (err) {
      console.warn('Could not save custom preset:', err);
    }
    setCustomText('');
    setShowAddCustom(false);
  };

  const progressPercent = selectedDhikr.target > 0
    ? Math.min(100, (count / selectedDhikr.target) * 100)
    : 0;

  return (
    <div className="max-w-xl mx-auto px-4 py-4 space-y-6">
      {/* Top Controls Bar */}
      <div className="flex items-center justify-between bg-emerald-900/40 border border-emerald-800/50 rounded-2xl p-3 shadow-lg backdrop-blur-md">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const val = !soundEnabled;
              setSoundEnabled(val);
              localStorage.setItem('tasbeeh_sound', val.toString());
            }}
            className={`p-2 rounded-xl transition ${
              soundEnabled ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-950/60 text-emerald-400/50'
            }`}
            title={soundEnabled ? 'كتم الصوت' : 'تشغيل الصوت'}
          >
            {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>

          <button
            onClick={() => {
              const val = !vibrateEnabled;
              setVibrateEnabled(val);
              localStorage.setItem('tasbeeh_vibrate', val.toString());
            }}
            className={`p-2 rounded-xl transition ${
              vibrateEnabled ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-950/60 text-emerald-400/50'
            }`}
            title={vibrateEnabled ? 'إيقاف الاهتزاز' : 'تفعيل الاهتزاز'}
          >
            <Smartphone className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[11px] text-emerald-300/80 block">إجمالي التسبيح</span>
            <span className="font-mono font-bold text-amber-300 text-sm">
              {totalLifetimeCount.toLocaleString('ar-EG')}
            </span>
          </div>

          <button
            onClick={handleReset}
            className="p-2 rounded-xl bg-rose-950/40 text-rose-300 hover:bg-rose-900/50 border border-rose-800/40 transition"
            title="إعادة التصفير"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Selected Dhikr Title & Target */}
      <div className="text-center py-2 px-4 rounded-3xl bg-gradient-to-b from-emerald-900/50 to-emerald-950/60 border border-amber-500/20 shadow-xl backdrop-blur-sm">
        <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-300 border border-amber-500/20 mb-2">
          الهدف: {selectedDhikr.target} تسبيحة • الدورات: {roundsCompleted}
        </span>
        <h2 className="text-xl sm:text-2xl font-bold font-quran text-amber-100 min-h-[48px] flex items-center justify-center">
          {selectedDhikr.text}
        </h2>
      </div>

      {/* Big Ergonomic Circular Counter Button */}
      <div className="relative flex items-center justify-center py-4">
        {/* Outer Glow Ring */}
        <div className="w-72 h-72 sm:w-80 sm:h-80 rounded-full p-2 bg-gradient-to-tr from-amber-500/30 via-emerald-600/20 to-teal-400/30 shadow-2xl flex items-center justify-center">
          {/* Progress Circular Track */}
          <div
            className="w-full h-full rounded-full p-3 flex items-center justify-center relative"
            style={{
              background: `conic-gradient(#f59e0b ${progressPercent * 3.6}deg, #064e3b 0deg)`,
            }}
          >
            {/* The Actual Touch Button */}
            <button
              onClick={handleIncrement}
              onMouseDown={() => setIsPressing(true)}
              onMouseUp={() => setIsPressing(false)}
              onTouchStart={() => setIsPressing(true)}
              onTouchEnd={() => setIsPressing(false)}
              className={`w-full h-full rounded-full bg-gradient-to-b from-emerald-900 to-emerald-950 border-4 border-amber-500/40 shadow-inner flex flex-col items-center justify-center select-none transition-transform duration-75 active:scale-95 focus:outline-none ${
                isPressing ? 'scale-95 brightness-110 shadow-amber-500/20' : ''
              }`}
            >
              <Sparkles className="w-6 h-6 text-amber-400 mb-1 opacity-70 animate-pulse" />
              <span className="text-6xl sm:text-7xl font-bold font-mono tracking-tight text-white drop-shadow-md">
                {count}
              </span>
              <span className="text-xs text-amber-200/80 font-medium mt-2 bg-emerald-800/60 px-3 py-1 rounded-full">
                اضغط للتسبيح
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Presets Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-amber-200">اختر الذكر المفضل:</h3>
          <button
            onClick={() => setShowAddCustom(true)}
            className="flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 font-medium"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>إضافة ذكر مخصص</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-56 overflow-y-auto pr-1">
          {presets.map(item => {
            const isSelected = selectedDhikr.id === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setSelectedDhikr(item);
                  setCount(0);
                }}
                className={`flex items-center justify-between p-3 rounded-2xl border text-right transition ${
                  isSelected
                    ? 'bg-amber-500/20 border-amber-400 text-amber-100 shadow-md'
                    : 'bg-emerald-900/30 border-emerald-800/40 text-emerald-100/90 hover:bg-emerald-900/50'
                }`}
              >
                <div className="flex-1">
                  <p className="font-semibold text-xs sm:text-sm font-quran">{item.text}</p>
                  <span className="text-[11px] text-amber-300/70">الهدف: {item.target}</span>
                </div>
                {isSelected && <Check className="w-4 h-4 text-amber-400 shrink-0 mr-2" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Custom Dhikr Modal */}
      {showAddCustom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-3xl bg-emerald-950 border border-amber-500/30 p-6 text-white shadow-2xl">
            <h3 className="text-lg font-bold text-amber-300 mb-4">إضافة ذكر جديد للمسبحة</h3>
            <form onSubmit={handleAddCustom} className="space-y-4">
              <div>
                <label className="block text-xs text-emerald-200/80 mb-1">نص الذكر أو التسبيح:</label>
                <input
                  type="text"
                  required
                  value={customText}
                  onChange={e => setCustomText(e.target.value)}
                  placeholder="مثال: لا حول ولا قوة إلا بالله"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-emerald-900/50 border border-emerald-700/60 text-white placeholder-emerald-400/50 text-sm focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs text-emerald-200/80 mb-1">العدد المستهدف:</label>
                <select
                  value={customTarget}
                  onChange={e => setCustomTarget(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-emerald-900/50 border border-emerald-700/60 text-white text-sm focus:outline-none focus:border-amber-400"
                >
                  <option value={33}>33 تسبيحة</option>
                  <option value={100}>100 تسبيحة</option>
                  <option value={500}>500 تسبيحة</option>
                  <option value={1000}>1000 تسبيحة</option>
                  <option value={0}>مفتوح (بدون هدف)</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-emerald-950 font-bold hover:from-amber-400 text-sm transition"
                >
                  حفظ الذكر
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddCustom(false)}
                  className="px-4 py-2.5 rounded-xl bg-emerald-900/60 text-emerald-200 text-sm hover:bg-emerald-800 transition"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
