import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { todayString, formatDate } from '@/lib/utils';
import { calculateUserDailyRanking } from '@/lib/ranking';
import RankBadge from '@/components/RankBadge';

export default async function SummaryPage() {
  const session = await auth();
  if (!session?.user?.id) redirect('/login');

  const today = todayString();
  const userId = session.user.id;

  let data = null;
  try {
    data = await calculateUserDailyRanking(userId, today);
  } catch (error) {
    console.error('Failed to get ranking data:', error);
  }

  const totalTasks = data?.totalTasks ?? 0;
  const completedTasks = data?.completedTasks ?? 0;
  const completionPct = data?.completionPct ?? 0;
  const schoolRank = data?.schoolRank ?? 1;
  const cityRank = data?.cityRank ?? 1;
  const nationalRank = data?.nationalRank ?? 1;

  const pctDisplay = Math.round(completionPct);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900">Today&apos;s Summary</h1>
        <p className="text-gray-500 mt-1">{formatDate(today)}</p>
      </div>

      {/* Stats card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 mb-6">
        <div className="flex flex-col items-center">
          {/* Circular progress */}
          <div className="relative w-40 h-40 mb-6">
            <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
              <circle
                cx="60"
                cy="60"
                r="50"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="12"
              />
              <circle
                cx="60"
                cy="60"
                r="50"
                fill="none"
                stroke="#2563eb"
                strokeWidth="12"
                strokeDasharray={`${2 * Math.PI * 50}`}
                strokeDashoffset={`${2 * Math.PI * 50 * (1 - completionPct / 100)}`}
                strokeLinecap="round"
                className="transition-all duration-700"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-extrabold text-blue-600">{pctDisplay}%</span>
              <span className="text-xs text-gray-400 font-medium">complete</span>
            </div>
          </div>

          {/* Task counts */}
          <div className="flex gap-8 text-center mb-2">
            <div>
              <p className="text-4xl font-bold text-green-600">{completedTasks}</p>
              <p className="text-sm text-gray-500 mt-1">Tasks Done</p>
            </div>
            <div className="w-px bg-gray-200" />
            <div>
              <p className="text-4xl font-bold text-gray-700">{totalTasks}</p>
              <p className="text-sm text-gray-500 mt-1">Total Tasks</p>
            </div>
          </div>

          {totalTasks === 0 && (
            <p className="text-gray-400 text-sm mt-4">
              No tasks added yet today.{' '}
              <a href="/dashboard" className="text-blue-600 hover:underline">
                Add some tasks →
              </a>
            </p>
          )}
        </div>
      </div>

      {/* Rank badges */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
        <h2 className="text-lg font-bold text-gray-900 mb-6 text-center">
          🏆 Your Rankings
        </h2>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <RankBadge type="school" rank={schoolRank} label={`in ${(session.user as any).school || 'School'}`} />
          <RankBadge type="city" rank={cityRank} label={`in ${(session.user as any).city || 'City'}`} />
          <RankBadge type="national" rank={nationalRank} label="in Morocco" />
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          Rankings update each time you visit this page. Only students with at
          least 1 task are ranked.
        </p>
      </div>

      {/* Navigation */}
      <div className="flex justify-center gap-4 mt-8">
        <a
          href="/dashboard"
          className="px-6 py-3 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-all"
        >
          ← Back to Dashboard
        </a>
        <a
          href="/leaderboard"
          className="px-6 py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-all shadow-sm"
        >
          View Leaderboard →
        </a>
      </div>
    </div>
  );
}
