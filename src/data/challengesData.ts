export interface DailyTask {
  id: string;
  title: string;
  category: 'quran' | 'prayer' | 'dhikr' | 'charity';
  points: number;
}

export interface RamadanDayChallenge {
  day: number;
  theme: string;
  hadithOrAyah: string;
  hadithSource: string;
  tasks: DailyTask[];
}

export const RAMADAN_CHALLENGES: RamadanDayChallenge[] = [
  {
    day: 1,
    theme: 'استقبال الشهر بنية صادقة وتجديد التوبة',
    hadithOrAyah: 'مَنْ صَامَ رَمَضَانَ إِيمَانًا وَاحْتِسَابًا غُفِرَ لَهُ مَا تَقَدَّمَ مِنْ ذَنْبِهِ.',
    hadithSource: 'متفق عليه',
    tasks: [
      { id: 'd1_t1', title: 'قراءة الجزء الأول من القرآن الكريم', category: 'quran', points: 25 },
      { id: 'd1_t2', title: 'صلاة التراويح والوتر جماعة أو في البيت', category: 'prayer', points: 25 },
      { id: 'd1_t3', title: 'المحافظة على أذكار الصباح والمساء كاملة', category: 'dhikr', points: 25 },
      { id: 'd1_t4', title: 'تهنئة الأهل والأقارب وصلة الرحم بحلول الشهر', category: 'charity', points: 25 },
    ],
  },
  {
    day: 2,
    theme: 'إطعام الطعام وتفقد الصائمين',
    hadithOrAyah: 'مَنْ فَطَّرَ صَائِمًا كَانَ لَهُ مِثْلُ أَجْرِهِ غَيْرَ أَنَّهُ لَا يَنْقُصُ مِنْ أَجْرِ الصَّائِمِ شَيْئًا.',
    hadithSource: 'رواه الترمذي وقال حسن صحيح',
    tasks: [
      { id: 'd2_t1', title: 'قراءة الجزء الثاني من القرآن الكريم', category: 'quran', points: 25 },
      { id: 'd2_t2', title: 'صلاة ركعتي الضحى', category: 'prayer', points: 25 },
      { id: 'd2_t3', title: 'ترديد 100 مرة "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ"', category: 'dhikr', points: 25 },
      { id: 'd2_t4', title: 'إفطار صائم أو تقديم ماء وتمر لمسلم عند الغروب', category: 'charity', points: 25 },
    ],
  },
  {
    day: 3,
    theme: 'حفظ اللسان وطيب الكلام',
    hadithOrAyah: 'وَإِذَا كَانَ يَوْمُ صَوْمِ أَحَدِكُمْ فَلَا يَرْفُثْ وَلَا يَصْخَبْ، فَإِنْ سَابَّهُ أَحَدٌ أَوْ قَاتَلَهُ فَلْيَقُلْ: إِنِّي امْرُؤٌ صَائِمٌ.',
    hadithSource: 'صحيح البخاري',
    tasks: [
      { id: 'd3_t1', title: 'قراءة الجزء الثالث من القرآن الكريم', category: 'quran', points: 25 },
      { id: 'd3_t2', title: 'صلاة السنن الرواتب (12 ركعة)', category: 'prayer', points: 25 },
      { id: 'd3_t3', title: 'الاستغفار 100 مرة في وقت السحر', category: 'dhikr', points: 25 },
      { id: 'd3_t4', title: 'الابتعاد التام عن الغيبة والجدال وكف الأذى', category: 'charity', points: 25 },
    ],
  },
  {
    day: 4,
    theme: 'بر الوالدين ونيل رضاهما',
    hadithOrAyah: 'رَغِمَ أَنْفُهُ مَنْ أَدْرَكَ رَمَضَانَ فَلَمْ يُغْفَرْ لَهُ، وَرَغِمَ أَنْفُهُ مَنْ أَدْرَكَ أَبَوَيْهِ عِنْدَ الْكِبَرِ فَلَمْ يَدْخُلِ الْجَنَّةَ.',
    hadithSource: 'صحيح مسلم',
    tasks: [
      { id: 'd4_t1', title: 'قراءة الجزء الرابع من القرآن الكريم', category: 'quran', points: 25 },
      { id: 'd4_t2', title: 'الخشوع في صلاتي العصر والمغرب', category: 'prayer', points: 25 },
      { id: 'd4_t3', title: 'الصلاة على النبي ﷺ 100 مرة', category: 'dhikr', points: 25 },
      { id: 'd4_t4', title: 'تقبيل يد الوالدين والدعاء لهما أو تقديم هدية لهما', category: 'charity', points: 25 },
    ],
  },
  {
    day: 5,
    theme: 'الصدقة الخفية وبركة المال',
    hadithOrAyah: 'مَا نَقَصَتْ صَدَقَةٌ مِنْ مَالٍ، وَمَا زَادَ اللَّهُ عَبْدًا بِعَفْوٍ إِلَّا عِزًّا.',
    hadithSource: 'صحيح مسلم',
    tasks: [
      { id: 'd5_t1', title: 'قراءة الجزء الخامس من القرآن الكريم', category: 'quran', points: 25 },
      { id: 'd5_t2', title: 'إطالة السجود في قيام الليل', category: 'prayer', points: 25 },
      { id: 'd5_t3', title: 'ترديد سيد الاستغفار صباحاً ومساءً', category: 'dhikr', points: 25 },
      { id: 'd5_t4', title: 'التصدق بمبلغ من المال سراً لمحتاج', category: 'charity', points: 25 },
    ],
  },
  {
    day: 6,
    theme: 'صلة الأرحام وتطييب النفوس',
    hadithOrAyah: 'مَنْ أَحَبَّ أَنْ يُبْسَطَ لَهُ فِي رِزْقِهِ، وَيُنْسَأَ لَهُ فِي أَثَرِهِ، فَلْيَصِلْ رَحِمَهُ.',
    hadithSource: 'صحيح البخاري',
    tasks: [
      { id: 'd6_t1', title: 'قراءة الجزء السادس من القرآن الكريم', category: 'quran', points: 25 },
      { id: 'd6_t2', title: 'المحافظة على صلاة الفجر في وقتها', category: 'prayer', points: 25 },
      { id: 'd6_t3', title: 'قول "لا حَوْلَ وَلا قُوَّةَ إِلاَّ بِاللَّهِ" 100 مرة', category: 'dhikr', points: 25 },
      { id: 'd6_t4', title: 'الاتصال بقريب لم تتواصل معه منذ فترة والسؤال عنه', category: 'charity', points: 25 },
    ],
  },
  {
    day: 7,
    theme: 'الدعاء المستجاب عند الإفطار',
    hadithOrAyah: 'ثَلَاثُ دَعَوَاتٍ لَا تُرَدُّ: دَعْوَةُ الْوَالِدِ، وَدَعْوَةُ الصَّائِمِ حِينَ يُفْطِرُ، وَدَعْوَةُ الْمُسَافِرِ.',
    hadithSource: 'رواه الترمذي',
    tasks: [
      { id: 'd7_t1', title: 'قراءة الجزء السابع من القرآن الكريم', category: 'quran', points: 25 },
      { id: 'd7_t2', title: 'الاعتكاف دقائق بين الأذان والإقامة للدعاء', category: 'prayer', points: 25 },
      { id: 'd7_t3', title: 'دعاء شامل للمسلمين والمستضعفين قبل أذان المغرب', category: 'dhikr', points: 25 },
      { id: 'd7_t4', title: 'مساعدة أهل البيت في إعداد وتجهيز مائدة الإفطار', category: 'charity', points: 25 },
    ],
  },
  {
    day: 8,
    theme: 'شكر النعم والتواضع لله',
    hadithOrAyah: 'وَإِذْ تَأَذَّنَ رَبُّكُمْ لَئِن شَكَرْتُمْ لَأَزِيدَنَّكُمْ.',
    hadithSource: 'سورة إبراهيم، الآية 7',
    tasks: [
      { id: 'd8_t1', title: 'قراءة الجزء الثامن من القرآن الكريم', category: 'quran', points: 25 },
      { id: 'd8_t2', title: 'صلاة التراويح بخشوع وسكينة', category: 'prayer', points: 25 },
      { id: 'd8_t3', title: 'قول "الحمد لله ملء السماوات والأرض" 50 مرة', category: 'dhikr', points: 25 },
      { id: 'd8_t4', title: 'حفظ النعمة وتجنب الإسراف في طعام الإفطار', category: 'charity', points: 25 },
    ],
  },
  {
    day: 9,
    theme: 'الرفق والتسامح والعفو',
    hadithOrAyah: 'إِنَّ الرِّفْقَ لَا يَكُونُ فِي شَيْءٍ إِلَّا زَانَهُ، وَلَا يُنْزَعُ مِنْ شَيْءٍ إِلَّا شَانَهُ.',
    hadithSource: 'صحيح مسلم',
    tasks: [
      { id: 'd9_t1', title: 'قراءة الجزء التاسع من القرآن الكريم', category: 'quran', points: 25 },
      { id: 'd9_t2', title: 'قراءة آية الكرسي دبر كل صلاة مكتوبة', category: 'prayer', points: 25 },
      { id: 'd9_t3', title: 'الاستغفار للمؤمنين والمؤمنات 27 مرة', category: 'dhikr', points: 25 },
      { id: 'd9_t4', title: 'العفو عمن أخطأ بحقك وابتغاء الأجر من الله', category: 'charity', points: 25 },
    ],
  },
  {
    day: 10,
    theme: 'ختام العشر الأوائل (عشر الرحمة)',
    hadithOrAyah: 'وَسَارِعُوا إِلَىٰ مَغْفِرَةٍ مِّن رَّبِّكُمْ وَجَنَّةٍ عَرْضُهَا السَّمَاوَاتُ وَالْأَرْضُ أُعِدَّتْ لِلْمُتَّقِينَ.',
    hadithSource: 'سورة آل عمران، الآية 133',
    tasks: [
      { id: 'd10_t1', title: 'قراءة الجزء العاشر وإتمام ثلث القرآن', category: 'quran', points: 25 },
      { id: 'd10_t2', title: 'جلسة تدبر لآيات القرآن بعد الفجر', category: 'prayer', points: 25 },
      { id: 'd10_t3', title: 'الدعاء بالرحمة والمغفرة والعتق من النيران', category: 'dhikr', points: 25 },
      { id: 'd10_t4', title: 'إدخال السرور على قلب طفل أو محتاج', category: 'charity', points: 25 },
    ],
  },
  // Days 11-30 generated dynamically with authentic rotating themes if day > 10
];

