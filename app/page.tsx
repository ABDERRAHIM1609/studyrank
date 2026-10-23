import Link from 'next/link';
import { auth } from '@/lib/auth';

export default async function LandingPage() {
  const session = await auth();

  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)]">
      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-blue-500/30 border border-blue-400/40 text-blue-100 text-sm font-medium px-4 py-2 rounded-full mb-6">
            🇲🇦 Built for Moroccan Students
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight">
            Study Smarter,
            <br />
            <span className="text-blue-200">Rank Higher</span>
          </h1>

          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto leading-relaxed">
            Track your daily study tasks, measure your completion rate, and see
            how you rank against students in your school, city, and all of
            Morocco.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {session ? (
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-white text-blue-700 font-bold text-lg hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl"
              >
                Go to Dashboard →
              </Link>
            ) : (
              <>
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-white text-blue-700 font-bold text-lg hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl"
                >
                  Get Started Free
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-blue-500/20 border-2 border-white/40 text-white font-bold text-lg hover:bg-blue-500/30 transition-all"
                >
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Everything you need to excel
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: '📋',
                title: 'Daily Task Board',
                description:
                  'Add your study tasks for the day and move them from To Do to Done as you complete them. Stay organised and focused.',
              },
              {
                icon: '📊',
                title: 'Progress Summary',
                description:
                  'See your completion percentage at a glance. Track how productive you are each day with beautiful stats.',
              },
              {
                icon: '🏆',
                title: 'Live Rankings',
                description:
                  'Compare yourself with students in your school, city, and nationally. Climb the leaderboard every day.',
              },
            ].map((f) => (
              <div
                key={f.title}
                className="flex flex-col items-center text-center p-8 rounded-2xl border border-gray-100 bg-gray-50 hover:border-blue-200 hover:bg-blue-50 transition-all"
              >
                <div className="text-5xl mb-4">{f.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {f.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">
          Ready to start ranking?
        </h2>
        <p className="text-blue-100 mb-8 text-lg">
          Join thousands of Moroccan students tracking their progress daily.
        </p>
        <Link
          href="/register"
          className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-white text-blue-700 font-bold text-lg hover:bg-blue-50 transition-all shadow-lg"
        >
          Create Free Account
        </Link>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-gray-400 text-sm bg-gray-900">
        © {new Date().getFullYear()} StudyRank — Empowering Moroccan Students 🇲🇦
      </footer>
    </div>
  );
}
