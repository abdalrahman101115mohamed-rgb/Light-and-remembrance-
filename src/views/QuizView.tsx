import React, { useState } from 'react';
import { HelpCircle, CheckCircle2, XCircle, Award, RotateCcw, Sparkles, ChevronLeft } from 'lucide-react';
import confetti from 'canvas-confetti';
import { RAMADAN_QUIZ_QUESTIONS, QuizQuestion } from '../data/quizData';
import { playCelebrationSound, triggerHaptic, playTasbeehClick } from '../utils/soundEffects';

export const QuizView: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  const currentQ = RAMADAN_QUIZ_QUESTIONS[currentIndex];

  const handleSelect = (idx: number) => {
    if (selectedOption !== null) return; // already answered
    setSelectedOption(idx);
    triggerHaptic(30);

    if (idx === currentQ.correctIndex) {
      setScore(s => s + 1);
      playTasbeehClick();
    } else {
      triggerHaptic(60);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < RAMADAN_QUIZ_QUESTIONS.length) {
      setCurrentIndex(i => i + 1);
      setSelectedOption(null);
    } else {
      setIsFinished(true);
      playCelebrationSound();
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
      });
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setScore(0);
    setIsFinished(false);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-4 space-y-6">
      {/* Top Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-emerald-900/60 to-emerald-950/80 border border-amber-500/30 p-5 shadow-xl space-y-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-500/20 text-amber-300">
              <HelpCircle className="w-5 h-5" />
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-amber-200">
              مسابقة رمضان الثقافية والمعلومات الدينية
            </h2>
          </div>
          <span className="text-xs bg-amber-500/10 text-amber-300 px-3 py-1 rounded-full border border-amber-500/30 font-mono font-bold">
            النقاط: {score}
          </span>
        </div>
        <p className="text-xs text-emerald-200/80">
          اختبر معلوماتك في أحكام الصيام، القرآن الكريم، والسيرة النبوية الشريفة
        </p>
      </div>

      {isFinished ? (
        /* Results Card */
        <div className="rounded-3xl bg-gradient-to-b from-emerald-900/50 to-emerald-950/80 border-2 border-amber-500/40 p-8 text-center space-y-6 shadow-2xl backdrop-blur-md">
          <div className="w-20 h-20 mx-auto rounded-full bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center text-amber-300">
            <Award className="w-10 h-10 animate-bounce" />
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-white font-quran">
              ما شاء الله! مبارك إنهاء المسابقة
            </h3>
            <p className="text-base text-amber-200">
              حققت <strong className="text-2xl font-mono text-amber-400">{score}</strong> من أصل {RAMADAN_QUIZ_QUESTIONS.length} إجابة صحيحة
            </p>
            <p className="text-xs text-emerald-300/80 max-w-sm mx-auto">
              {score >= 10
                ? 'ممتاز جداً! لديك حصيلة معرفية إسلامية مباركة وقوية.'
                : 'أداء رائع ومحاولة مشرفة، زد من قراءتك وتدبرك ونل الأجر.'}
            </p>
          </div>

          <button
            onClick={handleRestart}
            className="flex items-center justify-center gap-2 w-full max-w-xs mx-auto py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-emerald-950 font-bold hover:from-amber-400 transition shadow-lg"
          >
            <RotateCcw className="w-5 h-5" />
            <span>إعادة المسابقة</span>
          </button>
        </div>
      ) : (
        /* Question Card */
        <div className="rounded-3xl bg-gradient-to-b from-emerald-900/40 via-emerald-950/50 to-emerald-950/80 border border-amber-500/30 p-5 sm:p-7 shadow-2xl backdrop-blur-md space-y-6">
          <div className="flex items-center justify-between text-xs text-emerald-300/70 border-b border-emerald-800/60 pb-3">
            <span>السؤال رقم {currentIndex + 1} من {RAMADAN_QUIZ_QUESTIONS.length}</span>
            <div className="w-28 h-2 rounded-full bg-emerald-950 overflow-hidden border border-emerald-800/50">
              <div
                className="h-full bg-amber-400 rounded-full transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / RAMADAN_QUIZ_QUESTIONS.length) * 100}%` }}
              />
            </div>
          </div>

          <h3 className="text-lg sm:text-xl font-bold text-white font-quran leading-relaxed">
            {currentQ.question}
          </h3>

          {/* Options */}
          <div className="space-y-3">
            {currentQ.options.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrect = idx === currentQ.correctIndex;
              const showResult = selectedOption !== null;

              let btnStyle = 'bg-emerald-950/40 border-emerald-800/40 text-slate-100 hover:bg-emerald-900/40 hover:border-amber-500/40';
              if (showResult) {
                if (isCorrect) {
                  btnStyle = 'bg-emerald-600/40 border-emerald-400 text-emerald-100 font-bold';
                } else if (isSelected) {
                  btnStyle = 'bg-rose-950/60 border-rose-500 text-rose-200';
                } else {
                  btnStyle = 'bg-emerald-950/20 border-emerald-900/40 text-emerald-400/50';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  disabled={showResult}
                  className={`w-full flex items-center justify-between p-4 rounded-2xl border text-right transition ${btnStyle}`}
                >
                  <span className="text-xs sm:text-sm font-semibold">{opt}</span>
                  {showResult && (
                    <span className="shrink-0 mr-2">
                      {isCorrect ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      ) : isSelected ? (
                        <XCircle className="w-5 h-5 text-rose-400" />
                      ) : null}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation box after answer */}
          {selectedOption !== null && (
            <div className="p-4 rounded-2xl bg-emerald-950/70 border border-emerald-800/50 space-y-1 text-xs">
              <span className="font-bold text-amber-300 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>الشرح والتوضيح:</span>
              </span>
              <p className="text-emerald-100/90 leading-relaxed font-sans">
                {currentQ.explanation}
              </p>
            </div>
          )}

          {/* Next Button */}
          {selectedOption !== null && (
            <div className="pt-2 flex justify-end">
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-emerald-950 font-bold text-xs sm:text-sm shadow-md transition"
              >
                <span>{currentIndex + 1 === RAMADAN_QUIZ_QUESTIONS.length ? 'عرض النتيجة' : 'السؤال التالي'}</span>
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
