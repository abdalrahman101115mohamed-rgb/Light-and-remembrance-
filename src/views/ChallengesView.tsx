import React, { useState, useEffect } from 'react';
import { Award, Flame, CheckCircle2, Circle, Sparkles, Star, ChevronLeft, ChevronRight, Share2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { getRamadanDayChallenge, RamadanDayChallenge, DailyTask } from '../data/challengesData';
import { playCelebrationSound, triggerHaptic } from '../utils/soundEffects';

interface Props {
  currentRamadanDay: number;
}

export const ChallengesView: React.FC<Props> = ({ currentRamadanDay }) => {
  const [selectedDay, setSelectedDay] = useState<number>(currentRamadanDay || 1);
  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>({});

  // Load from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('ramadan_challenges_state');
      if (saved) setCompletedTasks(JSON.parse(saved));
    } catch (e) {
      console.warn('Storage read error:', e);
    }
  }, []);

  const challenge: RamadanDayChallenge = getRamadanDayChallenge(selectedDay);

  const toggleTask = (taskId: string) => {
    triggerHaptic(35);
    const updated = {
      ...completedTasks,
      [taskId]: !completedTasks[taskId],
    };
    setCompletedTasks(updated);

    try {
      localStorage.setItem('ramadan_challenges_state', JSON.stringify(updated));
    } catch (e) {
      console.warn(e);
    }

    // Check if all 4 tasks for this day are now complete
    const allDone = challenge.tasks.every(t => (t.id === taskId ? updated[taskId] : updated[t.id]));
    if (allDone) {
      playCelebrationSound();
      triggerHaptic(150);
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#fbbf24', '#10b981', '#6366f1'],
      });
    }
  };

  const dayCompletedCount = challenge.tasks.filter(t => completedTasks[t.id]).length;
  const dayPercent = (dayCompletedCount / challenge.tasks.length) * 100;

  // Calculate total completed tasks across month
  const totalTasksCompleted = Object.values(completedTasks).filter(Boolean).length;

  return (
    <div className="max-w-3xl mx-auto px-4 py-4 space-y-6">
      {/* Top Days Horizontal Carousel */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs sm:text-sm">
          <span className="font-bold text-amber-200">اختر يوم التحدي في رمضان:</span>
          <span className="text-emerald-300 font-mono">اليوم {selectedDay} من 30</span>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {Array.from({ length: 30 }, (_, i) => i + 1).map(day => {
            const isSelected = selectedDay === day;
            const isToday = currentRamadanDay === day;
            const dayCh = getRamadanDayChallenge(day);
            const isAllFinished = dayCh.tasks.every(t => completedTasks[t.id]);

            return (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`flex flex-col items-center justify-center min-w-[54px] py-2.5 rounded-2xl border transition shrink-0 relative ${
                  isSelected
                    ? 'bg-amber-500 text-emerald-950 font-bold border-amber-400 shadow-lg scale-105'
                    : isToday
                    ? 'bg-emerald-800/80 text-amber-300 border-amber-400/80 font-bold'
                    : isAllFinished
                    ? 'bg-emerald-900/60 text-emerald-200 border-emerald-500/60'
                    : 'bg-emerald-950/50 text-emerald-300/70 border-emerald-800/40 hover:bg-emerald-900/40'
                }`}
              >
                <span className="text-[10px] opacity-80">يوم</span>
                <span className="text-base font-mono font-bold">{day}</span>
                {isAllFinished && (
                  <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-amber-400 text-emerald-950 rounded-full flex items-center justify-center text-[9px]">
                    ★
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Challenge Card */}
      <div className="rounded-3xl bg-gradient-to-b from-emerald-900/40 via-emerald-950/50 to-emerald-950/80 border border-amber-500/30 p-5 sm:p-7 shadow-2xl backdrop-blur-md space-y-6">
        {/* Header Theme */}
        <div className="space-y-3 pb-4 border-b border-emerald-800/60">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/20">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>تحديات اليوم {selectedDay} من رمضان</span>
            </span>

            <div className="flex items-center gap-1.5 text-xs text-amber-300 font-bold">
              <Flame className="w-4 h-4 text-orange-400" />
              <span>إنجاز اليوم: {dayCompletedCount} / 4</span>
            </div>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-white font-quran">
            {challenge.theme}
          </h2>

          {/* Motivational Hadith */}
          <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-800/50 space-y-1.5">
            <p className="font-quran text-base sm:text-lg text-amber-100 leading-relaxed">
              «{challenge.hadithOrAyah}»
            </p>
            <p className="text-[11px] text-emerald-300/60 text-left font-sans">
              {challenge.hadithSource}
            </p>
          </div>
        </div>

        {/* 4 Daily Tasks Checklist */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-amber-200">المهام الروحية لليوم:</h3>

          <div className="grid grid-cols-1 gap-3">
            {challenge.tasks.map(task => {
              const isDone = !!completedTasks[task.id];
              return (
                <button
                  key={task.id}
                  onClick={() => toggleTask(task.id)}
                  className={`flex items-center justify-between p-4 rounded-2xl border text-right transition transform active:scale-98 ${
                    isDone
                      ? 'bg-emerald-900/60 border-emerald-400/80 text-emerald-100 shadow-md'
                      : 'bg-emerald-950/40 border-emerald-800/40 text-slate-200 hover:border-amber-500/40 hover:bg-emerald-900/30'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="shrink-0">
                      {isDone ? (
                        <CheckCircle2 className="w-6 h-6 text-amber-400" />
                      ) : (
                        <Circle className="w-6 h-6 text-emerald-600 hover:text-emerald-400" />
                      )}
                    </div>
                    <span className={`text-xs sm:text-sm font-semibold ${isDone ? 'line-through text-emerald-200/80' : 'text-white'}`}>
                      {task.title}
                    </span>
                  </div>

                  <span className="text-[11px] font-mono text-amber-300/80 px-2.5 py-1 rounded-xl bg-emerald-950/60 border border-emerald-800/40">
                    +{task.points} نقطة
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Day Completion Banner */}
        {dayPercent === 100 && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/20 via-emerald-500/20 to-teal-500/20 border border-amber-400/40 text-center space-y-1 animate-pulse">
            <h4 className="font-bold text-amber-300 text-sm sm:text-base">
              🎉 أحسنت صنعاً! أتممت جميع مهام اليوم بنجاح!
            </h4>
            <p className="text-xs text-emerald-200/90">
              تقبل الله طاعاتكم وكتب لكم الأجر العظيم ومضاعفة الحسنات.
            </p>
          </div>
        )}
      </div>

      {/* Monthly Total Statistics Card */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-emerald-950/60 border border-emerald-800/40 text-xs sm:text-sm">
        <div className="flex items-center gap-2 text-emerald-200">
          <Star className="w-4 h-4 text-amber-400" />
          <span>مجموع المهام المنجزة خلال الشهر:</span>
        </div>
        <span className="font-bold text-amber-300 font-mono text-base">
          {totalTasksCompleted} مهمة
        </span>
      </div>
    </div>
  );
};
