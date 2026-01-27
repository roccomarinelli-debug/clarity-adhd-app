import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="px-6 py-8">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            Clarity
          </h1>
          <p className="text-lg text-gray-600 mb-2">
            Your AI Coach for ADHD Mastery
          </p>
          <p className="text-sm text-gray-500 max-w-sm mx-auto">
            Wake up. Meditate. Move. Eat right. One habit leads to the next.
          </p>
        </div>

        {/* Three Lenses - Mobile Optimized */}
        <div className="space-y-4 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
              <span className="text-2xl">🥗</span>
            </div>
            <h3 className="text-lg font-bold mb-2">Diet Lens</h3>
            <p className="text-sm text-gray-600">
              Stay in ketosis. Your ADHD brain runs on ketones, not glucose.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
              <span className="text-2xl">💪</span>
            </div>
            <h3 className="text-lg font-bold mb-2">Exercise Lens</h3>
            <p className="text-sm text-gray-600">
              Prime your reward system. Norwegian 4x4, mobility, strength.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-3">
              <span className="text-2xl">🧘</span>
            </div>
            <h3 className="text-lg font-bold mb-2">Mindfulness Lens</h3>
            <p className="text-sm text-gray-600">
              30 minutes at 5 AM. Build attention. Delay gratification.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="space-y-3 mb-8">
          <Link
            href="/flow-state"
            className="block w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-6 py-4 rounded-2xl transition-colors text-center shadow-lg"
          >
            🚀 Flow State Production Line
          </Link>
          <Link
            href="/dashboard"
            className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-4 rounded-2xl transition-colors text-center"
          >
            Start Your Day
          </Link>
          <Link
            href="/about"
            className="block w-full border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold px-6 py-4 rounded-2xl transition-colors text-center"
          >
            How It Works
          </Link>
        </div>

        {/* Value Props - Mobile */}
        <div className="space-y-3 text-sm">
          <div className="flex gap-3">
            <div className="text-green-600 text-lg flex-shrink-0">✓</div>
            <div>
              <h4 className="font-semibold mb-1">AI-Guided Daily Routine</h4>
              <p className="text-gray-600 text-xs">
                Your personal coach walks you through each habit
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="text-green-600 text-lg flex-shrink-0">✓</div>
            <div>
              <h4 className="font-semibold mb-1">No Medication Needed</h4>
              <p className="text-gray-600 text-xs">
                Natural system based on science and lived experience
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="text-green-600 text-lg flex-shrink-0">✓</div>
            <div>
              <h4 className="font-semibold mb-1">Voice-First Interface</h4>
              <p className="text-gray-600 text-xs">
                Just speak: "I ate 4 eggs and bacon" - AI handles the rest
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="text-green-600 text-lg flex-shrink-0">✓</div>
            <div>
              <h4 className="font-semibold mb-1">One Habit Begets Another</h4>
              <p className="text-gray-600 text-xs">
                Like a rosary - each bead leads naturally to the next
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
