import React, { useState } from 'react';
import { Download, Smartphone, X, Share2, PlusSquare, Sparkles } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface Props {
  onOpenAndroidGuide: () => void;
}

export const PWAInstallBanner: React.FC<Props> = ({ onOpenAndroidGuide }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [dismissed, setDismissed] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);

  if (dismissed || isInstalled) return null;

  return (
    <>
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-900/90 via-teal-900/90 to-emerald-950/90 border border-amber-500/30 p-3 sm:p-4 shadow-xl backdrop-blur-md mb-5 text-white">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 p-0.5 shadow-md shrink-0 flex items-center justify-center">
              <img src="/icon-192.png" alt="رمضان كريم" className="w-full h-full rounded-[10px] object-cover" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-sm sm:text-base text-amber-200">تثبيت تطبيق (نور وذكر) كـ APK</h4>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/30 font-medium">
                  ملف APK / أندرويد
                </span>
              </div>
              <p className="text-xs text-emerald-100/80 mt-0.5">
                الأذان التلقائي للصلوات، القرآن الكريم، والأذكار الصوتية كل 5 دقائق بدون إنترنت
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {isInstallable && (
              <button
                onClick={install}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-emerald-950 font-bold px-4 py-2 rounded-xl text-xs sm:text-sm shadow-md transition transform active:scale-95"
              >
                <Download className="w-4 h-4" />
                <span>تثبيت كـ تطبيق أصلي (APK)</span>
              </button>
            )}

            {isIOS && (
              <button
                onClick={() => setShowIOSModal(true)}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-emerald-950 font-bold px-4 py-2 rounded-xl text-xs sm:text-sm shadow-md transition transform active:scale-95"
              >
                <Download className="w-4 h-4" />
                <span>طريقة التثبيت على الآيفون</span>
              </button>
            )}

            <button
              onClick={onOpenAndroidGuide}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-800/80 hover:bg-emerald-700/80 text-amber-200 text-xs border border-amber-500/20 transition"
              title="تنزيل حزمة وتثبيت ملف APK"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>تنزيل APK 📦</span>
            </button>

            <button
              onClick={() => setDismissed(true)}
              className="p-1.5 rounded-lg text-emerald-300/70 hover:text-white hover:bg-emerald-800/50 transition"
              aria-label="إغلاق التنبيه"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* iOS Safari Guide Modal */}
      {showIOSModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-emerald-950 border border-amber-500/30 p-6 text-white shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-emerald-800/60">
              <div className="flex items-center gap-2 text-amber-300 font-bold">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <h3>تثبيت التطبيق على آيفون وآيباد</h3>
              </div>
              <button onClick={() => setShowIOSModal(false)} className="text-emerald-300 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 my-5 text-sm text-emerald-100/90 leading-relaxed">
              <div className="flex items-start gap-3 p-3 rounded-2xl bg-emerald-900/40 border border-emerald-800/40">
                <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 shrink-0">
                  <Share2 className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-white">1. اضغط زر المشاركة (Share)</p>
                  <p className="text-xs text-emerald-200/70 mt-0.5">في شريط متصفح Safari بالأسفل أو بالأعلى.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-2xl bg-emerald-900/40 border border-emerald-800/40">
                <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 shrink-0">
                  <PlusSquare className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-white">2. اختر "إضافة إلى الشاشة الرئيسية"</p>
                  <p className="text-xs text-emerald-200/70 mt-0.5">مرر للأسفل واضغط (Add to Home Screen).</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-2xl bg-emerald-900/40 border border-emerald-800/40">
                <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-white">3. اضغط "إضافة" (Add)</p>
                  <p className="text-xs text-emerald-200/70 mt-0.5">سيظهر التطبيق بأيقونة رمضانية فاخرة ويعمل كأي تطبيق أصلي.</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowIOSModal(false)}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-emerald-950 font-bold hover:from-amber-400 transition"
            >
              تم، فهمت
            </button>
          </div>
        </div>
      )}
    </>
  );
};
