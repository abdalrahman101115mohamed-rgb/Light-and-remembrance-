import React from 'react';
import { X, Smartphone, ShieldCheck, BatteryCharging, BellRing, Sparkles, CheckCircle2 } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const LockScreenGuideModal: React.FC<Props> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl bg-emerald-950 border-2 border-amber-500/40 p-6 text-white shadow-2xl space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-amber-500/20">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500 text-emerald-950 shadow-md">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg text-amber-300 font-quran">
                تفعيل الأذكار والتنبيهات عند قفل الشاشة 📱
              </h3>
              <p className="text-xs text-emerald-300/80">
                خطوات بسيطة لضمان استمرار نداء الأذان والأذكار كل 3 دقائق دون توقف
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-emerald-300 hover:text-white hover:bg-emerald-900 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Why this is important banner */}
        <div className="p-4 rounded-2xl bg-amber-500/15 border border-amber-400/40 text-xs text-amber-200 space-y-2">
          <div className="flex items-center gap-2 font-bold text-amber-300">
            <Sparkles className="w-4 h-4" />
            <span>لماذا نحتاج هذه الإعدادات؟</span>
          </div>
          <p className="leading-relaxed">
            أنظمة الهواتف الذكية (أندرويد وآيفون) تقوم تلقائياً بتجميد التطبيقات عند إغلاق الشاشة لتوفير طاقة البطارية. 
            باتباع الخطوات التالية، سيستمر التطبيق في إرسال تذكيرات «صلِّ على النبي ﷺ» ونطق الأذكار والأذان حتى وشاشة الهاتف مغلقة تماماً.
          </p>
        </div>

        {/* Device Steps */}
        <div className="space-y-4 text-xs">
          {/* Step 1: Notifications */}
          <div className="p-4 rounded-2xl bg-emerald-900/40 border border-emerald-800 space-y-2">
            <h4 className="font-bold text-sm text-amber-300 flex items-center gap-2">
              <BellRing className="w-4 h-4 text-amber-400" />
              <span>1. السماح بالإشعارات على شاشة القفل:</span>
            </h4>
            <ul className="space-y-1.5 text-emerald-100/90 list-disc list-inside pr-2 leading-relaxed">
              <li>اضغط على <strong>«منح الصلاحية»</strong> للإشعارات في التطبيق إذا طُلبت منك.</li>
              <li>من إعدادات هاتفك ➔ <strong>التطبيقات والإشعارات</strong> ➔ اختر المتصفح أو تطبيق «نور وذكر».</li>
              <li>تأكد من تفعيل خيار: <strong>«إظهار الإشعارات على شاشة القفل»</strong> و <strong>«السماح بالصوت والاهتزاز»</strong>.</li>
            </ul>
          </div>

          {/* Step 2: Battery Optimization */}
          <div className="p-4 rounded-2xl bg-emerald-900/40 border border-emerald-800 space-y-2">
            <h4 className="font-bold text-sm text-amber-300 flex items-center gap-2">
              <BatteryCharging className="w-4 h-4 text-amber-400" />
              <span>2. استثناء التطبيق من موفر طاقة البطارية (Battery Saver):</span>
            </h4>
            <div className="space-y-2 text-emerald-100/90 leading-relaxed">
              <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-800/60">
                <strong className="text-amber-200 block mb-1">لهواتف سامسونج (Samsung):</strong>
                <span>الإعدادات ➔ البطارية والعناية بالجهاز ➔ البطارية ➔ حدود استخدام الخلفية ➔ أضف «نور وذكر / المتصفح» إلى <strong>«التطبيقات التي لن تنتقل لوضع السكون أبداً»</strong>.</span>
              </div>

              <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-800/60">
                <strong className="text-amber-200 block mb-1">لهواتف شاومي وريدمي (Xiaomi / Redmi / Poco):</strong>
                <span>الإعدادات ➔ التطبيقات ➔ إدارة التطبيقات ➔ اختر التطبيق ➔ <strong>التشغيل التلقائي (Autostart)</strong>: فعّلها ➔ موفر البطارية: اختر <strong>«لا توجد قيود (No restrictions)»</strong>.</span>
              </div>

              <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-800/60">
                <strong className="text-amber-200 block mb-1">لهواتف أوبو وريلمي وفيفو (Oppo / Realme / Vivo):</strong>
                <span>إعدادات التطبيق ➔ استهلاك البطارية ➔ فعّل <strong>«السماح بنشاط الخلفية (Allow Background Activity)»</strong>.</span>
              </div>

              <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-800/60">
                <strong className="text-amber-200 block mb-1">لهواتف آيفون (iPhone / iOS):</strong>
                <span>تأكد من تثبيت التطبيق على الشاشة الرئيسية عبر زر المشاركة ➔ «إضافة إلى الشاشة الرئيسية»، وتأكد من تفعيل الإشعارات للتطبيق من إعدادات iOS.</span>
              </div>
            </div>
          </div>

          {/* Step 3: Keep audio alive */}
          <div className="p-4 rounded-2xl bg-emerald-900/40 border border-emerald-800 space-y-1.5">
            <h4 className="font-bold text-sm text-amber-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>3. وضع الخلفية الصوتي التلقائي:</span>
            </h4>
            <p className="text-emerald-200/90 leading-relaxed">
              تطبيق «نور وذكر» مُزوّد ببروتوكول تفاعل صوتي خلفي ذكي (MediaSession Keep-Alive) يُبقي محرك التذكير يعمل بشكل صامت في الخلفية ليطلق صوت التذكير والأذان بدقة حتى عند إطفاء الشاشة.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-emerald-950 font-bold text-sm shadow-md transition hover:from-amber-400"
          >
            فهمت ذلك، تم تطبيق الإعدادات 👍
          </button>
        </div>
      </div>
    </div>
  );
};
