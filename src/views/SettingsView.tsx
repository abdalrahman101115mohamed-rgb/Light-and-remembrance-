import React, { useState } from 'react';
import {
  Settings,
  MapPin,
  Compass,
  Bell,
  Clock,
  Volume2,
  Moon,
  Sun,
  Smartphone,
  RotateCcw,
  Check,
  ShieldCheck
} from 'lucide-react';
import { POPULAR_CITIES, City } from '../data/cities';
import { CALCULATION_METHODS, CalculationMethodKey, JuristicMethodKey } from '../utils/prayerTimes';
import { playPrayerChime, triggerHaptic } from '../utils/soundEffects';
import { SalawatReminderWidget } from '../components/SalawatReminderWidget';
import { AdhanSettingsWidget } from '../components/AdhanSettingsWidget';

interface AppSettings {
  selectedCity: City;
  calculationMethod: CalculationMethodKey;
  juristicMethod: JuristicMethodKey;
  hijriOffset: number;
  notificationsEnabled: boolean;
  prePrayerAlertMinutes: number;
  theme: 'emerald' | 'midnight' | 'light';
  soundEnabled: boolean;
}

interface Props {
  settings: AppSettings;
  onUpdateSettings: (newSettings: AppSettings) => void;
  onOpenAndroidGuide: () => void;
}

