import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { todayString, formatDate } from '@/lib/utils';
import TaskColumn from '@/components/TaskColumn';

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect('/login');

  const today = todayString();
  const user = session.user as any;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 rounded-3xl p-6 md:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 bg-white/20 backdrop-blur-xs text-white text-xs font-semibold rounded-full">
                🏫 {user.school || 'School'}
              </span>
              <span className="px-3 py-1 bg-white/20 backdrop-blur-xs text-white text-xs font-semibold rounded-full">
                🏙️ {user.city || 'City'}
              </span>
              <span className="px-3 py-1 bg-emerald-400/30 text-emerald-200 text-xs font-bold rounded-full border border-emerald-400/40">
                🇲🇦 Morocco
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Welcome back, {session.user.name?.split(' ')[0]}! 👋
            </h1>

            <p className="text-blue-100 text-sm max-w-xl">
              Plan your daily studies below. As you finish each task, move it to <strong className="text-white">Done</strong> to climb your school, city, and national rank!
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <a
              href="/summary"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white text-blue-800 font-bold text-sm hover:bg-blue-50 transition-all shadow-md active:scale-95"
            >
              <span>📊 Today&apos;s Rank</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
            <a
              href="/leaderboard"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-blue-600/40 border border-white/20 text-white font-semibold text-sm hover:bg-blue-600/60 transition-all active:scale-95"
            >
              🏆 Leaderboard
            </a>
          </div>
        </div>

        {/* Date stamp in header */}
        <div className="mt-4 pt-4 border-t border-white/10 text-xs text-blue-200 flex items-center justify-between">
          <span>📅 Today: {formatDate(today)}</span>
          <span className="hidden sm:inline">⚡ Rankings calculate in real-time based on completion %</span>
        </div>
      </div>

      {/* Two-column task board */}
      <TaskColumn date={today} />
    </div>
  );
}
