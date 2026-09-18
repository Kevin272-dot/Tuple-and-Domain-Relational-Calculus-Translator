import { useState, useMemo, useEffect, useCallback } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import {
  competitiveQuestionBank, CompetitiveQuestion
} from '../../engine/gateQuestionBank';
import {
  CheckCircle, XCircle, RotateCcw, Trophy, ChevronRight, Clock,
  Settings, Filter, Play, Pause, Shuffle, Award, BookOpen, Building2
} from 'lucide-react';

type ExamFilter = 'all' | 'GATE' | 'UGC NET' | 'ISRO' | 'BARC' | 'IES';
type TopicFilter = 'all' | 'TRC' | 'DRC' | 'Relational Algebra' | 'SQL' | 'General';
type DifficultyFilter = 'all' | 'easy' | 'medium' | 'hard';

interface ExamConfig {
  examFilter: ExamFilter;
  topicFilter: TopicFilter;
  difficultyFilter: DifficultyFilter;
  timerEnabled: boolean;
  timerSeconds: number;
  shuffle: boolean;
  size: number;
}

const DEFAULT_CONFIG: ExamConfig = {
  examFilter: 'all',
  topicFilter: 'all',
  difficultyFilter: 'all',
  timerEnabled: false,
  timerSeconds: 600,
  shuffle: true,
  size: 20,
};

const EXAM_LOGOS: Record<string, string> = {
  'GATE': 'G',
  'UGC NET': 'U',
  'ISRO': 'I',
  'BARC': 'B',
  'IES': 'E',
};

const EXAM_COLORS: Record<string, string> = {
  'GATE': 'from-blue-500 to-indigo-600',
  'UGC NET': 'from-emerald-500 to-teal-600',
  'ISRO': 'from-orange-500 to-red-600',
  'BARC': 'from-violet-500 to-purple-600',
  'IES': 'from-amber-500 to-orange-600',
};

