import React, { useState, useEffect } from 'react';
import { BookOpen, CheckCircle, Circle, Award, Calendar, Sparkles, Check, ChevronRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { JUZ_LIST } from '../data/quranData';
import { playCelebrationSound, triggerHaptic } from '../utils/soundEffects';

export const KhatmaView: React.FC = () => {
  const [completedAjza, setCompletedAjza] = useState<number[]>([]);
  const [khatmaPlan, setKhatmaPlan] = useState<'1' | '2' | '3'>('1');
  const [startDate, setStartDate] = useState<string>('1 رمضان');

  // Load from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('khatma_completed_ajza');
      if (saved) setCompletedAjza(JSON.parse(saved));

      const savedPlan = localStorage.getItem('khatma_plan');
      if (savedPlan) setKhatmaPlan(savedPlan as '1' | '2' | '3');
    } catch (e) {
      console.warn('Storage read error:', e);
    }
  }, []);

  const toggleJuz = (juzNumber: number) => {
    triggerHaptic(40);
    let updated: number[];
    if (completedAjza.includes(juzNumber)) {
      updated = completedAjza.filter(n => n !== juzNumber);
    } else {
      updated = [...completedAjza, juzNumber];
      if (updated.length === 30) {
        // Completed entire Quran!
        playCelebrationSound();
        triggerHaptic(200);
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#f59e0b', '#10b981', '#3b82f6', '#ec4899', '#ffffff'],
        });
      }
    }
    setCompletedAjza(updated);
    try {
      localStorage.setItem('khatma_completed_ajza', JSON.stringify(updated));
    } catch (e) {
      console.warn(e);
    }
  };

  const handlePlanChange = (plan: '1' | '2' | '3') => {
    setKhatmaPlan(plan);
    try {
      localStorage.setItem('khatma_plan', plan);
    } catch (e) {
      console.warn(e);
    }
  };

  const progressPercent = Math.round((completedAjza.length / 30) * 100);

  return (
    <div className="max-w-3xl mx-auto px-4 py-4 space-y-6">
      {/* Top Banner & Plan Picker */}
      <div className="rounded-3xl bg-gradient-to-r from-emerald-900/70 via-teal-900/60 to-emerald-950/80 border border-amber-500/30 p-5 sm:p-6 shadow-xl backdrop-blur-md space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-amber-500/20 text-amber-300">
                <BookOpen className="w-5 h-5" />
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-amber-200">
                منظم ختمة القرآن الكريم في رمضان
              </h2>
            </div>
            <p className="text-xs text-emerald-200/80 mt-1">
              جدولك اليومي ومقدار القراءة لختم كتاب الله بتيسير وبركة
            </p>
          </div>

          {/* Plan Selector */}
          <div className="flex items-center gap-1.5 bg-emerald-950/70 p-1 rounded-2xl border border-emerald-800/60">
            <button
              onClick={() => handlePlanChange('1')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                khatmaPlan === '1'
                  ? 'bg-amber-500 text-emerald-950 shadow'
                  : 'text-emerald-300 hover:text-white'
              }`}
            >
              ختمة واحدة
            </button>
            <button
              onClick={() => handlePlanChange('2')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                khatmaPlan === '2'
                  ? 'bg-amber-500 text-emerald-950 shadow'
                  : 'text-emerald-300 hover:text-white'
              }`}
            >
              ختمتان
            </button>
            <button
              onClick={() => handlePlanChange('3')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                khatmaPlan === '3'
                  ? 'bg-amber-500 text-emerald-950 shadow'
                  : 'text-emerald-300 hover:text-white'
              }`}
            >
              3 ختمات
            </button>
          </div>
        </div>

        {/* Progress Bar & Stats */}
        <div className="space-y-2 pt-2 border-t border-emerald-800/50">
          <div className="flex items-center justify-between text-xs sm:text-sm">
            <span className="text-emerald-200">
              تم إتمام: <strong className="text-amber-300 font-mono text-base">{completedAjza.length}</strong> من 30 جزءاً
            </span>
            <span className="text-amber-300 font-mono font-bold text-base">{progressPercent}%</span>
          </div>

          <div className="w-full h-3 rounded-full bg-emerald-950/90 overflow-hidden border border-emerald-800/60">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full transition-all duration-500 shadow-md"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-emerald-300/70 pt-1">
            <span>المتبقي: {30 - completedAjza.length} جزءاً</span>
            <span>{completedAjza.length === 30 ? '🎉 مبارك لك إتمام ختمة القرآن كاملة!' : 'استمر في وردك اليومي ونيل الأجر'}</span>
          </div>
        </div>
      </div>

      {/* Practical Daily Schedule Card */}
      <div className="rounded-2xl bg-emerald-950/60 border border-emerald-800/40 p-4 space-y-3">
        <h3 className="text-xs sm:text-sm font-bold text-amber-300 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>جدول توزيع القراءة السهل بعد الصلوات الخمس:</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
          <div className="p-2 rounded-xl bg-emerald-900/40 border border-emerald-800/30">
            <span className="text-amber-300 font-bold block">الفجر</span>
            <span className="text-emerald-100/80">{khatmaPlan === '1' ? '4 صفحات' : khatmaPlan === '2' ? '8 صفحات' : '12 صفحة'}</span>
          </div>
          <div className="p-2 rounded-xl bg-emerald-900/40 border border-emerald-800/30">
            <span className="text-amber-300 font-bold block">الظهر</span>
            <span className="text-emerald-100/80">{khatmaPlan === '1' ? '4 صفحات' : khatmaPlan === '2' ? '8 صفحات' : '12 صفحة'}</span>
          </div>
          <div className="p-2 rounded-xl bg-emerald-900/40 border border-emerald-800/30">
            <span className="text-amber-300 font-bold block">العصر</span>
            <span className="text-emerald-100/80">{khatmaPlan === '1' ? '4 صفحات' : khatmaPlan === '2' ? '8 صفحات' : '12 صفحة'}</span>
          </div>
          <div className="p-2 rounded-xl bg-emerald-900/40 border border-emerald-800/30">
            <span className="text-amber-300 font-bold block">المغرب</span>
            <span className="text-emerald-100/80">{khatmaPlan === '1' ? '4 صفحات' : khatmaPlan === '2' ? '8 صفحات' : '12 صفحة'}</span>
          </div>
          <div className="col-span-2 sm:col-span-1 p-2 rounded-xl bg-emerald-900/40 border border-emerald-800/30">
            <span className="text-amber-300 font-bold block">العشاء</span>
            <span className="text-emerald-100/80">{khatmaPlan === '1' ? '4 صفحات' : khatmaPlan === '2' ? '8 صفحات' : '12 صفحة'}</span>
          </div>
        </div>

        <p className="text-[11px] text-emerald-300/70 text-center">
          {khatmaPlan === '1' && 'بمعدل 4 صفحات فقط بعد كل صلاة = 20 صفحة (جزء كامل يومياً) وتختم القرآن بيسر في 30 يوماً!'}
          {khatmaPlan === '2' && 'بمعدل 8 صفحات بعد كل صلاة = 40 صفحة (جزءان يومياً) وتختم القرآن مرتين في رمضان!'}
          {khatmaPlan === '3' && 'بمعدل 12 صفحة بعد كل صلاة = 60 صفحة (3 أجزاء يومياً) وتختم القرآن 3 مرات في رمضان!'}
        </p>
      </div>

      {/* 30 Ajza Checklist Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-amber-200">سجل إتمام الأجزاء الثلاثين:</h3>
          <span className="text-xs text-emerald-300/70">اضغط على الجزء لتحديده كمكتمل</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {JUZ_LIST.map(juz => {
            const isDone = completedAjza.includes(juz.index);
            return (
              <button
                key={juz.index}
                onClick={() => toggleJuz(juz.index)}
                className={`flex items-center justify-between p-3.5 rounded-2xl border text-right transition ${
                  isDone
                    ? 'bg-emerald-900/60 border-emerald-400 text-emerald-100 shadow-md'
                    : 'bg-emerald-950/40 border-emerald-800/40 text-emerald-300/70 hover:bg-emerald-900/30'
                }`}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className={`text-xs font-bold ${isDone ? 'text-amber-300' : 'text-slate-300'}`}>
                      الجزء {juz.index}
                    </span>
                  </div>
                  <span className="text-[10px] text-emerald-400/60 block truncate mt-0.5 font-quran">
                    {juz.startSurah}
                  </span>
                </div>

                <div className="shrink-0 mr-2">
                  {isDone ? (
                    <CheckCircle className="w-5 h-5 text-amber-400" />
                  ) : (
                    <Circle className="w-5 h-5 text-emerald-700" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