export const SettingsView: React.FC<Props> = ({ settings, onUpdateSettings, onOpenAndroidGuide }) => {
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);

  const handleCityChange = (cityId: string) => {
    const found = POPULAR_CITIES.find(c => c.id === cityId);
    if (found) {
      onUpdateSettings({
        ...settings,
        selectedCity: found,
        calculationMethod: (found.defaultMethod as CalculationMethodKey) || settings.calculationMethod,
      });
    }
  };

  const handleGpsDetect = () => {
    if (!navigator.geolocation) {
      setGpsError('خاصية تحديد الموقع الجغرافي غير مدعومة في متصفحك.');
      return;
    }
    setGpsLoading(true);
    setGpsError(null);

    navigator.geolocation.getCurrentPosition(
      pos => {
        const customGpsCity: City = {
          id: 'custom_gps',
          name: 'موقعي الحالي (GPS)',
          country: 'إحداثيات محددة تلقائياً',
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
          defaultMethod: settings.calculationMethod,
        };
        onUpdateSettings({
          ...settings,
          selectedCity: customGpsCity,
        });
        setGpsLoading(false);
        triggerHaptic(50);
      },
      err => {
        console.warn('GPS error:', err);
        setGpsError('تعذر تحديد موقعك الحالي، يرجى التأكد من تفعيل إذن الموقع الجغرافي.');
        setGpsLoading(false);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleRequestNotifications = async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      alert('الإشعارات غير مدعومة في متصفحك.');
      return;
    }
    try {
      const perm = await Notification.requestPermission();
      if (perm === 'granted') {
        onUpdateSettings({ ...settings, notificationsEnabled: true });
        new Notification('رمضان كريم', {
          body: 'تم تفعيل تنبيهات مواقيت الصلاة والأذكار بنجاح!',
          icon: '/icon-192.png',
        });
      } else {
        onUpdateSettings({ ...settings, notificationsEnabled: false });
        alert('تم رفض إذن الإشعارات من إعدادات المتصفح.');
      }
    } catch (e) {
      console.warn(e);
    }
  };

  const handleTestChime = () => {
    triggerHaptic(50);
    playPrayerChime();
  };

  const handleResetSettings = () => {
    if (window.confirm('هل تريد استعادة جميع الإعدادات الافتراضية؟')) {
      const defaultSettings: AppSettings = {
        selectedCity: POPULAR_CITIES[0], // Makkah
        calculationMethod: 'Makkah',
        juristicMethod: 'Standard',
        hijriOffset: 0,
        notificationsEnabled: false,
        prePrayerAlertMinutes: 10,
        theme: 'emerald',
        soundEnabled: true,
      };
      onUpdateSettings(defaultSettings);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-4 space-y-6">
      {/* Top Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-emerald-900/60 to-emerald-950/80 border border-amber-500/30 p-5 shadow-xl space-y-1">
        <h2 className="text-lg sm:text-xl font-bold text-amber-200 flex items-center gap-2">
          <Settings className="w-5 h-5 text-amber-400" />
          <span>إعدادات تطبيق «نور وذكر»</span>
        </h2>
        <p className="text-xs text-emerald-200/80">
          التحكم في الأذان التلقائي، أصوات المؤذنين، الأذكار الصوتية، وأوقات السكون بدون نت
        </p>
      </div>

      {/* 1. Automatic Adhan & Muezzin Selection */}
      <AdhanSettingsWidget />

      {/* 2. 5-Minute Sequential Azkar & Sleep Hours */}
      <SalawatReminderWidget />

      {/* 1. Location & City */}
      <div className="rounded-3xl bg-emerald-950/50 border border-emerald-800/50 p-5 sm:p-6 space-y-4">
        <h3 className="text-sm font-bold text-amber-300 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-amber-400" />
          <span>تحديد المدينة والموقع الجغرافي:</span>
        </h3>

        <div className="space-y-3">
          <div>
            <label className="text-xs text-emerald-200/80 block mb-1">اختر من المدن الأكثر شيوعاً:</label>
            <select
              value={settings.selectedCity.id}
              onChange={e => handleCityChange(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-emerald-900/60 border border-emerald-700/60 text-white text-xs sm:text-sm focus:outline-none focus:border-amber-400"
            >
              {POPULAR_CITIES.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name} — {c.country}
                </option>
              ))}
              {settings.selectedCity.id === 'custom_gps' && (
                <option value="custom_gps">موقعي الحالي (GPS)</option>
              )}
            </select>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
            <button
              onClick={handleGpsDetect}
              disabled={gpsLoading}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-emerald-800/80 hover:bg-emerald-700 text-amber-200 text-xs font-semibold border border-amber-500/30 transition shadow-sm"
            >
              <Compass className="w-4 h-4" />
              <span>{gpsLoading ? 'جاري تحديد موقعك...' : 'تحديد الموقع تلقائياً عبر (GPS)'}</span>
            </button>

            <span className="text-[11px] text-emerald-400/70">
              خط العرض: {settings.selectedCity.latitude.toFixed(2)}° • خط الطول: {settings.selectedCity.longitude.toFixed(2)}°
            </span>
          </div>

          {gpsError && (
            <p className="text-xs text-rose-300 bg-rose-950/50 p-2.5 rounded-xl border border-rose-800/40">
              {gpsError}
            </p>
          )}
        </div>
      </div>

      {/* 2. Calculation Methods */}
      <div className="rounded-3xl bg-emerald-950/50 border border-emerald-800/50 p-5 sm:p-6 space-y-4">
        <h3 className="text-sm font-bold text-amber-300 flex items-center gap-2">
          <Clock className="w-4 h-4 text-amber-400" />
          <span>طريقة حساب مواقيت الصلاة والمذهب الفقهي:</span>
        </h3>

        <div className="space-y-3">
          <div>
            <label className="text-xs text-emerald-200/80 block mb-1">الهيئة الحسابية المعتمدة:</label>
            <select
              value={settings.calculationMethod}
              onChange={e => onUpdateSettings({ ...settings, calculationMethod: e.target.value as CalculationMethodKey })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-emerald-900/60 border border-emerald-700/60 text-white text-xs sm:text-sm focus:outline-none focus:border-amber-400"
            >
              {Object.entries(CALCULATION_METHODS).map(([key, config]) => (
                <option key={key} value={key}>
                  {config.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs text-emerald-200/80 block mb-1">حساب صلاة العصر (المذهب الفقهي):</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onUpdateSettings({ ...settings, juristicMethod: 'Standard' })}
                className={`p-2.5 rounded-xl border text-xs font-semibold text-center transition ${
                  settings.juristicMethod === 'Standard'
                    ? 'bg-amber-500/20 border-amber-400 text-amber-200 shadow'
                    : 'bg-emerald-900/40 border-emerald-800/40 text-emerald-300/70 hover:bg-emerald-900/60'
                }`}
              >
                الشافعي والمالكي والحنبلي (الجمهور)
              </button>
              <button
                onClick={() => onUpdateSettings({ ...settings, juristicMethod: 'Hanafi' })}
                className={`p-2.5 rounded-xl border text-xs font-semibold text-center transition ${
                  settings.juristicMethod === 'Hanafi'
                    ? 'bg-amber-500/20 border-amber-400 text-amber-200 shadow'
                    : 'bg-emerald-900/40 border-emerald-800/40 text-emerald-300/70 hover:bg-emerald-900/60'
                }`}
              >
                المذهب الحنفي (ظل الشيء مثليه)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Hijri Adjustment */}
      <div className="rounded-3xl bg-emerald-950/50 border border-emerald-800/50 p-5 sm:p-6 space-y-4">
        <h3 className="text-sm font-bold text-amber-300 flex items-center gap-2">
          <Moon className="w-4 h-4 text-amber-400" />
          <span>تعديل التقويم الهجري (رؤية الهلال):</span>
        </h3>

        <div className="flex items-center justify-between">
          <span className="text-xs text-emerald-200/80">
            تعديل التاريخ لمطابقة الرؤية الشرعية في بلدك:
          </span>

          <div className="flex items-center gap-2 bg-emerald-900/60 p-1 rounded-2xl border border-emerald-800/50">
            {[-2, -1, 0, 1, 2].map(offset => (
              <button
                key={offset}
                onClick={() => onUpdateSettings({ ...settings, hijriOffset: offset })}
                className={`w-8 h-8 rounded-xl text-xs font-bold font-mono transition ${
                  settings.hijriOffset === offset
                    ? 'bg-amber-500 text-emerald-950 shadow'
                    : 'text-emerald-300 hover:text-white'
                }`}
              >
                {offset > 0 ? `+${offset}` : offset}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Notifications & Sound */}
      <div className="rounded-3xl bg-emerald-950/50 border border-emerald-800/50 p-5 sm:p-6 space-y-4">
        <h3 className="text-sm font-bold text-amber-300 flex items-center gap-2">
          <Bell className="w-4 h-4 text-amber-400" />
          <span>التنبيهات والأذان:</span>
        </h3>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs sm:text-sm font-semibold text-white block">إشعارات مواقيت الصلاة</span>
              <span className="text-[11px] text-emerald-300/70">تنبيه عند دخول وقت الصلاة ووقت الإفطار</span>
            </div>

            <button
              onClick={handleRequestNotifications}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                settings.notificationsEnabled
                  ? 'bg-emerald-600 text-white shadow'
                  : 'bg-emerald-900/80 text-amber-300 border border-amber-500/30'
              }`}
            >
              {settings.notificationsEnabled ? 'مفعلة ✓' : 'تفعيل الإشعارات'}
            </button>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-emerald-800/40">
            <div>
              <span className="text-xs sm:text-sm font-semibold text-white block">صوت التنبيه والأذان</span>
              <span className="text-[11px] text-emerald-300/70">نغمة روحانية هادئة عند الأذان</span>
            </div>

            <button
              onClick={handleTestChime}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-800/80 hover:bg-emerald-700 text-amber-200 text-xs transition"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>تجربة الصوت</span>
            </button>
          </div>
        </div>
      </div>

      {/* 5. Theme Settings */}
      <div className="rounded-3xl bg-emerald-950/50 border border-emerald-800/50 p-5 sm:p-6 space-y-4">
        <h3 className="text-sm font-bold text-amber-300 flex items-center gap-2">
          <Sun className="w-4 h-4 text-amber-400" />
          <span>المظهر والوضع الليلي/النهاري:</span>
        </h3>

        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => onUpdateSettings({ ...settings, theme: 'emerald' })}
            className={`p-3 rounded-2xl border text-center transition ${
              settings.theme === 'emerald'
                ? 'bg-emerald-800 border-amber-400 text-amber-200 font-bold shadow-md'
                : 'bg-emerald-950/40 border-emerald-800/40 text-emerald-300/70 hover:bg-emerald-900/40'
            }`}
          >
            <div className="w-full h-3 rounded-full bg-emerald-900 mb-1.5 border border-emerald-700" />
            <span className="text-xs">رمضان زمردي</span>
          </button>

          <button
            onClick={() => onUpdateSettings({ ...settings, theme: 'midnight' })}
            className={`p-3 rounded-2xl border text-center transition ${
              settings.theme === 'midnight'
                ? 'bg-indigo-950 border-amber-400 text-amber-200 font-bold shadow-md'
                : 'bg-emerald-950/40 border-emerald-800/40 text-emerald-300/70 hover:bg-emerald-900/40'
            }`}
          >
            <div className="w-full h-3 rounded-full bg-slate-950 mb-1.5 border border-indigo-700" />
            <span className="text-xs">ليلي كاحل</span>
          </button>

          <button
            onClick={() => onUpdateSettings({ ...settings, theme: 'light' })}
            className={`p-3 rounded-2xl border text-center transition ${
              settings.theme === 'light'
                ? 'bg-emerald-700/60 border-amber-400 text-amber-100 font-bold shadow-md'
                : 'bg-emerald-950/40 border-emerald-800/40 text-emerald-300/70 hover:bg-emerald-900/40'
            }`}
          >
            <div className="w-full h-3 rounded-full bg-emerald-100 mb-1.5 border border-amber-400" />
            <span className="text-xs">نهاري هادئ</span>
          </button>
        </div>
      </div>

      {/* 6. Android APK Download Launcher */}
      <div className="rounded-3xl bg-gradient-to-r from-amber-500/20 via-emerald-800/30 to-teal-900/40 border border-amber-500/30 p-5 flex items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-amber-500 text-emerald-950 shrink-0">
            <Smartphone className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-sm sm:text-base text-amber-200">
              تنزيل وتثبيت تطبيق (نور وذكر) كـ APK
            </h4>
            <p className="text-xs text-emerald-200/80 mt-0.5">
              تثبيت مباشر على هاتف الأندرويد، استخراج APK، والعمل بدون نت 100%
            </p>
          </div>
        </div>

        <button
          onClick={onOpenAndroidGuide}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-emerald-950 font-bold text-xs sm:text-sm shadow-md transition whitespace-nowrap shrink-0"
        >
          تنزيل APK 📦
        </button>
      </div>

      {/* 7. Reset All */}
      <div className="pt-2 flex justify-center">
        <button
          onClick={handleResetSettings}
          className="flex items-center gap-1.5 text-xs text-rose-300/80 hover:text-rose-200 transition py-2"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>استعادة الإعدادات الافتراضية للتطبيق</span>
        </button>
      </div>
    </div>
  );
};
