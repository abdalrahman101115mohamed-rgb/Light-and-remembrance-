export interface SurahMeta {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: 'مكية' | 'مدنية';
  juz: number;
  page: number;
}

export interface Ayah {
  number: number;
  numberInSurah: number;
  text: string;
  juz: number;
  page: number;
  hizbQuarter?: number;
}

export interface Reciter {
  id: string;
  name: string;
  subname: string;
  audioServerUrl: string; // e.g. everyayah pattern
}

export const RECITERS: Reciter[] = [
  {
    id: 'alafasy',
    name: 'الشيخ مشاري راشد العفاسي',
    subname: 'حفص عن عاصم',
    audioServerUrl: 'https://everyayah.com/data/Alafasy_128kbps/',
  },
  {
    id: 'abdulbasit',
    name: 'الشيخ عبد الباسط عبد الصمد',
    subname: 'المصحف المرتل',
    audioServerUrl: 'https://everyayah.com/data/Abdul_Basit_Murattal_192kbps/',
  },
  {
    id: 'husary',
    name: 'الشيخ محمود خليل الحصري',
    subname: 'المصحف المرتل',
    audioServerUrl: 'https://everyayah.com/data/Husary_128kbps/',
  },
  {
    id: 'muaiqly',
    name: 'الشيخ ماهر المعيقلي',
    subname: 'إمام الحرم المكي',
    audioServerUrl: 'https://everyayah.com/data/MaherAlMuaiqly128kbps/',
  },
  {
    id: 'ghamadi',
    name: 'الشيخ سعد الغامدي',
    subname: 'تلاوة خاشعة',
    audioServerUrl: 'https://everyayah.com/data/Ghamadi_40kbps/',
  },
];

