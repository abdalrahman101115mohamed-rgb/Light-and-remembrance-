// Astronomical Prayer Times Calculation Engine

export type CalculationMethodKey = 'Egypt' | 'Makkah' | 'MWL' | 'ISNA' | 'Karachi' | 'Gulf' | 'Tehran';
export type JuristicMethodKey = 'Standard' | 'Hanafi';

export interface MethodConfig {
  name: string;
  fajrAngle: number;
  ishaAngle: number;
  ishaIntervalMinutes?: number; // e.g. Makkah is 90 mins (or 120 in Ramadan)
}

export const CALCULATION_METHODS: Record<CalculationMethodKey, MethodConfig> = {
  Egypt: {
    name: 'الهيئة المصرية العامة للمساحة',
    fajrAngle: 19.5,
    ishaAngle: 17.5,
  },
  Makkah: {
    name: 'جامعة أم القرى - مكة المكرمة',
    fajrAngle: 18.5,
    ishaAngle: 0,
    ishaIntervalMinutes: 90,
  },
  MWL: {
    name: 'رابطة العالم الإسلامي',
    fajrAngle: 18.0,
    ishaAngle: 17.0,
  },
  ISNA: {
    name: 'الجمعية الإسلامية لأمريكا الشمالية (ISNA)',
    fajrAngle: 15.0,
    ishaAngle: 15.0,
  },
  Karachi: {
    name: 'جامعة العلوم الإسلامية بكراتشي',
    fajrAngle: 18.0,
    ishaAngle: 18.0,
  },
  Gulf: {
    name: 'دبي ودول الخليج العربي',
    fajrAngle: 19.5,
    ishaAngle: 0,
    ishaIntervalMinutes: 90,
  },
  Tehran: {
    name: 'معهد ليفا (طهران)',
    fajrAngle: 17.7,
    ishaAngle: 14.0,
  },
};

export interface PrayerTimesResult {
  fajr: Date;
  sunrise: Date;
  dhuhr: Date;
  asr: Date;
  maghrib: Date;
  isha: Date;
  imsak: Date;
}

export interface NextPrayerInfo {
  name: string;
  key: keyof PrayerTimesResult;
  time: Date;
  timeString: string;
  remainingSeconds: number;
  formattedRemaining: string;
  isIftar: boolean;
  isSuhoor: boolean;
}

// Math helpers for solar astronomy
const d2r = (d: number) => (d * Math.PI) / 180;
const r2d = (r: number) => (r * 180) / Math.PI;
const fixAngle = (a: number) => {
  const res = a - 360 * Math.floor(a / 360);
  return res < 0 ? res + 360 : res;
};
const fixHour = (h: number) => {
  const res = h - 24 * Math.floor(h / 24);
  return res < 0 ? res + 24 : res;
};

// Sun position calculations
function sunPosition(jd: number) {
  const D = jd - 2451545.0;
  const g = fixAngle(357.529 + 0.98560028 * D);
  const q = fixAngle(280.459 + 0.98564736 * D);
  const L = fixAngle(q + 1.915 * Math.sin(d2r(g)) + 0.02 * Math.sin(d2r(2 * g)));
  const e = 23.439 - 0.00000036 * D;
  const d = r2d(Math.asin(Math.sin(d2r(e)) * Math.sin(d2r(L))));
  let ra = r2d(Math.atan2(Math.cos(d2r(e)) * Math.sin(d2r(L)), Math.cos(d2r(L)))) / 15;
  ra = fixHour(ra);
  const eqT = q / 15 - ra;
  return { declination: d, equationOfTime: eqT };
}

function julianDate(year: number, month: number, day: number) {
  if (month <= 2) {
    year -= 1;
    month += 12;
  }
  const A = Math.floor(year / 100);
  const B = 2 - A + Math.floor(A / 4);
  return Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + B - 1524.5;
}

