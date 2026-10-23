import { formatNumber } from '@/lib/utils';

type RankBadgeType = 'school' | 'city' | 'national';

type RankBadgeProps = {
  type: RankBadgeType;
  rank: number;
  label: string;
};

const config: Record<
  RankBadgeType,
  { icon: string; bgColor: string; textColor: string; borderColor: string; accentColor: string }
> = {
  school: {
    icon: '🏫',
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-900',
    borderColor: 'border-purple-200',
    accentColor: 'text-purple-600',
  },
  city: {
    icon: '🏙️',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-900',
    borderColor: 'border-blue-200',
    accentColor: 'text-blue-600',
  },
  national: {
    icon: '🇲🇦',
    bgColor: 'bg-green-50',
    textColor: 'text-green-900',
    borderColor: 'border-green-200',
    accentColor: 'text-green-600',
  },
};

export default function RankBadge({ type, rank, label }: RankBadgeProps) {
  const c = config[type];

  return (
    <div
      className={`flex flex-col items-center p-6 rounded-2xl border ${c.bgColor} ${c.borderColor} flex-1 min-w-[140px]`}
    >
      <span className="text-3xl mb-2">{c.icon}</span>
      <div className={`text-3xl font-extrabold ${c.accentColor} mb-1`}>
        #{formatNumber(rank)}
      </div>
      <div className={`text-sm font-medium ${c.textColor} text-center`}>{label}</div>
    </div>
  );
}
