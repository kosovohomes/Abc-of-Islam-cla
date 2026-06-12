import type { Category, Topic } from '@/types';

export const CATEGORIES: Category[] = [
  { id: 'pillars_of_islam', name: 'Pillars of Islam', emoji: '🕌' },
  { id: 'core_beliefs', name: 'Core Beliefs', emoji: '📖' },
  { id: 'daily_practices', name: 'Daily Practices', emoji: '✨' },
  { id: 'islamic_values', name: 'Islamic Values', emoji: '💚' },
  { id: 'stories_history', name: 'Stories & History', emoji: '📜' },
  { id: 'special_times', name: 'Special Times', emoji: '🌙' },
];

// Local images: just the filename → resolved to /images/FILENAME at runtime
// ImageKit images: full https:// URL → used as-is
export const TOPICS: Omit<Topic, 'content' | 'funFact' | 'quiz'>[] = [
  // ── Pillars of Islam ──────────────────────────────────────────────────────
  { id: 'shahada',       emoji: '☪️',  title: 'Shahada - Declaration of Faith', image: 'aqeedah.webp',        category: 'pillars_of_islam' },
  { id: 'salah',         emoji: '🤲',  title: 'Salah - Prayer',                 image: 'prayer_salah.webp',   category: 'pillars_of_islam' },
  { id: 'zakat',         emoji: '💰',  title: 'Zakat - Charity',                image: 'zakat.png',            category: 'pillars_of_islam' },
  { id: 'sawm',          emoji: '🌙',  title: 'Sawm - Fasting in Ramadan',      image: 'ramadan_fasting.webp', category: 'pillars_of_islam' },
  { id: 'hajj',          emoji: '🕋',  title: 'Hajj - Pilgrimage to Mecca',     image: 'hajj_overview.webp',  category: 'pillars_of_islam' },

  // ── Core Beliefs ──────────────────────────────────────────────────────────
  { id: 'tawheed',       emoji: '☝️',  title: 'Tawheed - Oneness of God',       image: 'aqeedah.webp',        category: 'core_beliefs' },
  { id: 'angels',        emoji: '👼',  title: 'Angels',                         image: 'https://ik.imagekit.io/4zbzbdytp/REPLACE_WITH_ANGELS_URL.webp',       category: 'core_beliefs' },
  { id: 'holy_books',    emoji: '📕',  title: 'Holy Books',                     image: 'https://ik.imagekit.io/4zbzbdytp/REPLACE_WITH_QURAN_URL.webp',        category: 'core_beliefs' },
  { id: 'prophets',      emoji: '🧑‍🏫', title: 'Prophets of Allah',             image: 'prophet_stories.webp', category: 'core_beliefs' },
  { id: 'day_of_judgment', emoji: '⚖️', title: 'Day of Judgment',              image: 'https://ik.imagekit.io/4zbzbdytp/REPLACE_WITH_JUDGMENT_URL.webp',     category: 'core_beliefs' },

  // ── Daily Practices ───────────────────────────────────────────────────────
  { id: 'wudu',          emoji: '🚿',  title: 'Wudu - Ablution',                image: 'ablution_wudu.webp',  category: 'daily_practices' },
  { id: 'islamic_dress', emoji: '👗',  title: 'Islamic Dress',                  image: 'https://ik.imagekit.io/4zbzbdytp/REPLACE_WITH_DRESS_URL.webp',        category: 'daily_practices' },
  { id: 'halal_food',    emoji: '🍽️',  title: 'Halal Food',                     image: 'https://ik.imagekit.io/4zbzbdytp/REPLACE_WITH_HALAL_URL.webp',        category: 'daily_practices' },
  { id: 'duas',          emoji: '🤲',  title: 'Duas - Supplications',           image: 'https://ik.imagekit.io/4zbzbdytp/REPLACE_WITH_DUAS_URL.webp',         category: 'daily_practices' },
  { id: 'reading_quran', emoji: '📖',  title: 'Reading Quran',                  image: 'https://ik.imagekit.io/4zbzbdytp/REPLACE_WITH_RECITATION_URL.webp',   category: 'daily_practices' },

  // ── Islamic Values ────────────────────────────────────────────────────────
  { id: 'honesty',       emoji: '🤝',  title: 'Honesty',                        image: 'https://ik.imagekit.io/4zbzbdytp/REPLACE_WITH_HONESTY_URL.webp',      category: 'islamic_values' },
  { id: 'kindness',      emoji: '💕',  title: 'Kindness',                       image: 'https://ik.imagekit.io/4zbzbdytp/REPLACE_WITH_KINDNESS_URL.webp',     category: 'islamic_values' },
  { id: 'respect',       emoji: '🙏',  title: 'Respect',                        image: 'https://ik.imagekit.io/4zbzbdytp/REPLACE_WITH_RESPECT_URL.webp',      category: 'islamic_values' },
  { id: 'patience',      emoji: '🧘',  title: 'Patience',                       image: 'https://ik.imagekit.io/4zbzbdytp/REPLACE_WITH_PATIENCE_URL.webp',     category: 'islamic_values' },
  { id: 'gratitude',     emoji: '🙏',  title: 'Gratitude',                      image: 'https://ik.imagekit.io/4zbzbdytp/REPLACE_WITH_GRATITUDE_URL.webp',    category: 'islamic_values' },

  // ── Stories & History ─────────────────────────────────────────────────────
  { id: 'prophet_muhammad',   emoji: '☪️',  title: 'Prophet Muhammad ﷺ',       image: 'https://ik.imagekit.io/4zbzbdytp/REPLACE_WITH_MUHAMMAD_URL.webp',     category: 'stories_history' },
  { id: 'prophet_ibrahim',    emoji: '🏗️',  title: 'Prophet Ibrahim',           image: 'https://ik.imagekit.io/4zbzbdytp/REPLACE_WITH_IBRAHIM_URL.webp',      category: 'stories_history' },
  { id: 'islamic_civilization', emoji: '🏛️', title: 'Islamic Civilization',    image: 'https://ik.imagekit.io/4zbzbdytp/REPLACE_WITH_CIVILIZATION_URL.webp', category: 'stories_history' },
  { id: 'al_khwarizmi',       emoji: '📐',  title: 'Al-Khwarizmi - Father of Algebra',    image: 'al_khwarizmi.png',   category: 'stories_history' },
  { id: 'ibn_sina',           emoji: '🩺',  title: 'Ibn Sina - Father of Medicine',       image: 'ibn_sina.png',       category: 'stories_history' },
  { id: 'al_razi',            emoji: '🧪',  title: 'Al-Razi - Pioneer of Chemistry',      image: 'al_razi.png',        category: 'stories_history' },
  { id: 'al_biruni',          emoji: '🌍',  title: 'Al-Biruni - Master of Sciences',      image: 'al_biruni.png',      category: 'stories_history' },
  { id: 'al_ghazali',         emoji: '💡',  title: 'Al-Ghazali - Islamic Philosophy',     image: 'al_ghazali.png',     category: 'stories_history' },
  { id: 'fatima_al_fihri',    emoji: '🎓',  title: 'Fatima al-Fihri - First University',  image: 'fatima_al_fihri.png', category: 'stories_history' },
  { id: 'ibn_khaldun',        emoji: '📜',  title: 'Ibn Khaldun - Father of Sociology',   image: 'ibn_khaldun.png',    category: 'stories_history' },

  // ── Special Times ─────────────────────────────────────────────────────────
  { id: 'ramadan',     emoji: '🌙',  title: 'Ramadan',     image: 'https://ik.imagekit.io/4zbzbdytp/REPLACE_WITH_RAMADAN_URL.webp',  category: 'special_times' },
  { id: 'eid_al_fitr', emoji: '🎉',  title: 'Eid al-Fitr', image: 'https://ik.imagekit.io/4zbzbdytp/REPLACE_WITH_EID_FITR_URL.webp', category: 'special_times' },
  { id: 'eid_al_adha', emoji: '🐑',  title: 'Eid al-Adha', image: 'eid_adha.webp',                                                   category: 'special_times' },
];

export function getTopicsByCategory(categoryId: string): typeof TOPICS {
  return TOPICS.filter(t => t.category === categoryId);
}
export function getTopicById(id: string): typeof TOPICS[number] | undefined {
  return TOPICS.find(t => t.id === id);
}
export function getCategoryById(id: string): Category | undefined {
  return CATEGORIES.find(c => c.id === id);
}
