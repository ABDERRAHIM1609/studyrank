'use client';

import { useState, useEffect, useCallback } from 'react';
import { todayString, formatNumber } from '@/lib/utils';

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
    { key: 'national', label: 'Morocco', icon: '🇲🇦' },
    { key: 'city', label: 'City', icon: '🏙️' },
    { key: 'school', label: 'School', icon: '🏫' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900">🏆 Leaderboard</h1>
        <p className="text-gray-500 mt-1">Top students by task completion today</p>
      </div>

      {/* Scope tabs */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex rounded-xl border border-gray-200 bg-white p-1 shadow-sm">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setScope(tab.key)}
              className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                scope === tab.key
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <svg className="animate-spin h-8 w-8 text-blue-600" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
          </div>
        ) : entries.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-4xl mb-3">📭</p>
            <p className="font-medium">No data yet for today.</p>
            <p className="text-sm mt-1">Be the first to complete tasks and appear here!</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-16">Rank</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Student</th>
                {scope !== 'school' && (
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">School</th>
                )}
                {scope === 'national' && (
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">City</th>
                )}
                <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Tasks</th>
                <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">%</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {entries.map((entry, idx) => (
                <tr
                  key={idx}
                  className={`hover:bg-blue-50/30 transition-colors ${
                    entry.rank <= 3 ? 'bg-yellow-50/30' : ''
                  }`}
                >
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
                        entry.rank === 1
                          ? 'bg-yellow-100 text-yellow-700'
                          : entry.rank === 2
                          ? 'bg-gray-100 text-gray-600'
                          : entry.rank === 3
                          ? 'bg-orange-100 text-orange-600'
                          : 'bg-gray-50 text-gray-500'
                      }`}
                    >
                      {entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : entry.rank === 3 ? '🥉' : `#${entry.rank}`}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900 text-sm">{entry.name}</p>
                  </td>
                  {scope !== 'school' && (
                    <td className="px-6 py-4 text-sm text-gray-500 hidden sm:table-cell">
                      {entry.school}
                    </td>
                  )}
                  {scope === 'national' && (
                    <td className="px-6 py-4 text-sm text-gray-500 hidden md:table-cell">
                      {entry.city}
                    </td>
                  )}
                  <td className="px-6 py-4 text-right text-sm text-gray-600">
                    {entry.completedTasks}/{entry.totalTasks}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold ${
                        entry.completionPct >= 80
                          ? 'bg-green-100 text-green-700'
                          : entry.completionPct >= 50
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-600'
                      }`}
                    >
                      {Math.round(entry.completionPct)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
