import { useAppStore } from '@/lib/store';
import { useTranslation } from 'react-i18next';
import type { AgeLevel } from '@/types';
import { Baby, BookOpen, Brain } from 'lucide-react';

const LEVELS: { key: AgeLevel; labelKey: string; ageKey: string; icon: typeof Baby; color: string }[] = [
  { key: 'starter', labelKey: 'starterLabel', ageKey: 'starterAge', icon: Baby, color: 'bg-amber-500' },
  { key: 'explorer', labelKey: 'explorerLabel', ageKey: 'explorerAge', icon: BookOpen, color: 'bg-sky-500' },
  { key: 'thinker', labelKey: 'thinkerLabel', ageKey: 'thinkerAge', icon: Brain, color: 'bg-indigo-500' },
];

export default function AgeSelector() {
  const { ageLevel, setAgeLevel } = useAppStore();
  const { t } = useTranslation();

  return (
    <div className="flex gap-2">
      {LEVELS.map(level => {
        const Icon = level.icon;
        const isActive = ageLevel === level.key;
        return (
          <button
            id={`btn-age-${level.key}`}
            key={level.key}
            onClick={() => setAgeLevel(level.key)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all hover:scale-[1.03] active:scale-95 ${
              isActive
                ? `${level.color} text-white shadow-md shadow-black/10`
                : 'bg-white/80 text-gray-600 border border-gray-100 hover:bg-white hover:text-gray-800'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span>{t(level.labelKey)}</span>
            <span className="text-[10px] opacity-80 font-normal">({t(level.ageKey)})</span>
          </button>
        );
      })}
    </div>
  );
}