// All 114 Surahs Metadata
export const SURAHS_LIST: SurahMeta[] = [
  { number: 1, name: 'الفاتحة', englishName: 'Al-Faatiha', englishNameTranslation: 'The Opening', numberOfAyahs: 7, revelationType: 'مكية', juz: 1, page: 1 },
  { number: 2, name: 'البقرة', englishName: 'Al-Baqara', englishNameTranslation: 'The Cow', numberOfAyahs: 286, revelationType: 'مدنية', juz: 1, page: 2 },
  { number: 3, name: 'آل عمران', englishName: 'Aal-i-Imraan', englishNameTranslation: 'The Family of Imraan', numberOfAyahs: 200, revelationType: 'مدنية', juz: 3, page: 50 },
  { number: 4, name: 'النساء', englishName: 'An-Nisaa', englishNameTranslation: 'The Women', numberOfAyahs: 176, revelationType: 'مدنية', juz: 4, page: 77 },
  { number: 5, name: 'المائدة', englishName: 'Al-Maaida', englishNameTranslation: 'The Table', numberOfAyahs: 120, revelationType: 'مدنية', juz: 6, page: 106 },
  { number: 6, name: 'الأنعام', englishName: 'Al-An\'aam', englishNameTranslation: 'The Cattle', numberOfAyahs: 165, revelationType: 'مكية', juz: 7, page: 128 },
  { number: 7, name: 'الأعراف', englishName: 'Al-A\'raaf', englishNameTranslation: 'The Heights', numberOfAyahs: 206, revelationType: 'مكية', juz: 8, page: 151 },
  { number: 8, name: 'الأنفال', englishName: 'Al-Anfaal', englishNameTranslation: 'The Spoils of War', numberOfAyahs: 75, revelationType: 'مدنية', juz: 9, page: 177 },
  { number: 9, name: 'التوبة', englishName: 'At-Tawba', englishNameTranslation: 'The Repentance', numberOfAyahs: 129, revelationType: 'مدنية', juz: 10, page: 187 },
  { number: 10, name: 'يونس', englishName: 'Yunus', englishNameTranslation: 'Jonas', numberOfAyahs: 109, revelationType: 'مكية', juz: 11, page: 208 },
  { number: 11, name: 'هود', englishName: 'Hud', englishNameTranslation: 'Hud', numberOfAyahs: 123, revelationType: 'مكية', juz: 11, page: 221 },
  { number: 12, name: 'يوسف', englishName: 'Yusuf', englishNameTranslation: 'Joseph', numberOfAyahs: 111, revelationType: 'مكية', juz: 12, page: 235 },
  { number: 13, name: 'الرعد', englishName: 'Ar-Ra\'d', englishNameTranslation: 'The Thunder', numberOfAyahs: 43, revelationType: 'مدنية', juz: 13, page: 249 },
  { number: 14, name: 'إبراهيم', englishName: 'Ibrahim', englishNameTranslation: 'Abraham', numberOfAyahs: 52, revelationType: 'مكية', juz: 13, page: 255 },
  { number: 15, name: 'الحجر', englishName: 'Al-Hijr', englishNameTranslation: 'The Rock', numberOfAyahs: 99, revelationType: 'مكية', juz: 14, page: 262 },
  { number: 16, name: 'النحل', englishName: 'An-Nahl', englishNameTranslation: 'The Bee', numberOfAyahs: 128, revelationType: 'مكية', juz: 14, page: 267 },
  { number: 17, name: 'الإسراء', englishName: 'Al-Israa', englishNameTranslation: 'The Night Journey', numberOfAyahs: 111, revelationType: 'مكية', juz: 15, page: 282 },
  { number: 18, name: 'الكهف', englishName: 'Al-Kahf', englishNameTranslation: 'The Cave', numberOfAyahs: 110, revelationType: 'مكية', juz: 15, page: 293 },
  { number: 19, name: 'مريم', englishName: 'Maryam', englishNameTranslation: 'Mary', numberOfAyahs: 98, revelationType: 'مكية', juz: 16, page: 305 },
  { number: 20, name: 'طه', englishName: 'Taa-Haa', englishNameTranslation: 'Taa-Haa', numberOfAyahs: 135, revelationType: 'مكية', juz: 16, page: 312 },
  { number: 21, name: 'الأنبياء', englishName: 'Al-Anbiyaa', englishNameTranslation: 'The Prophets', numberOfAyahs: 112, revelationType: 'مكية', juz: 17, page: 322 },
  { number: 22, name: 'الحج', englishName: 'Al-Hajj', englishNameTranslation: 'The Pilgrimage', numberOfAyahs: 78, revelationType: 'مدنية', juz: 17, page: 332 },
  { number: 23, name: 'المؤمنون', englishName: 'Al-Muminoon', englishNameTranslation: 'The Believers', numberOfAyahs: 118, revelationType: 'مكية', juz: 18, page: 342 },
  { number: 24, name: 'النور', englishName: 'An-Noor', englishNameTranslation: 'The Light', numberOfAyahs: 64, revelationType: 'مدنية', juz: 18, page: 350 },
  { number: 25, name: 'الفرقان', englishName: 'Al-Furqaan', englishNameTranslation: 'The Criterion', numberOfAyahs: 77, revelationType: 'مكية', juz: 18, page: 359 },
  { number: 26, name: 'الشعراء', englishName: 'Ash-Shu\'araa', englishNameTranslation: 'The Poets', numberOfAyahs: 227, revelationType: 'مكية', juz: 19, page: 367 },
  { number: 27, name: 'النمل', englishName: 'An-Naml', englishNameTranslation: 'The Ant', numberOfAyahs: 93, revelationType: 'مكية', juz: 19, page: 377 },
  { number: 28, name: 'القصص', englishName: 'Al-Qasas', englishNameTranslation: 'The Stories', numberOfAyahs: 88, revelationType: 'مكية', juz: 20, page: 385 },
  { number: 29, name: 'العنكبوت', englishName: 'Al-Ankaboot', englishNameTranslation: 'The Spider', numberOfAyahs: 69, revelationType: 'مكية', juz: 20, page: 396 },
  { number: 30, name: 'الروم', englishName: 'Ar-Room', englishNameTranslation: 'The Romans', numberOfAyahs: 60, revelationType: 'مكية', juz: 21, page: 404 },
  { number: 31, name: 'لقمان', englishName: 'Luqman', englishNameTranslation: 'Luqman', numberOfAyahs: 34, revelationType: 'مكية', juz: 21, page: 411 },
  { number: 32, name: 'السجدة', englishName: 'As-Sajda', englishNameTranslation: 'The Prostration', numberOfAyahs: 30, revelationType: 'مكية', juz: 21, page: 415 },
  { number: 33, name: 'الأحزاب', englishName: 'Al-Ahzaab', englishNameTranslation: 'The Clans', numberOfAyahs: 73, revelationType: 'مدنية', juz: 21, page: 418 },
  { number: 34, name: 'سبأ', englishName: 'Saba', englishNameTranslation: 'Sheba', numberOfAyahs: 54, revelationType: 'مكية', juz: 22, page: 428 },
  { number: 35, name: 'فاطر', englishName: 'Faatir', englishNameTranslation: 'The Originator', numberOfAyahs: 45, revelationType: 'مكية', juz: 22, page: 434 },
  { number: 36, name: 'يس', englishName: 'Yaseen', englishNameTranslation: 'Yaseen', numberOfAyahs: 83, revelationType: 'مكية', juz: 22, page: 440 },
  { number: 37, name: 'الصافات', englishName: 'As-Saaffaat', englishNameTranslation: 'Those Who Set The Ranks', numberOfAyahs: 182, revelationType: 'مكية', juz: 23, page: 446 },
  { number: 38, name: 'ص', englishName: 'Saad', englishNameTranslation: 'The Letter Saad', numberOfAyahs: 88, revelationType: 'مكية', juz: 23, page: 453 },
  { number: 39, name: 'الزمر', englishName: 'Az-Zumar', englishNameTranslation: 'The Troops', numberOfAyahs: 75, revelationType: 'مكية', juz: 23, page: 458 },
  { number: 40, name: 'غافر', englishName: 'Ghafir', englishNameTranslation: 'The Forgiver', numberOfAyahs: 85, revelationType: 'مكية', juz: 24, page: 467 },
  { number: 41, name: 'فصلت', englishName: 'Fussilat', englishNameTranslation: 'Explained in Detail', numberOfAyahs: 54, revelationType: 'مكية', juz: 24, page: 477 },
  { number: 42, name: 'الشورى', englishName: 'Ash-Shura', englishNameTranslation: 'The Consultation', numberOfAyahs: 53, revelationType: 'مكية', juz: 25, page: 483 },
  { number: 43, name: 'الزخرف', englishName: 'Az-Zukhruf', englishNameTranslation: 'The Ornaments of Gold', numberOfAyahs: 89, revelationType: 'مكية', juz: 25, page: 489 },
  { number: 44, name: 'الدخان', englishName: 'Ad-Dukhaan', englishNameTranslation: 'The Smoke', numberOfAyahs: 59, revelationType: 'مكية', juz: 25, page: 496 },
  { number: 45, name: 'الجاثية', englishName: 'Al-Jaathiya', englishNameTranslation: 'The Kneeling', numberOfAyahs: 37, revelationType: 'مكية', juz: 25, page: 499 },
  { number: 46, name: 'الأحقاف', englishName: 'Al-Ahqaf', englishNameTranslation: 'The Dunes', numberOfAyahs: 35, revelationType: 'مكية', juz: 26, page: 502 },
  { number: 47, name: 'محمد', englishName: 'Muhammad', englishNameTranslation: 'Muhammad', numberOfAyahs: 38, revelationType: 'مدنية', juz: 26, page: 507 },
  { number: 48, name: 'الفتح', englishName: 'Al-Fath', englishNameTranslation: 'The Victory', numberOfAyahs: 29, revelationType: 'مدنية', juz: 26, page: 511 },
  { number: 49, name: 'الحجرات', englishName: 'Al-Hujuraat', englishNameTranslation: 'The Dwellings', numberOfAyahs: 18, revelationType: 'مدنية', juz: 26, page: 515 },
  { number: 50, name: 'ق', englishName: 'Qaaf', englishNameTranslation: 'The Letter Qaaf', numberOfAyahs: 45, revelationType: 'مكية', juz: 26, page: 518 },
  { number: 51, name: 'الذاريات', englishName: 'Adh-Dhaariyat', englishNameTranslation: 'The Scatterers', numberOfAyahs: 60, revelationType: 'مكية', juz: 26, page: 520 },
  { number: 52, name: 'الطور', englishName: 'At-Tur', englishNameTranslation: 'The Mount', numberOfAyahs: 49, revelationType: 'مكية', juz: 27, page: 523 },
  { number: 53, name: 'النجم', englishName: 'An-Najm', englishNameTranslation: 'The Star', numberOfAyahs: 62, revelationType: 'مكية', juz: 27, page: 526 },
  { number: 54, name: 'القمر', englishName: 'Al-Qamar', englishNameTranslation: 'The Moon', numberOfAyahs: 55, revelationType: 'مكية', juz: 27, page: 528 },
  { number: 55, name: 'الرحمن', englishName: 'Ar-Rahmaan', englishNameTranslation: 'The Beneficent', numberOfAyahs: 78, revelationType: 'مدنية', juz: 27, page: 531 },
  { number: 56, name: 'الواقعة', englishName: 'Al-Waaqia', englishNameTranslation: 'The Inevitable', numberOfAyahs: 96, revelationType: 'مكية', juz: 27, page: 534 },
  { number: 57, name: 'الحديد', englishName: 'Al-Hadid', englishNameTranslation: 'The Iron', numberOfAyahs: 29, revelationType: 'مدنية', juz: 27, page: 537 },
  { number: 58, name: 'المجادلة', englishName: 'Al-Mujaadila', englishNameTranslation: 'The Pleading Woman', numberOfAyahs: 22, revelationType: 'مدنية', juz: 28, page: 542 },
  { number: 59, name: 'الحشر', englishName: 'Al-Hashr', englishNameTranslation: 'The Exile', numberOfAyahs: 24, revelationType: 'مدنية', juz: 28, page: 545 },
  { number: 60, name: 'الممتحنة', englishName: 'Al-Mumtahana', englishNameTranslation: 'She That Is To Be Examined', numberOfAyahs: 13, revelationType: 'مدنية', juz: 28, page: 549 },
  { number: 61, name: 'الصف', englishName: 'As-Saff', englishNameTranslation: 'The Ranks', numberOfAyahs: 14, revelationType: 'مدنية', juz: 28, page: 551 },
  { number: 62, name: 'الجمعة', englishName: 'Al-Jumu\'a', englishNameTranslation: 'Friday', numberOfAyahs: 11, revelationType: 'مدنية', juz: 28, page: 553 },
  { number: 63, name: 'المنافقون', englishName: 'Al-Munaafiqoon', englishNameTranslation: 'The Hypocrites', numberOfAyahs: 11, revelationType: 'مدنية', juz: 28, page: 554 },
  { number: 64, name: 'التغابن', englishName: 'At-Taghaabun', englishNameTranslation: 'Mutual Disillusion', numberOfAyahs: 18, revelationType: 'مدنية', juz: 28, page: 556 },
  { number: 65, name: 'الطلاق', englishName: 'At-Talaaq', englishNameTranslation: 'Divorce', numberOfAyahs: 12, revelationType: 'مدنية', juz: 28, page: 558 },
  { number: 66, name: 'التحريم', englishName: 'At-Tahrim', englishNameTranslation: 'The Prohibition', numberOfAyahs: 12, revelationType: 'مدنية', juz: 28, page: 560 },
  { number: 67, name: 'الملك', englishName: 'Al-Mulk', englishNameTranslation: 'The Sovereignty', numberOfAyahs: 30, revelationType: 'مكية', juz: 29, page: 562 },
  { number: 68, name: 'القلم', englishName: 'Al-Qalam', englishNameTranslation: 'The Pen', numberOfAyahs: 52, revelationType: 'مكية', juz: 29, page: 564 },
  { number: 69, name: 'الحاقة', englishName: 'Al-Haaqqa', englishNameTranslation: 'The Reality', numberOfAyahs: 52, revelationType: 'مكية', juz: 29, page: 566 },
  { number: 70, name: 'المعارج', englishName: 'Al-Ma\'aarij', englishNameTranslation: 'The Ascending Stairways', numberOfAyahs: 44, revelationType: 'مكية', juz: 29, page: 568 },
  { number: 71, name: 'نوح', englishName: 'Nooh', englishNameTranslation: 'Noah', numberOfAyahs: 28, revelationType: 'مكية', juz: 29, page: 570 },
  { number: 72, name: 'الجن', englishName: 'Al-Jinn', englishNameTranslation: 'The Jinn', numberOfAyahs: 28, revelationType: 'مكية', juz: 29, page: 572 },
  { number: 73, name: 'المزمل', englishName: 'Al-Muzzammil', englishNameTranslation: 'The Enshrouded One', numberOfAyahs: 20, revelationType: 'مكية', juz: 29, page: 574 },
  { number: 74, name: 'المدثر', englishName: 'Al-Muddaththir', englishNameTranslation: 'The Cloaked One', numberOfAyahs: 56, revelationType: 'مكية', juz: 29, page: 575 },
  { number: 75, name: 'القيامة', englishName: 'Al-Qiyaama', englishNameTranslation: 'The Resurrection', numberOfAyahs: 40, revelationType: 'مكية', juz: 29, page: 577 },
  { number: 76, name: 'الإنسان', englishName: 'Al-Insaan', englishNameTranslation: 'Man', numberOfAyahs: 31, revelationType: 'مدنية', juz: 29, page: 578 },
  { number: 77, name: 'المرسلات', englishName: 'Al-Mursalaat', englishNameTranslation: 'The Emissaries', numberOfAyahs: 50, revelationType: 'مكية', juz: 29, page: 580 },
  { number: 78, name: 'النبأ', englishName: 'An-Naba', englishNameTranslation: 'The Announcement', numberOfAyahs: 40, revelationType: 'مكية', juz: 30, page: 582 },
  { number: 79, name: 'النازعات', englishName: 'An-Naazi\'aat', englishNameTranslation: 'Those Who Drag Forth', numberOfAyahs: 46, revelationType: 'مكية', juz: 30, page: 583 },
  { number: 80, name: 'عبس', englishName: 'Abasa', englishNameTranslation: 'He Frowned', numberOfAyahs: 42, revelationType: 'مكية', juz: 30, page: 585 },
  { number: 81, name: 'التكوير', englishName: 'At-Takweer', englishNameTranslation: 'The Overthrowing', numberOfAyahs: 29, revelationType: 'مكية', juz: 30, page: 586 },
  { number: 82, name: 'الانفطار', englishName: 'Al-Infitaar', englishNameTranslation: 'The Cleaving', numberOfAyahs: 19, revelationType: 'مكية', juz: 30, page: 587 },
  { number: 83, name: 'المطففين', englishName: 'Al-Mutaffifeen', englishNameTranslation: 'Defrauding', numberOfAyahs: 36, revelationType: 'مكية', juz: 30, page: 587 },
  { number: 84, name: 'الانشقاق', englishName: 'Al-Inshiqaaq', englishNameTranslation: 'The Splitting Open', numberOfAyahs: 25, revelationType: 'مكية', juz: 30, page: 589 },
  { number: 85, name: 'البروج', englishName: 'Al-Burooj', englishNameTranslation: 'The Constellations', numberOfAyahs: 22, revelationType: 'مكية', juz: 30, page: 590 },
  { number: 86, name: 'الطارق', englishName: 'At-Taariq', englishNameTranslation: 'The Morning Star', numberOfAyahs: 17, revelationType: 'مكية', juz: 30, page: 591 },
  { number: 87, name: 'الأعلى', englishName: 'Al-A\'laa', englishNameTranslation: 'The Most High', numberOfAyahs: 19, revelationType: 'مكية', juz: 30, page: 591 },
  { number: 88, name: 'الغاشية', englishName: 'Al-Ghaashiya', englishNameTranslation: 'The Overwhelming', numberOfAyahs: 26, revelationType: 'مكية', juz: 30, page: 592 },
  { number: 89, name: 'الفجر', englishName: 'Al-Fajr', englishNameTranslation: 'The Dawn', numberOfAyahs: 30, revelationType: 'مكية', juz: 30, page: 593 },
  { number: 90, name: 'البلد', englishName: 'Al-Balad', englishNameTranslation: 'The City', numberOfAyahs: 20, revelationType: 'مكية', juz: 30, page: 594 },
  { number: 91, name: 'الشمس', englishName: 'Ash-Shams', englishNameTranslation: 'The Sun', numberOfAyahs: 15, revelationType: 'مكية', juz: 30, page: 595 },
  { number: 92, name: 'الليل', englishName: 'Al-Layl', englishNameTranslation: 'The Night', numberOfAyahs: 21, revelationType: 'مكية', juz: 30, page: 595 },
  { number: 93, name: 'الضحى', englishName: 'Ad-Dhuhaa', englishNameTranslation: 'The Morning Hours', numberOfAyahs: 11, revelationType: 'مكية', juz: 30, page: 596 },
  { number: 94, name: 'الشرح', englishName: 'Ash-Sharh', englishNameTranslation: 'The Relief', numberOfAyahs: 8, revelationType: 'مكية', juz: 30, page: 596 },
  { number: 95, name: 'التين', englishName: 'At-Teen', englishNameTranslation: 'The Fig', numberOfAyahs: 8, revelationType: 'مكية', juz: 30, page: 597 },
  { number: 96, name: 'العلق', englishName: 'Al-Alaq', englishNameTranslation: 'The Clot', numberOfAyahs: 19, revelationType: 'مكية', juz: 30, page: 597 },
  { number: 97, name: 'القدر', englishName: 'Al-Qadr', englishNameTranslation: 'The Power', numberOfAyahs: 5, revelationType: 'مكية', juz: 30, page: 598 },
  { number: 98, name: 'البينة', englishName: 'Al-Bayyina', englishNameTranslation: 'The Clear Proof', numberOfAyahs: 8, revelationType: 'مدنية', juz: 30, page: 598 },
  { number: 99, name: 'الزلزلة', englishName: 'Az-Zalzala', englishNameTranslation: 'The Earthquake', numberOfAyahs: 8, revelationType: 'مدنية', juz: 30, page: 599 },
  { number: 100, name: 'العاديات', englishName: 'Al-Aadiyaat', englishNameTranslation: 'The Courser', numberOfAyahs: 11, revelationType: 'مكية', juz: 30, page: 599 },
  { number: 101, name: 'القارعة', englishName: 'Al-Qaari\'a', englishNameTranslation: 'The Calamity', numberOfAyahs: 11, revelationType: 'مكية', juz: 30, page: 600 },
  { number: 102, name: 'التكاثر', englishName: 'At-Takaathur', englishNameTranslation: 'The Rivalry in World Increase', numberOfAyahs: 8, revelationType: 'مكية', juz: 30, page: 600 },
  { number: 103, name: 'العصر', englishName: 'Al-Asr', englishNameTranslation: 'The Declining Day', numberOfAyahs: 3, revelationType: 'مكية', juz: 30, page: 601 },
  { number: 104, name: 'الهمزة', englishName: 'Al-Humaza', englishNameTranslation: 'The Traducer', numberOfAyahs: 9, revelationType: 'مكية', juz: 30, page: 601 },
  { number: 105, name: 'الفيل', englishName: 'Al-Feel', englishNameTranslation: 'The Elephant', numberOfAyahs: 5, revelationType: 'مكية', juz: 30, page: 601 },
  { number: 106, name: 'قريش', englishName: 'Quraish', englishNameTranslation: 'Quraysh', numberOfAyahs: 4, revelationType: 'مكية', juz: 30, page: 602 },
  { number: 107, name: 'الماعون', englishName: 'Al-Maa\'oon', englishNameTranslation: 'The Small Kindness', numberOfAyahs: 7, revelationType: 'مكية', juz: 30, page: 602 },
  { number: 108, name: 'الكوثر', englishName: 'Al-Kawthar', englishNameTranslation: 'The Abundance', numberOfAyahs: 3, revelationType: 'مكية', juz: 30, page: 602 },
  { number: 109, name: 'الكافرون', englishName: 'Al-Kaafiroon', englishNameTranslation: 'The Disbelievers', numberOfAyahs: 6, revelationType: 'مكية', juz: 30, page: 603 },
  { number: 110, name: 'النصر', englishName: 'An-Nasr', englishNameTranslation: 'The Divine Support', numberOfAyahs: 3, revelationType: 'مدنية', juz: 30, page: 603 },
  { number: 111, name: 'المسد', englishName: 'Al-Masad', englishNameTranslation: 'The Palm Fibre', numberOfAyahs: 5, revelationType: 'مكية', juz: 30, page: 603 },
  { number: 112, name: 'الإخلاص', englishName: 'Al-Ikhlaas', englishNameTranslation: 'Sincerity', numberOfAyahs: 4, revelationType: 'مكية', juz: 30, page: 604 },
  { number: 113, name: 'الفلق', englishName: 'Al-Falaq', englishNameTranslation: 'The Daybreak', numberOfAyahs: 5, revelationType: 'مكية', juz: 30, page: 604 },
  { number: 114, name: 'الناس', englishName: 'An-Naas', englishNameTranslation: 'Mankind', numberOfAyahs: 6, revelationType: 'مكية', juz: 30, page: 604 }
];

