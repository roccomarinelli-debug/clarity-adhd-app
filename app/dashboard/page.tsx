import Link from "next/link";

export default function Dashboard() {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-6 py-4">
          <h1 className="text-2xl font-bold text-blue-600">Clarity</h1>
          <p className="text-xs text-gray-500">{today}</p>
        </div>
      </header>

      <div className="px-6 py-6 space-y-6">
        {/* Morning Greeting */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-6 rounded-2xl">
          <h2 className="text-2xl font-bold mb-2">Good Morning</h2>
          <p className="text-blue-100 text-sm mb-4">Ready to align your three lenses?</p>
          <Link
            href="/meditation"
            className="block w-full bg-white hover:bg-gray-50 text-purple-600 font-bold px-6 py-4 rounded-2xl transition-colors text-center"
          >
            🧘 Start Morning Flow
          </Link>
        </div>

        {/* Today's Alignment */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h3 className="font-bold text-lg mb-4">Today's Alignment</h3>

          <div className="space-y-4">
            {/* Diet Lens */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">🥗</span>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-sm">Diet Lens</h4>
                <p className="text-xs text-gray-500">Not tracked yet</p>
              </div>
              <div className="w-3 h-3 rounded-full bg-gray-300"></div>
            </div>

            {/* Exercise Lens */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">💪</span>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-sm">Exercise Lens</h4>
                <p className="text-xs text-gray-500">Not tracked yet</p>
              </div>
              <div className="w-3 h-3 rounded-full bg-gray-300"></div>
            </div>

            {/* Mindfulness Lens */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">🧘</span>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-sm">Mindfulness Lens</h4>
                <p className="text-xs text-gray-500">Not tracked yet</p>
              </div>
              <div className="w-3 h-3 rounded-full bg-gray-300"></div>
            </div>
          </div>

          <Link
            href="/track"
            className="mt-6 block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-4 rounded-2xl transition-colors text-center"
          >
            Track Now
          </Link>
        </div>

        {/* Current Streaks */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h3 className="font-bold text-lg mb-4">Current Streaks</h3>

          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">0</div>
              <div className="text-xs text-gray-500 mt-1">Overall</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">0</div>
              <div className="text-xs text-gray-500 mt-1">Meditation</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">0</div>
              <div className="text-xs text-gray-500 mt-1">Exercise</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">0</div>
              <div className="text-xs text-gray-500 mt-1">Diet</div>
            </div>
          </div>
        </div>

        {/* Reward System Insights */}
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100">
          <h3 className="font-bold text-lg mb-4">⚡ Reward System</h3>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-gray-600">Days Primed (This Week)</span>
                <span className="font-bold">0/7</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{width: '0%'}}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-gray-600">Avg Clarity Rating</span>
                <span className="font-bold">-/10</span>
              </div>
            </div>

            <p className="text-xs text-gray-600 pt-2 border-t border-gray-200">
              Start tracking to see when your reward system is primed and strategic thinking emerges.
            </p>
          </div>
        </div>

        {/* Quick Tip */}
        <div className="bg-blue-50 rounded-2xl p-4">
          <div className="flex gap-3">
            <div className="text-2xl">💡</div>
            <div>
              <h4 className="font-semibold text-sm mb-1">Morning Tip</h4>
              <p className="text-xs text-gray-600">
                Your reward system is most likely to prime when all three lenses align. Track consistently to see your patterns.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3 flex justify-around" style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}>
        <Link href="/dashboard" className="flex flex-col items-center gap-1">
          <span className="text-xl">🏠</span>
          <span className="text-xs font-semibold text-blue-600">Home</span>
        </Link>
        <Link href="/track" className="flex flex-col items-center gap-1">
          <span className="text-xl">✏️</span>
          <span className="text-xs text-gray-500">Track</span>
        </Link>
        <Link href="/progress" className="flex flex-col items-center gap-1">
          <span className="text-xl">📊</span>
          <span className="text-xs text-gray-500">Progress</span>
        </Link>
        <Link href="/settings" className="flex flex-col items-center gap-1">
          <span className="text-xl">⚙️</span>
          <span className="text-xs text-gray-500">Settings</span>
        </Link>
      </nav>
    </div>
  );
}
