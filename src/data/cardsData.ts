export interface CardTemplate {
  id: string;
  category: 'ramadan_greeting' | 'dua' | 'ayah' | 'laylatul_qadr';
  title: string;
  arabicText: string;
  subText?: string;
  reference?: string;
}

export interface CardStyle {
  id: string;
  name: string;
  bgGradient: string;
  primaryColor: string;
  accentColor: string;
  textColor: string;
  borderColor: string;
  ornamentStyle: 'crescent' | 'lantern' | 'geometric';
}

export const CARD_STYLES: CardStyle[] = [
  {
    id: 'emerald_royal',
    name: 'زمردي ملكي',
    bgGradient: 'from-emerald-950 via-teal-900 to-emerald-900',
    primaryColor: '#059669',
    accentColor: '#f59e0b',
    textColor: '#ffffff',
    borderColor: '#d97706',
    ornamentStyle: 'crescent',
  },
  {
    id: 'midnight_indigo',
    name: 'ليلي أندلسي',
    bgGradient: 'from-slate-950 via-indigo-950 to-purple-950',
    primaryColor: '#6366f1',
    accentColor: '#fbbf24',
    textColor: '#ffffff',
    borderColor: '#eab308',
    ornamentStyle: 'geometric',
  },
  {
    id: 'golden_glow',
    name: 'نور ذهبي',
    bgGradient: 'from-amber-950 via-yellow-950 to-stone-900',
    primaryColor: '#d97706',
    accentColor: '#fef08a',
    textColor: '#fffbeb',
    borderColor: '#fbbf24',
    ornamentStyle: 'lantern',
  },
  {
    id: 'ruby_majesty',
    name: 'قرمزي رمضاني',
    bgGradient: 'from-rose-950 via-purple-950 to-slate-950',
    primaryColor: '#e11d48',
    accentColor: '#fde047',
    textColor: '#ffffff',
    borderColor: '#f59e0b',
    ornamentStyle: 'crescent',
  },
];

export const CARD_TEMPLATES: CardTemplate[] = [
  {
    id: 't1',
    category: 'ramadan_greeting',
    title: 'مبارك عليكم شهر رمضان',
    arabicText: 'مُبَارَكٌ عَلَيْكُمُ الشَّهْرُ الفَضِيلُ\nأَعَادَهُ اللَّهُ عَلَيْكُمْ وَعَلَى أُمَّتِنَا بِاليُمْنِ وَالإِيمَانِ وَالسَّلَامَةِ وَالإِسْلَامِ',
    subText: 'تقبل الله منا ومنكم صالح الأعمال والطاعات',
  },
  {
    id: 't2',
    category: 'ramadan_greeting',
    title: 'كل عام وأنتم بخير',
    arabicText: 'أَهْلًا بِشَهْرِ الصِّيَامِ وَالقِيَامِ\nجَعَلَكُمُ اللَّهُ فِيهِ مِنَ الفَائِزِينَ وَمِنْ عُتَقَائِهِ مِنَ النَّارِ',
    subText: 'رمضان مبارك كريم',
  },
  {
    id: 't3',
    category: 'dua',
    title: 'دعاء الإفطار',
    arabicText: 'ذَهَبَ الظَّمَأُ، وَابْتَلَّتِ الْعُرُوقُ، وَثَبَتَ الْأَجْرُ إِنْ شَاءَ اللَّهُ',
    subText: 'اللهم تقبل صيامنا وقيامنا ودعاءنا',
    reference: 'رواه أبو داود',
  },
  {
    id: 't4',
    category: 'laylatul_qadr',
    title: 'دعاء ليلة القدر',
    arabicText: 'اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي',
    subText: 'اللهم بلغنا ليلة القدر واجعلنا فيها من المقبولين',
    reference: 'رواه الترمذي',
  },
  {
    id: 't5',
    category: 'ayah',
    title: 'آية الصيام',
    arabicText: 'شَهْرُ رَمَضَانَ الَّذِي أُنزِلَ فِيهِ الْقُرْآنُ هُدًى لِّلنَّاسِ وَبَيِّنَاتٍ مِّنَ الْهُدَىٰ وَالْفُرْقَانِ',
    subText: 'سورة البقرة، الآية 185',
    reference: 'القرآن الكريم',
  },
  {
    id: 't6',
    category: 'ayah',
    title: 'آية إجابة الدعاء',
    arabicText: 'وَإِذَا سَأَلَكَ عِبَادِي عَنِّي فَإِنِّي قَرِيبٌ ۖ أُجِيبُ دَعْوَةَ الدَّاعِ إِذَا دَعَانِ',
    subText: 'سورة البقرة، الآية 186',
    reference: 'القرآن الكريم',
  },
];
