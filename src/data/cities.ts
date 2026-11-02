export interface City {
  id: string;
  name: string;
  country: string;
  latitude: number;
  longitude: number;
  timezone: string;
  defaultMethod: string;
}

export const POPULAR_CITIES: City[] = [
  { id: 'makkah', name: 'مكة المكرمة', country: 'المملكة العربية السعودية', latitude: 21.4225, longitude: 39.8262, timezone: 'Asia/Riyadh', defaultMethod: 'Makkah' },
  { id: 'madinah', name: 'المدينة المنورة', country: 'المملكة العربية السعودية', latitude: 24.4672, longitude: 39.6112, timezone: 'Asia/Riyadh', defaultMethod: 'Makkah' },
  { id: 'riyadh', name: 'الرياض', country: 'المملكة العربية السعودية', latitude: 24.7136, longitude: 46.6753, timezone: 'Asia/Riyadh', defaultMethod: 'Makkah' },
  { id: 'cairo', name: 'القاهرة', country: 'مصر', latitude: 30.0444, longitude: 31.2357, timezone: 'Africa/Cairo', defaultMethod: 'Egypt' },
  { id: 'alexandria', name: 'الإسكندرية', country: 'مصر', latitude: 31.2001, longitude: 29.9187, timezone: 'Africa/Cairo', defaultMethod: 'Egypt' },
  { id: 'jerusalem', name: 'القدس الشريف', country: 'فلسطين', latitude: 31.7683, longitude: 35.2137, timezone: 'Asia/Jerusalem', defaultMethod: 'MWL' },
  { id: 'dubai', name: 'دبي', country: 'الإمارات العربية المتحدة', latitude: 25.2048, longitude: 55.2708, timezone: 'Asia/Dubai', defaultMethod: 'Gulf' },
  { id: 'abudhabi', name: 'أبوظبي', country: 'الإمارات العربية المتحدة', latitude: 24.4539, longitude: 54.3773, timezone: 'Asia/Dubai', defaultMethod: 'Gulf' },
  { id: 'amman', name: 'عمّان', country: 'الأردن', latitude: 31.9539, longitude: 35.9106, timezone: 'Asia/Amman', defaultMethod: 'MWL' },
  { id: 'damascus', name: 'دمشق', country: 'سوريا', latitude: 33.5138, longitude: 36.2765, timezone: 'Asia/Damascus', defaultMethod: 'MWL' },
  { id: 'beirut', name: 'بيروت', country: 'لبنان', latitude: 33.8938, longitude: 35.5018, timezone: 'Asia/Beirut', defaultMethod: 'MWL' },
  { id: 'baghdad', name: 'بغداد', country: 'العراق', latitude: 33.3152, longitude: 44.3661, timezone: 'Asia/Baghdad', defaultMethod: 'MWL' },
  { id: 'kuwait', name: 'مدينة الكويت', country: 'الكويت', latitude: 29.3759, longitude: 47.9774, timezone: 'Asia/Kuwait', defaultMethod: 'Makkah' },
  { id: 'doha', name: 'الدوحة', country: 'قطر', latitude: 25.2854, longitude: 51.5310, timezone: 'Asia/Qatar', defaultMethod: 'Makkah' },
  { id: 'manama', name: 'المنامة', country: 'البحرين', latitude: 26.2285, longitude: 50.5860, timezone: 'Asia/Bahrain', defaultMethod: 'Makkah' },
  { id: 'muscat', name: 'مسقط', country: 'سلطنة عمان', latitude: 23.5880, longitude: 58.3829, timezone: 'Asia/Muscat', defaultMethod: 'Makkah' },
  { id: 'sanaa', name: 'صنعاء', country: 'اليمن', latitude: 15.3694, longitude: 44.1910, timezone: 'Asia/Aden', defaultMethod: 'Makkah' },
  { id: 'tunis', name: 'تونس', country: 'تونس', latitude: 36.8065, longitude: 10.1815, timezone: 'Africa/Tunis', defaultMethod: 'MWL' },
  { id: 'algiers', name: 'الجزائر', country: 'الجزائر', latitude: 36.7538, longitude: 3.0588, timezone: 'Africa/Algiers', defaultMethod: 'MWL' },
  { id: 'rabat', name: 'الرباط', country: 'المغرب', latitude: 34.0209, longitude: -6.8416, timezone: 'Africa/Casablanca', defaultMethod: 'MWL' },
  { id: 'casablanca', name: 'الدار البيضاء', country: 'المغرب', latitude: 33.5731, longitude: -7.5898, timezone: 'Africa/Casablanca', defaultMethod: 'MWL' },
  { id: 'khartoum', name: 'الخرطوم', country: 'السودان', latitude: 15.5007, longitude: 32.5599, timezone: 'Africa/Khartoum', defaultMethod: 'Egypt' },
  { id: 'tripoli', name: 'طرابلس', country: 'ليبيا', latitude: 32.8872, longitude: 13.1913, timezone: 'Africa/Tripoli', defaultMethod: 'MWL' },
  { id: 'istanbul', name: 'إسطنبول', country: 'تركيا', latitude: 41.0082, longitude: 28.9784, timezone: 'Europe/Istanbul', defaultMethod: 'MWL' },
  { id: 'london', name: 'لندن', country: 'المملكة المتحدة', latitude: 51.5074, longitude: -0.1278, timezone: 'Europe/London', defaultMethod: 'MWL' },
  { id: 'paris', name: 'باريس', country: 'فرنسا', latitude: 48.8566, longitude: 2.3522, timezone: 'Europe/Paris', defaultMethod: 'MWL' },
  { id: 'newyork', name: 'نيويورك', country: 'الولايات المتحدة', latitude: 40.7128, longitude: -74.0060, timezone: 'America/New_York', defaultMethod: 'ISNA' },
  { id: 'kualalumpur', name: 'كوالالمبور', country: 'ماليزيا', latitude: 3.1390, longitude: 101.6869, timezone: 'Asia/Kuala_Lumpur', defaultMethod: 'MWL' },
  { id: 'jakarta', name: 'جاكرتا', country: 'إندونيسيا', latitude: -6.2088, longitude: 106.8456, timezone: 'Asia/Jakarta', defaultMethod: 'MWL' }
];
