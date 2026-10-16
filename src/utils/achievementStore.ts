import { mcqBank, MCQQuestion } from '../engine/mcqBank';

export interface AchievementStats {
  translations: number;
  quizzes: number;
  perfectQuizzes: number;
  exams: number;
  challenges: number;
  pipelineRuns: number;
  tutorialDone: boolean;
  dailyStreak: number;
  lastDailyDate: string | null;
  unlocked: Record<string, number>;
}

const KEY = 'trc-achievements';

const DEFAULT_STATS: AchievementStats = {
  translations: 0,
  quizzes: 0,
  perfectQuizzes: 0,
  exams: 0,
  challenges: 0,
  pipelineRuns: 0,
  tutorialDone: false,
  dailyStreak: 0,
  lastDailyDate: null,
  unlocked: {},
};

export interface AchievementDef {
  id: string;
  title: string;
  description: string;
  icon: 'star' | 'zap' | 'flame' | 'trophy' | 'target' | 'brain' | 'graduation' | 'sparkles' | 'award';
  check: (s: AchievementStats) => boolean;
}

export const ACHIEVEMENT_DEFS: AchievementDef[] = [
  { id: 'first-translation', title: 'First Steps', description: 'Translate your first query', icon: 'star', check: (s) => s.translations >= 1 },
  { id: 'translations-10', title: 'Polyglot', description: 'Translate 10 queries', icon: 'zap', check: (s) => s.translations >= 10 },
  { id: 'translations-50', title: 'Query Master', description: 'Translate 50 queries', icon: 'award', check: (s) => s.translations >= 50 },
  { id: 'quiz-first', title: 'Quiz Starter', description: 'Complete your first quiz', icon: 'target', check: (s) => s.quizzes >= 1 },
  { id: 'quiz-perfect', title: 'Flawless', description: 'Score 100% on a quiz', icon: 'trophy', check: (s) => s.perfectQuizzes >= 1 },
  { id: 'exam-first', title: 'Exam Ready', description: 'Complete an exam practice session', icon: 'brain', check: (s) => s.exams >= 1 },
  { id: 'challenge-first', title: 'Challenger', description: 'Complete a timed challenge', icon: 'zap', check: (s) => s.challenges >= 1 },
  { id: 'pipeline-first', title: 'AI Whisperer', description: 'Run the NL to SQL pipeline', icon: 'sparkles', check: (s) => s.pipelineRuns >= 1 },
  { id: 'tutorial-complete', title: 'Graduate', description: 'Finish the guided tutorial', icon: 'graduation', check: (s) => s.tutorialDone },
  { id: 'daily-first', title: 'Daily Devotee', description: 'Complete a daily challenge', icon: 'star', check: (s) => s.dailyStreak >= 1 || s.lastDailyDate !== null },
  { id: 'daily-streak-3', title: 'On Fire', description: '3-day daily challenge streak', icon: 'flame', check: (s) => s.dailyStreak >= 3 },
  { id: 'daily-streak-7', title: 'Unstoppable', description: '7-day daily challenge streak', icon: 'flame', check: (s) => s.dailyStreak >= 7 },
];

function load(): AchievementStats {
  try {
    const saved = localStorage.getItem(KEY);
    if (saved) return { ...DEFAULT_STATS, ...JSON.parse(saved) };
  } catch { /* corrupted storage -> reset */ }
  return { ...DEFAULT_STATS };
}

function save(stats: AchievementStats): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(stats));
  } catch { /* storage unavailable */ }
}

export function getStats(): AchievementStats {
  return load();
}

export type TrackEvent =
  | 'translation' | 'quiz' | 'perfect-quiz' | 'exam'
  | 'challenge' | 'pipeline' | 'tutorial';

export function track(event: TrackEvent): string[] {
  const stats = load();
  switch (event) {
    case 'translation': stats.translations++; break;
    case 'quiz': stats.quizzes++; break;
    case 'perfect-quiz': stats.perfectQuizzes++; break;
    case 'exam': stats.exams++; break;
    case 'challenge': stats.challenges++; break;
    case 'pipeline': stats.pipelineRuns++; break;
    case 'tutorial': stats.tutorialDone = true; break;
  }
  const newlyUnlocked: string[] = [];
  for (const def of ACHIEVEMENT_DEFS) {
    if (!stats.unlocked[def.id] && def.check(stats)) {
      stats.unlocked[def.id] = Date.now();
      newlyUnlocked.push(def.id);
    }
  }
  save(stats);
  return newlyUnlocked;
}

function todayStr(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function yesterdayStr(): string {
  const d = new Date(Date.now() - 86400000);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function isDailyDoneToday(): boolean {
  return load().lastDailyDate === todayStr();
}

export function recordDailyResult(correct: boolean): void {
  const stats = load();
  if (correct) {
    if (stats.lastDailyDate === todayStr()) return;
    stats.dailyStreak = stats.lastDailyDate === yesterdayStr() ? stats.dailyStreak + 1 : 1;
    stats.lastDailyDate = todayStr();
  } else {
    stats.dailyStreak = 0;
  }
  const newlyUnlocked = ACHIEVEMENT_DEFS.filter(
    (d) => !stats.unlocked[d.id] && d.check(stats)
  );
  for (const def of newlyUnlocked) stats.unlocked[def.id] = Date.now();
  save(stats);
}

// Deterministic daily question: same for everyone on the same date
export function getDailyChallenge(): MCQQuestion {
  const today = todayStr();
  let seed = 0;
  for (let i = 0; i < today.length; i++) seed = (seed * 31 + today.charCodeAt(i)) % 100000;
  const idx = Math.abs(Math.sin(seed) * 10000) % mcqBank.length;
  return mcqBank[Math.floor(idx)];
}