export function CompetitiveExam() {
  const [phase, setPhase] = useState<'setup' | 'quiz' | 'review'>('setup');
  const [config, setConfig] = useState<ExamConfig>(DEFAULT_CONFIG);
  const [questions, setQuestions] = useState<CompetitiveQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [showSolutions, setShowSolutions] = useState(false);

  const availableCounts = useMemo(() => {
    const counts: Record<string, number> = { all: competitiveQuestionBank.length };
    competitiveQuestionBank.forEach(q => {
      counts[q.exam] = (counts[q.exam] || 0) + 1;
    });
    return counts;
  }, []);

  const availableTopics = useMemo(() => {
    const topics: Record<string, number> = { all: competitiveQuestionBank.length };
    competitiveQuestionBank.forEach(q => {
      topics[q.topic] = (topics[q.topic] || 0) + 1;
    });
    return topics;
  }, []);

  const startQuiz = useCallback((cfg: ExamConfig) => {
    setConfig(cfg);
    let pool = [...competitiveQuestionBank];
    if (cfg.examFilter !== 'all') pool = pool.filter(q => q.exam === cfg.examFilter);
    if (cfg.topicFilter !== 'all') pool = pool.filter(q => q.topic === cfg.topicFilter);
    if (cfg.difficultyFilter !== 'all') pool = pool.filter(q => q.difficulty === cfg.difficultyFilter);
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
    setShowSolutions(false);
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
    easy: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    hard: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  };

  const examBadgeColors: Record<string, string> = {
    'GATE': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    'UGC NET': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    'ISRO': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    'BARC': 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400',
    'IES': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  };

  // SETUP PHASE
  if (phase === 'setup') {
    return (
      <div className="space-y-6 max-w-3xl mx-auto">
        <Card className="text-center py-6">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center">
            <Building2 size={32} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            Competitive Exam Practice
          </h2>
          <p className="text-slate-600 dark:text-slate-300 mb-1">
            {competitiveQuestionBank.length} questions from GATE, UGC NET, ISRO, BARC, and IES
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Practice previous year questions on Relational Calculus, SQL, and Database concepts
          </p>
        </Card>

        {/* Exam Cards Preview */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {(['GATE', 'UGC NET', 'ISRO', 'BARC', 'IES'] as ExamFilter[]).map(exam => {
            const count = competitiveQuestionBank.filter(q => q.exam === exam).length;
            return (
              <button
                key={exam}
                onClick={() => setConfig(prev => ({ ...prev, examFilter: exam }))}
                className={`p-3 rounded-xl border-2 transition-all text-center ${
                  config.examFilter === exam
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                }`}
              >
                <div className={`w-10 h-10 mx-auto mb-2 rounded-lg bg-gradient-to-br ${EXAM_COLORS[exam]} flex items-center justify-center text-white font-bold text-sm`}>
                  {EXAM_LOGOS[exam]}
                </div>
                <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">{exam}</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">{count} Qs</div>
              </button>
            );
          })}
        </div>

        <Card>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Settings size={20} />
            Quiz Configuration
          </h3>

          {/* Exam Filter */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              <Building2 size={14} className="inline mr-1" />
              Exam Source
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
              {(['all', 'GATE', 'UGC NET', 'ISRO', 'BARC', 'IES'] as ExamFilter[]).map(f => (
                <button
                  key={f}
                  onClick={() => setConfig(prev => ({ ...prev, examFilter: f }))}
                  className={`px-3 py-2 text-sm font-medium rounded-lg border transition-all ${
                    config.examFilter === f
                      ? 'bg-primary-600 text-white border-primary-600'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-primary-400'
                  }`}
                >
                  {f === 'all' ? 'All' : f}
                  <span className="text-xs ml-1 opacity-70">({f === 'all' ? competitiveQuestionBank.length : availableCounts[f] || 0})</span>
                </button>
              ))}
            </div>
          </div>

          {/* Topic Filter */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              <Filter size={14} className="inline mr-1" />
              Topic
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
              {(['all', 'TRC', 'DRC', 'Relational Algebra', 'SQL', 'General'] as TopicFilter[]).map(f => (
                <button
                  key={f}
                  onClick={() => setConfig(prev => ({ ...prev, topicFilter: f }))}
                  className={`px-3 py-2 text-sm font-medium rounded-lg border transition-all ${
                    config.topicFilter === f
                      ? 'bg-primary-600 text-white border-primary-600'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-primary-400'
                  }`}
                >
                  {f === 'all' ? 'All' : f}
                  <span className="text-xs ml-1 opacity-70">({f === 'all' ? competitiveQuestionBank.length : availableTopics[f] || 0})</span>
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Difficulty
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(['all', 'easy', 'medium', 'hard'] as DifficultyFilter[]).map(d => (
                <button
                  key={d}
                  onClick={() => setConfig(prev => ({ ...prev, difficultyFilter: d }))}
                  className={`px-3 py-2 text-sm font-medium rounded-lg border transition-all ${
                    config.difficultyFilter === d
                      ? 'bg-primary-600 text-white border-primary-600'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-primary-400'
                  }`}
                >
                  {d.charAt(0).toUpperCase() + d.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Number of Questions */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Number of Questions
            </label>
            <div className="flex gap-2 flex-wrap">
              {[10, 20, 30, 50].map(s => {
                const maxAvailable = competitiveQuestionBank.filter(q => {
                  if (config.examFilter !== 'all' && q.exam !== config.examFilter) return false;
                  if (config.topicFilter !== 'all' && q.topic !== config.topicFilter) return false;
                  if (config.difficultyFilter !== 'all' && q.difficulty !== config.difficultyFilter) return false;
                  return true;
                }).length;
                return (
                  <button
                    key={s}
                    onClick={() => setConfig(prev => ({ ...prev, size: s }))}
                    disabled={s > maxAvailable}
                    className={`px-4 py-2 text-sm font-medium rounded-lg border transition-all ${
                      config.size === s
                        ? 'bg-primary-600 text-white border-primary-600'
                        : s > maxAvailable
                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700 cursor-not-allowed'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-primary-400'
                    }`}
                  >
                    {s}
                  </button>
                );
              })}
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
                  {[120, 300, 600, 900].map(s => (
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
              Start Practice
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
      <div className="space-y-4 max-w-3xl mx-auto">
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
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${examBadgeColors[q.exam]}`}>
              {q.exam} {q.year}
            </span>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${diffColors[q.difficulty]}`}>
              {q.difficulty}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">{q.topic}</span>
            {q.marks && (
              <span className="text-xs text-slate-400 dark:text-slate-500">| {q.marks} mark{q.marks > 1 ? 's' : ''}</span>
            )}
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
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                Source: {q.exam} {q.year} {q.marks ? `| ${q.marks} mark${q.marks > 1 ? 's' : ''}` : ''}
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

  const examStats: Record<string, { correct: number; total: number }> = {};
  questions.forEach((q, i) => {
    if (!examStats[q.exam]) examStats[q.exam] = { correct: 0, total: 0 };
    examStats[q.exam].total++;
    if (answers[i] === q.correctIndex) examStats[q.exam].correct++;
  });

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <Card className="text-center py-8">
        <Trophy
          size={48}
          className={`mx-auto mb-4 ${percentage >= 70 ? 'text-amber-500' : 'text-slate-400 dark:text-slate-500'}`}
        />
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Practice Complete!</h3>
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

        {/* Exam breakdown */}
        {Object.keys(examStats).length > 0 && (
          <div className="max-w-sm mx-auto mb-6">
            <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 text-left">By Exam</h4>
            <div className="space-y-1">
              {Object.entries(examStats).map(([exam, stat]) => (
                <div key={exam} className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                  <span>{exam}</span>
                  <span className="font-mono">{stat.correct}/{stat.total}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-3 justify-center flex-wrap">
          <Button onClick={() => startQuiz(config)}>
            <RotateCcw size={16} className="mr-2" />
            Retry Same Config
          </Button>
          <Button variant="secondary" onClick={() => setPhase('setup')}>
            <Settings size={16} className="mr-2" />
            New Setup
          </Button>
          {wrongAnswers > 0 && (
            <Button variant="secondary" onClick={() => setShowSolutions(!showSolutions)}>
              <BookOpen size={16} className="mr-2" />
              {showSolutions ? 'Hide Solutions' : 'Review Solutions'}
            </Button>
          )}
        </div>
      </Card>

      {/* Review wrong answers */}
      {showSolutions && wrongAnswers > 0 && (
        <Card>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            Review Incorrect Answers
          </h3>
          <div className="space-y-4">
            {questions.map((q, i) => {
              if (answers[i] === q.correctIndex) return null;
              return (
                <div key={q.id} className="p-4 bg-red-50 dark:bg-red-900/10 rounded-lg border border-red-200 dark:border-red-800">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${examBadgeColors[q.exam]}`}>
                      {q.exam} {q.year}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${diffColors[q.difficulty]}`}>
                      {q.difficulty}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-200 mb-2 whitespace-pre-wrap">{q.question}</p>
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