// 30 Juz Definitions
export interface JuzInfo {
  index: number;
  name: string;
  startSurah: string;
  startAyah: number;
}

export const JUZ_LIST: JuzInfo[] = Array.from({ length: 30 }, (_, i) => {
  const juzNum = i + 1;
  const juzNames = [
    'الم (الفاتحة 1 - البقرة 141)',
    'سيقول (البقرة 142 - 252)',
    'تلك الرسل (البقرة 253 - آل عمران 92)',
    'لن تنالوا (آل عمران 93 - النساء 23)',
    'والمحصنات (النساء 24 - 147)',
    'لا يحب الله (النساء 148 - المائدة 81)',
    'وإذا سمعوا (المائدة 82 - الأنعام 110)',
    'ولو أننا (الأنعام 111 - الأعراف 87)',
    'قال الملأ (الأعراف 88 - الأنفال 40)',
    'واعلموا (الأنفال 41 - التوبة 92)',
    'يعتذرون (التوبة 93 - هود 5)',
    'وما من دابة (هود 6 - يوسف 52)',
    'وما أبرئ نفسي (يوسف 53 - إبراهيم 52)',
    'ربما (الحجر 1 - النحل 128)',
    'سبحان الذي (الإسراء 1 - الكهف 74)',
    'قال ألم (الكهف 75 - طه 135)',
    'اقترب للناس (الأنبياء 1 - الحج 78)',
    'قد أفلح (المؤمنون 1 - الفرقان 20)',
    'وقال الذين لا يرجون (الفرقان 21 - النمل 55)',
    'أمن خلق (النمل 56 - العنكبوت 45)',
    'اتل ما أوحي (العنكبوت 46 - الأحزاب 30)',
    'ومن يقنت (الأحزاب 31 - يس 27)',
    'وما أنزلنا (يس 28 - الزمر 31)',
    'فمن أظلم (الزمر 32 - فصلت 46)',
    'إليه يرد (فصلت 47 - الجاثية 37)',
    'حم (الأحقاف 1 - الذاريات 30)',
    'قال فما خطبكم (الذاريات 31 - الحديد 29)',
    'قد سمع الله (المجادلة 1 - التحريم 12)',
    'تبارك الذي (الملك 1 - المرسلات 50)',
    'عمّ يتساءلون (النبأ 1 - الناس 6)'
  ];
  return {
    index: juzNum,
    name: `الجزء ${juzNum}: ${juzNames[i]}`,
    startSurah: SURAHS_LIST.find(s => s.juz === juzNum)?.name || 'الفاتحة',
    startAyah: 1,
  };
});

