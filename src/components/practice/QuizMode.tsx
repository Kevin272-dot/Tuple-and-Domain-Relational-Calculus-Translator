import { useState, useMemo, useEffect, useCallback } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import {
  CheckCircle, XCircle, RotateCcw, Trophy, ChevronRight, Clock,
  Settings, Filter, Play, Pause, Shuffle, Hash
} from 'lucide-react';
import { mcqBank, MCQQuestion } from '../../engine/mcqBank';

type QuizFilter = 'all' | 'TRC' | 'DRC' | 'General';
type QuizSize = 10 | 20 | 30 | 50 | 100;

interface QuizConfig {
  filter: QuizFilter;
  size: QuizSize;
  timerEnabled: boolean;
  timerSeconds: number;
  shuffle: boolean;
  difficulty: 'all' | 'basic' | 'intermediate' | 'advanced';
}

const DEFAULT_CONFIG: QuizConfig = {
  filter: 'all',
  size: 20,
  timerEnabled: false,
  timerSeconds: 300,
  shuffle: true,
  difficulty: 'all',
};

export function QuizMode() {
  const [phase, setPhase] = useState<'setup' | 'quiz' | 'review'>('setup');
  const [config, setConfig] = useState<QuizConfig>(DEFAULT_CONFIG);
  const [questions, setQuestions] = useState<MCQQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [timerActive, setTimerActive] = useState(false);

  const startQuiz = useCallback((cfg: QuizConfig) => {
    setConfig(cfg);
    let pool = [...mcqBank];
    if (cfg.filter !== 'all') pool = pool.filter(q => q.calculusType === cfg.filter);
    if (cfg.difficulty !== 'all') pool = pool.filter(q => q.difficulty === cfg.difficulty);
    if (cfg.shuffle) {
      for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pool[i], pool[j]] = [pool[j], pool[i]];
      }
    }
    const selected = pool.slice(0, Math.min(cfg.size, pool.length));
    setQuestions(selected);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setAnswers(new Array(selected.length).fill(null));
    setTimeLeft(cfg.timerSeconds);
    setTimerActive(cfg.timerEnabled);
    setPhase('quiz');
  }, []);

  useEffect(() => {
    if (!timerActive || timeLeft <= 0) return;
    const id = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setTimerActive(false);
          setPhase('review');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [timerActive, timeLeft]);

  const handleAnswer = (index: number) => {
    if (showResult) return;
    setSelectedAnswer(index);
    setShowResult(true);
    const newAnswers = [...answers];
    newAnswers[currentIndex] = index;
    setAnswers(newAnswers);
    if (index === questions[currentIndex].correctIndex) setScore(prev => prev + 1);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setTimerActive(false);
      setPhase('review');
    }
  };

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  const diffColors: Record<string, string> = {
    basic: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    intermediate: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    advanced: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  };

  const availableCounts = useMemo(() => {
    const counts: Record<string, number> = { all: mcqBank.length, TRC: 0, DRC: 0, General: 0 };
    mcqBank.forEach(q => { counts[q.calculusType]++; });
    return counts;
  }, []);

  // SETUP PHASE
  if (phase === 'setup') {
    return (
      <div className="space-y-6 max-w-2xl mx-auto">
        <Card className="text-center py-6">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary-500 to-violet-600 rounded-2xl flex items-center justify-center">
            <Trophy size={32} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            Practice Quiz
          </h2>
          <p className="text-slate-600 dark:text-slate-300 mb-1">
            {mcqBank.length} questions across TRC, DRC, and general concepts
          </p>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Settings size={20} />
            Quiz Setup
          </h3>

          {/* Topic Filter */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              <Filter size={14} className="inline mr-1" />
              Topic
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(['all', 'TRC', 'DRC', 'General'] as QuizFilter[]).map(f => (
                <button
                  key={f}
                  onClick={() => setConfig(prev => ({ ...prev, filter: f }))}
                  className={`px-3 py-2 text-sm font-medium rounded-lg border transition-all ${
                    config.filter === f
                      ? 'bg-primary-600 text-white border-primary-600'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-primary-400'
                  }`}
                >
                  {f}
                  <span className="text-xs ml-1 opacity-70">({availableCounts[f]})</span>
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty Filter */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Difficulty
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(['all', 'basic', 'intermediate', 'advanced'] as const).map(d => (
                <button
                  key={d}
                  onClick={() => setConfig(prev => ({ ...prev, difficulty: d }))}
                  className={`px-3 py-2 text-sm font-medium rounded-lg border transition-all ${
                    config.difficulty === d
                      ? 'bg-primary-600 text-white border-primary-600'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-primary-400'
                  }`}
                >
                  {d.charAt(0).toUpperCase() + d.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Quiz Size */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              <Hash size={14} className="inline mr-1" />
              Number of Questions
            </label>
            <div className="flex gap-2 flex-wrap">
              {([10, 20, 30, 50, 100] as QuizSize[]).map(s => (
                <button
                  key={s}
                  onClick={() => setConfig(prev => ({ ...prev, size: s }))}
                  className={`px-4 py-2 text-sm font-medium rounded-lg border transition-all ${
                    config.size === s
                      ? 'bg-primary-600 text-white border-primary-600'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-primary-400'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Timer */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              <Clock size={14} className="inline mr-1" />
              Timer
            </label>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setConfig(prev => ({ ...prev, timerEnabled: !prev.timerEnabled }))}
                className={`px-4 py-2 text-sm font-medium rounded-lg border transition-all ${
                  config.timerEnabled
                    ? 'bg-amber-500 text-white border-amber-500'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                }`}
              >
                {config.timerEnabled ? 'Timer ON' : 'Timer OFF'}
              </button>
              {config.timerEnabled && (
                <div className="flex gap-2">
                  {[60, 120, 300, 600].map(s => (
                    <button
                      key={s}
                      onClick={() => setConfig(prev => ({ ...prev, timerSeconds: s }))}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                        config.timerSeconds === s
                          ? 'bg-amber-500 text-white border-amber-500'
                          : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {s < 60 ? `${s}s` : `${s / 60}m`}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Shuffle */}
          <div className="mb-6">
            <button
              onClick={() => setConfig(prev => ({ ...prev, shuffle: !prev.shuffle }))}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border transition-all ${
                config.shuffle
                  ? 'bg-violet-600 text-white border-violet-600'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
              }`}
            >
              <Shuffle size={14} />
              {config.shuffle ? 'Shuffle ON' : 'Shuffle OFF'}
            </button>
          </div>

          {/* Start Buttons */}
          <div className="flex gap-3">
            <Button onClick={() => startQuiz(config)} className="flex-1">
              <Play size={16} className="mr-2" />
              Start Custom Quiz
            </Button>
            <Button
              variant="secondary"
              onClick={() => startQuiz(DEFAULT_CONFIG)}
              className="flex-1"
            >
              <RotateCcw size={16} className="mr-2" />
              Quick Start (20 random)
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // QUIZ PHASE
  if (phase === 'quiz' && questions.length > 0) {
    const q = questions[currentIndex];
    return (
      <div className="space-y-4 max-w-2xl mx-auto">
        {/* Header bar */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-500 dark:text-slate-400">
            Question {currentIndex + 1} of {questions.length}
          </span>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
              Score: {score}
            </span>
            {config.timerEnabled && (
              <span className={`text-sm font-mono font-medium flex items-center gap-1 ${
                timeLeft < 30 ? 'text-red-500' : 'text-slate-600 dark:text-slate-400'
              }`}>
                <Clock size={14} />
                {formatTime(timeLeft)}
              </span>
            )}
          </div>
        </div>

        {/* Progress */}
        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
          <div
            className="h-2 bg-primary-600 dark:bg-primary-500 rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          />
        </div>

        {/* Question Card */}
        <Card>
          <div className="flex items-center gap-2 mb-3">
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${diffColors[q.difficulty]}`}>
              {q.difficulty}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">{q.calculusType}</span>
            <span className="text-xs text-slate-400 dark:text-slate-500">|</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">{q.topic}</span>
          </div>

          <p className="text-sm text-slate-800 dark:text-slate-200 whitespace-pre-wrap mb-4 font-medium">
            {q.question}
          </p>

          <div className="space-y-2">
            {q.options.map((option, index) => {
              const isSelected = selectedAnswer === index;
              const isCorrect = index === q.correctIndex;
              const showCorrect = showResult && isCorrect;
              const showWrong = showResult && isSelected && !isCorrect;
              return (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  disabled={showResult}
                  className={`w-full text-left p-3 rounded-lg border text-sm transition-all duration-200 ${
                    showCorrect
                      ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700 text-green-800 dark:text-green-300'
                      : showWrong
                      ? 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700 text-red-800 dark:text-red-300'
                      : isSelected
                      ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-300 dark:border-primary-700 text-primary-800 dark:text-primary-300'
                      : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-primary-300 dark:hover:border-primary-600'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {showCorrect && <CheckCircle size={16} className="text-green-500 flex-shrink-0" />}
                    {showWrong && <XCircle size={16} className="text-red-500 flex-shrink-0" />}
                    {!showResult && (
                      <span className="flex-shrink-0 w-5 h-5 border border-slate-300 dark:border-slate-600 rounded-full flex items-center justify-center text-xs">
                        {String.fromCharCode(65 + index)}
                      </span>
                    )}
                    <span>{option}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {showResult && (
            <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 animate-slide-up">
              <p className="text-sm text-slate-700 dark:text-slate-300">
                <strong>Explanation:</strong> {q.explanation}
              </p>
            </div>
          )}
        </Card>

        {showResult && (
          <div className="flex justify-end">
            <Button onClick={handleNext}>
              {currentIndex < questions.length - 1 ? (
                <>Next <ChevronRight size={16} className="ml-2" /></>
              ) : 'See Results'}
            </Button>
          </div>
        )}
      </div>
    );
  }

  // REVIEW PHASE
  const total = questions.length;
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;
  const correctAnswers = answers.filter((a, i) => a === questions[i]?.correctIndex).length;
  const wrongAnswers = total - correctAnswers;
  const timeTaken = config.timerEnabled ? config.timerSeconds - timeLeft : 0;

  const topicStats: Record<string, { correct: number; total: number }> = {};
  questions.forEach((q, i) => {
    if (!topicStats[q.topic]) topicStats[q.topic] = { correct: 0, total: 0 };
    topicStats[q.topic].total++;
    if (answers[i] === q.correctIndex) topicStats[q.topic].correct++;
  });

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <Card className="text-center py-8">
        <Trophy
          size={48}
          className={`mx-auto mb-4 ${percentage >= 70 ? 'text-amber-500' : 'text-slate-400 dark:text-slate-500'}`}
        />
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Quiz Complete!</h3>
        <p className="text-lg text-slate-600 dark:text-slate-300 mb-4">
          You scored <span className="font-bold text-primary-600 dark:text-primary-400">{score}</span> out of <span className="font-bold">{total}</span> ({percentage}%)
        </p>
        <div className="w-full max-w-xs mx-auto bg-slate-200 dark:bg-slate-700 rounded-full h-3 mb-4">
          <div
            className={`h-3 rounded-full transition-all duration-500 ${
              percentage >= 70 ? 'bg-green-500' : percentage >= 50 ? 'bg-amber-500' : 'bg-red-500'
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto mb-6 text-sm">
          <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="text-green-700 dark:text-green-400 font-bold text-lg">{correctAnswers}</div>
            <div className="text-green-600 dark:text-green-500">Correct</div>
          </div>
          <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <div className="text-red-700 dark:text-red-400 font-bold text-lg">{wrongAnswers}</div>
            <div className="text-red-600 dark:text-red-500">Wrong</div>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
            <div className="text-slate-700 dark:text-slate-300 font-bold text-lg">
              {config.timerEnabled ? formatTime(timeTaken) : '—'}
            </div>
            <div className="text-slate-500">Time</div>
          </div>
        </div>

        {/* Topic breakdown */}
        {Object.keys(topicStats).length > 0 && (
          <div className="max-w-sm mx-auto mb-6">
            <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 text-left">By Topic</h4>
            <div className="space-y-1">
              {Object.entries(topicStats).map(([topic, stat]) => (
                <div key={topic} className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                  <span>{topic}</span>
                  <span className="font-mono">{stat.correct}/{stat.total}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-3 justify-center">
          <Button onClick={() => startQuiz(config)}>
            <RotateCcw size={16} className="mr-2" />
            Retry Same Config
          </Button>
          <Button variant="secondary" onClick={() => setPhase('setup')}>
            <Settings size={16} className="mr-2" />
            New Quiz Setup
          </Button>
        </div>
      </Card>

      {/* Review wrong answers */}
      {wrongAnswers > 0 && (
        <Card>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            Review Incorrect Answers
          </h3>
          <div className="space-y-4">
            {questions.map((q, i) => {
              if (answers[i] === q.correctIndex) return null;
              return (
                <div key={q.id} className="p-4 bg-red-50 dark:bg-red-900/10 rounded-lg border border-red-200 dark:border-red-800">
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-200 mb-2">{q.question}</p>
                  <p className="text-xs text-red-600 dark:text-red-400 mb-1">
                    Your answer: {answers[i] !== null ? q.options[answers[i]] : 'No answer'}
                  </p>
                  <p className="text-xs text-green-600 dark:text-green-400 mb-2">
                    Correct: {q.options[q.correctIndex]}
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">{q.explanation}</p>
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
}