// Helper to get challenge for any day of Ramadan (1-30)
export function getRamadanDayChallenge(dayNumber: number): RamadanDayChallenge {
  const normalizedDay = Math.min(30, Math.max(1, dayNumber));
  const found = RAMADAN_CHALLENGES.find(c => c.day === normalizedDay);
  if (found) return found;

  // Generate inspiring challenge for days 11-30
  const isLastTen = normalizedDay >= 21;
  const theme = isLastTen
    ? `العشر الأواخر وليالي القدر المباركة (اليوم ${normalizedDay})`
    : `أيام المغفرة ومضاعفة الطاعات (اليوم ${normalizedDay})`;

  const hadith = isLastTen
    ? 'تَحَرَّوْا لَيْلَةَ الْقَدْرِ فِي الْوِتْرِ مِنَ الْعَشْرِ الْأَوَاخِرِ مِنْ رَمَضَانَ.'
    : 'أَفْضَلُ الصَّدَقَةِ صَدَقَةٌ فِي رَمَضَانَ.';

  const source = isLastTen ? 'صحيح البخاري' : 'رواه الترمذي';

  return {
    day: normalizedDay,
    theme,
    hadithOrAyah: hadith,
    hadithSource: source,
    tasks: [
      { id: `d${normalizedDay}_t1`, title: `قراءة الجزء ${normalizedDay} من القرآن الكريم`, category: 'quran', points: 25 },
      { id: `d${normalizedDay}_t2`, title: isLastTen ? 'إحياء الليل بالصلاة والتهجد والوتر' : 'صلاة التراويح في جماعة وإتمامها مع الإمام', category: 'prayer', points: 25 },
      { id: `d${normalizedDay}_t3`, title: isLastTen ? 'ترديد: اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي' : 'الاستغفار والتسبيح 100 مرة', category: 'dhikr', points: 25 },
      { id: `d${normalizedDay}_t4`, title: isLastTen ? 'إخراج صدقة ليلة القدر وبر الأهل والفقراء' : 'عمل خير وإعانة مسلم أو إفطار صائم', category: 'charity', points: 25 },
    ],
  };
}
