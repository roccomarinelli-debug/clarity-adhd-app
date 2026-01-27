"use client";

import { useState } from "react";
import Link from "next/link";

export default function TrackPage() {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  // Form state - Three Lenses tracking
  const [formData, setFormData] = useState({
    // Diet Lens
    wake_time: "",
    fasting_start: "",
    fasting_end: "",
    diet_adherence: 5,

    // Exercise Lens
    exercise_completed: false,
    exercise_type: "",
    exercise_duration: 0,
    exercise_intensity: 5,

    // Mindfulness Lens
    meditation_completed: false,
    meditation_duration: 0,

    // The Alignment Effect
    reward_system_primed: false,
    clarity_rating: 5,
    strategic_thinking: false,

    // Notes
    wins: "",
    challenges: "",
    notes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Save to Supabase
    console.log("Tracking data:", formData);
    alert("Saved! (This will connect to database soon)");
  };

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
            <Link href="/track" className="text-blue-600 font-semibold">
              Track Today
            </Link>
            <Link href="/progress" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
              Progress
            </Link>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <Link href="/dashboard" className="text-blue-600 hover:underline mb-2 inline-block">
            ← Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold mb-2">Track Today's Habits</h1>
          <p className="text-gray-600 dark:text-gray-400">{today}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* DIET LENS */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                <span className="text-2xl">🥗</span>
              </div>
              <h2 className="text-2xl font-bold">Diet Lens</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Wake Time
                </label>
                <input
                  type="time"
                  value={formData.wake_time}
                  onChange={(e) => setFormData({ ...formData, wake_time: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                />
                <p className="text-xs text-gray-500 mt-1">Target: 5:00 AM for optimal clarity</p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Fasting Window Start
                  </label>
                  <input
                    type="time"
                    value={formData.fasting_start}
                    onChange={(e) => setFormData({ ...formData, fasting_start: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Fasting Window End
                  </label>
                  <input
                    type="time"
                    value={formData.fasting_end}
                    onChange={(e) => setFormData({ ...formData, fasting_end: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                  />
                </div>
              </div>
              <p className="text-xs text-gray-500">18/6 fasting (e.g., 6:30 PM - 12:30 PM)</p>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Diet Adherence (Keto/Carnivore): {formData.diet_adherence}/10
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={formData.diet_adherence}
                  onChange={(e) => setFormData({ ...formData, diet_adherence: parseInt(e.target.value) })}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Broke keto</span>
                  <span>Perfect adherence</span>
                </div>
              </div>
            </div>
          </div>

          {/* EXERCISE LENS */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <span className="text-2xl">💪</span>
              </div>
              <h2 className="text-2xl font-bold">Exercise Lens</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="exercise_completed"
                  checked={formData.exercise_completed}
                  onChange={(e) => setFormData({ ...formData, exercise_completed: e.target.checked })}
                  className="w-5 h-5 text-blue-600"
                />
                <label htmlFor="exercise_completed" className="text-sm font-medium">
                  Completed exercise today
                </label>
              </div>

              {formData.exercise_completed && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Exercise Type
                    </label>
                    <select
                      value={formData.exercise_type}
                      onChange={(e) => setFormData({ ...formData, exercise_type: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                    >
                      <option value="">Select type</option>
                      <option value="Norwegian 4x4">Norwegian 4x4 (HIIT)</option>
                      <option value="Strength Training">Strength Training</option>
                      <option value="Mobility Work">Mobility Work</option>
                      <option value="Running">Running</option>
                      <option value="Mixed">Mixed / Hour of Power</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Duration (minutes)
                    </label>
                    <input
                      type="number"
                      value={formData.exercise_duration}
                      onChange={(e) => setFormData({ ...formData, exercise_duration: parseInt(e.target.value) })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Intensity: {formData.exercise_intensity}/10
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={formData.exercise_intensity}
                      onChange={(e) => setFormData({ ...formData, exercise_intensity: parseInt(e.target.value) })}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Light</span>
                      <span>Maximum effort</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* MINDFULNESS LENS */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                <span className="text-2xl">🧘</span>
              </div>
              <h2 className="text-2xl font-bold">Mindfulness Lens</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="meditation_completed"
                  checked={formData.meditation_completed}
                  onChange={(e) => setFormData({ ...formData, meditation_completed: e.target.checked })}
                  className="w-5 h-5 text-purple-600"
                />
                <label htmlFor="meditation_completed" className="text-sm font-medium">
                  Completed meditation today
                </label>
              </div>

              {formData.meditation_completed && (
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Duration (minutes)
                  </label>
                  <input
                    type="number"
                    value={formData.meditation_duration}
                    onChange={(e) => setFormData({ ...formData, meditation_duration: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                    min="0"
                  />
                  <p className="text-xs text-gray-500 mt-1">Target: 30 minutes (5:00-5:30 AM)</p>
                </div>
              )}
            </div>
          </div>

          {/* THE ALIGNMENT EFFECT */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg shadow-lg p-6 border-2 border-blue-200 dark:border-blue-800">
            <h2 className="text-2xl font-bold mb-6">⚡ The Alignment Effect</h2>

            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <input
                    type="checkbox"
                    id="reward_system_primed"
                    checked={formData.reward_system_primed}
                    onChange={(e) => setFormData({ ...formData, reward_system_primed: e.target.checked })}
                    className="w-5 h-5 text-blue-600"
                  />
                  <label htmlFor="reward_system_primed" className="text-sm font-bold">
                    Reward system is PRIMED 🎯
                  </label>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 ml-8">
                  Do you feel strategic thinking emerging? Are you in a state of massive action?
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <input
                    type="checkbox"
                    id="strategic_thinking"
                    checked={formData.strategic_thinking}
                    onChange={(e) => setFormData({ ...formData, strategic_thinking: e.target.checked })}
                    className="w-5 h-5 text-purple-600"
                  />
                  <label htmlFor="strategic_thinking" className="text-sm font-bold">
                    Strategic thinking is active 🧠
                  </label>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 ml-8">
                  Can you see patterns, plan ahead, make connections easily?
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Overall Clarity Rating: {formData.clarity_rating}/10
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={formData.clarity_rating}
                  onChange={(e) => setFormData({ ...formData, clarity_rating: parseInt(e.target.value) })}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Brain fog</span>
                  <span>Crystal clear</span>
                </div>
              </div>
            </div>
          </div>

          {/* NOTES & REFLECTION */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-6">Notes & Reflection</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Today's Wins 🎉
                </label>
                <textarea
                  value={formData.wins}
                  onChange={(e) => setFormData({ ...formData, wins: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                  rows={2}
                  placeholder="What went well today?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Challenges 🧗
                </label>
                <textarea
                  value={formData.challenges}
                  onChange={(e) => setFormData({ ...formData, challenges: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                  rows={2}
                  placeholder="What was difficult?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Additional Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                  rows={3}
                  placeholder="Any other observations about today?"
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-lg transition-colors"
            >
              Save Today's Tracking
            </button>
            <Link
              href="/dashboard"
              className="px-8 py-4 border-2 border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 font-semibold transition-colors"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
