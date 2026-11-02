import React, { useState, useEffect } from 'react';
import {
  Sun,
  Moon,
  Utensils,
  Sparkles,
  Bed,
  Sunrise,
  BookOpen,
  CheckCircle2,
  RotateCcw,
  Volume2,
  VolumeX,
  Share2,
  Copy,
  Check,
  Smartphone
} from 'lucide-react';
import { ALL_AZKAR, AZKAR_CATEGORIES, DhikrItem, AzkarCategoryMeta } from '../data/azkarData';
import { playTasbeehClick, playCelebrationSound, triggerHaptic } from '../utils/soundEffects';

export const AzkarView: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<DhikrItem['category']>('iftar_suhoor');
  const [progressMap, setProgressMap] = useState<Record<string, number>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [speechActiveId, setSpeechActiveId] = useState<string | null>(null);

  // Load progress from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('azkar_progress_map');
      if (saved) {
        setProgressMap(JSON.parse(saved));
      }
    } catch (e) {
      console.warn('Storage read error:', e);
    }
  }, []);

  const handleIncrement = (item: DhikrItem) => {
    const current = progressMap[item.id] || 0;
    if (current >= item.count) return;

    playTasbeehClick();
    triggerHaptic(30);

    const next = current + 1;
    const updated = { ...progressMap, [item.id]: next };
    setProgressMap(updated);

    if (next >= item.count) {
      triggerHaptic(100);
      playCelebrationSound();
    }

    try {
      localStorage.setItem('azkar_progress_map', JSON.stringify(updated));
    } catch (e) {
      console.warn(e);
    }
  };

  const handleResetCategory = () => {
    if (window.confirm('هل تريد إعادة تصفير عداد هذه المجموعة؟')) {
      const filtered = ALL_AZKAR.filter(a => a.category === selectedCategory);
      const updated = { ...progressMap };
      filtered.forEach(f => {
        updated[f.id] = 0;
      });
      setProgressMap(updated);
      try {
        localStorage.setItem('azkar_progress_map', JSON.stringify(updated));
      } catch (e) {
        console.warn(e);
      }
    }
  };

  const handleCopy = (item: DhikrItem) => {
    const textToCopy = `${item.text}\n\n(تطبيق رمضان كريم)`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleShare = async (item: DhikrItem) => {
    const textToShare = `${item.text}\n\n${item.virtue || ''}\n(تطبيق رمضان كريم)`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'ذكر ودعاء من تطبيق رمضان كريم',
          text: textToShare,
        });
      } catch {
        // User cancelled share
      }
    } else {
      handleCopy(item);
    }
  };

  // Text-To-Speech Arabic engine
  const handleToggleSpeech = (item: DhikrItem) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      alert('ميزة التلاوة الصوتية غير مدعومة في هذا المتصفح.');
      return;
    }

    if (speechActiveId === item.id) {
      window.speechSynthesis.cancel();
      setSpeechActiveId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(item.text);
    utterance.lang = 'ar-SA';
    utterance.rate = 0.85; // Pleasant calm rate

    utterance.onend = () => setSpeechActiveId(null);
    utterance.onerror = () => setSpeechActiveId(null);

    setSpeechActiveId(item.id);
    window.speechSynthesis.speak(utterance);
  };

  const getCategoryIcon = (category: DhikrItem['category']) => {
    switch (category) {
      case 'morning': return <Sun className="w-5 h-5 text-amber-400" />;
      case 'evening': return <Moon className="w-5 h-5 text-indigo-300" />;
      case 'iftar_suhoor': return <Utensils className="w-5 h-5 text-emerald-400" />;
      case 'ramadan': return <Sparkles className="w-5 h-5 text-amber-300" />;
      case 'sleep': return <Bed className="w-5 h-5 text-blue-400" />;
      case 'wake': return <Sunrise className="w-5 h-5 text-sky-400" />;
      case 'quranic': return <BookOpen className="w-5 h-5 text-green-400" />;
    }
  };

  const currentAzkarList = ALL_AZKAR.filter(a => a.category === selectedCategory);
  const completedCount = currentAzkarList.filter(a => (progressMap[a.id] || 0) >= a.count).length;

  return (
    <div className="max-w-3xl mx-auto px-4 py-4 space-y-6">
      {/* Category Pills Slider */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {AZKAR_CATEGORIES.map(cat => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                if (speechActiveId) {
                  window.speechSynthesis?.cancel();
                  setSpeechActiveId(null);
                }
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl whitespace-nowrap text-xs sm:text-sm font-bold transition shrink-0 ${
                isSelected
                  ? 'bg-amber-500 text-emerald-950 shadow-lg scale-102'
                  : 'bg-emerald-900/40 text-emerald-100 hover:bg-emerald-900/70 border border-emerald-800/40'
              }`}
            >
              {getCategoryIcon(cat.id)}
              <span>{cat.title}</span>
            </button>
          );
        })}
      </div>

      {/* Category Header Progress Card */}
      <div className="flex items-center justify-between p-4 rounded-3xl bg-gradient-to-r from-emerald-900/60 to-emerald-950/80 border border-amber-500/30 shadow-xl backdrop-blur-md">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-amber-200">
            {AZKAR_CATEGORIES.find(c => c.id === selectedCategory)?.title}
          </h2>
          <p className="text-xs text-emerald-300/80 mt-0.5">
            تم إتمام {completedCount} من {currentAzkarList.length} أذكار
          </p>
        </div>

        <button
          onClick={handleResetCategory}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/60 hover:bg-emerald-800/60 text-emerald-200 text-xs border border-emerald-800/50 transition"
          title="إعادة التصفير"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>تصفير</span>
        </button>
      </div>

      {/* Azkar List */}
      <div className="space-y-4">
        {currentAzkarList.map(item => {
          const currentCount = progressMap[item.id] || 0;
          const isCompleted = currentCount >= item.count;
          const isSpeaking = speechActiveId === item.id;

          return (
            <div
              key={item.id}
              className={`rounded-3xl border transition-all duration-200 overflow-hidden shadow-lg ${
                isCompleted
                  ? 'bg-emerald-950/80 border-emerald-500/60'
                  : 'bg-emerald-900/30 border-emerald-800/50 hover:border-amber-500/40'
              }`}
            >
              <div className="p-5 sm:p-6 space-y-4">
                {/* Dhikr Arabic Text */}
                <p className="font-quran text-lg sm:text-xl text-slate-100 leading-relaxed text-justify">
                  {item.text}
                </p>

                {/* Virtue and Reference */}
                {(item.virtue || item.reference) && (
                  <div className="bg-emerald-950/60 rounded-2xl p-3 border border-emerald-800/40 text-xs space-y-1">
                    {item.virtue && (
                      <p className="text-amber-300/90 font-medium">
                        ✦ الفضل: {item.virtue}
                      </p>
                    )}
                    {item.reference && (
                      <p className="text-emerald-300/60 font-sans">
                        المصدر: {item.reference}
                      </p>
                    )}
                  </div>
                )}

                {/* Footer Controls: Audio, Copy, Share, Tap Counter */}
                <div className="flex items-center justify-between pt-2 border-t border-emerald-800/40">
                  <div className="flex items-center gap-1.5">
                    {/* Audio speech button */}
                    <button
                      onClick={() => handleToggleSpeech(item)}
                      className={`p-2 rounded-xl transition ${
                        isSpeaking
                          ? 'bg-amber-500 text-emerald-950 animate-pulse'
                          : 'bg-emerald-950/60 text-emerald-300 hover:text-amber-300 hover:bg-emerald-800'
                      }`}
                      title={isSpeaking ? 'إيقاف التلاوة' : 'استماع صوتي'}
                    >
                      {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </button>

                    {/* Copy */}
                    <button
                      onClick={() => handleCopy(item)}
                      className="p-2 rounded-xl bg-emerald-950/60 text-emerald-300 hover:text-amber-300 hover:bg-emerald-800 transition"
                      title="نسخ الذكر"
                    >
                      {copiedId === item.id ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>

                    {/* Share */}
                    <button
                      onClick={() => handleShare(item)}
                      className="p-2 rounded-xl bg-emerald-950/60 text-emerald-300 hover:text-amber-300 hover:bg-emerald-800 transition"
                      title="مشاركة الذكر"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Big Tap Increment Counter Button */}
                  <button
                    onClick={() => handleIncrement(item)}
                    disabled={isCompleted}
                    className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl font-bold text-sm transition transform active:scale-95 ${
                      isCompleted
                        ? 'bg-emerald-700/60 text-emerald-200 cursor-default'
                        : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-emerald-950 shadow-md'
                    }`}
                  >
                    {isCompleted ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                        <span>تم ({item.count})</span>
                      </>
                    ) : (
                      <>
                        <span className="font-mono text-base">{currentCount} / {item.count}</span>
                        <span className="text-xs">اضغط للعد</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
