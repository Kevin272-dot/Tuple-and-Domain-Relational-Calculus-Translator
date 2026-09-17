import { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Brain, Clock, CheckCircle, ArrowRight } from 'lucide-react';

interface ReviewCard {
  id: string;
  concept: string;
  question: string;
  answer: string;
  lastReviewed: number;
  nextReview: number;
  easeFactor: number;
  interval: number;
  repetitions: number;
}

const CONCEPTS: Omit<ReviewCard, 'lastReviewed' | 'nextReview' | 'easeFactor' | 'interval' | 'repetitions'>[] = [
  { id: 'trc-syntax', concept: 'TRC Syntax', question: 'What is the basic syntax of a TRC query?', answer: '{TupleVariable | Condition} — e.g., {T | T in Students AND T.age > 20}' },
  { id: 'drc-syntax', concept: 'DRC Syntax', question: 'What is the basic syntax of a DRC query?', answer: '{<DomainVars> | Condition} — e.g., {<name, age> | <name, age, dept> in Students}' },
  { id: 'exists', concept: 'Existential Quantifier', question: 'How does EXISTS translate to SQL?', answer: 'EXISTS (SELECT * FROM R WHERE condition)' },
  { id: 'forall', concept: 'Universal Quantifier', question: 'How does FORALL translate to SQL?', answer: 'NOT EXISTS (SELECT * FROM R WHERE NOT condition)' },
  { id: 'implies', concept: 'Implication', question: 'How is P implies Q translated?', answer: 'NOT P OR Q — implication is materialized as a disjunction' },
  { id: 'membership', concept: 'Membership (in)', question: 'What does T in R translate to in SQL?', answer: 'FROM R (for the main relation) or IN R (for subqueries)' },
  { id: 'conjunction', concept: 'Conjunction', question: 'What is the SQL equivalent of AND in TRC?', answer: 'AND' },
  { id: 'disjunction', concept: 'Disjunction', question: 'What is the SQL equivalent of OR in TRC?', answer: 'OR' },
  { id: 'negation', concept: 'Negation', question: 'What is the SQL equivalent of NOT in TRC?', answer: 'NOT' },
  { id: 'projection', concept: 'Projection', question: 'How do you project specific attributes in TRC?', answer: '{T.name | ...} → SELECT name FROM ...' },
  { id: 'iff', concept: 'Biconditional', question: 'How is P iff Q translated?', answer: '(P AND Q) OR (NOT P AND NOT Q) — equivalent to P = Q' },
  { id: 'trc-vs-drc', concept: 'TRC vs DRC', question: 'What is the key difference between TRC and DRC?', answer: 'TRC variables range over tuples (rows), DRC variables range over domains (column values)' },
];

function createInitialCards(): ReviewCard[] {
  const now = Date.now();
  return CONCEPTS.map((c) => ({
    ...c,
    lastReviewed: 0,
    nextReview: now,
    easeFactor: 2.5,
    interval: 1,
    repetitions: 0,
  }));
}

function getNextInterval(card: ReviewCard, quality: number): { interval: number; easeFactor: number } {
  let { easeFactor, interval, repetitions } = card;

  if (quality >= 3) {
    if (repetitions === 0) interval = 1;
    else if (repetitions === 1) interval = 6;
    else interval = Math.round(interval * easeFactor);
    repetitions += 1;
  } else {
    repetitions = 0;
    interval = 1;
  }

  easeFactor = Math.max(1.3, easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)));

  return { interval, easeFactor };
}

