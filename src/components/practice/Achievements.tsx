import { useState } from 'react';
import type { ReactNode } from 'react';
import { Card } from '../ui/Card';
import {
  Star, Zap, Flame, Trophy, Target, Brain, GraduationCap, Sparkles, Award,
  Calendar, Lock, CheckCircle, XCircle, RotateCcw, TrendingUp,
} from 'lucide-react';
import {
  ACHIEVEMENT_DEFS, getStats, getDailyChallenge, isDailyDoneToday, recordDailyResult,
} from '../../utils/achievementStore';

const ICONS: Record<string, ReactNode> = {
  star: <Star size={20} />,
  zap: <Zap size={20} />,
  flame: <Flame size={20} />,
  trophy: <Trophy size={20} />,
  target: <Target size={20} />,
  brain: <Brain size={20} />,
  graduation: <GraduationCap size={20} />,
  sparkles: <Sparkles size={20} />,
  award: <Award size={20} />,
};

export function Achievements() {
  const [stats, setStats] = useState(() => getStats());
  const [dailyAnswer, setDailyAnswer] = useState<number | null>(null);
  const [dailyDone, setDailyDone] = useState(() => isDailyDoneToday());

  const daily = getDailyChallenge();
  const unlockedCount = ACHIEVEMENT_DEFS.filter((d) => stats.unlocked[d.id]).length;

  const answerDaily = (index: number) => {
    if (dailyAnswer !== null) return;
    setDailyAnswer(index);
    const correct = index === daily.correctIndex;
    recordDailyResult(correct);
    setDailyDone(true);
    setStats(getStats());
  };

  return (
    <div className="space-y-4">
      <Card>
        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Trophy size={20} className="text-amber-500" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              Achievements
            </h3>
          </div>
          <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
            {unlockedCount} / {ACHIEVEMENT_DEFS.length} unlocked
          </span>
        </div>

        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mb-4">
          <div
            className="h-2 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full transition-all duration-500"
            style={{ width: `${(unlockedCount / ACHIEVEMENT_DEFS.length) * 100}%` }}
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {ACHIEVEMENT_DEFS.map((def) => {
            const unlocked = !!stats.unlocked[def.id];
            return (
              <div
                key={def.id}
                className={`p-3 rounded-xl border text-center transition-all ${
                  unlocked
                    ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800'
                    : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 opacity-60'
                }`}
              >
                <div
                  className={`mx-auto w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                    unlocked
                      ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-400'
                  }`}
                >
                  {unlocked ? ICONS[def.icon] : <Lock size={18} />}
                </div>
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  {def.title}
                </p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-tight">
                  {def.description}
                </p>
              </div>
            );
          })}
        </div>
      </Card>

      <Card>
        <div className="flex items-center gap-2 mb-3">
          <Calendar size={20} className="text-primary-600 dark:text-primary-400" />
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            Daily Challenge
          </h3>
        </div>

        <div className="flex items-center gap-4 mb-4 flex-wrap">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-orange-50 dark:bg-orange-900/20 rounded-full">
            <Flame size={14} className="text-orange-500" />
            <span className="text-xs font-medium text-orange-700 dark:text-orange-400">
              {stats.dailyStreak} day streak
            </span>
          </div>
          {dailyDone && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 dark:bg-green-900/20 rounded-full">
              <CheckCircle size={14} className="text-green-500" />
              <span className="text-xs font-medium text-green-700 dark:text-green-400">
                Completed today
              </span>
            </div>
          )}
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300">
              {daily.topic}
            </span>
            <span className="text-[10px] uppercase tracking-wide text-slate-400">
              {daily.difficulty}
            </span>
          </div>
          <p className="text-sm font-medium text-slate-800 dark:text-slate-200 mb-3">
            {daily.question}
          </p>
          <div className="space-y-2">
            {daily.options.map((opt, i) => {
              const isCorrect = i === daily.correctIndex;
              const chosen = dailyAnswer === i;
              let cls = 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-primary-400';
              if (dailyAnswer !== null) {
                if (isCorrect) cls = 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700';
                else if (chosen) cls = 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700';
                else cls = 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 opacity-60';
              }
              return (
                <button
                  key={i}
                  onClick={() => answerDaily(i)}
                  disabled={dailyAnswer !== null}
                  className={`w-full text-left p-3 rounded-lg border text-sm transition-all flex items-center gap-2 ${cls}`}
                >
                  {dailyAnswer !== null && isCorrect && <CheckCircle size={14} className="text-green-500 flex-shrink-0" />}
                  {dailyAnswer !== null && chosen && !isCorrect && <XCircle size={14} className="text-red-500 flex-shrink-0" />}
                  <span className="text-slate-700 dark:text-slate-300">{opt}</span>
                </button>
              );
            })}
          </div>

          {dailyAnswer !== null && (
            <div className="mt-3 p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg border border-primary-200 dark:border-primary-800">
              <p className="text-xs text-slate-600 dark:text-slate-300">
                <strong className="text-primary-700 dark:text-primary-400">
                  {dailyAnswer === daily.correctIndex ? 'Correct! ' : 'Not quite. '}
                </strong>
                {daily.explanation}
              </p>
            </div>
          )}
        </div>

        {dailyDone && (
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-3 flex items-center gap-1">
            <RotateCcw size={12} />
            A new challenge appears every day — keep the streak alive.
          </p>
        )}
      </Card>

      <Card>
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp size={18} className="text-primary-600 dark:text-primary-400" />
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            Your Activity
          </h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { label: 'Translations', value: stats.translations },
            { label: 'Quizzes', value: stats.quizzes },
            { label: 'Perfect scores', value: stats.perfectQuizzes },
            { label: 'Exam sessions', value: stats.exams },
            { label: 'Challenges', value: stats.challenges },
            { label: 'Pipeline runs', value: stats.pipelineRuns },
          ].map((item) => (
            <div key={item.label} className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 text-center">
              <p className="text-xl font-bold text-slate-800 dark:text-slate-100">{item.value}</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">{item.label}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
