import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Search,
  Bookmark,
  BookmarkCheck,
  Share2,
  Copy,
  Check,
  Volume2,
  VolumeX,
  Sparkles,
  Award,
  ChevronDown,
  ChevronUp,
  Info,
  Heart
} from 'lucide-react';
import { HADITHS_DATA, HADITHS_CATEGORIES, HadithItem } from '../data/hadithsData';
import { sheikhVoiceService } from '../utils/sheikhVoiceService';

export const HadithView: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedHadithId, setExpandedHadithId] = useState<string | null>(HADITHS_DATA[0].id);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('bookmarked_hadiths');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    const unsub = sheikhVoiceService.subscribe(st => {
      if (st.sourceType === 'hadith' && st.isPlaying) {
        setSpeakingId(st.activeId);
      } else if (st.sourceType === 'hadith' && !st.isPlaying) {
        setSpeakingId(null);
      } else {
        setSpeakingId(null);
      }
    });
    return unsub;
  }, []);

  // Filter Hadiths
  const filteredHadiths = HADITHS_DATA.filter(item => {
    const matchesCategory =
      selectedCategory === 'all'
        ? true
        : selectedCategory === 'bookmarked'
        ? bookmarkedIds.includes(item.id)
        : item.category === selectedCategory;

    const query = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !query ||
      item.title.toLowerCase().includes(query) ||
      item.matn.toLowerCase().includes(query) ||
      item.rawi.toLowerCase().includes(query) ||
      item.source.toLowerCase().includes(query) ||
      item.explanation.toLowerCase().includes(query);

    return matchesCategory && matchesSearch;
  });

  const toggleBookmark = (id: string) => {
    setBookmarkedIds(prev => {
      const updated = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      try {
        localStorage.setItem('bookmarked_hadiths', JSON.stringify(updated));
      } catch (e) {
        console.warn(e);
      }
      return updated;
    });
  };

  const copyHadith = (item: HadithItem) => {
    const text = `«${item.matn}»\n\nالراوي: ${item.rawi}\nالمصدر: ${item.source} (${item.ruling})\n— تطبيق الرفيق الإسلامي (يعمل بدون نت)`;
    navigator.clipboard.writeText(text);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const shareHadith = async (item: HadithItem) => {
    const text = `«${item.matn}»\n\nالراوي: ${item.rawi}\nالمصدر: ${item.source}\n— تطبيق الرفيق الإسلامي`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: item.title,
          text: text,
        });
      } catch {
        // user cancelled
      }
    } else {
      copyHadith(item);
    }
  };

  const speakHadith = (item: HadithItem) => {
    sheikhVoiceService.playHadith(item.id, item.title, item.matn, item.rawi, item.source);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 space-y-6">
      {/* Top Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-emerald-950 via-teal-950 to-emerald-900 border-2 border-amber-500/40 p-5 sm:p-6 shadow-2xl backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-300 flex items-center justify-center border border-amber-500/30 shrink-0">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-lg sm:text-xl font-quran text-amber-300">
                الأحاديث النبوية الشريفة (100% بدون إنترنت)
              </h1>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                أوفلاين دائم
              </span>
            </div>
            <p className="text-xs text-emerald-200/80 mt-1">
              صحيح السنة النبوية، الأربعون النووية كاملة، وفضائل الصلاة على النبي ﷺ مع الشرح والقراءة الصوتية
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mt-4 relative">
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="ابحث في الأحاديث، الصحابي الراوي، أو الكلمات المفتاحية..."
            className="w-full bg-emerald-900/60 border border-emerald-700/60 rounded-2xl py-3 pr-10 pl-4 text-xs sm:text-sm text-emerald-100 placeholder-emerald-400/50 focus:outline-none focus:border-amber-400 transition"
          />
          <Search className="w-4 h-4 text-emerald-400 absolute right-3.5 top-3.5" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute left-3 top-3 text-xs text-emerald-400 hover:text-white"
            >
              مسح
            </button>
          )}
        </div>
      </div>

      {/* Category Pills Slider */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none text-xs">
        {HADITHS_CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3.5 py-2 rounded-2xl whitespace-nowrap font-medium transition shrink-0 ${
              selectedCategory === cat.id
                ? 'bg-amber-500 text-emerald-950 font-bold shadow-md'
                : 'bg-emerald-900/40 text-emerald-200 border border-emerald-800/60 hover:bg-emerald-900/80'
            }`}
          >
            {cat.name}
          </button>
        ))}

        {/* Bookmarks Filter */}
        <button
          onClick={() => setSelectedCategory('bookmarked')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl whitespace-nowrap font-medium transition shrink-0 ${
            selectedCategory === 'bookmarked'
              ? 'bg-amber-500 text-emerald-950 font-bold shadow-md'
              : 'bg-emerald-900/40 text-emerald-200 border border-emerald-800/60 hover:bg-emerald-900/80'
          }`}
        >
          <Bookmark className="w-3.5 h-3.5 text-amber-400" />
          <span>المفضلة ({bookmarkedIds.length})</span>
        </button>
      </div>

      {/* Hadiths Listing */}
      <div className="space-y-4">
        {filteredHadiths.length === 0 ? (
          <div className="py-16 text-center text-emerald-300/70 space-y-2 rounded-3xl bg-emerald-950/40 border border-emerald-800/40">
            <BookOpen className="w-10 h-10 mx-auto text-emerald-500/40" />
            <p className="text-sm font-semibold">لم يتم العثور على أحاديث تطابق بحثك</p>
            <p className="text-xs text-emerald-400/60">جرب كتابة كلمة أخرى مثل "الصلاة"، "النية"، "صام"، أو "الذكر"</p>
          </div>
        ) : (
          filteredHadiths.map(item => {
            const isExpanded = expandedHadithId === item.id;
            const isBookmarked = bookmarkedIds.includes(item.id);
            const isSpeaking = speakingId === item.id;

            return (
              <div
                key={item.id}
                className="rounded-3xl bg-gradient-to-b from-emerald-900/30 to-emerald-950/60 border border-emerald-800/60 hover:border-amber-500/40 p-5 sm:p-6 transition shadow-lg space-y-3"
              >
                {/* Hadith Top Info */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
                      {item.categoryName}
                    </span>
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-800/50 text-emerald-300 border border-emerald-700/40 font-mono">
                      {item.ruling}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    {/* Speech Voice Button */}
                    <button
                      onClick={() => speakHadith(item)}
                      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-bold transition shadow-sm ${
                        isSpeaking
                          ? 'bg-amber-500 text-emerald-950 border-amber-400 animate-pulse ring-2 ring-amber-300'
                          : 'bg-emerald-900/70 text-amber-300 hover:text-white border-emerald-800/60'
                      }`}
                      title={isSpeaking ? 'إيقاف قراءة الشيخ' : 'استمع للحديث بصوت الشيخ الخاشع'}
                    >
                      {isSpeaking ? (
                        <>
                          <VolumeX className="w-3.5 h-3.5" />
                          <span className="text-[10px]">إيقاف</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-3.5 h-3.5" />
                          <span className="text-[10px]">صوت الشيخ</span>
                        </>
                      )}
                    </button>

                    {/* Bookmark */}
                    <button
                      onClick={() => toggleBookmark(item.id)}
                      className={`p-2 rounded-xl border transition ${
                        isBookmarked
                          ? 'bg-amber-500 text-emerald-950 border-amber-400'
                          : 'bg-emerald-900/60 text-emerald-300 hover:text-white border-emerald-800/50'
                      }`}
                      title={isBookmarked ? 'إزالة من المفضلة' : 'حفظ في المفضلة'}
                    >
                      {isBookmarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                    </button>

                    {/* Copy */}
                    <button
                      onClick={() => copyHadith(item)}
                      className="p-2 rounded-xl bg-emerald-900/60 text-emerald-300 hover:text-white border border-emerald-800/50 transition"
                      title="نسخ الحديث الشريف"
                    >
                      {copiedId === item.id ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>

                    {/* Share */}
                    <button
                      onClick={() => shareHadith(item)}
                      className="p-2 rounded-xl bg-emerald-900/60 text-emerald-300 hover:text-white border border-emerald-800/50 transition"
                      title="مشاركة الحديث"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Hadith Title */}
                <h3 className="font-bold text-sm sm:text-base text-amber-300">
                  {item.title}
                </h3>

                {/* Hadith Matn (Text) */}
                <div className="p-4 rounded-2xl bg-emerald-950/70 border border-amber-500/20">
                  <p className="font-quran text-base sm:text-lg text-white leading-loose text-justify selection:bg-amber-500">
                    {item.matn}
                  </p>
                </div>

                {/* Narrator & Source */}
                <div className="flex flex-wrap items-center justify-between text-xs text-emerald-300/80 gap-2 pt-1 border-t border-emerald-900/80">
                  <div className="flex items-center gap-1.5">
                    <span className="text-amber-400 font-medium">الراوي:</span>
                    <span>{item.rawi}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="text-amber-400 font-medium">المصدر:</span>
                    <span>{item.source}</span>
                  </div>

                  <button
                    onClick={() => setExpandedHadithId(isExpanded ? null : item.id)}
                    className="text-amber-300 hover:text-white font-medium flex items-center gap-1 ml-auto"
                  >
                    <span>{isExpanded ? 'إخفاء الشرح والفوائد' : 'عرض الشرح والفوائد'}</span>
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {/* Expanded Explanation & Benefits */}
                {isExpanded && (
                  <div className="mt-3 pt-3 border-t border-amber-500/20 space-y-3 bg-emerald-950/40 p-4 rounded-2xl">
                    <div>
                      <h4 className="text-xs font-bold text-amber-300 flex items-center gap-1 mb-1">
                        <Info className="w-3.5 h-3.5 text-amber-400" />
                        <span>الشرح والتوضيح:</span>
                      </h4>
                      <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
                        {item.explanation}
                      </p>
                    </div>

                    {item.benefits && item.benefits.length > 0 && (
                      <div>
                        <h4 className="text-xs font-bold text-emerald-300 flex items-center gap-1 mb-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                          <span>الفوائد المستنبطة:</span>
                        </h4>
                        <ul className="space-y-1">
                          {item.benefits.map((benefit, bIdx) => (
                            <li key={bIdx} className="text-xs text-emerald-200/90 flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                              <span>{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
