import React, { useState, useRef } from 'react';
import { Share2, Download, Sparkles, Check, Copy, Palette, MessageSquare } from 'lucide-react';
import { CARD_STYLES, CARD_TEMPLATES, CardStyle, CardTemplate } from '../data/cardsData';

export const CardsView: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<CardTemplate>(CARD_TEMPLATES[0]);
  const [selectedStyle, setSelectedStyle] = useState<CardStyle>(CARD_STYLES[0]);
  const [senderName, setSenderName] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const cardRef = useRef<HTMLDivElement | null>(null);

  const handleDownloadPNG = async () => {
    setIsGenerating(true);
    try {
      // Use HTML5 Canvas to render the card
      const canvas = document.createElement('canvas');
      const width = 1080;
      const height = 1080;
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Draw Background Gradient
      let grad = ctx.createLinearGradient(0, 0, width, height);
      if (selectedStyle.id === 'emerald_royal') {
        grad.addColorStop(0, '#022c22');
        grad.addColorStop(0.5, '#064e3b');
        grad.addColorStop(1, '#021e17');
      } else if (selectedStyle.id === 'midnight_indigo') {
        grad.addColorStop(0, '#090d16');
        grad.addColorStop(0.5, '#1e1b4b');
        grad.addColorStop(1, '#0f172a');
      } else if (selectedStyle.id === 'golden_glow') {
        grad.addColorStop(0, '#451a03');
        grad.addColorStop(0.5, '#78350f');
        grad.addColorStop(1, '#1c1917');
      } else {
        grad.addColorStop(0, '#4c0519');
        grad.addColorStop(0.5, '#881337');
        grad.addColorStop(1, '#1e1b4b');
      }
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Decorative Border
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 12;
      ctx.strokeRect(40, 40, width - 80, height - 80);

      ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
      ctx.lineWidth = 4;
      ctx.strokeRect(60, 60, width - 120, height - 120);

      // Crescent moon symbol in top center
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(width / 2, 220, 70, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(width / 2 + 25, 205, 62, 0, Math.PI * 2);
      ctx.fill();

      // Title
      ctx.fillStyle = '#fef08a';
      ctx.font = 'bold 54px Arial, Tajawal, sans-serif';
      ctx.textAlign = 'center';
      ctx.direction = 'rtl';
      ctx.fillText(selectedTemplate.title, width / 2, 380);

      // Body Arabic Text with word wrapping
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 44px Arial, Amiri, serif';
      const lines = selectedTemplate.arabicText.split('\n');
      let yPos = 500;
      lines.forEach(line => {
        ctx.fillText(line, width / 2, yPos);
        yPos += 75;
      });

      // Subtitle
      if (selectedTemplate.subText) {
        ctx.fillStyle = '#fde047';
        ctx.font = '32px Arial, Tajawal, sans-serif';
        ctx.fillText(selectedTemplate.subText, width / 2, yPos + 30);
      }

      // Sender Name if provided
      if (senderName.trim()) {
        ctx.fillStyle = '#fef08a';
        ctx.font = 'italic 34px Arial, Tajawal, sans-serif';
        ctx.fillText(`تهنئة من: ${senderName.trim()}`, width / 2, 880);
      }

      // Footer app watermark
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.font = '24px Arial, Tajawal, sans-serif';
      ctx.fillText('تطبيق رمضان كريم', width / 2, 980);

      // Trigger download
      const dataUrl = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `ramadan_card_${Date.now()}.png`;
      a.click();
    } catch (err) {
      console.warn('Canvas export error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleShare = async () => {
    const shareText = `${selectedTemplate.title}\n\n${selectedTemplate.arabicText}\n\n${senderName ? `من: ${senderName}\n` : ''}(تطبيق رمضان كريم)`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: selectedTemplate.title,
          text: shareText,
        });
      } catch {
        // user cancelled
      }
    } else {
      navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-4 space-y-6">
      {/* Top Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-emerald-900/60 to-emerald-950/80 border border-amber-500/30 p-5 shadow-xl space-y-1">
        <h2 className="text-lg sm:text-xl font-bold text-amber-200 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <span>صانع بطاقات التهنئة والأدعية الرمضانية</span>
        </h2>
        <p className="text-xs text-emerald-200/80">
          صمم بطاقات إسلامية أنيقة بآيات وأدعية وتهاني، وشاركها مع أهلك وأحبابك عبر واتساب ووسائل التواصل
        </p>
      </div>

      {/* Style & Template Selectors */}
      <div className="space-y-4">
        {/* Style Selector */}
        <div>
          <span className="text-xs font-bold text-amber-200 block mb-2 flex items-center gap-1.5">
            <Palette className="w-4 h-4" />
            <span>اختر الطابع واللون:</span>
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {CARD_STYLES.map(style => (
              <button
                key={style.id}
                onClick={() => setSelectedStyle(style)}
                className={`p-3 rounded-2xl border text-center transition ${
                  selectedStyle.id === style.id
                    ? 'border-amber-400 bg-amber-500/20 text-white shadow-md'
                    : 'border-emerald-800/40 bg-emerald-950/40 text-emerald-200/80 hover:bg-emerald-900/40'
                }`}
              >
                <div className={`w-full h-4 rounded-full bg-gradient-to-r ${style.bgGradient} mb-2 border border-white/20`} />
                <span className="text-xs font-bold block">{style.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Template Selector */}
        <div>
          <span className="text-xs font-bold text-amber-200 block mb-2 flex items-center gap-1.5">
            <MessageSquare className="w-4 h-4" />
            <span>اختر نص البطاقة:</span>
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
            {CARD_TEMPLATES.map(tpl => (
              <button
                key={tpl.id}
                onClick={() => setSelectedTemplate(tpl)}
                className={`p-3 rounded-2xl border text-right transition ${
                  selectedTemplate.id === tpl.id
                    ? 'border-amber-400 bg-amber-500/20 text-white shadow-md'
                    : 'border-emerald-800/40 bg-emerald-950/40 text-emerald-200/80 hover:bg-emerald-900/40'
                }`}
              >
                <span className="text-xs font-bold text-amber-300 block">{tpl.title}</span>
                <p className="text-[11px] text-emerald-200/70 truncate mt-0.5 font-quran">{tpl.arabicText}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Sender Name Customization */}
        <div>
          <label className="text-xs font-bold text-amber-200 block mb-1">اسم المرسل (اختياري):</label>
          <input
            type="text"
            value={senderName}
            onChange={e => setSenderName(e.target.value)}
            placeholder="اكتب اسمك ليظهر على البطاقة (مثال: محبكم عبد الرحمن)"
            className="w-full px-4 py-2.5 rounded-2xl bg-emerald-950/60 border border-emerald-800/60 text-white text-xs sm:text-sm placeholder-emerald-400/50 focus:outline-none focus:border-amber-400"
          />
        </div>
      </div>

      {/* Live Card Preview Box */}
      <div className="space-y-3">
        <span className="text-xs font-bold text-amber-200 block">معاينة البطاقة الجاهزة للمشاركة:</span>

        <div
          ref={cardRef}
          className={`relative rounded-3xl bg-gradient-to-b ${selectedStyle.bgGradient} border-4 border-amber-500/40 p-6 sm:p-10 shadow-2xl text-center space-y-6 overflow-hidden`}
        >
          {/* Subtle Ambient Crescent Glow */}
          <div className="w-20 h-20 mx-auto relative flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-amber-400 shadow-amber-400/50 shadow-2xl" />
            <div className="w-14 h-14 rounded-full bg-emerald-950 absolute -top-1 -right-1" />
          </div>

          <div className="space-y-3">
            <h3 className="text-xl sm:text-2xl font-bold font-tajawal text-amber-300 tracking-wide">
              {selectedTemplate.title}
            </h3>

            <p className="font-quran text-lg sm:text-2xl text-white leading-loose whitespace-pre-line drop-shadow-sm">
              {selectedTemplate.arabicText}
            </p>

            {selectedTemplate.subText && (
              <p className="text-xs sm:text-sm text-amber-200/90 font-medium">
                {selectedTemplate.subText}
              </p>
            )}
          </div>

          {senderName.trim() && (
            <div className="pt-2 border-t border-amber-500/30">
              <span className="text-xs sm:text-sm text-amber-300 font-semibold font-quran">
                مع أطيب التحيات من: {senderName.trim()}
              </span>
            </div>
          )}

          <div className="text-[10px] text-white/50 pt-2">
            تطبيق رمضان كريم المبارك
          </div>
        </div>

        {/* Action Buttons: Download Image & Share */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <button
            onClick={handleDownloadPNG}
            disabled={isGenerating}
            className="w-full sm:flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-emerald-950 font-bold text-xs sm:text-sm transition shadow-lg"
          >
            <Download className="w-4 h-4" />
            <span>{isGenerating ? 'جاري تجهيز الصورة...' : 'تحميل البطاقة كصورة (PNG)'}</span>
          </button>

          <button
            onClick={handleShare}
            className="w-full sm:flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-emerald-800/90 hover:bg-emerald-700 text-amber-200 font-bold text-xs sm:text-sm border border-amber-500/30 transition shadow-lg"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            <span>{copied ? 'تم نسخ النص!' : 'مشاركة عبر واتساب / التطبيقات'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
