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
  onMarkDone?: (id: string) => void;
};

export default function TaskCard({ task, onMarkDone }: TaskCardProps) {
  const [moving, setMoving] = useState(false);

  async function handleMarkDone() {
    if (moving || task.status === 'done') return;
    setMoving(true);

    try {
      const res = await fetch(`/api/tasks/${task.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
      });

      if (res.ok) {
        setTimeout(() => {
          onMarkDone?.(task.id);
        }, 200);
      } else {
        setMoving(false);
      }
    } catch {
      setMoving(false);
    }
  }

  return (
    <div
      className={`group flex items-center justify-between gap-3 p-4 rounded-xl border transition-all duration-200 ${
        task.status === 'done'
          ? 'bg-emerald-50/60 border-emerald-200'
          : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-sm'
      } ${moving ? 'opacity-40 scale-95' : 'opacity-100'}`}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {/* Checkbox indicator */}
        <button
          type="button"
          onClick={handleMarkDone}
          disabled={task.status === 'done' || moving}
          className={`w-6 h-6 rounded-lg border flex-shrink-0 flex items-center justify-center transition-colors ${
            task.status === 'done'
              ? 'bg-emerald-500 border-emerald-500 cursor-default'
              : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50 cursor-pointer'
          }`}
          title={task.status === 'done' ? 'Completed' : 'Click to complete'}
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
              ? 'text-emerald-800 line-through decoration-emerald-500/60'
              : 'text-gray-800'
          }`}
        >
          {task.title}
        </p>
      </div>

      {/* Move to Done button (Two rows / To Do column) */}
      {task.status === 'todo' && (
        <button
          onClick={handleMarkDone}
          disabled={moving}
          className="flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-600 hover:text-white border border-blue-100 transition-all cursor-pointer shadow-xs active:scale-95"
          title="Move to Done"
        >
          <span>Done</span>
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      )}

      {task.status === 'done' && (
        <span className="flex-shrink-0 text-xs font-semibold text-emerald-600 bg-emerald-100/70 px-2.5 py-1 rounded-md">
          Completed
        </span>
      )}
    </div>
  );
}
