'use client';

import { useState, useEffect, useCallback } from 'react';
import TaskCard from './TaskCard';

type Task = {
  id: string;
  title: string;
  status: 'todo' | 'done';
  createdAt: string;
};

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

  async function handleAddTask(e: React.FormEvent) {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setAdding(true);

    const res = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newTitle.trim(), date }),
    });

    if (res.ok) {
      const data = await res.json();
      setTasks((prev) => [...prev, data.task]);
      setNewTitle('');
      setShowForm(false);
    }

    setAdding(false);
  }

  function handleMarkDone(id: string) {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: 'done' as const } : t))
    );
  }

  const todoTasks = tasks.filter((t) => t.status === 'todo');
  const doneTasks = tasks.filter((t) => t.status === 'done');

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
      {/* Add task button */}
      <div>
        {showForm ? (
          <form
            onSubmit={handleAddTask}
            className="flex gap-3 p-4 bg-white rounded-xl border border-blue-200 shadow-sm"
          >
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="What do you want to study today?"
              autoFocus
              className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="submit"
              disabled={adding || !newTitle.trim()}
              className="px-5 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {adding ? '…' : 'Add'}
            </button>
            <button
              type="button"
              onClick={() => { setShowForm(false); setNewTitle(''); }}
              className="px-4 py-2.5 rounded-lg text-gray-500 hover:bg-gray-100 transition-all text-sm"
            >
              Cancel
            </button>
          </form>
        ) : (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-5 py-3 rounded-xl border-2 border-dashed border-gray-200 text-gray-500 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all w-full justify-center text-sm font-medium"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add New Task
          </button>
        )}
      </div>

      {/* Two columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* To Do column */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-blue-50 bg-blue-50">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <h2 className="font-semibold text-blue-900">To Do</h2>
            </div>
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">
              {todoTasks.length}
            </span>
          </div>
          <div className="p-4 space-y-2 min-h-[200px]">
            {todoTasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-gray-300">
                <span className="text-4xl mb-2">✅</span>
                <p className="text-sm font-medium">All done!</p>
              </div>
            ) : (
              todoTasks.map((task) => (
                <TaskCard key={task.id} task={task} onMarkDone={handleMarkDone} />
              ))
            )}
          </div>
        </div>

        {/* Done column */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-green-50 bg-green-50">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <h2 className="font-semibold text-green-900">Done</h2>
            </div>
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-100 text-green-700 text-xs font-bold">
              {doneTasks.length}
            </span>
          </div>
          <div className="p-4 space-y-2 min-h-[200px]">
            {doneTasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-gray-300">
                <span className="text-4xl mb-2">🎯</span>
                <p className="text-sm font-medium">Complete tasks to see them here</p>
              </div>
            ) : (
              doneTasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Stats bar */}
      {tasks.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-6 py-4 flex items-center gap-6">
          <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-green-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${tasks.length > 0 ? (doneTasks.length / tasks.length) * 100 : 0}%` }}
            />
          </div>
          <span className="text-sm font-medium text-gray-600 flex-shrink-0">
            {doneTasks.length} / {tasks.length} tasks done
            {tasks.length > 0 && (
              <span className="ml-2 text-blue-600 font-bold">
                ({Math.round((doneTasks.length / tasks.length) * 100)}%)
              </span>
            )}
          </span>
        </div>
      )}
    </div>
  );
}
