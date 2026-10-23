'use client';

import { useState } from 'react';

type ShareRankButtonProps = {
  name: string;
  completionPct: number;
  completedTasks: number;
  totalTasks: number;
  schoolRank: number;
  cityRank: number;
  nationalRank: number;
  school: string;
  city: string;
};

export default function ShareRankButton({
  name,
  completionPct,
  completedTasks,
  totalTasks,
  schoolRank,
  cityRank,
  nationalRank,
  school,
  city,
}: ShareRankButtonProps) {
  const [copied, setCopied] = useState(false);

  function handleShare() {
    const text = `🇲🇦 StudyRank Update for ${name}:
🎯 ${completionPct}% completed (${completedTasks}/${totalTasks} tasks)
🏫 #${schoolRank} in ${school}
🏙️ #${cityRank} in ${city}
🇲🇦 #${nationalRank} in Morocco!

Track your daily study tasks and climb the ranks:
https://studyrank-gbz7.vercel.app`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } else {
      alert(text);
    }
  }

  return (
    <button
      onClick={handleShare}
      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm transition-all shadow-sm active:scale-95 cursor-pointer"
    >
      {copied ? (
        <>
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
          <span>Copied to Clipboard! 🎉</span>
        </>
      ) : (
        <>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          <span>Share My Rank (WhatsApp / Socials)</span>
        </>
      )}
    </button>
  );
}
