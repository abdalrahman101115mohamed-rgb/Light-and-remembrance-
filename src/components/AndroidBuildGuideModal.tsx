import React, { useState } from 'react';
import {
  Smartphone,
  X,
  CheckCircle2,
  Copy,
  Check,
  Terminal,
  ShieldCheck,
  PlaySquare,
  Layers,
  Download,
  ExternalLink,
  PackageCheck,
  AlertTriangle,
  Sparkles
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const AndroidBuildGuideModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'direct-apk' | 'install-steps' | 'twa' | 'capacitor' | 'playstore'>('direct-apk');
  const { isInstallable, install } = usePWAInstall();

  if (!isOpen) return null;

  const copyCode = (code: string, index: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const appUrl = typeof window !== 'undefined' ? window.location.origin : 'https://my-app.run.app';
  const pwaBuilderUrl = `https://www.pwabuilder.com/?site=${encodeURIComponent(appUrl)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md overflow-y-auto">
      <div className="w-full max-w-3xl my-8 rounded-3xl bg-slate-900 border-2 border-amber-500/40 p-5 sm:p-7 text-slate-100 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-amber-300">
                  تنزيل وتثبيت تطبيق (نور وذكر) كملف APK
                </h2>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                  بدون نت 100%
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                تثبيت أصلي ومباشر على هواتف الأندرويد، متوافق مع نظام أندرويد 16 و API 36
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 border-b border-slate-800 py-3 overflow-x-auto text-xs sm:text-sm">
          <button
            onClick={() => setActiveTab('direct-apk')}
            className={`px-3.5 py-2 rounded-xl font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'direct-apk'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Download className="w-4 h-4" />
            <span>تنزيل APK مباشر والتثبيت الفوري</span>
          </button>

          <button
            onClick={() => setActiveTab('install-steps')}
            className={`px-3.5 py-2 rounded-xl font-semibold transition whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'install-steps'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <PackageCheck className="w-4 h-4" />
            <span>خطوات التثبيت على الهاتف</span>
          </button>

          <button
            onClick={() => setActiveTab('twa')}
            className={`px-3.5 py-2 rounded-xl font-semibold transition whitespace-nowrap ${
              activeTab === 'twa'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            أداة Google الرسمية (Bubblewrap)
          </button>

          <button
            onClick={() => setActiveTab('capacitor')}
            className={`px-3.5 py-2 rounded-xl font-semibold transition whitespace-nowrap ${
              activeTab === 'capacitor'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            مشروع Android Studio (Capacitor)
          </button>

          <button
            onClick={() => setActiveTab('playstore')}
            className={`px-3.5 py-2 rounded-xl font-semibold transition whitespace-nowrap ${
              activeTab === 'playstore'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            متطلبات Google Play
          </button>
        </div>

        {/* Tab Contents */}
        <div className="py-4 space-y-4 max-h-[60vh] overflow-y-auto pr-1">
          {/* TAB 1: Direct APK & WebAPK Install */}
          {activeTab === 'direct-apk' && (
            <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
              {/* Option A: 1-Click Native WebAPK Install */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-900 border-2 border-amber-500/40 text-emerald-100 shadow-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs">
                      الخيار الأسرع ⚡
                    </span>
                    <h3 className="font-bold text-base text-amber-300">
                      1. تثبيت التطبيق مباشرة بصيغة APK (WebAPK)
                    </h3>
                  </div>
                  <span className="text-[11px] text-emerald-300 bg-emerald-900/60 px-2 py-0.5 rounded-full border border-emerald-700">
                    رسمي من Google
                  </span>
                </div>

                <p className="text-xs text-slate-200">
                  على هواتف أندرويد (متصفح Chrome أو Samsung Internet)، يقوم النظام تلقائياً بإنشاء حزمة <strong>APK أصلية</strong> وتثبيتها داخل هاتفك وقائمة التطبيقات. التطبيق يعمل 100% بدون إنترنت وبملء الشاشة!
                </p>

                {isInstallable ? (
                  <button
                    onClick={install}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-emerald-950 font-bold text-sm shadow-lg transition transform active:scale-95"
                  >
                    <Download className="w-5 h-5" />
                    <span>اضغط هنا لتثبيت الـ APK على هاتفك فوراً</span>
                  </button>
                ) : (
                  <div className="flex flex-col sm:flex-row items-center gap-3 p-3 rounded-xl bg-slate-950/70 border border-amber-500/30">
                    <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />
                    <p className="text-xs text-amber-200">
                      إذا لم يظهر زر التثبيت التلقائي أعلاه: اضغط على القائمة <strong>(⋮) الثلاث نقاط</strong> في متصفحك بالأعلى ثم اختر <strong>"تثبيت التطبيق"</strong> أو <strong>"إضافة إلى الشاشة الرئيسية"</strong>.
                    </p>
                  </div>
                )}
              </div>

              {/* Option B: Direct PWABuilder APK Generator */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm sm:text-base text-amber-300 flex items-center gap-2">
                    <PackageCheck className="w-5 h-5 text-amber-400" />
                    <span>2. توليد وتحميل ملف APK مخصص عبر أداة PWABuilder الرسمية</span>
                  </h3>
                  <span className="text-[11px] text-slate-400">Microsoft Open Source</span>
                </div>

                <p className="text-xs text-slate-300">
                  يمكنك تحميل ملف الـ APK الموقّع مباشرة من خدمة PWABuilder بنقرة واحدة، حيث يتم أخذ رابط التطبيق وبيانات المانيفست وتوليد ملف APK جاهز للتثبيت على أي جهاز أندرويد:
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <a
                    href={pwaBuilderUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm transition shadow-md"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>فتح مولد الـ APK المباشر (PWABuilder)</span>
                  </a>

                  <button
                    onClick={() => copyCode(appUrl, 99)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs border border-slate-700 transition"
                  >
                    {copiedIndex === 99 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>نسخ رابط التطبيق لاستخدامه في أداة البناء</span>
                  </button>
                </div>
              </div>

              {/* Application Details Summary */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">اسم الحزمة:</span>
                  <span className="font-mono text-amber-300 font-bold">com.alrafeeq.islamic</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">العمل بدون نت:</span>
                  <span className="text-emerald-400 font-bold">100% أوفلاين</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">التذكير الصوتي:</span>
                  <span className="text-amber-300 font-bold">كل 5 دقائق</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">إصدار الأندرويد:</span>
                  <span className="text-amber-300 font-bold">Android 16 (API 36)</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Step-by-Step Installation on Phone */}
          {activeTab === 'install-steps' && (
            <div className="space-y-3 text-xs sm:text-sm text-slate-300">
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs">
                خطوات بسيطة لتثبيت التطبيق على أي هاتف (سامسونج، شاومي، أوبو، ريلمي، فيفو، هواوي، بيكسل):
              </div>

              <div className="space-y-2.5">
                <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-950 border border-slate-800">
                  <div className="w-7 h-7 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-xs shrink-0">
                    1
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">الضغط على "تثبيت التطبيق كـ APK"</h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      اضغط على زر التثبيت من الشاشة الرئيسية، أو من شريط المتصفح عبر خيار "إضافة إلى الشاشة الرئيسية / تثبيت التطبيق".
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-950 border border-slate-800">
                  <div className="w-7 h-7 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-xs shrink-0">
                    2
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">تأكيد التثبيت على الهاتف</h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      ستظهر نافذة أندرويد الرسمية لتثبيت حزمة التطبيق. اضغط على <strong>تثبيت (Install)</strong>.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-950 border border-slate-800">
                  <div className="w-7 h-7 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-xs shrink-0">
                    3
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">فتح التطبيق بدون إنترنت</h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      ستجد أيقونة <strong>«الرفيق الإسلامي»</strong> في قائمة تطبيقات هاتفك الرئيسية. افتحه في أي وقت حتى بدون شبكة واي فاي أو بيانات هاتف!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: TWA Bubblewrap CLI */}
          {activeTab === 'twa' && (
            <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200">
                أداة <strong>Bubblewrap</strong> الرسمية من فريق Google Chrome لإنتاج حزمة .apk أو .aab موقعة للنشر على Google Play:
              </div>

              {/* Step 1 */}
              <div className="rounded-2xl bg-slate-950 border border-slate-800 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-amber-400">الخطوة 1: تثبيت أداة Bubblewrap CLI</span>
                  <button
                    onClick={() => copyCode('npm install -g @bubblewrap/cli', 1)}
                    className="flex items-center gap-1 text-xs text-slate-400 hover:text-amber-300"
                  >
                    {copiedIndex === 1 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>نسخ</span>
                  </button>
                </div>
                <pre className="p-3 rounded-xl bg-slate-900 text-emerald-300 font-mono text-xs overflow-x-auto">
                  npm install -g @bubblewrap/cli
                </pre>
              </div>

              {/* Step 2 */}
              <div className="rounded-2xl bg-slate-950 border border-slate-800 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-amber-400">الخطوة 2: إنشاء مشروع الأندرويد واستيراد البيانات</span>
                  <button
                    onClick={() => copyCode(`bubblewrap init --manifest=${appUrl}/manifest.webmanifest`, 2)}
                    className="flex items-center gap-1 text-xs text-slate-400 hover:text-amber-300"
                  >
                    {copiedIndex === 2 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>نسخ</span>
                  </button>
                </div>
                <pre className="p-3 rounded-xl bg-slate-900 text-emerald-300 font-mono text-xs overflow-x-auto">
                  bubblewrap init --manifest={appUrl}/manifest.webmanifest
                </pre>
              </div>

              {/* Step 3 */}
              <div className="rounded-2xl bg-slate-950 border border-slate-800 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-amber-400">الخطوة 3: بناء حزمة APK و AAB النهائية</span>
                  <button
                    onClick={() => copyCode('bubblewrap build', 3)}
                    className="flex items-center gap-1 text-xs text-slate-400 hover:text-amber-300"
                  >
                    {copiedIndex === 3 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>نسخ</span>
                  </button>
                </div>
                <pre className="p-3 rounded-xl bg-slate-900 text-emerald-300 font-mono text-xs overflow-x-auto">
                  bubblewrap build
                </pre>
              </div>
            </div>
          )}

          {/* TAB 4: Capacitor */}
          {activeTab === 'capacitor' && (
            <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200">
                بناء تطبيق أصلي 100% عبر Capacitor لفتحه في أندرويد ستوديو وتوليد APK:
              </div>

              <div className="rounded-2xl bg-slate-950 border border-slate-800 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-amber-400">أوامر التثبيت والبناء</span>
                  <button
                    onClick={() => copyCode(`npm install @capacitor/core @capacitor/android\nnpx cap init "نور وذكر" com.noorwadhikr.app --web-dir dist\nnpm run build\nnpx cap add android\nnpx cap open android`, 4)}
                    className="flex items-center gap-1 text-xs text-slate-400 hover:text-amber-300"
                  >
                    {copiedIndex === 4 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>نسخ جميع الأوامر</span>
                  </button>
                </div>
                <pre className="p-3 rounded-xl bg-slate-900 text-emerald-300 font-mono text-xs overflow-x-auto leading-relaxed">
{`npm install @capacitor/core @capacitor/android
npx cap init "نور وذكر" com.noorwadhikr.app --web-dir dist
npm run build
npx cap add android
npx cap open android`}
                </pre>
              </div>
            </div>
          )}

          {/* TAB 5: Play Store Requirements */}
          {activeTab === 'playstore' && (
            <div className="space-y-3 text-xs sm:text-sm text-slate-300">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <h4 className="font-bold text-amber-300 text-sm">متطلبات متجر Google Play الحديثة (2026):</h4>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span><strong>استهداف أحدث واجهة برمجية:</strong> Target API 36 (Android 16).</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span><strong>صيغة الحزمة:</strong> Android App Bundle (.aab) بدلاً من APK للمتجر.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span><strong>الرموز:</strong> أيقونة دائرية 512x512 مع مساحة أمان (Maskable icon).</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span><strong>العمل دون اتصال:</strong> محقق 100% في التطبيق عبر Service Worker.</span>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
          <p className="text-xs text-slate-400">
            تطبيق «الرفيق الإسلامي» جاهز تماماً للاستخدام اليومي بدون شبكة إنترنت
          </p>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs sm:text-sm transition"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
