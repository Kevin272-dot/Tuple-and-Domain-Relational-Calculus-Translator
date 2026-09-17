import { useState, useEffect, useCallback } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Timer, Trophy, RotateCcw, Zap, CheckCircle, XCircle, ArrowRight } from 'lucide-react';
import { translateToSQL } from '../../engine/translator';
import { sampleQueries } from '../../engine/examples';

interface Challenge {
  query: string;
  expectedSql: string;
  description: string;
  difficulty: string;
  calculusType: string;
}

type ChallengePhase = 'setup' | 'active' | 'results';

export function ChallengeMode() {
  const [phase, setPhase] = useState<ChallengePhase>('setup');
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [results, setResults] = useState<Array<{ challenge: Challenge; correct: boolean; userSql: string }>>([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [difficulty, setDifficulty] = useState<'mixed' | 'basic' | 'intermediate' | 'advanced'>('mixed');

  const startChallenge = useCallback((diff: typeof difficulty) => {
    setDifficulty(diff);
    let pool = [...sampleQueries];
    if (diff !== 'mixed') pool = pool.filter((q) => q.difficulty === diff);
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    const selected = pool.slice(0, Math.min(5, pool.length)).map((q) => ({
      query: q.query,
      expectedSql: q.expectedSql,
      description: q.description,
      difficulty: q.difficulty,
      calculusType: q.calculusType,
    }));
    setChallenges(selected);
    setCurrentIndex(0);
    setUserAnswer('');
    setScore(0);
    setResults([]);
    setTimeLeft(selected.length * 120);
    setTimerActive(true);
    setPhase('active');
  }, []);

  useEffect(() => {
    if (!timerActive || timeLeft <= 0) return;
    const id = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setTimerActive(false);
          setPhase('results');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [timerActive, timeLeft]);

  const handleSubmit = () => {
    const challenge = challenges[currentIndex];
    const result = translateToSQL(userAnswer);
    const normalizedUser = normalizeSQL(result.sql);
    const normalizedExpected = normalizeSQL(challenge.expectedSql);
    const correct = result.success && normalizedUser === normalizedExpected;

    if (correct) setScore((prev) => prev + 1);

    setResults([...results, { challenge, correct, userSql: result.sql }]);

    if (currentIndex < challenges.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setUserAnswer('');
    } else {
      setTimerActive(false);
      setPhase('results');
    }
  };

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  if (phase === 'setup') {
    return (
      <div className="space-y-6 max-w-2xl mx-auto">
        <Card className="text-center py-6">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center">
            <Zap size={32} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Challenge Mode</h2>
          <p className="text-slate-600 dark:text-slate-300">
            Timed challenges: translate TRC/DRC to SQL before time runs out!
          </p>
        </Card>
        <Card>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Select Difficulty</h3>
          <div className="grid grid-cols-2 gap-3">
            {(['mixed', 'basic', 'intermediate', 'advanced'] as const).map((d) => (
              <button
                key={d}
                onClick={() => startChallenge(d)}
                className="p-4 text-left bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-primary-400 transition-all"
              >
                <span className="text-sm font-medium text-slate-900 dark:text-white capitalize">{d}</span>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {d === 'mixed' ? 'All difficulty levels' : `${d.charAt(0).toUpperCase() + d.slice(1)} queries only`}
                </p>
              </button>
            ))}
          </div>
        </Card>
      </div>
    );
  }

  if (phase === 'active' && challenges.length > 0) {
    const challenge = challenges[currentIndex];
    return (
      <div className="space-y-4 max-w-2xl mx-auto">
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-500 dark:text-slate-400">
            Challenge {currentIndex + 1} of {challenges.length}
          </span>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-primary-600 dark:text-primary-400">Score: {score}</span>
            <span className={`text-sm font-mono font-medium flex items-center gap-1 ${
              timeLeft < 30 ? 'text-red-500' : 'text-slate-600 dark:text-slate-400'
            }`}>
              <Timer size={14} />
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>
        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
          <div
            className="h-2 bg-primary-600 rounded-full transition-all"
            style={{ width: `${((currentIndex + 1) / challenges.length) * 100}%` }}
          />
        </div>
        <Card>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400">
              {challenge.calculusType}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">{challenge.description}</span>
          </div>
          <p className="text-sm font-mono text-slate-800 dark:text-slate-200 mb-4 p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
            {challenge.query}
          </p>
          <textarea
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder="Write the equivalent SQL query..."
            className="w-full h-24 p-3 font-mono text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none mb-3"
          />
          <Button onClick={handleSubmit} disabled={!userAnswer.trim()} className="w-full">
            {currentIndex < challenges.length - 1 ? (
              <>Next <ArrowRight size={16} className="ml-2" /></>
            ) : 'Finish Challenge'}
          </Button>
        </Card>
      </div>
    );
  }

  const total = challenges.length;
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;
  const timeTaken = 120 * total - timeLeft;

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <Card className="text-center py-8">
        <Trophy size={48} className={`mx-auto mb-4 ${percentage >= 70 ? 'text-amber-500' : 'text-slate-400'}`} />
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Challenge Complete!</h3>
        <p className="text-lg text-slate-600 dark:text-slate-300 mb-4">
          Score: <span className="font-bold text-primary-600 dark:text-primary-400">{score}</span> / {total} ({percentage}%)
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
          Time taken: {formatTime(timeTaken)}
        </p>
        <div className="flex gap-3 justify-center">
          <Button onClick={() => startChallenge(difficulty)}>
            <RotateCcw size={16} className="mr-2" />
            Try Again
          </Button>
          <Button variant="secondary" onClick={() => setPhase('setup')}>
            New Challenge
          </Button>
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Results</h3>
        <div className="space-y-3">
          {results.map((r, i) => (
            <div key={i} className={`p-3 rounded-lg border ${
              r.correct
                ? 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800'
                : 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800'
            }`}>
              <div className="flex items-center gap-2 mb-1">
                {r.correct ? <CheckCircle size={14} className="text-green-500" /> : <XCircle size={14} className="text-red-500" />}
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  {r.challenge.calculusType}: {r.challenge.description}
                </span>
              </div>
              <p className="text-xs font-mono text-slate-600 dark:text-slate-400">{r.challenge.query}</p>
              {!r.correct && (
                <div className="mt-2 text-xs">
                  <p className="text-red-600 dark:text-red-400">Your SQL: {r.userSql || '(empty)'}</p>
                  <p className="text-green-600 dark:text-green-400">Expected: {r.challenge.expectedSql}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function normalizeSQL(sql: string): string {
  return sql.replace(/;\s*$/, '').replace(/\s+/g, ' ').toLowerCase().trim();
}
