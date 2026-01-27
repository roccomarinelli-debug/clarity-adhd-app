"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function PomodoroPage() {
  const [bigRock, setBigRock] = useState("");
  const [hasStarted, setHasStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isActive, setIsActive] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [clarityRating, setClarityRating] = useState<number | null>(null);

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
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  const handleStart = () => {
    if (bigRock.trim()) {
      setHasStarted(true);
      setIsActive(true);
    }
  };

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((25 * 60 - timeLeft) / (25 * 60)) * 100;

  // Clarity rating submission
  if (isCompleted && clarityRating === null) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50 flex flex-col items-center justify-center px-6">
        <div className="text-center space-y-6 max-w-md">
          <div className="text-6xl mb-4">✅</div>
          <h1 className="text-3xl font-bold text-green-600">Pomodoro Complete!</h1>
          <p className="text-gray-600">
            You completed 25 minutes of focused work on:
            <br />
            <span className="font-semibold text-lg mt-2 block">"{bigRock}"</span>
          </p>

          <div className="bg-white rounded-2xl p-6">
            <h3 className="font-semibold mb-4">How was your clarity?</h3>
            <p className="text-xs text-gray-500 mb-4">
              Rate your focus and strategic thinking during this session
            </p>

            <div className="flex gap-2 justify-center flex-wrap">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((rating) => (
                <button
                  key={rating}
                  onClick={() => setClarityRating(rating)}
                  className="w-12 h-12 rounded-xl bg-blue-100 hover:bg-blue-600 hover:text-white transition-colors font-bold"
                >
                  {rating}
                </button>
              ))}
            </div>

            <div className="flex justify-between text-xs text-gray-400 mt-2">
              <span>Foggy</span>
              <span>Crystal Clear</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Success screen after rating
  if (isCompleted && clarityRating !== null) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50 flex flex-col items-center justify-center px-6">
        <div className="text-center space-y-6 max-w-md">
          <div className="text-6xl mb-4">🚀</div>
          <h1 className="text-3xl font-bold text-green-600">
            {clarityRating >= 7 ? "Rocket Mode Activated!" : "Great Session!"}
          </h1>
          <p className="text-gray-600">
            {clarityRating >= 7
              ? "Your reward system is primed. Strategic thinking is flowing. String another 2 Pomodoros together!"
              : "You completed focused work. Keep building momentum. Try another Pomodoro or take a break."}
          </p>

          <div className="bg-white rounded-2xl p-6">
            <div className="space-y-3 text-left text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Big Rock:</span>
                <span className="font-semibold">{bigRock}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Duration:</span>
                <span className="font-semibold">25 minutes</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Clarity Rating:</span>
                <span className="font-semibold">{clarityRating}/10</span>
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-4">
            <button
              onClick={() => {
                setBigRock("");
                setHasStarted(false);
                setTimeLeft(25 * 60);
                setIsActive(false);
                setIsCompleted(false);
                setClarityRating(null);
              }}
              className="block w-full bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-4 rounded-2xl transition-colors text-center"
            >
              Start Another Pomodoro
            </button>
            <Link
              href="/dashboard"
              className="block w-full border-2 border-green-600 text-green-600 hover:bg-green-50 font-semibold px-8 py-4 rounded-2xl transition-colors text-center"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Big Rock input screen
  if (!hasStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="px-6 py-4 flex items-center justify-between">
            <Link href="/dashboard" className="text-blue-600 font-semibold">
              ← Back
            </Link>
            <h1 className="text-lg font-bold">First Pomodoro</h1>
            <div className="w-16"></div>
          </div>
        </header>

        <div className="px-6 py-12 flex flex-col items-center justify-center min-h-[calc(100vh-73px)]">
          <div className="w-full max-w-md space-y-6">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">🎯</div>
              <h2 className="text-2xl font-bold mb-2">What's Your Big Rock?</h2>
              <p className="text-sm text-gray-600">
                The ONE thing that, if you shipped it in the next 25 minutes, would make today a win.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6">
              <label className="block text-sm font-semibold mb-2">Your Big Rock</label>
              <input
                type="text"
                value={bigRock}
                onChange={(e) => setBigRock(e.target.value)}
                placeholder="e.g., Write chapter 3, Build login flow, Plan Q2 strategy"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                autoFocus
              />
              <p className="text-xs text-gray-500 mt-2">
                Be specific. Not "work on book" but "write 500 words of chapter 3"
              </p>
            </div>

            <div className="bg-blue-50 rounded-2xl p-4">
              <div className="flex gap-3">
                <div className="text-2xl">💡</div>
                <div>
                  <h4 className="font-semibold text-sm mb-1">The First Pomodoro is Key</h4>
                  <p className="text-xs text-gray-600">
                    This is attentive dedication to ONE thing. Absolute attention. Not pursuit of
                    pleasure - the PLEASURE OF PURSUIT. String 3 of these together and you're unstoppable.
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={handleStart}
              disabled={!bigRock.trim()}
              className={`w-full font-bold text-lg px-8 py-5 rounded-2xl transition-all shadow-lg ${
                bigRock.trim()
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              Start 25-Minute Pomodoro
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Timer screen
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="w-16"></div>
          <h1 className="text-lg font-bold">Focus Mode</h1>
          <div className="w-16"></div>
        </div>
      </header>

      <div className="px-6 py-12 flex flex-col items-center justify-center min-h-[calc(100vh-73px)]">
        {/* Big Rock Display */}
        <div className="mb-8 text-center">
          <p className="text-sm text-gray-500 mb-2">Working on:</p>
          <h2 className="text-xl font-bold text-gray-800 px-6">{bigRock}</h2>
        </div>

        {/* Timer Circle */}
        <div className="relative w-64 h-64 mb-12">
          <svg className="transform -rotate-90 w-64 h-64">
            <circle cx="128" cy="128" r="120" stroke="#E5E7EB" strokeWidth="8" fill="transparent" />
            <circle
              cx="128"
              cy="128"
              r="120"
              stroke="#16A34A"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={`${2 * Math.PI * 120}`}
              strokeDashoffset={`${2 * Math.PI * 120 * (1 - progress / 100)}`}
              strokeLinecap="round"
              className="transition-all duration-1000"
            />
          </svg>

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-5xl font-bold text-green-600 mb-2">{formatTime(timeLeft)}</div>
              <div className="text-sm text-gray-500">
                {isActive ? "Deep Focus..." : "Paused"}
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="space-y-3 w-full max-w-sm">
          <button
            onClick={toggleTimer}
            className={`w-full font-bold text-lg px-8 py-5 rounded-2xl transition-all shadow-lg ${
              isActive
                ? "bg-gray-600 hover:bg-gray-700 text-white"
                : "bg-green-600 hover:bg-green-700 text-white"
            }`}
          >
            {isActive ? "Pause" : "Resume"}
          </button>
        </div>

        {/* Reminder */}
        {isActive && (
          <div className="mt-12 max-w-sm text-center">
            <p className="text-sm text-gray-600 italic">
              Absolute attention. When your mind wanders, notice it and come back. That's the practice.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
