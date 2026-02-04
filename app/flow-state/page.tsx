'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { DndContext, DragEndEvent, closestCorners, PointerSensor, TouchSensor, KeyboardSensor, useSensor, useSensors, useDroppable } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useEncryption } from '@/lib/encryption-context';

// Types
interface Task {
  id: string;
  title: string;
  description: string;
  complexity: 'simple' | 'medium' | 'complex';
  estimatedMinutes: number;
  status: 'planned' | 'active' | 'completed';
}

interface BaselineHabit {
  id: string;
  label: string;
  completed: boolean;
  icon: string;
}

// Epic Types
interface EpicTask {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
}

interface SubCategory {
  id: string;
  name: string;
  tasks: EpicTask[];
}

interface Epic {
  id: string;
  name: string;
  color: string; // folder color
  subCategories: SubCategory[];
}

// Weekly Focus Types
interface WeeklyGoal {
  id: string;
  text: string;
  completed: boolean;
  priority: 1 | 2 | 3 | null;
}

interface DailyTask {
  id: string;
  text: string;
  completed: boolean;
}

// Sortable Weekly Goal Component
function SortableWeeklyGoal({
  goal,
  onToggle,
  onDelete,
  onEdit,
  onSetPriority
}: {
  goal: WeeklyGoal;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, newText: string) => void;
  onSetPriority: (id: string, priority: 1 | 2 | 3 | null) => void;
}) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [editText, setEditText] = React.useState(goal.text);
  const [showPriorityMenu, setShowPriorityMenu] = React.useState(false);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: goal.id
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.7 : 1,
  };

  const handleSaveEdit = () => {
    if (editText.trim()) {
      onEdit(goal.id, editText);
      setIsEditing(false);
    }
  };

  const priorityConfig = {
    1: { bg: 'from-amber-500/30 to-orange-500/30', border: 'border-amber-400/50', badge: 'bg-amber-600', text: 'P1', label: 'Priority 1' },
    2: { bg: 'from-blue-500/30 to-indigo-500/30', border: 'border-blue-400/50', badge: 'bg-blue-600', text: 'P2', label: 'Priority 2' },
    3: { bg: 'from-emerald-500/30 to-teal-500/30', border: 'border-emerald-400/50', badge: 'bg-emerald-600', text: 'P3', label: 'Priority 3' },
  };

  const currentPriority = goal.priority ? priorityConfig[goal.priority] : null;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-start gap-3 rounded-lg p-3 hover:bg-white/10 transition group relative ${
        currentPriority
          ? `bg-gradient-to-r ${currentPriority.bg} border-2 ${currentPriority.border}`
          : 'bg-white/5'
      }`}
    >
      {currentPriority && (
        <span className={`text-xs font-bold text-white absolute -top-2 left-2 ${currentPriority.badge} px-2 py-0.5 rounded-full`}>
          {currentPriority.text}
        </span>
      )}
      <input
        type="checkbox"
        checked={goal.completed}
        onChange={(e) => {
          e.stopPropagation();
          onToggle(goal.id);
        }}
        onClick={(e) => e.stopPropagation()}
        className="mt-1 w-5 h-5 cursor-pointer flex-shrink-0"
      />
      {isEditing ? (
        <input
          type="text"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onBlur={handleSaveEdit}
          onKeyPress={(e) => {
            if (e.key === 'Enter') handleSaveEdit();
            if (e.key === 'Escape') {
              setEditText(goal.text);
              setIsEditing(false);
            }
          }}
          className="flex-1 px-2 py-1 rounded bg-white/90 text-gray-800 text-sm"
          autoFocus
        />
      ) : (
        <span
          {...attributes}
          {...listeners}
          onDoubleClick={() => setIsEditing(true)}
          className={`flex-1 text-white text-sm cursor-grab active:cursor-grabbing select-none ${goal.completed ? 'line-through opacity-60' : ''} ${goal.priority ? 'font-semibold' : ''}`}
          style={{ touchAction: 'none' }}
        >
          {goal.text}
        </span>
      )}
      {/* Priority Selector */}
      <div className="relative">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowPriorityMenu(!showPriorityMenu);
          }}
          className="opacity-0 group-hover:opacity-100 text-white/60 hover:text-white text-xs px-2 py-1 bg-white/10 rounded transition"
          title="Set priority"
        >
          ⭐
        </button>
        {showPriorityMenu && (
          <div className="absolute right-0 top-8 bg-gray-900 border border-white/20 rounded-lg shadow-xl z-50 py-1 min-w-[120px]">
            <button
              onClick={() => {
                onSetPriority(goal.id, 1);
                setShowPriorityMenu(false);
              }}
              className="w-full px-3 py-2 text-left text-sm text-white hover:bg-amber-600/50 transition flex items-center gap-2"
            >
              <span className="w-3 h-3 bg-amber-600 rounded-full"></span>
              Priority 1
            </button>
            <button
              onClick={() => {
                onSetPriority(goal.id, 2);
                setShowPriorityMenu(false);
              }}
              className="w-full px-3 py-2 text-left text-sm text-white hover:bg-blue-600/50 transition flex items-center gap-2"
            >
              <span className="w-3 h-3 bg-blue-600 rounded-full"></span>
              Priority 2
            </button>
            <button
              onClick={() => {
                onSetPriority(goal.id, 3);
                setShowPriorityMenu(false);
              }}
              className="w-full px-3 py-2 text-left text-sm text-white hover:bg-emerald-600/50 transition flex items-center gap-2"
            >
              <span className="w-3 h-3 bg-emerald-600 rounded-full"></span>
              Priority 3
            </button>
            <button
              onClick={() => {
                onSetPriority(goal.id, null);
                setShowPriorityMenu(false);
              }}
              className="w-full px-3 py-2 text-left text-sm text-white hover:bg-white/10 transition border-t border-white/10"
            >
              Clear priority
            </button>
          </div>
        )}
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(goal.id);
        }}
        className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 font-bold text-lg transition"
      >
        ×
      </button>
    </div>
  );
}

// Sortable Daily Task Component
function SortableDailyTask({
  task,
  onToggle,
  onDelete,
  onEdit
}: {
  task: DailyTask;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, newText: string) => void;
}) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [editText, setEditText] = React.useState(task.text);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.7 : 1,
  };

  const handleSaveEdit = () => {
    if (editText.trim()) {
      onEdit(task.id, editText);
      setIsEditing(false);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-start gap-3 bg-white/5 rounded-lg p-3 hover:bg-white/10 transition group"
    >
      <input
        type="checkbox"
        checked={task.completed}
        onChange={(e) => {
          e.stopPropagation();
          onToggle(task.id);
        }}
        onClick={(e) => e.stopPropagation()}
        className="mt-1 w-5 h-5 cursor-pointer flex-shrink-0"
      />
      {isEditing ? (
        <input
          type="text"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onBlur={handleSaveEdit}
          onKeyPress={(e) => {
            if (e.key === 'Enter') handleSaveEdit();
            if (e.key === 'Escape') {
              setEditText(task.text);
              setIsEditing(false);
            }
          }}
          className="flex-1 px-2 py-1 rounded bg-white/90 text-gray-800 text-sm"
          autoFocus
        />
      ) : (
        <span
          {...attributes}
          {...listeners}
          onDoubleClick={() => setIsEditing(true)}
          className={`flex-1 text-white text-sm cursor-grab active:cursor-grabbing select-none ${task.completed ? 'line-through opacity-60' : ''}`}
          style={{ touchAction: 'none' }}
        >
          {task.text}
        </span>
      )}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(task.id);
        }}
        className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 font-bold text-lg transition"
      >
        ×
      </button>
    </div>
  );
}

// Sortable Task Card Component (two display modes: full-width for queue, compact for active)
function SortableTaskBubble({ task, onDelete, onEdit, mode = 'compact' }: { task: Task; onDelete: (id: string) => void; onEdit: (task: Task) => void; mode?: 'compact' | 'full' }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.7 : 1,
  };

  const complexityColors = {
    simple: 'from-cyan-400 to-blue-500',
    medium: 'from-purple-400 to-indigo-500',
    complex: 'from-rose-400 to-pink-500',
  };

  const complexityLabels = {
    simple: 'Simple',
    medium: 'Medium',
    complex: 'Complex',
  };

  // Full-width card for task queue
  if (mode === 'full') {
    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        className={`relative bg-gradient-to-br ${complexityColors[task.complexity]} text-white rounded-2xl shadow-md hover:shadow-xl transition-all hover:scale-[1.02] ${
          isDragging ? 'scale-105 rotate-1 opacity-70 shadow-2xl' : ''
        } w-full p-4 cursor-grab active:cursor-grabbing`}
        {...listeners}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(task.id);
          }}
          className="absolute top-2 right-2 w-5 h-5 bg-white/40 hover:bg-white/60 rounded-full flex items-center justify-center text-white font-bold text-xs z-10"
        >
          ×
        </button>

        <div
          onClick={(e) => {
            e.stopPropagation();
            onEdit(task);
          }}
          className="cursor-pointer"
        >
          <div className="flex items-start justify-between mb-2 pr-6">
            <h4 className="font-bold text-sm leading-tight">{task.title}</h4>
            <span className="text-[10px] bg-white/30 px-2 py-0.5 rounded-full whitespace-nowrap ml-2">
              {task.estimatedMinutes}m
            </span>
          </div>
          {task.description && (
            <p className="text-xs text-white/90 mb-2 line-clamp-2 leading-relaxed">{task.description}</p>
          )}
          <div className="flex items-center gap-2">
            <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full">
              {complexityLabels[task.complexity]}
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Compact lozenge for active zone
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={`relative bg-gradient-to-br ${complexityColors[task.complexity]} text-white rounded-[1.2rem] shadow-md hover:shadow-lg transition-all hover:scale-105 ${
        isDragging ? 'scale-110 rotate-2 opacity-70 shadow-2xl' : ''
      } w-[85px] h-[60px] flex items-center justify-center`}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(task.id);
        }}
        className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-white/40 hover:bg-white/60 rounded-full flex items-center justify-center text-white font-bold text-[8px] z-10"
      >
        ×
      </button>

      {/* Drag handle area */}
      <div {...listeners} className="absolute inset-0 cursor-grab active:cursor-grabbing" />

      {/* Clickable content for editing */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onEdit(task);
        }}
        className="relative z-10 text-center w-full h-full flex flex-col items-center justify-center px-2 py-1.5"
      >
        <h4 className="font-bold text-[9px] mb-0.5 line-clamp-2">{task.title}</h4>
        <span className="text-[7px] bg-white/30 px-1 py-0.5 rounded-full inline-block">
          {task.estimatedMinutes}m
        </span>
      </button>
    </div>
  );
}

// Fireworks Component
function Fireworks() {
  const [fireworksData] = useState(() =>
    Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      x: 20 + (i % 4) * 20 + Math.random() * 8,
      y: 25 + Math.floor(i / 4) * 15,
      delay: i * 0.45,
      color: ['#FFD700', '#FF1744', '#00E5FF', '#76FF03', '#FF9100', '#E040FB', '#FFEA00', '#18FFFF'][i % 8],
      size: 0.7 + Math.random() * 0.4,
    }))
  );

  const [confettiData] = useState(() =>
    Array.from({ length: 35 }).map((_, i) => ({
      id: i,
      x: 10 + Math.random() * 80,
      delay: i * 0.12,
      color: ['#FFD700', '#FF1744', '#00E5FF', '#76FF03', '#FF9100', '#E040FB'][i % 6],
      rotation: Math.random() * 360,
    }))
  );

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-20" style={{ height: '100%' }}>
      {fireworksData.map((fw) => (
        <div key={fw.id}>
          {/* Rocket trail shooting up */}
          <div
            className="absolute w-1 h-12 animate-rocket"
            style={{
              left: `${fw.x}%`,
              bottom: '0',
              background: `linear-gradient(to top, ${fw.color}, transparent)`,
              animationDelay: `${fw.delay}s`,
            }}
          />

          {/* Explosion burst */}
          <div
            className="absolute"
            style={{
              left: `${fw.x}%`,
              top: `${fw.y}%`,
            }}
          >
            {/* Main explosion flash */}
            <div
              className="absolute w-20 h-20 -ml-10 -mt-10 rounded-full animate-flash"
              style={{
                backgroundColor: fw.color,
                boxShadow: `0 0 60px ${fw.color}, 0 0 100px ${fw.color}`,
                animationDelay: `${fw.delay + 0.6}s`,
              }}
            />

            {/* Explosion particles - 24 particles per burst */}
            {Array.from({ length: 24 }).map((_, j) => {
              const angle = (j * (360 / 24) * Math.PI) / 180;
              const distance = 60 + (j % 3) * 15;

              return (
                <div
                  key={j}
                  className="absolute rounded-full animate-explode"
                  style={{
                    backgroundColor: j % 3 === 0 ? '#FFF' : fw.color,
                    boxShadow: `0 0 6px ${fw.color}`,
                    width: `${3 + (j % 3)}px`,
                    height: `${3 + (j % 3)}px`,
                    // @ts-ignore
                    '--tx': `${Math.cos(angle) * distance * fw.size}px`,
                    '--ty': `${Math.sin(angle) * distance * fw.size}px`,
                    animationDelay: `${fw.delay + 0.6 + j * 0.01}s`,
                  }}
                />
              );
            })}

            {/* Secondary sparkles */}
            {Array.from({ length: 12 }).map((_, j) => {
              const angle = (j * (360 / 12) * Math.PI) / 180;
              const distance = 40;

              return (
                <div
                  key={`spark-${j}`}
                  className="absolute text-xl animate-sparkle-burst"
                  style={{
                    // @ts-ignore
                    '--tx': `${Math.cos(angle) * distance}px`,
                    '--ty': `${Math.sin(angle) * distance}px`,
                    animationDelay: `${fw.delay + 0.7}s`,
                  }}
                >
                  ✨
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* Confetti rain */}
      {confettiData.map((c) => (
        <div
          key={`confetti-${c.id}`}
          className="absolute w-2 h-3 animate-confetti"
          style={{
            left: `${c.x}%`,
            top: '-10px',
            backgroundColor: c.color,
            animationDelay: `${c.delay}s`,
            transform: `rotate(${c.rotation}deg)`,
          }}
        />
      ))}

      {/* Glowing ring pulses */}
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={`ring-${i}`}
          className="absolute animate-ring-pulse"
          style={{
            left: `${25 + i * 12}%`,
            top: `${35 + (i % 2) * 15}%`,
            width: '60px',
            height: '60px',
            border: '3px solid #FFD700',
            borderRadius: '50%',
            animationDelay: `${i * 0.6}s`,
            boxShadow: '0 0 15px #FFD700',
          }}
        />
      ))}
    </div>
  );
}

// Droppable Zone Component
function DroppableZone({ id, children, className }: { id: string; children: React.ReactNode; className?: string }) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div ref={setNodeRef} className={className}>
      {children}
    </div>
  );
}

// Pomodoro Timer Component
function PomodoroTimer({ isActive, onComplete }: { isActive: boolean; onComplete: () => void }) {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!isActive) {
      setIsRunning(false);
      setTimeLeft(25 * 60);
    }
  }, [isActive]);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            onComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isRunning, timeLeft, onComplete]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progress = ((25 * 60 - timeLeft) / (25 * 60)) * 100;

  if (!isActive) return null;

  return (
    <div className="relative">
      <svg className="w-48 h-48 transform -rotate-90">
        <circle
          cx="96"
          cy="96"
          r="88"
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="8"
          fill="none"
        />
        <circle
          cx="96"
          cy="96"
          r="88"
          stroke="white"
          strokeWidth="8"
          fill="none"
          strokeDasharray={`${2 * Math.PI * 88}`}
          strokeDashoffset={`${2 * Math.PI * 88 * (1 - progress / 100)}`}
          className="transition-all duration-1000"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-4xl font-bold text-white mb-3">
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </div>
        <button
          onClick={() => setIsRunning(!isRunning)}
          className="bg-white text-purple-600 px-5 py-2 rounded-full font-bold hover:bg-gray-100 transition shadow-lg text-sm"
        >
          {isRunning ? '⏸ Pause' : '▶ Start'}
        </button>
        {!isRunning && timeLeft < 25 * 60 && (
          <button
            onClick={() => setTimeLeft(25 * 60)}
            className="mt-2 bg-white/20 text-white px-3 py-1.5 rounded-full hover:bg-white/30 transition text-xs"
          >
            Reset
          </button>
        )}
      </div>
    </div>
  );
}

export default function FlowStatePage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const dayJobRef = React.useRef<HTMLDivElement>(null);

  // Weekday habits (Mon-Fri)
  const weekdayHabits: BaselineHabit[] = [
    { id: '1', label: '30 min meditation', completed: false, icon: '🧘' },
    { id: '2', label: '1 hour of power', completed: false, icon: '💪' },
    { id: '3', label: 'Ketosis state', completed: false, icon: '🥩' },
    { id: '4', label: 'Cold therapy', completed: false, icon: '🧊' },
    { id: '5', label: 'Connection with family', completed: false, icon: '👨‍👩‍👧‍👦' },
    { id: '6', label: 'eye exercises', completed: false, icon: '👁️' },
  ];

  // Weekend habits (Sat-Sun)
  const weekendHabits: BaselineHabit[] = [
    { id: '1', label: '10 min meditation', completed: false, icon: '🧘' },
  ];

  // Determine if selected date is a weekend
  const isWeekend = selectedDate.getDay() === 0 || selectedDate.getDay() === 6;

  const [baselineHabits, setBaselineHabits] = useState<BaselineHabit[]>(
    isWeekend ? weekendHabits : weekdayHabits
  );

  // Update habits when date changes
  useEffect(() => {
    const newHabits = isWeekend ? weekendHabits : weekdayHabits;
    setBaselineHabits(newHabits);
  }, [selectedDate, isWeekend]);

  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [completedTasks, setCompletedTasks] = useState<Task[]>([]);
  const [showAddTask, setShowAddTask] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    complexity: 'medium' as 'simple' | 'medium' | 'complex',
    estimatedMinutes: 25,
  });

  // Day Job state
  const [dayJobFocus, setDayJobFocus] = useState('');
  const [dayJobReward, setDayJobReward] = useState('');
  const [dayJobCompleted, setDayJobCompleted] = useState({
    pomodoro1: false,
    pomodoro2: false,
    pomodoro3: false,
    signInMicrosoft: false,
    phoneOutOfOffice: false,
  });

  // Pomodoro Timer state
  const [pomodoroTime, setPomodoroTime] = useState(25 * 60); // 25 minutes in seconds
  const [isPomodoroRunning, setIsPomodoroRunning] = useState(false);
  const [pomodoroView, setPomodoroView] = useState<'digital' | 'analog'>('digital');
  const [dailyPomodoroCount, setDailyPomodoroCount] = useState(0);
  const [pomodoroDate, setPomodoroDate] = useState(new Date().toDateString());

  // Release Your Soul Timer state
  const [soulTime, setSoulTime] = useState(10 * 60); // 10 minutes in seconds
  const [isSoulTimerRunning, setIsSoulTimerRunning] = useState(false);
  const [soulTask, setSoulTask] = useState('Byron FC - Children\'s Book');
  const [soulScheduledTime, setSoulScheduledTime] = useState('');
  const [soulTimerCompleted, setSoulTimerCompleted] = useState(false);

  // Mantras
  const mantras = [
    "Chunk it down. Break the big thing into the tiniest bit that you can focus entirely on now.",
    "One habit begets another. Like a rosary, each bead leads naturally to the next.",
    "The morning sets the tone. Win the morning, win the day.",
    "Keep going, close.",
    "I feel so good when I complete things, when I see a job done to completion.",
  ];

  const [currentMantraIndex, setCurrentMantraIndex] = useState(0);

  // Rotate mantras every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMantraIndex((prev) => (prev + 1) % mantras.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 150, tolerance: 5 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const allHabitsCompleted = baselineHabits.every(h => h.completed);
  const completedHabitsCount = baselineHabits.filter(h => h.completed).length;

  // Scroll to Day Job section when baseline is complete
  useEffect(() => {
    if (allHabitsCompleted && dayJobRef.current) {
      setTimeout(() => {
        dayJobRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }, 1000); // Wait 1 second for fireworks to finish
    }
  }, [allHabitsCompleted]);

  // Soul Timer countdown
  useEffect(() => {
    if (isSoulTimerRunning && soulTime > 0) {
      const timer = setInterval(() => {
        setSoulTime(prev => {
          if (prev <= 1) {
            setIsSoulTimerRunning(false);
            setSoulTimerCompleted(true);
            // Play completion sound or show notification here if desired
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isSoulTimerRunning, soulTime]);

  // Pomodoro Timer countdown
  useEffect(() => {
    if (isPomodoroRunning && pomodoroTime > 0) {
      const timer = setInterval(() => {
        setPomodoroTime(prev => {
          if (prev <= 1) {
            setIsPomodoroRunning(false);
            setDailyPomodoroCount(prev => prev + 1);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isPomodoroRunning, pomodoroTime]);

  const toggleHabit = (id: string) => {
    setBaselineHabits(prev =>
      prev.map(h => (h.id === id ? { ...h, completed: !h.completed } : h))
    );
  };

  const addTask = () => {
    if (!newTask.title.trim()) return;
    const task: Task = {
      id: Date.now().toString(),
      ...newTask,
      status: 'planned',
    };
    setTasks(prev => [...prev, task]);
    setNewTask({
      title: '',
      description: '',
      complexity: 'medium',
      estimatedMinutes: 25,
    });
    setShowAddTask(false);
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    setCompletedTasks(prev => prev.filter(t => t.id !== id));
    if (activeTask?.id === id) setActiveTask(null);
  };

  const editTask = (task: Task) => {
    setEditingTask(task);
  };

  const saveEditedTask = () => {
    if (!editingTask) return;

    // Update task in tasks array
    setTasks(prev => prev.map(t => t.id === editingTask.id ? editingTask : t));

    // Update active task if it's the one being edited
    if (activeTask?.id === editingTask.id) {
      setActiveTask(editingTask);
    }

    setEditingTask(null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    console.log('Drag ended:', {
      activeId: active.id,
      overId: over?.id,
      overData: over?.data
    });

    if (!over) {
      console.log('No drop target detected');
      return;
    }

    const taskId = active.id as string;

    // Check if dragging from task queue
    let task = tasks.find(t => t.id === taskId);
    let fromActive = false;

    // Check if dragging from active zone
    if (!task && activeTask?.id === taskId) {
      task = activeTask;
      fromActive = true;
    }

    if (!task) {
      console.log('Task not found:', taskId);
      return;
    }

    console.log('Task found:', task.title, 'fromActive:', fromActive);

    // Dragging to active zone
    if (over.id === 'active-zone') {
      console.log('Dropped on active-zone');
      if (!allHabitsCompleted) {
        alert('Complete all baseline habits before starting tasks!');
        return;
      }
      if (!fromActive) {
        console.log('Moving task to active:', task.title);
        setTasks(prev => prev.filter(t => t.id !== taskId));
        setActiveTask(task);
      }
    }

    // Dragging back to task queue
    if (over.id === 'task-queue-zone' && fromActive) {
      console.log('Moving task back to queue:', task.title);
      setActiveTask(null);
      setTasks(prev => [...prev, task]);
    }
  };

  const completeActiveTask = () => {
    if (activeTask) {
      setCompletedTasks(prev => [...prev, { ...activeTask, status: 'completed' }]);
      setActiveTask(null);
    }
  };

  // Pomodoro timer effect
  useEffect(() => {
    if (isPomodoroRunning && pomodoroTime > 0) {
      const timer = setInterval(() => {
        setPomodoroTime((prev) => {
          if (prev <= 1) {
            setIsPomodoroRunning(false);
            // Pomodoro completed
            setDailyPomodoroCount(count => count + 1);
            // Play a sound or show notification here if desired
            return 25 * 60; // Reset to 25 minutes
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isPomodoroRunning, pomodoroTime]);

  // Check if we need to reset daily pomodoro count
  useEffect(() => {
    const today = new Date().toDateString();
    if (pomodoroDate !== today) {
      setDailyPomodoroCount(0);
      setPomodoroDate(today);
    }
  }, [pomodoroDate]);

  // Get encrypted storage from context
  const { storage } = useEncryption();
  const [dataLoaded, setDataLoaded] = useState(false);

  // Default data used when no saved data exists
  const defaultEpics: Epic[] = [
    {
      id: '1',
      name: 'Move To Finland',
      color: '#3B82F6',
      subCategories: [
        {
          id: '1-1',
          name: 'Finding a job',
          tasks: []
        }
      ]
    },
    {
      id: '2',
      name: 'Move From Australia',
      color: '#10B981',
      subCategories: []
    },
    {
      id: '3',
      name: '85 Koetong Parade',
      color: '#F59E0B',
      subCategories: []
    },
    {
      id: '4',
      name: 'Roykka House',
      color: '#8B5CF6',
      subCategories: []
    }
  ];

  const defaultWeeklyGoals: WeeklyGoal[] = [
    { id: '1', text: 'Eliminate the rubbish pile at the front of the house', completed: false, priority: null },
    { id: '2', text: 'Finish the restoration of the tall table', completed: false, priority: null },
    { id: '3', text: 'List everything on market place and hand it over to the boys to run', completed: false, priority: null },
    { id: '4', text: 'Prior to Hanna leaving, hall cupboard, Hanna\'s wardrobe, bathrooms', completed: false, priority: null },
    { id: '5', text: 'Give notice to landlord', completed: false, priority: null },
    { id: '6', text: 'Arrange payment of suncorp loan', completed: false, priority: null },
    { id: '7', text: 'Rectify bond lodgement', completed: false, priority: null },
  ];

  // Load data from encrypted storage
  useEffect(() => {
    if (!storage) return;

    const loadData = async () => {
      try {
        const saved = await storage.getItem('flowStateData');
        if (saved) {
          const data = JSON.parse(saved);
          setTasks(data.tasks || []);
          setCompletedTasks(data.completedTasks || []);
          setDayJobFocus(data.dayJobFocus || '');
          setDayJobReward(data.dayJobReward || '');
          setDayJobCompleted(data.dayJobCompleted || {
            pomodoro1: false,
            pomodoro2: false,
            pomodoro3: false,
            signInMicrosoft: false,
            phoneOutOfOffice: false,
          });

          if (data.dailyPomodoroCount !== undefined) {
            const today = new Date().toDateString();
            if (data.pomodoroDate === today) {
              setDailyPomodoroCount(data.dailyPomodoroCount);
              setPomodoroDate(data.pomodoroDate);
            }
          }
        }

        const savedEpics = await storage.getItem('epicsData');
        setEpics(savedEpics ? JSON.parse(savedEpics) : defaultEpics);

        const savedWeeklyGoals = await storage.getItem('weeklyGoals');
        setWeeklyGoals(savedWeeklyGoals ? JSON.parse(savedWeeklyGoals) : defaultWeeklyGoals);

        const savedDailyTasks = await storage.getItem('dailyTasks');
        if (savedDailyTasks) {
          setDailyTasks(JSON.parse(savedDailyTasks));
        }
      } catch (error) {
        console.error('Error loading encrypted data:', error);
      } finally {
        setDataLoaded(true);
      }
    };

    loadData();
  }, [storage]);

  // Save flow state data to encrypted storage
  useEffect(() => {
    if (!storage || !dataLoaded) return;

    const data = {
      baselineHabits,
      tasks,
      completedTasks,
      dayJobFocus,
      dayJobReward,
      dayJobCompleted,
      dailyPomodoroCount,
      pomodoroDate,
      date: new Date().toISOString().split('T')[0],
    };

    const saveData = async () => {
      try {
        await storage.setItem('flowStateData', JSON.stringify(data));
      } catch (error) {
        console.error('Failed to save flow state data:', error);
      }
    };
    saveData();
  }, [storage, dataLoaded, baselineHabits, tasks, completedTasks, dayJobFocus, dayJobReward, dayJobCompleted, dailyPomodoroCount, pomodoroDate]);

  const [activeTab, setActiveTab] = useState<'daily' | 'tasks' | 'goals'>('daily');

  // Epic Management State (defaults loaded from storage, see loadData above)
  const [epics, setEpics] = useState<Epic[]>([]);
  const [selectedEpic, setSelectedEpic] = useState<Epic | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<SubCategory | null>(null);
  const [showAddSubCategory, setShowAddSubCategory] = useState(false);
  const [showAddTaskForSubCat, setShowAddTaskForSubCat] = useState<string | null>(null);
  const [newSubCategoryName, setNewSubCategoryName] = useState('');
  const [newEpicTask, setNewEpicTask] = useState({ title: '', description: '' });
  const [showAddEpic, setShowAddEpic] = useState(false);
  const [newEpicName, setNewEpicName] = useState('');
  const [newEpicColor, setNewEpicColor] = useState('#3B82F6');

  // Weekly Focus State (defaults loaded from storage, see loadData above)
  const [weeklyGoals, setWeeklyGoals] = useState<WeeklyGoal[]>([]);
  const [dailyTasks, setDailyTasks] = useState<DailyTask[]>([]);
  const [showAddWeeklyGoal, setShowAddWeeklyGoal] = useState(false);
  const [showAddDailyTask, setShowAddDailyTask] = useState(false);
  const [newWeeklyGoalText, setNewWeeklyGoalText] = useState('');
  const [newDailyTaskText, setNewDailyTaskText] = useState('');
  const [showCompletedGoals, setShowCompletedGoals] = useState(false);
  const [showCompletedTasks, setShowCompletedTasks] = useState(false);

  // Save epics to encrypted storage (only after data has been loaded)
  useEffect(() => {
    if (!storage || !dataLoaded) return;
    const saveEpics = async () => {
      try {
        await storage.setItem('epicsData', JSON.stringify(epics));
      } catch (error) {
        console.error('Failed to save epics:', error);
      }
    };
    saveEpics();
  }, [storage, dataLoaded, epics]);

  // Save weekly goals to encrypted storage (only after data has been loaded)
  useEffect(() => {
    if (!storage || !dataLoaded) return;
    const saveWeeklyGoals = async () => {
      try {
        await storage.setItem('weeklyGoals', JSON.stringify(weeklyGoals));
      } catch (error) {
        console.error('Failed to save weekly goals:', error);
      }
    };
    saveWeeklyGoals();
  }, [storage, dataLoaded, weeklyGoals]);

  // Save daily tasks to encrypted storage (only after data has been loaded)
  useEffect(() => {
    if (!storage || !dataLoaded) return;
    const saveDailyTasks = async () => {
      try {
        await storage.setItem('dailyTasks', JSON.stringify(dailyTasks));
      } catch (error) {
        console.error('Failed to save daily tasks:', error);
      }
    };
    saveDailyTasks();
  }, [storage, dataLoaded, dailyTasks]);

  // Add new epic
  const addEpic = () => {
    if (!newEpicName.trim()) return;

    const newEpic: Epic = {
      id: Date.now().toString(),
      name: newEpicName,
      color: newEpicColor,
      subCategories: []
    };

    setEpics(prev => [...prev, newEpic]);
    setNewEpicName('');
    setNewEpicColor('#3B82F6');
    setShowAddEpic(false);
  };

  // Delete epic
  const deleteEpic = (epicId: string) => {
    if (confirm('Are you sure you want to delete this epic and all its contents?')) {
      setEpics(prev => prev.filter(e => e.id !== epicId));
      if (selectedEpic?.id === epicId) {
        setSelectedEpic(null);
      }
    }
  };

  // Add sub-category to epic
  const addSubCategory = () => {
    if (!selectedEpic || !newSubCategoryName.trim()) return;

    const newSubCat: SubCategory = {
      id: `${selectedEpic.id}-${Date.now()}`,
      name: newSubCategoryName,
      tasks: []
    };

    setEpics(prev => prev.map(epic =>
      epic.id === selectedEpic.id
        ? { ...epic, subCategories: [...epic.subCategories, newSubCat] }
        : epic
    ));

    // Update selectedEpic to reflect changes
    setSelectedEpic(prev => prev ? { ...prev, subCategories: [...prev.subCategories, newSubCat] } : null);

    setNewSubCategoryName('');
    setShowAddSubCategory(false);
  };

  // Add task to sub-category
  const addTaskToSubCategory = (subCatId: string) => {
    if (!selectedEpic || !newEpicTask.title.trim()) return;

    const newTask: EpicTask = {
      id: `task-${Date.now()}`,
      title: newEpicTask.title,
      description: newEpicTask.description,
      completed: false
    };

    setEpics(prev => prev.map(epic =>
      epic.id === selectedEpic.id
        ? {
            ...epic,
            subCategories: epic.subCategories.map(subCat =>
              subCat.id === subCatId
                ? { ...subCat, tasks: [...subCat.tasks, newTask] }
                : subCat
            )
          }
        : epic
    ));

    // Update selectedEpic
    setSelectedEpic(prev => prev ? {
      ...prev,
      subCategories: prev.subCategories.map(subCat =>
        subCat.id === subCatId
          ? { ...subCat, tasks: [...subCat.tasks, newTask] }
          : subCat
      )
    } : null);

    setNewEpicTask({ title: '', description: '' });
    setShowAddTaskForSubCat(null);
  };

  // Delete sub-category
  const deleteSubCategory = (subCatId: string) => {
    if (!selectedEpic) return;
    if (!confirm('Are you sure you want to delete this sub-category and all its tasks?')) return;

    setEpics(prev => prev.map(epic =>
      epic.id === selectedEpic.id
        ? {
            ...epic,
            subCategories: epic.subCategories.filter(subCat => subCat.id !== subCatId)
          }
        : epic
    ));

    // Update selectedEpic
    setSelectedEpic(prev => prev ? {
      ...prev,
      subCategories: prev.subCategories.filter(subCat => subCat.id !== subCatId)
    } : null);
  };

  // Delete task from sub-category
  const deleteEpicTask = (subCatId: string, taskId: string) => {
    if (!selectedEpic) return;

    setEpics(prev => prev.map(epic =>
      epic.id === selectedEpic.id
        ? {
            ...epic,
            subCategories: epic.subCategories.map(subCat =>
              subCat.id === subCatId
                ? {
                    ...subCat,
                    tasks: subCat.tasks.filter(task => task.id !== taskId)
                  }
                : subCat
            )
          }
        : epic
    ));

    // Update selectedEpic
    setSelectedEpic(prev => prev ? {
      ...prev,
      subCategories: prev.subCategories.map(subCat =>
        subCat.id === subCatId
          ? {
              ...subCat,
              tasks: subCat.tasks.filter(task => task.id !== taskId)
            }
          : subCat
      )
    } : null);
  };

  // Toggle task completion
  const toggleEpicTask = (subCatId: string, taskId: string) => {
    if (!selectedEpic) return;

    setEpics(prev => prev.map(epic =>
      epic.id === selectedEpic.id
        ? {
            ...epic,
            subCategories: epic.subCategories.map(subCat =>
              subCat.id === subCatId
                ? {
                    ...subCat,
                    tasks: subCat.tasks.map(task =>
                      task.id === taskId
                        ? { ...task, completed: !task.completed }
                        : task
                    )
                  }
                : subCat
            )
          }
        : epic
    ));

    // Update selectedEpic
    setSelectedEpic(prev => prev ? {
      ...prev,
      subCategories: prev.subCategories.map(subCat =>
        subCat.id === subCatId
          ? {
              ...subCat,
              tasks: subCat.tasks.map(task =>
                task.id === taskId
                  ? { ...task, completed: !task.completed }
                  : task
              )
            }
          : subCat
      )
    } : null);
  };

  // Weekly Focus Functions
  const addWeeklyGoal = () => {
    if (!newWeeklyGoalText.trim()) return;
    const newGoal: WeeklyGoal = {
      id: Date.now().toString(),
      text: newWeeklyGoalText,
      completed: false,
      priority: null
    };
    setWeeklyGoals(prev => [...prev, newGoal]);
    setNewWeeklyGoalText('');
    setShowAddWeeklyGoal(false);
  };

  const deleteWeeklyGoal = (goalId: string) => {
    setWeeklyGoals(prev => prev.filter(g => g.id !== goalId));
  };

  const toggleWeeklyGoal = (goalId: string) => {
    setWeeklyGoals(prev => prev.map(g =>
      g.id === goalId ? { ...g, completed: !g.completed } : g
    ));
  };

  const editWeeklyGoal = (goalId: string, newText: string) => {
    setWeeklyGoals(prev => prev.map(g =>
      g.id === goalId ? { ...g, text: newText } : g
    ));
  };

  const setPriorityForGoal = (goalId: string, priority: 1 | 2 | 3 | null) => {
    setWeeklyGoals(prev => prev.map(g =>
      g.id === goalId ? { ...g, priority } : g
    ));
  };

  const addDailyTask = () => {
    if (!newDailyTaskText.trim()) return;
    const newTask: DailyTask = {
      id: Date.now().toString(),
      text: newDailyTaskText,
      completed: false
    };
    setDailyTasks(prev => [...prev, newTask]);
    setNewDailyTaskText('');
    setShowAddDailyTask(false);
  };

  const deleteDailyTask = (taskId: string) => {
    setDailyTasks(prev => prev.filter(t => t.id !== taskId));
  };

  const toggleDailyTask = (taskId: string) => {
    setDailyTasks(prev => prev.map(t =>
      t.id === taskId ? { ...t, completed: !t.completed } : t
    ));
  };

  const editDailyTask = (taskId: string, newText: string) => {
    setDailyTasks(prev => prev.map(t =>
      t.id === taskId ? { ...t, text: newText } : t
    ));
  };

  // Handle weekly goals drag and drop
  const handleWeeklyGoalsDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setWeeklyGoals((goals) => {
      const oldIndex = goals.findIndex((g) => g.id === active.id);
      const newIndex = goals.findIndex((g) => g.id === over.id);
      return arrayMove(goals, oldIndex, newIndex);
    });
  };

  // Handle daily tasks drag and drop
  const handleDailyTasksDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setDailyTasks((tasks) => {
      const oldIndex = tasks.findIndex((t) => t.id === active.id);
      const newIndex = tasks.findIndex((t) => t.id === over.id);
      return arrayMove(tasks, oldIndex, newIndex);
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 overflow-x-hidden">
      <div className="max-w-[1800px] mx-auto p-4">
        {/* Header with Quote and Tabs */}
        <div className="relative mb-3">
          {/* Rotating Quote - Top Left */}
          <div className="absolute left-0 top-0">
            <p className="text-xs text-white/70 italic max-w-xs line-clamp-1">
              💭 {mantras[currentMantraIndex]}
            </p>
          </div>

          {/* Tab Navigation - Top Right */}
          <div className="absolute right-0 top-0 flex items-center gap-2">
            <button
              onClick={() => setActiveTab('daily')}
              className={`px-4 py-1 rounded-full font-bold text-xs transition-all ${
                activeTab === 'daily'
                  ? 'bg-white text-purple-900 shadow-xl'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              DAILY
            </button>
            <button
              onClick={() => setActiveTab('tasks')}
              className={`px-4 py-1 rounded-full font-bold text-xs transition-all ${
                activeTab === 'tasks'
                  ? 'bg-white text-purple-900 shadow-xl'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              TASKS
            </button>
            <button
              onClick={() => setActiveTab('goals')}
              className={`px-4 py-1 rounded-full font-bold text-xs transition-all ${
                activeTab === 'goals'
                  ? 'bg-white text-purple-900 shadow-xl'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              GOALS
            </button>
          </div>

          {/* Title - Center */}
          <div className="text-center pt-6">
            <h1 className="text-2xl font-bold text-white drop-shadow-2xl uppercase tracking-wide">
              FINDING FLOW
            </h1>
          </div>
        </div>

        {activeTab === 'goals' && (
          <div className="text-center text-white py-20">
            <h2 className="text-3xl font-bold mb-4">GOALS</h2>
            <p className="text-lg text-white/80">Strategic vision & projects coming soon...</p>
          </div>
        )}

        {activeTab === 'tasks' && (
          <>
            {/* Epic View - No epic selected, show all manila folders */}
            {!selectedEpic && (
              <div className="max-w-7xl mx-auto">
                {/* Weekly Focus Section */}
                <div className="mb-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Weekly Goals */}
                    <div className={`bg-white/10 backdrop-blur-md rounded-2xl p-6 ${
                      (() => {
                        const priorityGoals = weeklyGoals.filter(g => g.priority && !g.completed);
                        const completedPriorityGoals = weeklyGoals.filter(g => g.priority && g.completed).length;
                        const totalPriorityGoals = weeklyGoals.filter(g => g.priority).length;
                        const hasAnyPriority = totalPriorityGoals > 0;
                        const almostDone = hasAnyPriority && completedPriorityGoals >= totalPriorityGoals - 1 && priorityGoals.length > 0;
                        return almostDone ? 'border-4 animate-neon-flash' : 'border-2 border-white/20';
                      })()
                    }`}>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-white">📅 This Week's Goals</h3>
                        <button
                          onClick={() => setShowAddWeeklyGoal(!showAddWeeklyGoal)}
                          className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white font-bold transition"
                        >
                          +
                        </button>
                      </div>

                      {/* Motivational Banner - Shows when priorities are almost complete */}
                      {(() => {
                        const priorityGoals = weeklyGoals.filter(g => g.priority && !g.completed);
                        const completedPriorityGoals = weeklyGoals.filter(g => g.priority && g.completed).length;
                        const totalPriorityGoals = weeklyGoals.filter(g => g.priority).length;
                        const hasAnyPriority = totalPriorityGoals > 0;
                        const almostDone = hasAnyPriority && completedPriorityGoals >= totalPriorityGoals - 1 && priorityGoals.length > 0;

                        if (almostDone) {
                          return (
                            <div className="mb-4 bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 rounded-xl p-4 border-2 border-white/50">
                              <div className="text-center">
                                <h4 className="text-2xl font-black text-white mb-2 animate-text-glow uppercase tracking-wide">
                                  YES! SO CLOSE! 🔥
                                </h4>
                                <p className="text-white font-bold text-lg mb-1">
                                  You're almost there!
                                </p>
                                <p className="text-white/90 text-sm">
                                  Keep going - see it through to completion!
                                </p>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      })()}

                      {/* Add Weekly Goal Form */}
                      {showAddWeeklyGoal && (
                        <div className="mb-4 flex gap-2">
                          <input
                            type="text"
                            placeholder="New weekly goal..."
                            value={newWeeklyGoalText}
                            onChange={(e) => setNewWeeklyGoalText(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && addWeeklyGoal()}
                            className="flex-1 px-3 py-2 rounded-lg bg-white/90 text-gray-800 text-sm"
                            autoFocus
                          />
                          <button
                            onClick={addWeeklyGoal}
                            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-bold transition"
                          >
                            Add
                          </button>
                        </div>
                      )}

                      {/* Weekly Goals List */}
                      <DndContext
                        onDragEnd={handleWeeklyGoalsDragEnd}
                        collisionDetection={closestCorners}
                      >
                        <SortableContext
                          items={weeklyGoals.filter(g => !g.completed).map(g => g.id)}
                          strategy={verticalListSortingStrategy}
                        >
                          <div className="space-y-2 relative">
                            {weeklyGoals.filter(g => !g.completed).map((goal) => (
                              <div key={goal.id} className="relative">
                                <SortableWeeklyGoal
                                  goal={goal}
                                  onToggle={toggleWeeklyGoal}
                                  onDelete={deleteWeeklyGoal}
                                  onEdit={editWeeklyGoal}
                                  onSetPriority={setPriorityForGoal}
                                />
                              </div>
                            ))}
                            {weeklyGoals.filter(g => !g.completed).length === 0 && !showCompletedGoals && (
                              <p className="text-white/50 text-sm text-center py-4">No active goals</p>
                            )}
                          </div>
                        </SortableContext>
                      </DndContext>

                      {/* Completed Goals Accordion */}
                      {weeklyGoals.filter(g => g.completed).length > 0 && (
                        <div className="mt-4">
                          <button
                            onClick={() => setShowCompletedGoals(!showCompletedGoals)}
                            className="w-full flex items-center justify-between px-3 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition text-white/70 text-sm"
                          >
                            <span>Completed ({weeklyGoals.filter(g => g.completed).length})</span>
                            <span className="transform transition-transform" style={{ transform: showCompletedGoals ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                              ▼
                            </span>
                          </button>
                          {showCompletedGoals && (
                            <div className="mt-2 space-y-2">
                              {weeklyGoals.filter(g => g.completed).map((goal) => (
                                <div key={goal.id} className="flex items-start gap-3 bg-white/5 rounded-lg p-3 opacity-60">
                                  <input
                                    type="checkbox"
                                    checked={true}
                                    onChange={() => toggleWeeklyGoal(goal.id)}
                                    className="mt-1 w-5 h-5 cursor-pointer flex-shrink-0"
                                  />
                                  <span className="flex-1 text-white text-sm line-through">
                                    {goal.text}
                                  </span>
                                  <button
                                    onClick={() => deleteWeeklyGoal(goal.id)}
                                    className="text-red-400 hover:text-red-300 font-bold text-lg transition"
                                  >
                                    ×
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Daily Tasks */}
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl border-2 border-white/20 p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-white">✅ Today's Tasks</h3>
                        <button
                          onClick={() => setShowAddDailyTask(!showAddDailyTask)}
                          className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white font-bold transition"
                        >
                          +
                        </button>
                      </div>

                      {/* Add Daily Task Form */}
                      {showAddDailyTask && (
                        <div className="mb-4 flex gap-2">
                          <input
                            type="text"
                            placeholder="New daily task..."
                            value={newDailyTaskText}
                            onChange={(e) => setNewDailyTaskText(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && addDailyTask()}
                            className="flex-1 px-3 py-2 rounded-lg bg-white/90 text-gray-800 text-sm"
                            autoFocus
                          />
                          <button
                            onClick={addDailyTask}
                            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-bold transition"
                          >
                            Add
                          </button>
                        </div>
                      )}

                      {/* Daily Tasks List */}
                      <DndContext
                        onDragEnd={handleDailyTasksDragEnd}
                        collisionDetection={closestCorners}
                      >
                        <SortableContext
                          items={dailyTasks.filter(t => !t.completed).map(t => t.id)}
                          strategy={verticalListSortingStrategy}
                        >
                          <div className="space-y-2">
                            {dailyTasks.filter(t => !t.completed).map((task) => (
                              <SortableDailyTask
                                key={task.id}
                                task={task}
                                onToggle={toggleDailyTask}
                                onDelete={deleteDailyTask}
                                onEdit={editDailyTask}
                              />
                            ))}
                            {dailyTasks.filter(t => !t.completed).length === 0 && !showCompletedTasks && (
                              <p className="text-white/50 text-sm text-center py-4">No active tasks</p>
                            )}
                          </div>
                        </SortableContext>
                      </DndContext>

                      {/* Completed Tasks Accordion */}
                      {dailyTasks.filter(t => t.completed).length > 0 && (
                        <div className="mt-4">
                          <button
                            onClick={() => setShowCompletedTasks(!showCompletedTasks)}
                            className="w-full flex items-center justify-between px-3 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition text-white/70 text-sm"
                          >
                            <span>Completed ({dailyTasks.filter(t => t.completed).length})</span>
                            <span className="transform transition-transform" style={{ transform: showCompletedTasks ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                              ▼
                            </span>
                          </button>
                          {showCompletedTasks && (
                            <div className="mt-2 space-y-2">
                              {dailyTasks.filter(t => t.completed).map((task) => (
                                <div key={task.id} className="flex items-start gap-3 bg-white/5 rounded-lg p-3 opacity-60">
                                  <input
                                    type="checkbox"
                                    checked={true}
                                    onChange={() => toggleDailyTask(task.id)}
                                    className="mt-1 w-5 h-5 cursor-pointer flex-shrink-0"
                                  />
                                  <span className="flex-1 text-white text-sm line-through">
                                    {task.text}
                                  </span>
                                  <button
                                    onClick={() => deleteDailyTask(task.id)}
                                    className="text-red-400 hover:text-red-300 font-bold text-lg transition"
                                  >
                                    ×
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-white mb-2">Life Epics</h2>
                  <p className="text-white/70 text-sm">Big projects that shape your life</p>
                </div>

                {/* Manila Folders Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {epics.map((epic) => (
                    <div key={epic.id} className="relative">
                      {/* Delete Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteEpic(epic.id);
                        }}
                        className="absolute -top-2 -right-2 z-10 w-8 h-8 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg transition"
                      >
                        ×
                      </button>

                      <button
                        onClick={() => setSelectedEpic(epic)}
                        className="group relative hover:scale-105 transition-transform w-full"
                      >
                        {/* Manila Folder */}
                        <div className="relative">
                          {/* Folder Tab */}
                          <div
                            className="absolute -top-3 left-8 w-24 h-8 rounded-t-lg shadow-md"
                            style={{ backgroundColor: epic.color }}
                          />

                          {/* Folder Body */}
                          <div
                            className="relative h-48 rounded-lg shadow-xl p-6 flex flex-col justify-between backdrop-blur-sm border-2 border-white/20"
                            style={{ backgroundColor: `${epic.color}dd` }}
                          >
                            <div>
                              <h3 className="text-xl font-bold text-white mb-3">{epic.name}</h3>
                              <div className="text-white/80 text-sm">
                                {epic.subCategories.length} {epic.subCategories.length === 1 ? 'category' : 'categories'}
                              </div>
                            </div>

                            <div className="text-white/60 text-xs">
                              Click to open →
                            </div>
                          </div>
                        </div>
                      </button>
                    </div>
                  ))}

                  {/* Add New Epic Folder */}
                  {showAddEpic ? (
                    <div className="relative">
                      <div className="relative">
                        {/* Folder Tab */}
                        <div
                          className="absolute -top-3 left-8 w-24 h-8 rounded-t-lg shadow-md"
                          style={{ backgroundColor: newEpicColor }}
                        />

                        {/* Folder Body - Add Form */}
                        <div
                          className="relative h-48 rounded-lg shadow-xl p-4 flex flex-col justify-between backdrop-blur-sm border-2 border-white/20"
                          style={{ backgroundColor: `${newEpicColor}dd` }}
                        >
                          <div className="space-y-2">
                            <input
                              type="text"
                              placeholder="Epic name"
                              value={newEpicName}
                              onChange={(e) => setNewEpicName(e.target.value)}
                              className="w-full px-3 py-2 rounded-lg bg-white/90 text-gray-800 text-sm"
                            />
                            <input
                              type="color"
                              value={newEpicColor}
                              onChange={(e) => setNewEpicColor(e.target.value)}
                              className="w-full h-10 rounded-lg cursor-pointer"
                            />
                          </div>

                          <div className="flex gap-2">
                            <button
                              onClick={addEpic}
                              className="flex-1 bg-white text-gray-800 py-2 rounded-lg text-sm font-bold hover:bg-gray-100 transition"
                            >
                              Add
                            </button>
                            <button
                              onClick={() => {
                                setShowAddEpic(false);
                                setNewEpicName('');
                                setNewEpicColor('#3B82F6');
                              }}
                              className="flex-1 bg-white/20 text-white py-2 rounded-lg text-sm font-bold hover:bg-white/30 transition"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowAddEpic(true)}
                      className="group relative hover:scale-105 transition-transform"
                    >
                      {/* Add Folder Outline */}
                      <div className="relative">
                        {/* Folder Tab Outline */}
                        <div className="absolute -top-3 left-8 w-24 h-8 rounded-t-lg border-2 border-dashed border-white/40" />

                        {/* Folder Body Outline */}
                        <div className="relative h-48 rounded-lg border-2 border-dashed border-white/40 p-6 flex flex-col items-center justify-center hover:border-white/60 transition">
                          <div className="text-6xl text-white/40 mb-2">+</div>
                          <div className="text-white/60 text-sm font-semibold">Add New Epic</div>
                        </div>
                      </div>
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Epic Detail View - Show subcategories and tasks */}
            {selectedEpic && (
              <div className="max-w-7xl mx-auto">
                {/* Breadcrumb / Back Button */}
                <button
                  onClick={() => {
                    setSelectedEpic(null);
                    setSelectedSubCategory(null);
                  }}
                  className="mb-6 text-white/70 hover:text-white flex items-center gap-2 text-sm"
                >
                  ← Back to all epics
                </button>

                {/* Epic Header */}
                <div
                  className="mb-6 p-6 rounded-2xl shadow-xl border-2 border-white/20"
                  style={{ backgroundColor: `${selectedEpic.color}dd` }}
                >
                  <h1 className="text-3xl font-bold text-white mb-2">{selectedEpic.name}</h1>
                  <p className="text-white/80 text-sm">
                    {selectedEpic.subCategories.length} {selectedEpic.subCategories.length === 1 ? 'sub-category' : 'sub-categories'}
                  </p>
                </div>

                {/* Sub-Categories */}
                <div className="space-y-4">
                  {selectedEpic.subCategories.map((subCat) => (
                    <div
                      key={subCat.id}
                      className="relative bg-white/10 backdrop-blur-md rounded-2xl p-6 border-2 border-white/20 shadow-lg"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-white">{subCat.name}</h3>
                        <div className="flex items-center gap-3">
                          <span className="text-white/60 text-sm">
                            {subCat.tasks.filter(t => t.completed).length}/{subCat.tasks.length} complete
                          </span>
                          <button
                            onClick={() => deleteSubCategory(subCat.id)}
                            className="w-7 h-7 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg transition text-sm"
                          >
                            ×
                          </button>
                        </div>
                      </div>

                      {/* Tasks */}
                      <div className="space-y-2">
                        {subCat.tasks.map((task) => (
                          <div
                            key={task.id}
                            className={`p-3 rounded-xl flex items-center gap-3 ${
                              task.completed
                                ? 'bg-green-500/20 border border-green-400/30'
                                : 'bg-white/5 border border-white/10'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={task.completed}
                              onChange={() => toggleEpicTask(subCat.id, task.id)}
                              className="w-5 h-5 rounded"
                            />
                            <div className="flex-1">
                              <div className={`text-white ${task.completed ? 'line-through opacity-60' : ''}`}>
                                {task.title}
                              </div>
                              {task.description && (
                                <div className="text-white/60 text-xs mt-1">{task.description}</div>
                              )}
                            </div>
                            <button
                              onClick={() => deleteEpicTask(subCat.id, task.id)}
                              className="w-6 h-6 bg-red-500/80 hover:bg-red-500 rounded-full flex items-center justify-center text-white font-bold transition text-xs flex-shrink-0"
                            >
                              ×
                            </button>
                          </div>
                        ))}

                        {subCat.tasks.length === 0 && (
                          <div className="text-center text-white/40 py-4 text-sm">
                            No tasks yet. Add your first task!
                          </div>
                        )}
                      </div>

                      {/* Add Task Form */}
                      {showAddTaskForSubCat === subCat.id ? (
                        <div className="mt-4 bg-white/10 p-4 rounded-xl border border-white/20 space-y-3">
                          <input
                            type="text"
                            placeholder="Task title"
                            value={newEpicTask.title}
                            onChange={(e) => setNewEpicTask({ ...newEpicTask, title: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg bg-white/90 text-gray-800 text-sm"
                          />
                          <textarea
                            placeholder="Description (optional)"
                            value={newEpicTask.description}
                            onChange={(e) => setNewEpicTask({ ...newEpicTask, description: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg bg-white/90 text-gray-800 text-sm"
                            rows={2}
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => addTaskToSubCategory(subCat.id)}
                              className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg text-sm font-semibold transition"
                            >
                              Add Task
                            </button>
                            <button
                              onClick={() => {
                                setShowAddTaskForSubCat(null);
                                setNewEpicTask({ title: '', description: '' });
                              }}
                              className="flex-1 bg-white/20 hover:bg-white/30 text-white py-2 rounded-lg text-sm font-semibold transition"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => setShowAddTaskForSubCat(subCat.id)}
                          className="mt-4 w-full bg-white/10 hover:bg-white/20 text-white py-2 rounded-xl text-sm font-semibold transition border border-white/20"
                        >
                          + Add Task
                        </button>
                      )}
                    </div>
                  ))}

                  {selectedEpic.subCategories.length === 0 && (
                    <div className="text-center text-white/60 py-12">
                      <div className="text-4xl mb-3">📁</div>
                      <p className="text-lg mb-2">No sub-categories yet</p>
                      <p className="text-sm text-white/40">Add your first sub-category to get started</p>
                    </div>
                  )}

                  {/* Add Sub-Category Form/Button */}
                  {showAddSubCategory ? (
                    <div className="bg-white/10 p-6 rounded-2xl border-2 border-white/20 space-y-4">
                      <input
                        type="text"
                        placeholder="Sub-category name (e.g., Finding a job)"
                        value={newSubCategoryName}
                        onChange={(e) => setNewSubCategoryName(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-white/90 text-gray-800 text-base"
                      />
                      <div className="flex gap-3">
                        <button
                          onClick={addSubCategory}
                          className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl text-base font-bold transition"
                        >
                          Add Sub-Category
                        </button>
                        <button
                          onClick={() => {
                            setShowAddSubCategory(false);
                            setNewSubCategoryName('');
                          }}
                          className="flex-1 bg-white/20 hover:bg-white/30 text-white py-3 rounded-xl text-base font-bold transition"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowAddSubCategory(true)}
                      className="w-full bg-white/10 hover:bg-white/20 text-white py-4 rounded-2xl text-base font-bold transition border-2 border-white/20 border-dashed"
                    >
                      + Add Sub-Category
                    </button>
                  )}
                </div>
              </div>
            )}
          </>
        )}

        {/* Sticky Baseline Habits Bar - Always visible */}
        <div className="sticky top-0 z-50 -mx-4 px-4 py-3 bg-gradient-to-r from-indigo-900/95 via-purple-900/95 to-pink-800/95 backdrop-blur-lg border-b border-white/10 shadow-xl">
          <div className="max-w-7xl mx-auto">
            {/* Compact layout for sticky bar */}
            <div className="flex items-center justify-between gap-4 flex-wrap">
              {/* Date selector */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const newDate = new Date(selectedDate);
                    newDate.setDate(newDate.getDate() - 1);
                    setSelectedDate(newDate);
                  }}
                  className="text-white/60 hover:text-white transition-colors p-1"
                >
                  <span className="text-sm">←</span>
                </button>
                <div className="text-center min-w-[120px]">
                  <span className="text-sm font-bold text-white">
                    {selectedDate.toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                  {selectedDate.toDateString() === new Date().toDateString() && (
                    <span className="ml-2 text-green-400 text-[10px] font-semibold">Today</span>
                  )}
                </div>
                <button
                  onClick={() => {
                    const newDate = new Date(selectedDate);
                    newDate.setDate(newDate.getDate() + 1);
                    setSelectedDate(newDate);
                  }}
                  className="text-white/60 hover:text-white transition-colors p-1"
                >
                  <span className="text-sm">→</span>
                </button>
              </div>

              {/* Baseline habits */}
              <div className="flex items-center gap-2 flex-wrap justify-center flex-1">
                <span className="text-white/70 text-xs font-semibold uppercase hidden sm:inline">
                  {isWeekend ? 'Weekend' : 'Morning'} Baseline:
                </span>
                {baselineHabits.map(habit => (
                  <button
                    key={habit.id}
                    onClick={() => toggleHabit(habit.id)}
                    className="transition-all duration-200 hover:scale-105 active:scale-95"
                  >
                    <div className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-md ${
                      habit.completed
                        ? 'bg-gradient-to-br from-green-400 to-emerald-600 text-white'
                        : 'bg-white/15 text-white border border-white/30 hover:bg-white/25'
                    }`}>
                      <span className="text-base">{habit.icon}</span>
                      <span className="font-medium text-xs whitespace-nowrap hidden sm:inline">
                        {habit.label}
                      </span>
                      {habit.completed && (
                        <span className="text-white text-xs">✓</span>
                      )}
                    </div>
                  </button>
                ))}
              </div>

              {/* Progress indicator */}
              <div className="flex items-center gap-2">
                <div className="text-white text-xs font-bold px-3 py-1.5 bg-white/15 rounded-full border border-white/30">
                  {completedHabitsCount}/{baselineHabits.length}
                </div>
                {allHabitsCompleted && (
                  <span className="bg-gradient-to-r from-green-400 to-emerald-500 text-white px-3 py-1.5 rounded-full text-xs font-bold animate-pulse shadow-lg whitespace-nowrap">
                    Ready to Flow! 🚀
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {activeTab === 'daily' && (
          <>
        {/* Day Job Section */}
        <div ref={dayJobRef} className="mb-4 mx-auto max-w-7xl">
          <div className={`relative bg-white/10 backdrop-blur-md rounded-[3rem] border-4 shadow-2xl p-4 overflow-hidden transition-all duration-500 ${
            allHabitsCompleted
              ? 'border-green-400/50 animate-breathe animate-glow-pulse'
              : 'border-white/30'
          }`}>
            <div className="flex items-center justify-center gap-3 mb-3 relative z-30">
              <h3 className="text-lg font-bold text-white">Day Job</h3>
              {allHabitsCompleted && (
                <span className="bg-gradient-to-r from-green-400 to-emerald-500 text-white px-3 py-1 rounded-full text-[10px] font-bold animate-pulse shadow-xl">
                  Ready to Work! 💼
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 relative z-30">
              {/* Column 1: Setup for Success */}
              <div className="space-y-2">
                <label className="block text-white text-xs font-semibold mb-1">
                  Setup for Success
                </label>
                <label className="flex items-center gap-2 text-white text-xs cursor-pointer bg-white/10 px-2 py-2 rounded-xl hover:bg-white/20 transition border border-white/20">
                  <input
                    type="checkbox"
                    checked={dayJobCompleted.signInMicrosoft}
                    onChange={(e) => setDayJobCompleted({ ...dayJobCompleted, signInMicrosoft: e.target.checked })}
                    className="w-4 h-4 rounded-full"
                  />
                  <span>Sign into Microsoft</span>
                </label>
                <label className="flex items-center gap-2 text-white text-xs cursor-pointer bg-white/10 px-2 py-2 rounded-xl hover:bg-white/20 transition border border-white/20">
                  <input
                    type="checkbox"
                    checked={dayJobCompleted.phoneOutOfOffice}
                    onChange={(e) => setDayJobCompleted({ ...dayJobCompleted, phoneOutOfOffice: e.target.checked })}
                    className="w-4 h-4 rounded-full"
                  />
                  <span>Move phone out</span>
                </label>
              </div>

              {/* Column 2: ONE THING */}
              <div className="space-y-2">
                <label className="block text-white text-xs font-semibold mb-1">
                  ONE THING
                </label>
                <input
                  type="text"
                  value={dayJobFocus}
                  onChange={(e) => setDayJobFocus(e.target.value)}
                  placeholder="Your key focus"
                  className="w-full px-3 py-2 rounded-xl bg-white/90 text-gray-800 text-sm"
                />
              </div>

              {/* Column 3: Pomodoro Timer */}
              <div className="space-y-2">
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-white text-xs font-semibold">
                    Pomodoro
                  </label>
                  <button
                    onClick={() => setPomodoroView(pomodoroView === 'digital' ? 'analog' : 'digital')}
                    className="text-white/60 hover:text-white text-[10px] px-2 py-1 bg-white/10 rounded-lg transition"
                  >
                    {pomodoroView === 'digital' ? '⏰' : '🔢'}
                  </button>
                </div>

                {pomodoroView === 'digital' ? (
                  <div className="bg-white/10 rounded-xl p-3 border border-white/20">
                    <div className="text-4xl font-bold text-white text-center mb-2">
                      {Math.floor(pomodoroTime / 60)}:{String(pomodoroTime % 60).padStart(2, '0')}
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => setIsPomodoroRunning(!isPomodoroRunning)}
                        className="flex-1 bg-green-500 hover:bg-green-600 text-white py-1 rounded-lg text-xs font-bold transition"
                      >
                        {isPomodoroRunning ? '⏸' : '▶'}
                      </button>
                      <button
                        onClick={() => {
                          setIsPomodoroRunning(false);
                          setPomodoroTime(25 * 60);
                        }}
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white py-1 rounded-lg text-xs font-bold transition"
                      >
                        ⟳
                      </button>
                    </div>
                    <div className="text-center text-white/60 text-[10px] mt-2">
                      Today: {dailyPomodoroCount} 🍅
                    </div>
                  </div>
                ) : (
                  <div className="bg-white/10 rounded-xl p-2 border border-white/20 flex flex-col items-center">
                    <svg className="w-32 h-32" viewBox="0 0 120 120">
                      <circle
                        cx="60"
                        cy="60"
                        r="54"
                        fill="none"
                        stroke="rgba(255,255,255,0.2)"
                        strokeWidth="4"
                      />
                      <circle
                        cx="60"
                        cy="60"
                        r="54"
                        fill="none"
                        stroke="white"
                        strokeWidth="4"
                        strokeDasharray={`${2 * Math.PI * 54}`}
                        strokeDashoffset={`${2 * Math.PI * 54 * (pomodoroTime / (25 * 60))}`}
                        transform="rotate(-90 60 60)"
                      />
                      <text x="60" y="65" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">
                        {Math.floor(pomodoroTime / 60)}:{String(pomodoroTime % 60).padStart(2, '0')}
                      </text>
                    </svg>
                    <div className="flex gap-1 w-full mt-1">
                      <button
                        onClick={() => setIsPomodoroRunning(!isPomodoroRunning)}
                        className="flex-1 bg-green-500 hover:bg-green-600 text-white py-1 rounded-lg text-xs font-bold transition"
                      >
                        {isPomodoroRunning ? '⏸' : '▶'}
                      </button>
                      <button
                        onClick={() => {
                          setIsPomodoroRunning(false);
                          setPomodoroTime(25 * 60);
                        }}
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white py-1 rounded-lg text-xs font-bold transition"
                      >
                        ⟳
                      </button>
                    </div>
                    <div className="text-center text-white/60 text-[10px] mt-1">
                      {dailyPomodoroCount} 🍅
                    </div>
                  </div>
                )}
              </div>

              {/* Column 4: Reward */}
              <div className="space-y-2">
                <label className="block text-white text-xs font-semibold mb-1">
                  Reward
                </label>
                <input
                  type="text"
                  value={dayJobReward}
                  onChange={(e) => setDayJobReward(e.target.value)}
                  placeholder="Your reward"
                  className="w-full px-3 py-2 rounded-xl bg-white/90 text-gray-800 text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Release Your Soul Section */}
        <div className="mb-4 mx-auto max-w-7xl">
          <div className={`relative bg-white/8 backdrop-blur-md rounded-[3rem] border-4 shadow-2xl p-6 overflow-hidden transition-all duration-500 ${
            soulTimerCompleted ? 'border-purple-400/50 animate-breathe animate-glow-pulse' : 'border-white/25'
          }`}>
            <div className="flex items-center justify-center gap-3 mb-4 relative z-30">
              <h3 className="text-lg font-bold text-white">✍️ Release Your Soul</h3>
              {soulTimerCompleted && (
                <span className="bg-gradient-to-r from-purple-400 to-pink-500 text-white px-3 py-1 rounded-full text-[10px] font-bold animate-pulse shadow-xl">
                  Session Complete! 🎉
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-30">
              {/* Column 1: Creative Task */}
              <div className="space-y-2">
                <label className="block text-white text-xs font-semibold mb-1">
                  Today's Creative Task
                </label>
                <input
                  type="text"
                  value={soulTask}
                  onChange={(e) => setSoulTask(e.target.value)}
                  placeholder="e.g., Byron FC - Children's Book"
                  className="w-full px-3 py-2 rounded-xl bg-white/90 text-gray-800 text-sm"
                />
                <p className="text-white/60 text-[10px] mt-1">
                  What creative project will you work on?
                </p>
              </div>

              {/* Column 2: 10 Minute Timer */}
              <div className="space-y-2">
                <label className="block text-white text-xs font-semibold mb-1">
                  10 Minute Session
                </label>
                <div className="bg-white/10 rounded-xl p-4 border border-white/20">
                  <div className="text-4xl font-bold text-white text-center mb-3">
                    {Math.floor(soulTime / 60)}:{String(soulTime % 60).padStart(2, '0')}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setIsSoulTimerRunning(!isSoulTimerRunning)}
                      className="flex-1 bg-purple-500 hover:bg-purple-600 text-white py-2 rounded-lg text-xs font-bold transition"
                    >
                      {isSoulTimerRunning ? '⏸ Pause' : '▶ Start'}
                    </button>
                    <button
                      onClick={() => {
                        setIsSoulTimerRunning(false);
                        setSoulTime(10 * 60);
                        setSoulTimerCompleted(false);
                      }}
                      className="flex-1 bg-pink-500 hover:bg-pink-600 text-white py-2 rounded-lg text-xs font-bold transition"
                    >
                      ⟳ Reset
                    </button>
                  </div>
                </div>
              </div>

              {/* Column 3: Scheduled Time */}
              <div className="space-y-2">
                <label className="block text-white text-xs font-semibold mb-1">
                  When Will You Do This?
                </label>
                <input
                  type="time"
                  value={soulScheduledTime}
                  onChange={(e) => setSoulScheduledTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/90 text-gray-800 text-sm"
                />
                {soulScheduledTime && (
                  <div className="bg-white/10 rounded-xl p-3 border border-white/20">
                    <p className="text-white text-xs text-center">
                      ⏰ Scheduled for <span className="font-bold">{soulScheduledTime}</span>
                    </p>
                  </div>
                )}
                <p className="text-white/60 text-[10px] mt-1">
                  Commit to a specific time today
                </p>
              </div>
            </div>

            {/* Motivational Message */}
            <div className="mt-4 text-center">
              <p className="text-white/70 text-sm italic">
                "10 minutes a day. One bead on the rosary of your creative life."
              </p>
            </div>
          </div>
        </div>

          </>
        )}

        {/* Edit Task Modal */}
        {editingTask && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-3xl p-6 max-w-md w-full shadow-2xl">
              <h3 className="text-2xl font-bold text-white mb-4">Edit Task</h3>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Task title"
                  value={editingTask.title}
                  onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                  className="w-full px-4 py-2 rounded-full bg-white/90 text-gray-800"
                />
                <textarea
                  placeholder="Description"
                  value={editingTask.description}
                  onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
                  className="w-full px-4 py-2 rounded-2xl bg-white/90 text-gray-800"
                  rows={3}
                />
                <div className="grid grid-cols-2 gap-3">
                  <select
                    value={editingTask.complexity}
                    onChange={(e) => setEditingTask({ ...editingTask, complexity: e.target.value as any })}
                    className="px-4 py-2 rounded-full bg-white/90 text-gray-800"
                  >
                    <option value="simple">Simple</option>
                    <option value="medium">Medium</option>
                    <option value="complex">Complex</option>
                  </select>
                  <input
                    type="number"
                    placeholder="Minutes"
                    value={editingTask.estimatedMinutes}
                    onChange={(e) => setEditingTask({ ...editingTask, estimatedMinutes: parseInt(e.target.value) || 25 })}
                    className="px-4 py-2 rounded-full bg-white/90 text-gray-800"
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={saveEditedTask}
                    className="flex-1 bg-white text-purple-600 py-2 rounded-full hover:bg-gray-100 font-semibold transition"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => setEditingTask(null)}
                    className="flex-1 bg-white/20 text-white py-2 rounded-full hover:bg-white/30 font-semibold transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