export function SpacedRepetition() {
  const [cards, setCards] = useState<ReviewCard[]>(() => {
    try {
      const saved = localStorage.getItem('trc-spaced-repetition');
      if (saved) return JSON.parse(saved);
    } catch { /* ignore */ }
    return createInitialCards();
  });
  const [showAnswer, setShowAnswer] = useState(false);
  const [currentCard, setCurrentCard] = useState<ReviewCard | null>(null);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [reviewedCount, setReviewedCount] = useState(0);

  useEffect(() => {
    localStorage.setItem('trc-spaced-repetition', JSON.stringify(cards));
  }, [cards]);

  const getDueCards = () => {
    const now = Date.now();
    return cards.filter((c) => c.nextReview <= now);
  };

  const startSession = () => {
    const due = getDueCards();
    if (due.length === 0) {
      setSessionComplete(true);
      return;
    }
    setCurrentCard(due[0]);
    setShowAnswer(false);
    setReviewedCount(0);
    setSessionComplete(false);
  };

  const rateCard = (quality: number) => {
    if (!currentCard) return;

    const now = Date.now();
    const { interval, easeFactor } = getNextInterval(currentCard, quality);
    const cardId = currentCard.id;

    setCards((prev) =>
      prev.map((c) =>
        c.id === cardId
          ? {
              ...c,
              lastReviewed: now,
              nextReview: now + interval * 24 * 60 * 60 * 1000,
              interval,
              easeFactor,
              repetitions: quality >= 3 ? c.repetitions + 1 : 0,
            }
          : c
      )
    );

    setReviewedCount((prev) => prev + 1);

    const remaining = getDueCards().filter((c) => c.id !== cardId);
    if (remaining.length > 0) {
      setCurrentCard(remaining[0]);
      setShowAnswer(false);
    } else {
      setCurrentCard(null);
      setSessionComplete(true);
    }
  };

  const dueCount = getDueCards().length;

  if (!currentCard && !sessionComplete) {
    return (
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <Brain size={20} className="text-violet-600 dark:text-violet-400" />
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Spaced Repetition Review</h3>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
          Review concepts at optimal intervals for long-term retention.
        </p>
        <div className="text-center py-4">
          <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">{dueCount}</div>
          <div className="text-sm text-slate-500 dark:text-slate-400 mb-4">cards due for review</div>
          <Button onClick={startSession} disabled={dueCount === 0}>
            <Brain size={16} className="mr-2" />
            Start Review Session
          </Button>
          {dueCount === 0 && (
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-3">All caught up! Come back later for more reviews.</p>
          )}
        </div>
      </Card>
    );
  }

  if (sessionComplete) {
    return (
      <Card className="text-center py-8">
        <CheckCircle size={48} className="mx-auto mb-4 text-green-500" />
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Session Complete!</h3>
        <p className="text-slate-600 dark:text-slate-300 mb-4">
          You reviewed {reviewedCount} cards.
        </p>
        <Button onClick={() => { setSessionComplete(false); setCurrentCard(null); }}>
          Back to Review
        </Button>
      </Card>
    );
  }

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Brain size={20} className="text-violet-600 dark:text-violet-400" />
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Spaced Repetition</h3>
        </div>
        <span className="text-sm text-slate-500 dark:text-slate-400">
          {reviewedCount} reviewed
        </span>
      </div>

      <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 mb-4">
        <div className="text-xs text-slate-500 dark:text-slate-400 mb-2">{currentCard?.concept}</div>
        <p className="text-sm font-medium text-slate-800 dark:text-slate-200 mb-4">{currentCard?.question}</p>

        {!showAnswer ? (
          <Button onClick={() => setShowAnswer(true)} className="w-full">
            Show Answer
          </Button>
        ) : (
          <div className="animate-slide-up">
            <p className="text-sm text-primary-700 dark:text-primary-300 p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg mb-4">
              {currentCard?.answer}
            </p>
            <div className="flex gap-2">
              <Button onClick={() => rateCard(1)} variant="danger" className="flex-1" size="sm">
                Again
              </Button>
              <Button onClick={() => rateCard(3)} variant="secondary" className="flex-1" size="sm">
                Good
              </Button>
              <Button onClick={() => rateCard(5)} className="flex-1" size="sm">
                Easy
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
