"use client";

import { useState } from "react";
import Link from "next/link";

type ExerciseType = {
  id: string;
  name: string;
  emoji: string;
  description: string;
};

const exerciseTypes: ExerciseType[] = [
  { id: "norwegian", name: "Norwegian 4x4", emoji: "🏃", description: "4 min intervals at 90-95% max HR" },
  { id: "mobility", name: "Mobility Work", emoji: "🤸", description: "Joint rotations, flow movements" },
  { id: "strength", name: "Strength Training", emoji: "🏋️", description: "Weights, resistance training" },
  { id: "sprints", name: "Sprints", emoji: "⚡", description: "Short intense bursts" },
  { id: "threshold", name: "Threshold Training", emoji: "💪", description: "At lactate threshold pace" },
  { id: "stretching", name: "Stretching", emoji: "🧘", description: "Deep stretching, flexibility" },
];

export default function HourOfPowerPage() {
  const [selected, setSelected] = useState<string[]>([]);
  const [duration, setDuration] = useState(60);
  const [isCompleted, setIsCompleted] = useState(false);

  const toggleExercise = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleComplete = () => {
    if (selected.length > 0) {
      setIsCompleted(true);
    }
  };

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 flex flex-col items-center justify-center px-6">
        <div className="text-center space-y-6">
          <div className="text-6xl mb-4">💪</div>
          <h1 className="text-3xl font-bold text-blue-600">Reward System Primed</h1>
          <p className="text-gray-600">
            That {duration} minute session primed your dopamine system.
            <br />
            Strategic thinking is about to emerge.
            <br />
            Time to identify your Big Rock.
          </p>

          <div className="bg-white rounded-2xl p-6 max-w-sm mx-auto">
            <h3 className="font-semibold mb-3">You completed:</h3>
            <div className="space-y-2">
              {selected.map((id) => {
                const exercise = exerciseTypes.find((e) => e.id === id);
                return exercise ? (
                  <div key={id} className="flex items-center gap-3 text-sm">
                    <span className="text-xl">{exercise.emoji}</span>
                    <span>{exercise.name}</span>
                  </div>
                ) : null;
              })}
            </div>
            <div className="text-sm text-gray-500 mt-4 pt-4 border-t">
              Duration: {duration} minutes
            </div>
          </div>

          <div className="space-y-3 pt-6">
            <Link
              href="/pomodoro"
              className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-2xl transition-colors text-center"
            >
              Start First Pomodoro →
            </Link>
            <Link
              href="/dashboard"
              className="block w-full border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold px-8 py-4 rounded-2xl transition-colors text-center"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-6 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="text-blue-600 font-semibold">
            ← Back
          </Link>
          <h1 className="text-lg font-bold">Hour of Power</h1>
          <div className="w-16"></div>
        </div>
      </header>

      <div className="px-6 py-8 space-y-6">
        {/* Intro */}
        <div className="bg-white rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-2">Prime Your Reward System</h2>
          <p className="text-sm text-gray-600">
            Select what you did during your exercise session. High-intensity threshold training
            is most likely to prime your reward system for strategic thinking.
          </p>
        </div>

        {/* Exercise Selection */}
        <div className="space-y-3">
          <h3 className="font-semibold text-sm text-gray-600 px-1">What did you do?</h3>
          {exerciseTypes.map((exercise) => (
            <button
              key={exercise.id}
              onClick={() => toggleExercise(exercise.id)}
              className={`w-full text-left p-4 rounded-2xl transition-all ${
                selected.includes(exercise.id)
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-white text-gray-800 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`text-3xl ${selected.includes(exercise.id) ? "" : "opacity-60"}`}>
                  {exercise.emoji}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold">{exercise.name}</h4>
                  <p className={`text-xs ${selected.includes(exercise.id) ? "text-blue-100" : "text-gray-500"}`}>
                    {exercise.description}
                  </p>
                </div>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  selected.includes(exercise.id)
                    ? "border-white bg-white"
                    : "border-gray-300"
                }`}>
                  {selected.includes(exercise.id) && (
                    <span className="text-blue-600 text-sm">✓</span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Duration */}
        <div className="bg-white rounded-2xl p-6">
          <h3 className="font-semibold mb-4">Duration</h3>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="10"
              max="120"
              step="5"
              value={duration}
              onChange={(e) => setDuration(parseInt(e.target.value))}
              className="flex-1"
            />
            <div className="text-2xl font-bold text-blue-600 w-20 text-center">
              {duration} min
            </div>
          </div>
        </div>

        {/* Insight */}
        {selected.includes("norwegian") || selected.includes("threshold") ? (
          <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl p-4">
            <div className="flex gap-3">
              <div className="text-2xl">⚡</div>
              <div>
                <h4 className="font-semibold text-sm mb-1">High Priming Potential</h4>
                <p className="text-xs text-gray-700">
                  Norwegian 4x4 and threshold training are most likely to prime your reward system.
                  You're setting yourself up for a rocket day.
                </p>
              </div>
            </div>
          </div>
        ) : null}

        {/* Complete Button */}
        <button
          onClick={handleComplete}
          disabled={selected.length === 0}
          className={`w-full font-bold text-lg px-8 py-5 rounded-2xl transition-all ${
            selected.length > 0
              ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          {selected.length > 0 ? "Complete Hour of Power" : "Select at least one exercise"}
        </button>
      </div>
    </div>
  );
}
