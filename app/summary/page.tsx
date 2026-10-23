import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { todayString, formatDate } from '@/lib/utils';
import { calculateUserDailyRanking } from '@/lib/ranking';
import RankBadge from '@/components/RankBadge';
import ShareRankButton from '@/components/ShareRankButton';

export default async function SummaryPage() {
  const session = await auth();
  if (!session?.user?.id) redirect('/login');

  const today = todayString();
  const userId = session.user.id;
  const user = session.user as any;

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
      <div className="mb-8 text-center space-y-1">
        <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
          Daily Report
        </span>
        <h1 className="text-3xl font-extrabold text-gray-900 pt-2">Today&apos;s Summary & Rankings</h1>
        <p className="text-gray-500 text-sm">{formatDate(today)}</p>
      </div>

      {/* Progress & Stats Card */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 mb-6">
        <div className="flex flex-col items-center">
          {/* Circular progress with animated gradient appearance */}
          <div className="relative w-44 h-44 mb-6">
            <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
              <circle
                cx="60"
                cy="60"
                r="50"
                fill="none"
                stroke="#f3f4f6"
                strokeWidth="10"
              />
              <circle
                cx="60"
                cy="60"
                r="50"
                fill="none"
                stroke="#2563eb"
                strokeWidth="10"
                strokeDasharray={`${2 * Math.PI * 50}`}
                strokeDashoffset={`${2 * Math.PI * 50 * (1 - completionPct / 100)}`}
                strokeLinecap="round"
                className="transition-all duration-700"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-black text-blue-600">{pctDisplay}%</span>
              <span className="text-xs text-gray-400 font-semibold tracking-wider uppercase">complete</span>
            </div>
          </div>

          {/* Task count indicators */}
          <div className="flex gap-8 text-center mb-2">
            <div>
              <p className="text-4xl font-extrabold text-emerald-600">{completedTasks}</p>
              <p className="text-xs font-medium text-gray-500 mt-1 uppercase tracking-wider">Tasks Done</p>
            </div>
            <div className="w-px bg-gray-200" />
            <div>
              <p className="text-4xl font-extrabold text-gray-700">{totalTasks}</p>
              <p className="text-xs font-medium text-gray-500 mt-1 uppercase tracking-wider">Total Tasks</p>
            </div>
          </div>

          {totalTasks === 0 ? (
            <p className="text-gray-400 text-sm mt-4">
              No tasks added yet today.{' '}
              <a href="/dashboard" className="text-blue-600 font-semibold hover:underline">
                Add your tasks now →
              </a>
            </p>
          ) : pctDisplay === 100 ? (
            <p className="text-emerald-700 text-sm font-semibold mt-4 bg-emerald-50 px-4 py-1.5 rounded-full">
              🌟 Outstanding! You completed 100% of your planned studies today.
            </p>
          ) : (
            <p className="text-blue-700 text-sm font-medium mt-4 bg-blue-50 px-4 py-1.5 rounded-full">
              ⚡ Finish remaining tasks to climb higher on the leaderboard!
            </p>
          )}
        </div>
      </div>

      {/* Rank badges */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-6 text-center flex items-center justify-center gap-2">
          <span>🏆</span>
          <span>Your Live Rankings</span>
        </h2>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <RankBadge type="school" rank={schoolRank} label={`in ${user.school || 'School'}`} />
          <RankBadge type="city" rank={cityRank} label={`in ${user.city || 'City'}`} />
          <RankBadge type="national" rank={nationalRank} label="in Morocco" />
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          Rankings are calculated dynamically based on tasks completed vs planned today.
        </p>

        {/* Share Button */}
        {totalTasks > 0 && (
          <div className="flex justify-center mt-6 pt-6 border-t border-gray-100">
            <ShareRankButton
              name={session.user.name || 'Student'}
              completionPct={pctDisplay}
              completedTasks={completedTasks}
              totalTasks={totalTasks}
              schoolRank={schoolRank}
              cityRank={cityRank}
              nationalRank={nationalRank}
              school={user.school || 'School'}
              city={user.city || 'City'}
            />
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex flex-col sm:flex-row justify-center gap-3">
        <a
          href="/dashboard"
          className="px-6 py-3 rounded-2xl border border-gray-200 bg-white text-gray-700 font-semibold text-sm hover:bg-gray-50 transition-all text-center shadow-xs"
        >
          ← Back to Tasks
        </a>
        <a
          href="/leaderboard"
          className="px-6 py-3 rounded-2xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 transition-all text-center shadow-sm"
        >
          View Full Leaderboard →
        </a>
      </div>
    </div>
  );
}
