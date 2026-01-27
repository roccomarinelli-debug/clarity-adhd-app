import Link from "next/link";

export default function ProgressPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            Clarity
          </Link>
          <nav className="flex gap-6">
            <Link href="/dashboard" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
              Dashboard
            </Link>
            <Link href="/track" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
              Track Today
            </Link>
            <Link href="/progress" className="text-blue-600 font-semibold">
              Progress
            </Link>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Your Progress</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track your journey toward mastering ADHD naturally
          </p>
        </div>

        {/* Weekly Overview */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6">This Week</h2>

          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Days Tracked</p>
              <p className="text-4xl font-bold text-blue-600">0/7</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">All Aligned</p>
              <p className="text-4xl font-bold text-green-600">0</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Reward Primed</p>
              <p className="text-4xl font-bold text-purple-600">0</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Avg Clarity</p>
              <p className="text-4xl font-bold text-blue-600">-/10</p>
            </div>
          </div>

          {/* Calendar Placeholder */}
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8">
            <p className="text-center text-gray-500">
              📅 Weekly calendar view coming soon
            </p>
            <p className="text-center text-sm text-gray-400 mt-2">
              Track daily to see your patterns
            </p>
          </div>
        </div>

        {/* Lens Breakdown */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Diet Lens Progress */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                <span className="text-xl">🥗</span>
              </div>
              <h3 className="text-xl font-bold">Diet Lens</h3>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Avg Adherence</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{width: '0%'}}></div>
                  </div>
                  <span className="text-sm font-semibold">-/10</span>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Fasting Consistency</p>
                <p className="text-2xl font-bold">0%</p>
              </div>

              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Current Streak</p>
                <p className="text-2xl font-bold text-green-600">0 days</p>
              </div>
            </div>
          </div>

          {/* Exercise Lens Progress */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <span className="text-xl">💪</span>
              </div>
              <h3 className="text-xl font-bold">Exercise Lens</h3>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Completion Rate</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{width: '0%'}}></div>
                  </div>
                  <span className="text-sm font-semibold">0%</span>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Avg Intensity</p>
                <p className="text-2xl font-bold">-/10</p>
              </div>

              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Current Streak</p>
                <p className="text-2xl font-bold text-blue-600">0 days</p>
              </div>
            </div>
          </div>

          {/* Mindfulness Lens Progress */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                <span className="text-xl">🧘</span>
              </div>
              <h3 className="text-xl font-bold">Mindfulness Lens</h3>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Completion Rate</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full" style={{width: '0%'}}></div>
                  </div>
                  <span className="text-sm font-semibold">0%</span>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Avg Duration</p>
                <p className="text-2xl font-bold">0 min</p>
              </div>

              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Current Streak</p>
                <p className="text-2xl font-bold text-purple-600">0 days</p>
              </div>
            </div>
          </div>
        </div>

        {/* Insights */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg shadow-lg p-6 border-2 border-blue-200 dark:border-blue-800">
          <h2 className="text-2xl font-bold mb-4">Insights & Patterns</h2>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Start tracking daily to unlock powerful insights about your patterns:
            </p>

            <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <li className="flex gap-2">
                <span>📊</span>
                <span>Which days you achieve full alignment</span>
              </li>
              <li className="flex gap-2">
                <span>⚡</span>
                <span>When your reward system is most likely to be primed</span>
              </li>
              <li className="flex gap-2">
                <span>🎯</span>
                <span>Correlation between lenses and clarity ratings</span>
              </li>
              <li className="flex gap-2">
                <span>📈</span>
                <span>Your best performing days and what made them special</span>
              </li>
              <li className="flex gap-2">
                <span>🔍</span>
                <span>Patterns in exercise types and their impact</span>
              </li>
            </ul>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-8 text-center">
          <Link
            href="/track"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
          >
            Track Today
          </Link>
        </div>
      </div>
    </div>
  );
}
