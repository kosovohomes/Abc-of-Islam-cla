import type { Category, Topic } from '@/types';

export const CATEGORIES: Category[] = [
  { id: 'pillars_of_islam', name: 'Pillars of Islam', emoji: '🕌' },
  { id: 'core_beliefs', name: 'Core Beliefs', emoji: '📖' },
  { id: 'daily_practices', name: 'Daily Practices', emoji: '✨' },
  { id: 'islamic_values', name: 'Islamic Values', emoji: '💚' },
  { id: 'stories_history', name: 'Stories & History', emoji: '📜' },
  { id: 'special_times', name: 'Special Times', emoji: '🌙' },
];

export const TOPICS: Omit<Topic, 'content' | 'funFact' | 'quiz'>[] = [
  // ── Pillars of Islam ──────────────────────────────────────────────────────
  { id: 'shahada',       emoji: '☪️',  title: 'Shahada - Declaration of Faith', image: 'https://ik.imagekit.io/4zbzbdytp/imgi_21_topic_abrahamic_religions-24Ub5MbtndBYdeZHxSMfyV.webp',        category: 'pillars_of_islam' },
  { id: 'salah',         emoji: '🤲',  title: 'Salah - Prayer',                 image: 'https://ik.imagekit.io/4zbzbdytp/imgi_11_topic_prayer_salah-AiQHjTprGERKrV6ZWGWS6N.webp',   category: 'pillars_of_islam' },
  { id: 'zakat',         emoji: '💰',  title: 'Zakat - Charity',                image: 'https://ik.imagekit.io/4zbzbdytp/imgi_45_zakat_overview-iB69C239XxvYzdfsgqWaNR.webp',            category: 'pillars_of_islam' },
  { id: 'sawm',          emoji: '🌙',  title: 'Sawm - Fasting in Ramadan',      image: 'https://ik.imagekit.io/4zbzbdytp/imgi_40_ramadan_fasting-SeQhGeRR5buiYbtryMhUKA.webp', category: 'pillars_of_islam' },
  { id: 'hajj',          emoji: '🕋',  title: 'Hajj - Pilgrimage to Mecca',     image: 'https://ik.imagekit.io/4zbzbdytp/hajj_overview-9BS5YUf8qgFKvNgAVo2DpT.webp',  category: 'pillars_of_islam' },

  // ── Core Beliefs ──────────────────────────────────────────────────────────
  { id: 'tawheed',       emoji: '☝️',  title: 'Tawheed - Oneness of God',       image: 'https://ik.imagekit.io/4zbzbdytp/imgi_21_topic_abrahamic_religions-24Ub5MbtndBYdeZHxSMfyV.webp',        category: 'core_beliefs' },
  { id: 'angels',        emoji: '👼',  title: 'Angels',                         image: 'https://ik.imagekit.io/4zbzbdytp/imgi_21_topic_abrahamic_religions-24Ub5MbtndBYdeZHxSMfyV.webp',       category: 'core_beliefs' },
  { id: 'holy_books',    emoji: '📕',  title: 'Holy Books',                     image: 'https://ik.imagekit.io/4zbzbdytp/imgi_41_ramadan_quran-Q4vPHzY2VWydTXwzmZNchH.webp',     category: 'core_beliefs' },
  { id: 'prophets',      emoji: '🧑‍🏫', title: 'Prophets of Allah',             image: 'https://ik.imagekit.io/4zbzbdytp/imgi_3_prophet_stories_feature-FtRej2zvGTyPa9u6r2MF85.webp', category: 'core_beliefs' },
  { id: 'day_of_judgment', emoji: '⚖️', title: 'Day of Judgment',              image: 'https://ik.imagekit.io/4zbzbdytp/imgi_24_topic_myths_facts-9XosEGtJZUumCGvLgPN7Zd.webp',     category: 'core_beliefs' },

  // ── Daily Practices ───────────────────────────────────────────────────────
  { id: 'wudu',          emoji: '🚿',  title: 'Wudu - Ablution',                image: 'https://ik.imagekit.io/4zbzbdytp/imgi_11_topic_prayer_salah-AiQHjTprGERKrV6ZWGWS6N.webp',  category: 'daily_practices' },
  { id: 'islamic_dress', emoji: '👗',  title: 'Islamic Dress',                  image: 'https://ik.imagekit.io/4zbzbdytp/imgi_13_topic_islamic_dress-7whwzZgTnmsVkCdmrsGaFv.webp',  category: 'daily_practices' },
  { id: 'halal_food',    emoji: '🍽️',  title: 'Halal Food',                     image: 'https://ik.imagekit.io/4zbzbdytp/imgi_16_topic_halal_haram_food-2MdETNGseNCerrvGkHzkzE.webp',     category: 'daily_practices' },
  { id: 'duas',          emoji: '🤲',  title: 'Duas - Supplications',           image: 'https://ik.imagekit.io/4zbzbdytp/imgi_10_pillar_duas-EqyXdQq6eb7Aov9Lmrvy3T.webp',         category: 'daily_practices' },
  { id: 'reading_quran', emoji: '📖',  title: 'Reading Quran',                  image: 'https://ik.imagekit.io/4zbzbdytp/imgi_41_ramadan_quran-Q4vPHzY2VWydTXwzmZNchH.webp',   category: 'daily_practices' },

  // ── Islamic Values ────────────────────────────────────────────────────────
  { id: 'honesty',       emoji: '🤝',  title: 'Honesty',                        image: 'https://ik.imagekit.io/4zbzbdytp/imgi_22_topic_shared_values-KgUz6j3XRCxAXqD4mpnH5G.webp',      category: 'islamic_values' },
  { id: 'kindness',      emoji: '💕',  title: 'Kindness',                       image: 'https://ik.imagekit.io/4zbzbdytp/imgi_46_sadaqah_voluntary-metCJkjaZZWHwc3n86346d.webp',     category: 'islamic_values' },
  { id: 'respect',       emoji: '🙏',  title: 'Respect',                        image: 'https://ik.imagekit.io/4zbzbdytp/imgi_17_topic_respect_elders-6wUPfPgJRqgzEPbLKEPMkD.webp',      category: 'islamic_values' },
  { id: 'patience',      emoji: '🧘',  title: 'Patience',                       image: 'https://ik.imagekit.io/4zbzbdytp/imgi_22_topic_shared_values-KgUz6j3XRCxAXqD4mpnH5G.webp',     category: 'islamic_values' },
  { id: 'gratitude',     emoji: '🙏',  title: 'Gratitude',                      image: 'https://ik.imagekit.io/4zbzbdytp/imgi_50_hiba_gifts-6i3784QxV2uUz9RuU6ni4m.webp',    category: 'islamic_values' },

  // ── Stories & History ─────────────────────────────────────────────────────
  { id: 'prophet_muhammad',   emoji: '☪️',  title: 'Prophet Muhammad ﷺ',       image: 'https://ik.imagekit.io/4zbzbdytp/imgi_19_topic_prophet_journey-8ffuT33CJYiTZzo3bCifJ9.webp',     category: 'stories_history' },
  { id: 'prophet_ibrahim',    emoji: '🏗️',  title: 'Prophet Ibrahim',           image: 'https://ik.imagekit.io/4zbzbdytp/imgi_19_topic_prophet_journey-8ffuT33CJYiTZzo3bCifJ9.webp',      category: 'stories_history' },
  { id: 'islamic_civilization', emoji: '🏛️', title: 'Islamic Civilization',    image: 'https://ik.imagekit.io/4zbzbdytp/imgi_20_topic_islamic_civilization-gNpeURs5zuRnR3dMvEndDR.webp', category: 'stories_history' },
  { id: 'al_khwarizmi',       emoji: '📐',  title: 'Al-Khwarizmi - Father of Algebra',    image: 'https://ik.imagekit.io/4zbzbdytp/imgi_25_scholar_al_khwarizmi-YyTnbwqk77BcABwPTm7CYw.webp',   category: 'stories_history' },
  { id: 'ibn_sina',           emoji: '🩺',  title: 'Ibn Sina - Father of Medicine',       image: 'https://ik.imagekit.io/4zbzbdytp/imgi_26_scholar_ibn_sina-96S5bSYcoRZXXh4aq6Jx7q.webp',       category: 'stories_history' },
  { id: 'al_razi',            emoji: '🧪',  title: 'Al-Razi - Pioneer of Chemistry',      image: 'https://ik.imagekit.io/4zbzbdytp/imgi_27_scholar_al_razi-734zXvqhUQPULCRdzdCjA9.webp',        category: 'stories_history' },
  { id: 'al_biruni',          emoji: '🌍',  title: 'Al-Biruni - Master of Sciences',      image: 'https://ik.imagekit.io/4zbzbdytp/imgi_28_scholar_al_biruni-3CxEZkDDXSfMvzUgmWWyDk.webp',      category: 'stories_history' },
  { id: 'al_ghazali',         emoji: '💡',  title: 'Al-Ghazali - Islamic Philosophy',     image: 'https://ik.imagekit.io/4zbzbdytp/imgi_29_scholar_al_ghazali-hXQACXYZ4iArCEGuBdVNNd.webp',     category: 'stories_history' },
  { id: 'fatima_al_fihri',    emoji: '🎓',  title: 'Fatima al-Fihri - First University',  image: 'https://ik.imagekit.io/4zbzbdytp/imgi_30_scholar_fatima_al_fihri-oUUmqToz9ELRTCtWCXgCQn.webp', category: 'stories_history' },
  { id: 'ibn_khaldun',        emoji: '📜',  title: 'Ibn Khaldun - Father of Sociology',   image: 'https://ik.imagekit.io/4zbzbdytp/imgi_31_scholar_ibn_khaldun-22Tqw9TsmYYVf9NDTfPHYp.webp',    category: 'stories_history' },

  // ── Special Times ─────────────────────────────────────────────────────────
  { id: 'ramadan',     emoji: '🌙',  title: 'Ramadan',     image: 'https://ik.imagekit.io/4zbzbdytp/imgi_39_ramadan_overview-KSNdX85Mzos8r2Xf3JL6rh.webp',     category: 'special_times' },
  { id: 'eid_al_fitr', emoji: '🎉',  title: 'Eid al-Fitr', image: 'https://ik.imagekit.io/4zbzbdytp/imgi_42_eid_fitr_celebration-WoRzqkwEMUXtjWTsNNttWJ.webp', category: 'special_times' },
  { id: 'eid_al_adha', emoji: '🐑',  title: 'Eid al-Adha', image: 'https://ik.imagekit.io/4zbzbdytp/imgi_43_eid_adha_celebration-a8nckcQaGvn3CYJJy7ta5A.webp',    category: 'special_times' },
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