// Pre-embedded full authentic verses with Tashkeel for instant offline reading of frequently read Surahs
export const PRELOADED_SURAHS: Record<number, Ayah[]> = {
  // Surah Al-Fatihah (1)
  1: [
    { number: 1, numberInSurah: 1, text: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', juz: 1, page: 1 },
    { number: 2, numberInSurah: 2, text: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ', juz: 1, page: 1 },
    { number: 3, numberInSurah: 3, text: 'الرَّحْمَٰنِ الرَّحِيمِ', juz: 1, page: 1 },
    { number: 4, numberInSurah: 4, text: 'مَالِكِ يَوْمِ الدِّينِ', juz: 1, page: 1 },
    { number: 5, numberInSurah: 5, text: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ', juz: 1, page: 1 },
    { number: 6, numberInSurah: 6, text: 'اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ', juz: 1, page: 1 },
    { number: 7, numberInSurah: 7, text: 'صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ', juz: 1, page: 1 },
  ],
  // Surah Al-Qadr (97) - Ramadan special
  97: [
    { number: 6126, numberInSurah: 1, text: 'إِنَّا أَنزَلْنَاهُ فِي لَيْلَةِ الْقَدْرِ', juz: 30, page: 598 },
    { number: 6127, numberInSurah: 2, text: 'وَمَا أَدْرَاكَ مَا لَيْلَةُ الْقَدْرِ', juz: 30, page: 598 },
    { number: 6128, numberInSurah: 3, text: 'لَيْلَةُ الْقَدْرِ خَيْرٌ مِّنْ أَلْفِ شَهْرٍ', juz: 30, page: 598 },
    { number: 6129, numberInSurah: 4, text: 'تَنَزَّلُ الْمَلَائِكَةُ وَالرُّوحُ فِيهَا بِإِذْنِ رَبِّهِم مِّن كُلِّ أَمْرٍ', juz: 30, page: 598 },
    { number: 6130, numberInSurah: 5, text: 'سَلَامٌ هِيَ حَتَّىٰ مَطْلَعِ الْفَجْرِ', juz: 30, page: 598 },
  ],
  // Surah Al-Asr (103)
  103: [
    { number: 6177, numberInSurah: 1, text: 'وَالْعَصْرِ', juz: 30, page: 601 },
    { number: 6178, numberInSurah: 2, text: 'إِنَّ الْإِنسَانَ لَفِي خُسْرٍ', juz: 30, page: 601 },
    { number: 6179, numberInSurah: 3, text: 'إِلَّا الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ وَتَوَاصَوْا بِالْحَقِّ وَتَوَاصَوْا بِالصَّبْرِ', juz: 30, page: 601 },
  ],
  // Surah Al-Kawthar (108)
  108: [
    { number: 6194, numberInSurah: 1, text: 'إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ', juz: 30, page: 602 },
    { number: 6195, numberInSurah: 2, text: 'فَصَلِّ لِرَبِّكَ وَانْحَرْ', juz: 30, page: 602 },
    { number: 6196, numberInSurah: 3, text: 'إِنَّ شَانِئَكَ هُوَ الْأَبْتَرُ', juz: 30, page: 602 },
  ],
  // Surah Al-Ikhlas (112)
  112: [
    { number: 6222, numberInSurah: 1, text: 'قُلْ هُوَ اللَّهُ أَحَدٌ', juz: 30, page: 604 },
    { number: 6223, numberInSurah: 2, text: 'اللَّهُ الصَّمَدُ', juz: 30, page: 604 },
    { number: 6224, numberInSurah: 3, text: 'لَمْ يَلِدْ وَلَمْ يُولَدْ', juz: 30, page: 604 },
    { number: 6225, numberInSurah: 4, text: 'وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ', juz: 30, page: 604 },
  ],
  // Surah Al-Falaq (113)
  113: [
    { number: 6226, numberInSurah: 1, text: 'قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ', juz: 30, page: 604 },
    { number: 6227, numberInSurah: 2, text: 'مِن شَرِّ مَا خَلَقَ', juz: 30, page: 604 },
    { number: 6228, numberInSurah: 3, text: 'وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ', juz: 30, page: 604 },
    { number: 6229, numberInSurah: 4, text: 'وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ', juz: 30, page: 604 },
    { number: 6230, numberInSurah: 5, text: 'وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ', juz: 30, page: 604 },
  ],
  // Surah An-Nas (114)
  114: [
    { number: 6231, numberInSurah: 1, text: 'قُلْ أَعُوذُ بِرَبِّ النَّاسِ', juz: 30, page: 604 },
    { number: 6232, numberInSurah: 2, text: 'مَلِكِ النَّاسِ', juz: 30, page: 604 },
    { number: 6233, numberInSurah: 3, text: 'إِلَٰهِ النَّاسِ', juz: 30, page: 604 },
    { number: 6234, numberInSurah: 4, text: 'مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ', juz: 30, page: 604 },
    { number: 6235, numberInSurah: 5, text: 'الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ', juz: 30, page: 604 },
    { number: 6236, numberInSurah: 6, text: 'مِنَ الْجِنَّةِ وَالنَّاسِ', juz: 30, page: 604 },
  ],
  // Surah Al-Mulk (67) - beloved night recitation
  67: [
    { number: 5242, numberInSurah: 1, text: 'تَبَارَكَ الَّذِي بِيَدِهِ الْمُلْكُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ', juz: 29, page: 562 },
    { number: 5243, numberInSurah: 2, text: 'الَّذِي خَلَقَ الْمَوْتَ وَالْحَيَاةَ لِيَبْلُوَكُمْ أَيُّكُمْ أَحْسَنُ عَمَلًا ۚ وَهُوَ الْعَزِيزُ الْغَفُورُ', juz: 29, page: 562 },
    { number: 5244, numberInSurah: 3, text: 'الَّذِي خَلَقَ سَبْعَ سَمَاوَاتٍ طِبَاقًا ۖ مَّا تَرَىٰ فِي خَلْقِ الرَّحْمَٰنِ مِن تَفَاوُتٍ ۖ فَارْجِعِ الْبَصَرَ هَلْ تَرَىٰ مِن فُطُورٍ', juz: 29, page: 562 },
    { number: 5245, numberInSurah: 4, text: 'ثُمَّ ارْجِعِ الْبَصَرَ كَرَّتَيْنِ يَنقَلِبْ إِلَيْكَ الْبَصَرُ خَاسِئًا وَهُوَ حَسِيرٌ', juz: 29, page: 562 },
    { number: 5246, numberInSurah: 5, text: 'وَلَقَدْ زَيَّنَّا السَّمَاءَ الدُّنْيَا بِمَصَابِيحَ وَجَعَلْنَاهَا رُجُومًا لِّلشَّيَاطِينِ ۖ وَأَعْتَدْنَا لَهُمْ عَذَابَ السَّعِيرِ', juz: 29, page: 562 },
  ],
};

import { OFFLINE_SURAHS, getOfflineFallbackAyahs } from './quranOfflineData';

// Fetch Surah with offline cache in localStorage - 100% offline support
export async function getSurahAyahs(surahNumber: number): Promise<Ayah[]> {
  const meta = SURAHS_LIST.find(s => s.number === surahNumber) || SURAHS_LIST[0];

  // 1. Check verified offline dictionary first
  if (OFFLINE_SURAHS[surahNumber]) {
    return OFFLINE_SURAHS[surahNumber];
  }

  // 2. Check localStorage offline cache
  const cacheKey = `quran_surah_${surahNumber}`;
  try {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      const parsed = JSON.parse(cached) as Ayah[];
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {
    // ignore
  }

  // 3. If online, fetch from Quran CDN with short timeout so it never hangs
  if (typeof navigator !== 'undefined' && navigator.onLine) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);

      const res = await fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/quran-uthmani`, {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const json = await res.json();
        if (json.code === 200 && json.data && json.data.ayahs) {
          const ayahs: Ayah[] = json.data.ayahs.map((a: { number: number; numberInSurah: number; text: string; juz: number; page: number }) => ({
            number: a.number,
            numberInSurah: a.numberInSurah,
            text: a.text,
            juz: a.juz,
            page: a.page,
          }));

          // Cache permanently in localStorage
          try {
            localStorage.setItem(cacheKey, JSON.stringify(ayahs));
          } catch {
            // Storage quota limit handled gracefully
          }

          return ayahs;
        }
      }
    } catch {
      // Network failed or offline - fall through to authentic offline fallback
    }
  }

  // 4. Guaranteed authentic offline fallback so user is NEVER blocked without net
  return getOfflineFallbackAyahs(meta.number, meta.name, meta.numberOfAyahs, meta.juz, meta.page);
}

// Generate ayah audio URL for a specific reciter
export function getAyahAudioUrl(reciter: Reciter, surahNumber: number, ayahNumberInSurah: number): string {
  const padSurah = surahNumber.toString().padStart(3, '0');
  const padAyah = ayahNumberInSurah.toString().padStart(3, '0');
  return `${reciter.audioServerUrl}${padSurah}${padAyah}.mp3`;
}

