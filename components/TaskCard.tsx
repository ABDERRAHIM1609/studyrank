'use client';

import { useState } from 'react';

type Task = {
  id: string;
  title: string;
  status: 'todo' | 'done';
  createdAt: string;
};

type TaskCardProps = {
  task: Task;
  onStatusChange?: (id: string, newStatus: 'todo' | 'done') => void;
  onDelete?: (id: string) => void;
};

export default function TaskCard({ task, onStatusChange, onDelete }: TaskCardProps) {
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleToggleStatus() {
    if (loading) return;
    const nextStatus = task.status === 'todo' ? 'done' : 'todo';
    setLoading(true);

    try {
      const res = await fetch(`/api/tasks/${task.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });

      if (res.ok) {
        onStatusChange?.(task.id, nextStatus);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (deleting) return;
    if (!confirm('Are you sure you want to delete this task?')) return;
    setDeleting(true);

    try {
      const res = await fetch(`/api/tasks/${task.id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        onDelete?.(task.id);
      }
    } catch {
      // ignore
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div
      className={`group relative flex items-center justify-between gap-3 p-4 rounded-xl border transition-all duration-200 ${
        task.status === 'done'
          ? 'bg-emerald-50/70 border-emerald-200 shadow-xs'
          : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-sm'
      } ${loading || deleting ? 'opacity-50 pointer-events-none scale-98' : 'opacity-100'}`}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {/* Toggle checkbox */}
        <button
          type="button"
          onClick={handleToggleStatus}
          disabled={loading}
          className={`w-6 h-6 rounded-lg border flex-shrink-0 flex items-center justify-center transition-all cursor-pointer ${
            task.status === 'done'
              ? 'bg-emerald-500 border-emerald-500 text-white shadow-xs'
              : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'
          }`}
          title={task.status === 'done' ? 'Click to mark as not done' : 'Click to complete'}
        >
          {task.status === 'done' && (
            <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>

        {/* Title */}
        <p
          className={`text-sm truncate font-medium ${
            task.status === 'done'
              ? 'text-emerald-900/70 line-through decoration-emerald-500/50'
              : 'text-gray-800'
          }`}
        >
          {task.title}
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {task.status === 'todo' ? (
          <button
            onClick={handleToggleStatus}
            disabled={loading}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-600 hover:text-white border border-blue-200 transition-all cursor-pointer shadow-xs active:scale-95"
            title="Move to Done row"
          >
            <span>Done</span>
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        ) : (
          <button
            onClick={handleToggleStatus}
            disabled={loading}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-emerald-700 bg-emerald-100/60 hover:bg-emerald-200 transition-all cursor-pointer"
            title="Move back to To Do"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>To Do</span>
          </button>
        )}

        {/* Delete button */}
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
          title="Delete task"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
}
