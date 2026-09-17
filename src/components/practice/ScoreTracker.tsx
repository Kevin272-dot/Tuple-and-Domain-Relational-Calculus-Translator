import { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { Trophy, TrendingUp, Target, Clock, Star } from 'lucide-react';

interface ScoreEntry {
  id: string;
  timestamp: number;
  score: number;
  total: number;
  type: 'quiz' | 'challenge';
  difficulty: string;
  timeTaken?: number;
}

export function ScoreTracker() {
  const [scores, setScores] = useState<ScoreEntry[]>(() => {
    try {
      const saved = localStorage.getItem('trc-scores');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('trc-scores', JSON.stringify(scores));
  }, [scores]);

  const totalQuizzes = scores.filter((s) => s.type === 'quiz').length;
  const totalChallenges = scores.filter((s) => s.type === 'challenge').length;
  const avgScore = scores.length > 0
    ? Math.round(scores.reduce((acc, s) => acc + (s.score / s.total) * 100, 0) / scores.length)
    : 0;
  const bestScore = scores.length > 0
    ? Math.max(...scores.map((s) => Math.round((s.score / s.total) * 100)))
    : 0;
  const totalQuestions = scores.reduce((acc, s) => acc + s.total, 0);
  const totalCorrect = scores.reduce((acc, s) => acc + s.score, 0);

  const recentScores = scores.slice(0, 10);

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <Trophy size={20} className="text-amber-500" />
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Score Tracker</h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg text-center">
            <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">{totalQuizzes + totalChallenges}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Total Sessions</div>
          </div>
          <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{avgScore}%</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Average Score</div>
          </div>
          <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg text-center">
            <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">{bestScore}%</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Best Score</div>
          </div>
          <div className="p-3 bg-violet-50 dark:bg-violet-900/20 rounded-lg text-center">
            <div className="text-2xl font-bold text-violet-600 dark:text-violet-400">{totalCorrect}/{totalQuestions}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Questions Correct</div>
          </div>
        </div>

        {scores.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Recent Activity</h4>
            <div className="space-y-2">
              {recentScores.map((entry) => {
                const pct = Math.round((entry.score / entry.total) * 100);
                return (
                  <div key={entry.id} className="flex items-center gap-3 p-2 bg-slate-50 dark:bg-slate-900 rounded-lg">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold ${
                      pct >= 70 ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                        : pct >= 50 ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
                        : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                    }`}>
                      {pct}%
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-slate-700 dark:text-slate-300 capitalize">
                          {entry.type}
                        </span>
                        <span className="text-xs text-slate-400 dark:text-slate-500">
                          {entry.difficulty}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        {entry.score}/{entry.total} correct
                      </div>
                    </div>
                    <div className="text-xs text-slate-400 dark:text-slate-500">
                      {new Date(entry.timestamp).toLocaleDateString()}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {scores.length === 0 && (
          <div className="text-center py-8 text-slate-500 dark:text-slate-400">
            <Target size={32} className="mx-auto mb-2 opacity-50" />
            <p className="text-sm">No scores yet. Complete a quiz or challenge to start tracking!</p>
          </div>
        )}
      </Card>
    </div>
  );
}

export function addScore(entry: Omit<ScoreEntry, 'id' | 'timestamp'>) {
  try {
    const saved = localStorage.getItem('trc-scores');
    const scores: ScoreEntry[] = saved ? JSON.parse(saved) : [];
    scores.unshift({
      ...entry,
      id: Date.now().toString(),
      timestamp: Date.now(),
    });
    localStorage.setItem('trc-scores', JSON.stringify(scores.slice(0, 100)));
  } catch {
    // ignore storage errors
  }
}