// Compute prayer times for a given date and location
export function calculatePrayerTimes(
  date: Date,
  lat: number,
  lng: number,
  methodKey: CalculationMethodKey = 'Egypt',
  juristicKey: JuristicMethodKey = 'Standard'
): PrayerTimesResult {
  const method = CALCULATION_METHODS[methodKey] || CALCULATION_METHODS.Egypt;
  const asrFactor = juristicKey === 'Hanafi' ? 2 : 1;

  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const jd = julianDate(year, month, day);
  const timezoneOffsetHours = -date.getTimezoneOffset() / 60;

  const sun = sunPosition(jd);
  const transit = 12 + timezoneOffsetHours - lng / 15 - sun.equationOfTime;

  // Sun hour angle helper
  const hourAngle = (angle: number) => {
    const latRad = d2r(lat);
    const decRad = d2r(sun.declination);
    const cosHA = (Math.sin(d2r(-angle)) - Math.sin(latRad) * Math.sin(decRad)) / (Math.cos(latRad) * Math.cos(decRad));
    if (cosHA > 1 || cosHA < -1) return 0;
    return r2d(Math.acos(cosHA)) / 15;
  };

  // Asr hour angle helper
  const asrHourAngle = (factor: number) => {
    const latRad = d2r(lat);
    const decRad = d2r(sun.declination);
    const cotA = factor + Math.tan(Math.abs(latRad - decRad));
    const alt = r2d(Math.atan(1 / cotA));
    const cosHA = (Math.sin(d2r(alt)) - Math.sin(latRad) * Math.sin(decRad)) / (Math.cos(latRad) * Math.cos(decRad));
    if (cosHA > 1 || cosHA < -1) return 0;
    return r2d(Math.acos(cosHA)) / 15;
  };

  const dhuhrHours = transit;
  const sunriseHours = transit - hourAngle(0.833);
  const sunsetHours = transit + hourAngle(0.833);
  const fajrHours = transit - hourAngle(method.fajrAngle);
  const asrHours = transit + asrHourAngle(asrFactor);

  let ishaHours: number;
  if (method.ishaIntervalMinutes) {
    ishaHours = sunsetHours + method.ishaIntervalMinutes / 60;
  } else {
    ishaHours = transit + hourAngle(method.ishaAngle);
  }

  const hoursToDate = (h: number) => {
    const result = new Date(date);
    const normalizedH = fixHour(h);
    const hours = Math.floor(normalizedH);
    const minutes = Math.floor((normalizedH - hours) * 60);
    const seconds = Math.floor(((normalizedH - hours) * 60 - minutes) * 60);
    result.setHours(hours, minutes, seconds, 0);
    return result;
  };

  const fajrDate = hoursToDate(fajrHours);
  const imsakDate = new Date(fajrDate.getTime() - 10 * 60 * 1000); // 10 minutes before Fajr

  return {
    imsak: imsakDate,
    fajr: fajrDate,
    sunrise: hoursToDate(sunriseHours),
    dhuhr: hoursToDate(dhuhrHours),
    asr: hoursToDate(asrHours),
    maghrib: hoursToDate(sunsetHours),
    isha: hoursToDate(ishaHours),
  };
}

// Arabic prayer names mapping
export const PRAYER_NAMES_AR: Record<keyof PrayerTimesResult, string> = {
  imsak: 'الإمساك',
  fajr: 'الفجر',
  sunrise: 'الشروق',
  dhuhr: 'الظهر',
  asr: 'العصر',
  maghrib: 'المغرب',
  isha: 'العشاء',
};

