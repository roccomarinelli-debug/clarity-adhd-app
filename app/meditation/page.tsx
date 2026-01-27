"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function MeditationPage() {
  const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 minutes in seconds
  const [isActive, setIsActive] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => {
          if (time <= 1) {
            setIsActive(false);
            setIsCompleted(true);
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(30 * 60);
    setIsCompleted(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((30 * 60 - timeLeft) / (30 * 60)) * 100;

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-blue-50 flex flex-col items-center justify-center px-6">
        <div className="text-center space-y-6">
          <div className="text-6xl mb-4">🧘</div>
          <h1 className="text-3xl font-bold text-purple-600">Beautiful Session</h1>
          <p className="text-gray-600">
            You completed 30 minutes of meditation.
            <br />
            Your impulse control is trained.
            <br />
            Your attention is sharp.
          </p>

          <div className="space-y-3 pt-6">
            <button
              onClick={resetTimer}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold px-8 py-4 rounded-2xl transition-colors"
            >
              Meditate Again
            </button>
            <Link
              href="/hour-of-power"
              className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-2xl transition-colors text-center"
            >
              Continue to Hour of Power →
            </Link>
            <Link
              href="/dashboard"
              className="block w-full border-2 border-purple-600 text-purple-600 hover:bg-purple-50 font-semibold px-8 py-4 rounded-2xl transition-colors text-center"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-blue-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-6 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="text-blue-600 font-semibold">
            ← Back
          </Link>
          <h1 className="text-lg font-bold">30-Min Meditation</h1>
          <div className="w-16"></div> {/* Spacer for centering */}
        </div>
      </header>

      <div className="px-6 py-12 flex flex-col items-center justify-center min-h-[calc(100vh-73px)]">
        {/* Timer Circle */}
        <div className="relative w-64 h-64 mb-12">
          {/* Progress Ring */}
          <svg className="transform -rotate-90 w-64 h-64">
            <circle
              cx="128"
              cy="128"
              r="120"
              stroke="#E5E7EB"
              strokeWidth="8"
              fill="transparent"
            />
            <circle
              cx="128"
              cy="128"
              r="120"
              stroke="#9333EA"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={`${2 * Math.PI * 120}`}
              strokeDashoffset={`${2 * Math.PI * 120 * (1 - progress / 100)}`}
              strokeLinecap="round"
              className="transition-all duration-1000"
            />
          </svg>

          {/* Time Display */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-5xl font-bold text-purple-600 mb-2">
                {formatTime(timeLeft)}
              </div>
              <div className="text-sm text-gray-500">
                {isActive ? "Breathing..." : "Ready to begin"}
              </div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        {!isActive && timeLeft === 30 * 60 && (
          <div className="bg-white rounded-2xl p-6 mb-8 max-w-sm">
            <h3 className="font-bold text-lg mb-3">The Practice</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex gap-2">
                <span className="text-purple-600">•</span>
                <span>Focus on your breath</span>
              </li>
              <li className="flex gap-2">
                <span className="text-purple-600">•</span>
                <span>When your mind wanders, NOTICE it</span>
              </li>
              <li className="flex gap-2">
                <span className="text-purple-600">•</span>
                <span>COME BACK to your breath</span>
              </li>
              <li className="flex gap-2">
                <span className="text-purple-600">•</span>
                <span>That's the whole game</span>
              </li>
            </ul>
            <p className="text-xs text-gray-500 mt-4 pt-4 border-t">
              Coming back trains impulse control. This is THE practice for ADHD.
            </p>
          </div>
        )}

        {/* Controls */}
        <div className="space-y-3 w-full max-w-sm">
          <button
            onClick={toggleTimer}
            className={`w-full font-bold text-lg px-8 py-5 rounded-2xl transition-all shadow-lg ${
              isActive
                ? "bg-gray-600 hover:bg-gray-700 text-white"
                : "bg-purple-600 hover:bg-purple-700 text-white"
            }`}
          >
            {isActive ? "Pause" : timeLeft === 30 * 60 ? "Begin Meditation" : "Resume"}
          </button>

          {timeLeft !== 30 * 60 && (
            <button
              onClick={resetTimer}
              className="w-full border-2 border-purple-600 text-purple-600 hover:bg-purple-50 font-semibold px-8 py-4 rounded-2xl transition-colors"
            >
              Reset
            </button>
          )}
        </div>

        {/* Quote / Reminder */}
        {isActive && (
          <div className="mt-12 max-w-sm text-center">
            <p className="text-sm text-gray-600 italic">
              "You're not failing when you're thinking. You're succeeding when you notice and come back."
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
