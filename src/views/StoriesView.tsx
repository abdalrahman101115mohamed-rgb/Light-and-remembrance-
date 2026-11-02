import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Sparkles,
  Clock,
  ArrowRight,
  Volume2,
  VolumeX,
  CheckCircle,
  Play,
  Pause,
  RotateCcw,
  Headphones,
  Check
} from 'lucide-react';
import { PROPHET_STORIES, ProphetStory } from '../data/storiesData';
import { sheikhVoiceService, NarrationQueueState } from '../utils/sheikhVoiceService';

export const StoriesView: React.FC = () => {
  const [activeStory, setActiveStory] = useState<ProphetStory | null>(null);
  const [narrationState, setNarrationState] = useState<NarrationQueueState>(
    sheikhVoiceService.getState()
  );

  useEffect(() => {
    const unsub = sheikhVoiceService.subscribe(st => {
      setNarrationState(st);
    });
    return unsub;
  }, []);

  const handlePlayStory = (story: ProphetStory) => {
    sheikhVoiceService.playStory(
      story.id,
      story.title,
      story.fullStory,
      story.moralLessons
    );
  };

  const handlePlayParagraph = (story: ProphetStory, paraIndex: number) => {
    if (narrationState.activeId === story.id) {
      sheikhVoiceService.jumpToChunk(paraIndex + 1); // chunk 0 is title
    } else {
      sheikhVoiceService.playStory(
        story.id,
        story.title,
        story.fullStory,
        story.moralLessons
      );
      // jump shortly after starting
      setTimeout(() => {
        sheikhVoiceService.jumpToChunk(paraIndex + 1);
      }, 350);
    }
  };

  const closeStory = () => {
    setActiveStory(null);
  };

  const isCurrentStoryPlaying =
    activeStory &&
    narrationState.activeId === activeStory.id &&
    narrationState.isPlaying;

  const isCurrentStoryActive =
    activeStory && narrationState.activeId === activeStory.id;

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 space-y-6">
      {activeStory ? (
        /* Reading Story Full View */
        <div className="space-y-6">
          <div className="flex items-center justify-between bg-emerald-900/60 border border-emerald-800/60 rounded-3xl p-3.5 shadow-xl backdrop-blur-md">
            <button
              onClick={closeStory}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-emerald-800/80 hover:bg-emerald-700/80 text-amber-200 text-xs sm:text-sm font-semibold transition"
            >
              <ArrowRight className="w-4 h-4" />
              <span>العودة للقصص</span>
            </button>

            {/* Sheikh Audio Recitation Button */}
            <button
              onClick={() => handlePlayStory(activeStory)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-bold shadow-md transition ${
                isCurrentStoryPlaying
                  ? 'bg-amber-500 text-emerald-950 animate-pulse ring-2 ring-amber-300'
                  : 'bg-gradient-to-r from-amber-500/90 to-amber-600/90 text-emerald-950 hover:brightness-110'
              }`}
            >
              {isCurrentStoryPlaying ? (
                <>
                  <Pause className="w-4 h-4 fill-current" />
                  <span>إيقاف قراءة الشيخ</span>
                </>
              ) : (
                <>
                  <Headphones className="w-4 h-4" />
                  <span>استماع للقصة كاملة بصوت الشيخ</span>
                </>
              )}
            </button>
          </div>

          <div className="rounded-3xl bg-gradient-to-b from-emerald-900/40 via-emerald-950/50 to-emerald-950/80 border border-amber-500/30 p-6 sm:p-8 shadow-2xl backdrop-blur-md space-y-6">
            <div className="space-y-2 border-b border-emerald-800/60 pb-5">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {activeStory.badge}
                </span>
                <span className="text-xs bg-emerald-800/40 text-emerald-300 border border-emerald-700/40 px-2.5 py-1 rounded-full flex items-center gap-1.5">
                  <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>متاحة بالقراءة الصوتية الخاشعة 100% بدون نت</span>
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold font-quran text-white">
                {activeStory.title}
              </h1>
              <p className="text-sm text-emerald-200/80">
                {activeStory.subtitle}
              </p>
              <div className="flex items-center gap-2 text-xs text-amber-400 pt-1">
                <Clock className="w-3.5 h-3.5" />
                <span>وقت القراءة: قرابة {activeStory.readingTimeMinutes} دقائق</span>
              </div>
            </div>

            {/* Quranic Ayah Card */}
            <div className="p-4 rounded-2xl bg-emerald-950/70 border border-amber-500/20 space-y-1.5">
              <span className="text-[11px] text-amber-400 font-bold block">شاهد من القرآن الكريم:</span>
              <p className="font-quran text-lg text-amber-100">
                ﴿{activeStory.quranicAyah}﴾
              </p>
              <p className="text-[10px] text-emerald-300/60 text-left">
                {activeStory.ayahSource}
              </p>
            </div>

            {/* Paragraphs with interactive Sheikh speech highlighting */}
            <div className="space-y-4 text-slate-100 text-base sm:text-lg leading-loose font-sans text-justify">
              {activeStory.fullStory.map((para, idx) => {
                const isThisParaActive =
                  isCurrentStoryActive &&
                  narrationState.currentChunkIndex === idx + 1;

                return (
                  <div
                    key={idx}
                    className={`relative p-5 rounded-2xl border transition-all duration-300 ${
                      isThisParaActive
                        ? 'bg-emerald-900/60 border-amber-400 ring-2 ring-amber-400/30 shadow-lg'
                        : 'bg-emerald-950/30 hover:bg-emerald-950/50 border-emerald-800/30'
                    }`}
                  >
                    {isThisParaActive && (
                      <div className="absolute top-2 left-3 flex items-center gap-1.5 text-[10px] bg-amber-500 text-emerald-950 px-2 py-0.5 rounded-full font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-950 animate-ping"></span>
                        <span>الشيخ يقرأ هذه الفقرة</span>
                      </div>
                    )}

                    <p>{para}</p>

                    <div className="mt-3 pt-2 border-t border-emerald-800/30 flex items-center justify-between">
                      <span className="text-[10px] text-emerald-300/50">
                        الفقرة {idx + 1}
                      </span>
                      <button
                        onClick={() => handlePlayParagraph(activeStory, idx)}
                        className="text-[11px] flex items-center gap-1 text-amber-300 hover:text-amber-200 transition"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>قراءة من هنا بصوت الشيخ</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Moral Lessons */}
            <div className="rounded-2xl bg-gradient-to-r from-emerald-900/50 to-teal-900/50 border border-amber-500/30 p-5 space-y-3">
              <h3 className="font-bold text-amber-300 text-base flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <span>العبر والدروس المستفادة:</span>
              </h3>
              <ul className="space-y-2 text-sm text-emerald-100/90">
                {activeStory.moralLessons.map((lesson, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>{lesson}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ) : (
        /* Stories Index */
        <div className="space-y-4">
          <div className="rounded-3xl bg-gradient-to-r from-emerald-900/60 to-emerald-950/80 border border-amber-500/30 p-5 sm:p-6 shadow-xl space-y-2">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <h2 className="text-lg sm:text-xl font-bold text-amber-200 flex items-center gap-2 font-quran">
                <BookOpen className="w-5 h-5 text-amber-400" />
                <span>قصص الأنبياء والرمضانيات (100% بدون إنترنت)</span>
              </h2>
              <span className="text-[11px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2.5 py-1 rounded-full font-bold flex items-center gap-1">
                <Volume2 className="w-3.5 h-3.5" />
                <span>مدعومة بالقراءة الصوتية بصوت الشيخ</span>
              </span>
            </div>
            <p className="text-xs text-emerald-200/80">
              قصص تربوية ملهمة بأسلوب مبسط وشيق، غنية بالعبر والآيات القرآنية، يمكنك قراءتها أو الاستماع إليها بصوت الشيخ الخاشع.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {PROPHET_STORIES.map(story => {
              const isPlayingThis =
                narrationState.activeId === story.id && narrationState.isPlaying;

              return (
                <div
                  key={story.id}
                  className="rounded-3xl bg-emerald-900/30 hover:bg-emerald-900/50 border border-emerald-800/50 hover:border-amber-500/50 p-5 transition shadow-lg flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20">
                        {story.badge}
                      </span>
                      <span className="flex items-center gap-1 text-[11px] text-emerald-300/70">
                        <Clock className="w-3 h-3" />
                        <span>{story.readingTimeMinutes} د</span>
                      </span>
                    </div>

                    <h3
                      onClick={() => setActiveStory(story)}
                      className="font-bold text-base sm:text-lg text-white font-quran hover:text-amber-300 cursor-pointer transition"
                    >
                      {story.title}
                    </h3>

                    <p className="text-xs text-emerald-100/80 line-clamp-3 leading-relaxed">
                      {story.summary}
                    </p>
                  </div>

                  {/* Actions: Read or Listen directly in Sheikh voice */}
                  <div className="flex items-center justify-between pt-3 border-t border-emerald-800/40 gap-2">
                    <button
                      onClick={() => setActiveStory(story)}
                      className="flex items-center gap-1 text-xs text-emerald-200 hover:text-white font-semibold transition"
                    >
                      <span>قراءة كاملة</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handlePlayStory(story)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-sm ${
                        isPlayingThis
                          ? 'bg-amber-500 text-emerald-950 animate-pulse'
                          : 'bg-emerald-800/70 hover:bg-emerald-700 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {isPlayingThis ? (
                        <>
                          <Pause className="w-3.5 h-3.5 fill-current" />
                          <span>إيقاف الصوت</span>
                        </>
                      ) : (
                        <>
                          <Headphones className="w-3.5 h-3.5" />
                          <span>استمع بصوت الشيخ</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
