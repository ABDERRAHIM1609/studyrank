import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { todayString, formatDate } from '@/lib/utils';
import TaskColumn from '@/components/TaskColumn';

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect('/login');

  const today = todayString();

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              👋 Hello, {session.user.name?.split(' ')[0]}!
            </h1>
            <p className="text-gray-500 mt-1">{formatDate(today)}</p>
          </div>
          <div className="flex gap-3">
            <a
              href="/summary"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white font-medium text-sm hover:bg-blue-700 transition-all shadow-sm"
            >
              📊 View Summary
            </a>
          </div>
        </div>
      </div>

      {/* Two-column task board */}
      <TaskColumn date={today} />
    </div>
  );
}
