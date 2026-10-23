'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { todayString, formatDate } from '@/lib/utils';

type LeaderboardEntry = {
  rank: number;
  name: string;
  school: string;
  city: string;
  completedTasks: number;
  totalTasks: number;
  completionPct: number;
};

type Scope = 'national' | 'city' | 'school';

export default function LeaderboardPage() {
  const [scope, setScope] = useState<Scope>('national');
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const today = todayString();

  const fetchLeaderboard = useCallback(async (s: Scope) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/leaderboard?scope=${s}&date=${today}`);
      if (res.ok) {
        const data = await res.json();
        setEntries(data.entries || []);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [today]);

  useEffect(() => {
    fetchLeaderboard(scope);
  }, [scope, fetchLeaderboard]);

  const tabs: { key: Scope; label: string; icon: string }[] = [
    { key: 'national', label: 'Morocco (National)', icon: '🇲🇦' },
    { key: 'city', label: 'My City', icon: '🏙️' },
    { key: 'school', label: 'My School', icon: '🏫' },
  ];

  const filteredEntries = useMemo(() => {
    if (!searchQuery.trim()) return entries;
    const q = searchQuery.toLowerCase().trim();
    return entries.filter(
      (e) =>
        e.name.toLowerCase().includes(q) ||
        e.school.toLowerCase().includes(q) ||
        e.city.toLowerCase().includes(q)
    );
  }, [entries, searchQuery]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      <div className="text-center space-y-1">
        <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
          Live Rankings
        </span>
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 pt-2">🏆 Student Leaderboard</h1>
        <p className="text-gray-500 text-sm">
          Rankings for {formatDate(today)} based on percentage of completed tasks
        </p>
      </div>

      {/* Scope tabs */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="inline-flex rounded-2xl border border-gray-200 bg-white p-1.5 shadow-xs w-full sm:w-auto">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setScope(tab.key)}
              className={`flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                scope === tab.key
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="w-full sm:w-64">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search student or school..."
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-xs sm:text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs"
          />
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <svg className="animate-spin h-8 w-8 text-blue-600" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
          </div>
        ) : filteredEntries.length === 0 ? (
          <div className="text-center py-20 px-4 text-gray-400">
            <p className="text-5xl mb-3">🇲🇦</p>
            <p className="font-bold text-gray-700 text-base">
              {searchQuery ? 'No matching students found' : 'No tasks finished yet today'}
            </p>
            <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
              {searchQuery
                ? 'Try a different search term.'
                : 'Be the first student to add and finish tasks today to claim #1!'}
            </p>
            <a
              href="/dashboard"
              className="inline-block mt-4 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 shadow-xs"
            >
              Go to My Tasks →
            </a>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100">
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider w-20">Rank</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Student</th>
                  {scope !== 'school' && (
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider hidden sm:table-cell">School</th>
                  )}
                  {scope === 'national' && (
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider hidden md:table-cell">City</th>
                  )}
                  <th className="text-right px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Progress</th>
                  <th className="text-right px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">% Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredEntries.map((entry, idx) => (
                  <tr
                    key={idx}
                    className={`hover:bg-blue-50/40 transition-colors ${
                      entry.rank === 1
                        ? 'bg-amber-50/30'
                        : entry.rank === 2
                        ? 'bg-slate-50/30'
                        : entry.rank === 3
                        ? 'bg-orange-50/20'
                        : ''
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-extrabold ${
                          entry.rank === 1
                            ? 'bg-yellow-100 text-yellow-800'
                            : entry.rank === 2
                            ? 'bg-gray-200 text-gray-700'
                            : entry.rank === 3
                            ? 'bg-orange-100 text-orange-800'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : entry.rank === 3 ? '🥉' : `#${entry.rank}`}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="font-semibold text-gray-900 text-sm">{entry.name}</p>
                    </td>
                    {scope !== 'school' && (
                      <td className="px-6 py-4 text-xs sm:text-sm text-gray-500 hidden sm:table-cell whitespace-nowrap">
                        {entry.school}
                      </td>
                    )}
                    {scope === 'national' && (
                      <td className="px-6 py-4 text-xs sm:text-sm text-gray-500 hidden md:table-cell whitespace-nowrap">
                        {entry.city}
                      </td>
                    )}
                    <td className="px-6 py-4 text-right text-xs sm:text-sm text-gray-600 whitespace-nowrap font-medium">
                      {entry.completedTasks} / {entry.totalTasks} tasks
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-black ${
                          entry.completionPct === 100
                            ? 'bg-emerald-100 text-emerald-800'
                            : entry.completionPct >= 70
                            ? 'bg-blue-100 text-blue-800'
                            : entry.completionPct >= 40
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {Math.round(entry.completionPct)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
