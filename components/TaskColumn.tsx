'use client';

import { useState, useEffect, useCallback } from 'react';
import TaskCard from './TaskCard';

type Task = {
  id: string;
  title: string;
  status: 'todo' | 'done';
  createdAt: string;
};

const QUICK_SUGGESTIONS = [
  'Math exercises 📐',
  'Physics & Chemistry ⚗️',
  'Philosophy essay ✍️',
  'English practice 🇬🇧',
  'French revision 🇫🇷',
  'National Exam Prep 🇲🇦',
];

export default function TaskColumn({ date }: { date: string }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTitle, setNewTitle] = useState('');
  const [adding, setAdding] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const fetchTasks = useCallback(async () => {
    try {
      const res = await fetch(`/api/tasks?date=${date}`);
      if (res.ok) {
        const data = await res.json();
        setTasks(data.tasks || []);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [date]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  async function handleAddTask(titleToAdd?: string) {
    const title = (titleToAdd || newTitle).trim();
    if (!title) return;
    setAdding(true);

    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, date }),
      });

      if (res.ok) {
        const data = await res.json();
        setTasks((prev) => [...prev, data.task]);
        setNewTitle('');
        setShowForm(false);
      }
    } catch {
      // ignore
    } finally {
      setAdding(false);
    }
  }

  function handleStatusChange(id: string, newStatus: 'todo' | 'done') {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t))
    );
  }

  function handleDelete(id: string) {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }

  const todoTasks = tasks.filter((t) => t.status === 'todo');
  const doneTasks = tasks.filter((t) => t.status === 'done');
  const completionPct = tasks.length > 0 ? Math.round((doneTasks.length / tasks.length) * 100) : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <svg className="animate-spin h-8 w-8 text-blue-600" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 100% Celebration Banner */}
      {tasks.length > 0 && doneTasks.length === tasks.length && (
        <div className="p-4 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl text-white shadow-md flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🎉</span>
            <div>
              <p className="font-bold text-base">Perfect Score! 100% Completed Today</p>
              <p className="text-emerald-100 text-xs">You conquered all your study goals! Check your updated rank.</p>
            </div>
          </div>
          <a
            href="/summary"
            className="px-4 py-2 bg-white text-emerald-700 font-bold text-xs rounded-xl hover:bg-emerald-50 transition-all shadow-sm flex-shrink-0"
          >
            Check My Rank →
          </a>
        </div>
      )}

      {/* Add task bar */}
      <div>
        {showForm ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAddTask();
            }}
            className="flex flex-col sm:flex-row gap-3 p-4 bg-white rounded-2xl border border-blue-200 shadow-sm"
          >
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="What do you plan to study today? (e.g. Solve Math Exam 2023)"
              autoFocus
              className="flex-1 px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={adding || !newTitle.trim()}
                className="px-6 py-3 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xs"
              >
                {adding ? 'Adding...' : 'Add Task'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setNewTitle('');
                }}
                className="px-4 py-3 rounded-xl text-gray-500 hover:bg-gray-100 transition-all text-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-3">
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl border-2 border-dashed border-blue-200 text-blue-700 hover:border-blue-500 hover:bg-blue-50/50 transition-all w-full justify-center text-sm font-semibold bg-white shadow-xs"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
              <span>+ Add What to Do Today</span>
            </button>

            {/* Quick 1-click subject tags */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-xs text-gray-400 font-medium">Quick add:</span>
              {QUICK_SUGGESTIONS.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => handleAddTask(suggestion)}
                  disabled={adding}
                  className="px-3 py-1 rounded-full text-xs bg-white border border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 transition-all cursor-pointer"
                >
                  + {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Progress Bar Header */}
      {tasks.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
              {completionPct}%
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Today&apos;s Progress</p>
              <p className="text-sm font-bold text-gray-900">
                {doneTasks.length} of {tasks.length} tasks completed
              </p>
            </div>
          </div>

          <div className="w-full sm:w-72 bg-gray-100 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${completionPct}%` }}
            />
          </div>
        </div>
      )}

      {/* Two-column / Two-row Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ROW 1 / Column 1: TO DO */}
        <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden flex flex-col">
          <div className="flex items-center justify-between px-6 py-4 border-b border-blue-100 bg-blue-50/70">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-500 animate-pulse" />
              <h2 className="font-bold text-blue-900 text-base">📋 To Do (Planned)</h2>
            </div>
            <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full bg-blue-200 text-blue-800 text-xs font-extrabold">
              {todoTasks.length}
            </span>
          </div>
          <div className="p-4 space-y-3 flex-1 min-h-[220px]">
            {todoTasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                <span className="text-4xl mb-2">🎉</span>
                <p className="text-sm font-medium text-gray-500">
                  {tasks.length === 0 ? 'No tasks added yet today' : 'All tasks moved to Done!'}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {tasks.length === 0 ? 'Add what you want to achieve today above' : 'Great job!'}
                </p>
              </div>
            ) : (
              todoTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onStatusChange={handleStatusChange}
                  onDelete={handleDelete}
                />
              ))
            )}
          </div>
        </div>

        {/* ROW 2 / Column 2: DONE */}
        <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden flex flex-col">
          <div className="flex items-center justify-between px-6 py-4 border-b border-emerald-100 bg-emerald-50/70">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500" />
              <h2 className="font-bold text-emerald-900 text-base">✅ Done (Finished)</h2>
            </div>
            <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full bg-emerald-200 text-emerald-800 text-xs font-extrabold">
              {doneTasks.length}
            </span>
          </div>
          <div className="p-4 space-y-3 flex-1 min-h-[220px]">
            {doneTasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                <span className="text-4xl mb-2">🎯</span>
                <p className="text-sm font-medium text-gray-500">No completed tasks yet</p>
                <p className="text-xs text-gray-400 mt-1">Click &quot;Done →&quot; on any task to move it here</p>
              </div>
            ) : (
              doneTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onStatusChange={handleStatusChange}
                  onDelete={handleDelete}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