// Format Date object to Arabic 12-hour or 24-hour time
export function formatTimeArabic(d: Date, use24h: boolean = false): string {
  if (use24h) {
    return d.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit', hour12: false });
  }
  const hours = d.getHours();
  const minutes = d.getMinutes().toString().padStart(2, '0');
  const period = hours >= 12 ? 'م' : 'ص';
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${minutes} ${period}`;
}

// Format seconds into Arabic "X س Y د Z ث"
export function formatDurationArabic(totalSeconds: number): string {
  if (totalSeconds <= 0) return '0 د';
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const parts: string[] = [];
  if (hours > 0) parts.push(`${hours} ساعة`);
  if (minutes > 0) parts.push(`${minutes} دقيقة`);
  if (seconds > 0 && hours === 0) parts.push(`${seconds} ثانية`);

  return parts.join(' و ') || 'أقل من دقيقة';
}

// Determine the next upcoming prayer
export function getNextPrayer(prayerTimes: PrayerTimesResult, now: Date = new Date()): NextPrayerInfo {
  const prayers: Array<{ key: keyof PrayerTimesResult; time: Date }> = [
    { key: 'fajr', time: prayerTimes.fajr },
    { key: 'sunrise', time: prayerTimes.sunrise },
    { key: 'dhuhr', time: prayerTimes.dhuhr },
    { key: 'asr', time: prayerTimes.asr },
    { key: 'maghrib', time: prayerTimes.maghrib },
    { key: 'isha', time: prayerTimes.isha },
  ];

  for (const p of prayers) {
    if (p.time.getTime() > now.getTime()) {
      const remainingSeconds = Math.max(0, Math.floor((p.time.getTime() - now.getTime()) / 1000));
      return {
        key: p.key,
        name: PRAYER_NAMES_AR[p.key],
        time: p.time,
        timeString: formatTimeArabic(p.time),
        remainingSeconds,
        formattedRemaining: formatDurationArabic(remainingSeconds),
        isIftar: p.key === 'maghrib',
        isSuhoor: p.key === 'fajr',
      };
    }
  }

  // If all prayers passed today, the next prayer is Fajr tomorrow
  const tomorrowFajr = new Date(prayerTimes.fajr.getTime() + 24 * 60 * 60 * 1000);
  const remainingSeconds = Math.max(0, Math.floor((tomorrowFajr.getTime() - now.getTime()) / 1000));
  return {
    key: 'fajr',
    name: PRAYER_NAMES_AR.fajr,
    time: tomorrowFajr,
    timeString: formatTimeArabic(tomorrowFajr),
    remainingSeconds,
    formattedRemaining: formatDurationArabic(remainingSeconds),
    isIftar: false,
    isSuhoor: true,
  };
}

// Countdown to Iftar (Maghrib)
export function getIftarCountdown(prayerTimes: PrayerTimesResult, now: Date = new Date()): { remainingSeconds: number; formatted: string; hasPassed: boolean } {
  const maghribTime = prayerTimes.maghrib.getTime();
  const nowTime = now.getTime();
  
  if (nowTime < maghribTime) {
    const diff = Math.floor((maghribTime - nowTime) / 1000);
    return {
      remainingSeconds: diff,
      formatted: formatDurationArabic(diff),
      hasPassed: false,
    };
  } else {
    // Next day's Iftar
    const nextDayMaghrib = maghribTime + 24 * 60 * 60 * 1000;
    const diff = Math.floor((nextDayMaghrib - nowTime) / 1000);
    return {
      remainingSeconds: diff,
      formatted: formatDurationArabic(diff),
      hasPassed: true,
    };
  }
}

// Accurate Hijri Date Calculator with manual offset support
export function getHijriDate(date: Date = new Date(), offsetDays: number = 0): {
  day: number;
  month: number;
  year: number;
  monthName: string;
  formatted: string;
  isRamadan: boolean;
  ramadanDay: number;
} {
  const adjustedDate = new Date(date.getTime() + offsetDays * 24 * 60 * 60 * 1000);

  // Using standard Intl.DateTimeFormat with islamic-umalqura calendar
  try {
    const formatter = new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    });
    const parts = formatter.formatToParts(adjustedDate);
    const day = parseInt(parts.find(p => p.type === 'day')?.value || '1', 10);
    const month = parseInt(parts.find(p => p.type === 'month')?.value || '9', 10);
    const year = parseInt(parts.find(p => p.type === 'year')?.value || '1448', 10);

    const monthNamesAr = [
      'محرم', 'صفر', 'ربيع الأول', 'ربيع الآخر',
      'جمادى الأولى', 'جمادى الآخرة', 'رجب', 'شعبان',
      'رمضان المبارك', 'شوال', 'ذو القعدة', 'ذو الحجة'
    ];

    const monthName = monthNamesAr[(month - 1) % 12];
    const isRamadan = month === 9;
    const ramadanDay = isRamadan ? day : (month < 9 ? 0 : 30);

    return {
      day,
      month,
      year,
      monthName,
      formatted: `${day} ${monthName} ${year} هـ`,
      isRamadan,
      ramadanDay: Math.min(30, Math.max(1, day)),
    };
  } catch {
    // Fallback if Intl calendar not supported
    return {
      day: 1,
      month: 9,
      year: 1448,
      monthName: 'رمضان المبارك',
      formatted: '1 رمضان المبارك 1448 هـ',
      isRamadan: true,
      ramadanDay: 1,
    };
  }
}
