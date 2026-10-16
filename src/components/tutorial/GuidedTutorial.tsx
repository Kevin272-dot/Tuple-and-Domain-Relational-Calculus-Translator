import { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import {
  GraduationCap, ChevronLeft, ChevronRight, Play, CheckCircle, Database,
  Braces, Sigma, Lightbulb, Trophy, Target, BookOpen, Zap,
} from 'lucide-react';
import { translateToSQL } from '../../engine/translator';
import { useApp } from '../../context/AppContext';
import { track } from '../../utils/achievementStore';

const TUTORIAL_KEY = 'trc-tutorial-step';

const TRY_QUERIES = {
  trc: '{T | T in Students and T.age > 20}',
  quantified: "{T.name | T in Students and exists E(E in Enrollment and E.student = T.name and E.course = 'DBMS')}",
};

export function GuidedTutorial() {
  const { setSharedQuery, setActiveTab } = useApp();
  const [step, setStep] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(TUTORIAL_KEY);
      return saved ? Math.min(parseInt(saved, 10) || 0, 6) : 0;
    } catch { return 0; }
  });
  const [tryQuery, setTryQuery] = useState(TRY_QUERIES.trc);
  const [tryResult, setTryResult] = useState<string>('');
  const [translated, setTranslated] = useState(false);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    try { localStorage.setItem(TUTORIAL_KEY, String(step)); } catch { /* ignore */ }
  }, [step]);

  const goTo = (i: number) => setStep(Math.max(0, Math.min(6, i)));

  const handleTryTranslate = () => {
    const result = translateToSQL(tryQuery);
    setTryResult(result.success ? result.sql : result.error || 'Translation failed.');
    if (result.success) setTranslated(true);
  };

  const handleFinish = () => {
    track('tutorial');
    setCompleted(true);
    goTo(6);
  };

  const loadIntoSimulator = (q: string) => {
    setSharedQuery(q);
    setActiveTab('simulator');
  };

  const stepTitles = [
    'Welcome to Relational Calculus',
    'Anatomy of a TRC Query',
    'Anatomy of a DRC Query',
    'Hands-On: Translate a Query',
    'Quantifiers: exists and forall',
    'Common Mistakes to Avoid',
    'You Did It',
  ];

  return (
    <div className="space-y-4 max-w-3xl mx-auto">
      {/* Progress */}
      <Card padding="sm">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <GraduationCap size={18} className="text-primary-600 dark:text-primary-400" />
            <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              {stepTitles[step]}
            </span>
          </div>
          <span className="text-xs text-slate-400">
            Step {step + 1} of 7
          </span>
        </div>
        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5">
          <div
            className="h-1.5 bg-primary-600 rounded-full transition-all duration-300"
            style={{ width: `${((step + 1) / 7) * 100}%` }}
          />
        </div>
      </Card>

      {/* STEP 0: Welcome */}
      {step === 0 && (
        <Card className="animate-fade-in">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
            What is Relational Calculus?
          </h3>
          <div className="space-y-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            <p>
              When you write a query, you can describe it in two very different ways:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
                <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-semibold mb-2">
                  <Sigma size={16} /> Procedural
                </div>
                <p className="text-xs">
                  Relational algebra: describe <strong>HOW</strong> to get the result — a recipe
                  of operations (select, project, join).
                </p>
              </div>
              <div className="p-4 bg-primary-50 dark:bg-primary-900/20 rounded-xl border border-primary-200 dark:border-primary-800">
                <div className="flex items-center gap-2 text-primary-700 dark:text-primary-400 font-semibold mb-2">
                  <Braces size={16} /> Non-procedural
                </div>
                <p className="text-xs">
                  Relational calculus: describe <strong>WHAT</strong> you want — just state the
                  condition the result must satisfy.
                </p>
              </div>
            </div>
            <p>
              Relational calculus comes in two equally powerful flavors: <strong>TRC</strong> (variables
              range over whole rows) and <strong>DRC</strong> (variables range over individual column
              values). SQL was designed around these ideas — and in this tutorial you will see exactly
              how a calculus query becomes SQL.
            </p>
          </div>
        </Card>
      )}

      {/* STEP 1: TRC anatomy */}
      {step === 1 && (
        <Card className="animate-fade-in">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
            Anatomy of a TRC Query
          </h3>
          <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 mb-4 font-mono text-sm text-center">
            <span className="text-primary-600 dark:text-primary-400 font-bold">{'{'}</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold px-1">T</span>
            <span className="text-primary-600 dark:text-primary-400 font-bold">{'|'}</span>{' '}
            <span className="text-cyan-600 dark:text-cyan-400">T in Students</span>{' '}
            <span className="text-violet-600 dark:text-violet-400 font-bold">and</span>{' '}
            <span className="text-amber-600 dark:text-amber-400">T.age &gt; 20</span>
            <span className="text-primary-600 dark:text-primary-400 font-bold">{'}'}</span>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex gap-3">
              <span className="w-20 flex-shrink-0 font-mono font-bold text-emerald-600 dark:text-emerald-400">T</span>
              <p className="text-slate-600 dark:text-slate-300">
                The <strong>tuple variable</strong> — a name for a whole row of the result.
                You choose the letter freely.
              </p>
            </div>
            <div className="flex gap-3">
              <span className="w-20 flex-shrink-0 font-mono text-cyan-600 dark:text-cyan-400">T in Students</span>
              <p className="text-slate-600 dark:text-slate-300">
                The <strong>membership</strong> — T ranges over tuples of the Students relation.
                This becomes the SQL <code className="font-mono">FROM Students</code>.
              </p>
            </div>
            <div className="flex gap-3">
              <span className="w-20 flex-shrink-0 font-mono text-amber-600 dark:text-amber-400">T.age &gt; 20</span>
              <p className="text-slate-600 dark:text-slate-300">
                The <strong>condition</strong> — only tuples satisfying it appear in the result.
                This becomes the SQL <code className="font-mono">WHERE age &gt; 20</code>.
              </p>
            </div>
          </div>
          <div className="mt-4 p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-700 dark:text-emerald-400">
            This exact query translates to: <code className="font-mono">SELECT * FROM Students WHERE age &gt; 20</code>
          </div>
        </Card>
      )}

      {/* STEP 2: DRC anatomy */}
      {step === 2 && (
        <Card className="animate-fade-in">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
            Anatomy of a DRC Query
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
            In Domain Relational Calculus, variables range over individual <strong>column values</strong>{' '}
            instead of whole rows:
          </p>
          <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 mb-4 font-mono text-sm text-center">
            <span className="text-primary-600 dark:text-primary-400 font-bold">{'{'}</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">&lt;name, age&gt;</span>
            <span className="text-primary-600 dark:text-primary-400 font-bold">{'|'}</span>{' '}
            <span className="text-cyan-600 dark:text-cyan-400">&lt;name, age, dept&gt; in Students</span>{' '}
            <span className="text-violet-600 dark:text-violet-400 font-bold">and</span>{' '}
            <span className="text-amber-600 dark:text-amber-400">dept = 'CS'</span>
            <span className="text-primary-600 dark:text-primary-400 font-bold">{'}'}</span>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex gap-3">
              <span className="w-32 flex-shrink-0 font-mono font-bold text-emerald-600 dark:text-emerald-400">&lt;name, age&gt;</span>
              <p className="text-slate-600 dark:text-slate-300">
                The <strong>result variables</strong> — which values appear in the answer
                (like the SELECT list).
              </p>
            </div>
            <div className="flex gap-3">
              <span className="w-32 flex-shrink-0 font-mono text-cyan-600 dark:text-cyan-400 text-xs">&lt;name, age, dept&gt; in Students</span>
              <p className="text-slate-600 dark:text-slate-300">
                The <strong>membership</strong> — the variables in angle brackets must match the
                relation's columns position by position (Students has 3 columns, so 3 variables).
              </p>
            </div>
          </div>
          <div className="mt-4 p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-700 dark:text-emerald-400">
            Translates to: <code className="font-mono">SELECT name, age FROM Students WHERE dept = 'CS'</code>
          </div>
        </Card>
      )}

      {/* STEP 3: Hands-on */}
      {step === 3 && (
        <Card className="animate-fade-in">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
            Hands-On: Translate It Yourself
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">
            Edit the query below and press <strong>Translate</strong> — or try one of your own.
          </p>
          <textarea
            value={tryQuery}
            onChange={(e) => { setTryQuery(e.target.value); setTranslated(false); setTryResult(''); }}
            className="w-full h-20 p-3 font-mono text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none mb-3"
          />
          <Button onClick={handleTryTranslate} disabled={!tryQuery.trim()} className="w-full mb-3">
            <Play size={16} className="mr-2" />
            Translate
          </Button>
          {tryResult && (
            <div className={`p-3 rounded-lg border font-mono text-sm whitespace-pre-wrap ${
              translated
                ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200'
                : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400'
            }`}>
              {tryResult}
            </div>
          )}
          {translated && (
            <div className="mt-3 flex items-center gap-2 text-xs text-green-600 dark:text-green-400">
              <CheckCircle size={14} />
              The calculus condition became the SQL WHERE clause.
            </div>
          )}
        </Card>
      )}

      {/* STEP 4: Quantifiers */}
      {step === 4 && (
        <Card className="animate-fade-in">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
            Quantifiers: exists and forall
          </h3>
          <div className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
            <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-200 dark:border-emerald-800">
              <div className="flex items-center gap-2 font-semibold text-emerald-700 dark:text-emerald-400 mb-2">
                <Database size={16} /> exists — "there is at least one"
              </div>
              <code className="block font-mono text-xs mb-2 break-words">
                {'{T.name | T in Students and exists E(E in Enrollment and E.student = T.name and E.course = \'DBMS\')}'}
              </code>
              <p className="text-xs">
                becomes <code className="font-mono">WHERE EXISTS (SELECT * FROM Enrollment WHERE ...)</code> —
                a correlated subquery.
              </p>
            </div>
            <div className="p-4 bg-violet-50 dark:bg-violet-900/20 rounded-xl border border-violet-200 dark:border-violet-800">
              <div className="flex items-center gap-2 font-semibold text-violet-700 dark:text-violet-400 mb-2">
                <Target size={16} /> forall — "for every"
              </div>
              <code className="block font-mono text-xs mb-2 break-words">
                {'{T.name | forall E(E in Enrollment implies T.name = E.student → E.grade = \'A\')}'}
              </code>
              <p className="text-xs">
                SQL has no <code className="font-mono">forall</code>! It becomes a double negation:
                <code className="font-mono"> NOT EXISTS (... WHERE NOT (...))</code>.
              </p>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Tip: "takes all courses" queries always use the pattern{' '}
              <code className="font-mono">forall C(... implies exists E(...))</code>.
            </p>
          </div>
          <div className="mt-4">
            <Button variant="secondary" onClick={() => loadIntoSimulator(TRY_QUERIES.quantified)} className="w-full">
              <Zap size={16} className="mr-2" />
              Load the quantified example into the Simulator
            </Button>
          </div>
        </Card>
      )}

      {/* STEP 5: Mistakes */}
      {step === 5 && (
        <Card className="animate-fade-in">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
            Common Mistakes to Avoid
          </h3>
          <div className="space-y-3">
            {[
              { wrong: 'T in Students ∧ T.age > 20', right: 'Use the keyword "and" — symbols work but text is clearer' },
              { wrong: '{T | Students and T.age > 20}', right: 'Missing "in" — write T in Students' },
              { wrong: 'exists E E.course = \'DBMS\'', right: 'Quantifiers need parentheses: exists E(...)' },
              { wrong: 'forall E(E.grade = \'A\')', right: 'Use implies for conditions: E in Enrollment implies ...' },
            ].map((m, i) => (
              <div key={i} className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
                <div className="flex items-start gap-2 text-xs">
                  <span className="font-mono text-red-600 dark:text-red-400 break-all">{m.wrong}</span>
                </div>
                <div className="flex items-start gap-2 text-xs mt-1 text-green-600 dark:text-green-400">
                  <CheckCircle size={12} className="flex-shrink-0 mt-0.5" />
                  <span className="text-slate-600 dark:text-slate-300">{m.right}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
            <Lightbulb size={14} className="text-amber-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700 dark:text-amber-400">
              The full gallery with live examples lives in the Learn tab, under Mistakes.
            </p>
          </div>
        </Card>
      )}

      {/* STEP 6: Finish */}
      {step === 6 && (
        <Card className="animate-fade-in text-center">
          <Trophy size={48} className="mx-auto mb-4 text-amber-500" />
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            Tutorial Complete
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-300 mb-6">
            You now know how TRC and DRC queries are structured, how they become SQL, and how
            quantifiers work. Here is where to go next:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
            <button
              onClick={() => setActiveTab('simulator')}
              className="p-4 bg-primary-50 dark:bg-primary-900/20 rounded-xl border border-primary-200 dark:border-primary-800 hover:border-primary-400 transition-colors"
            >
              <Braces size={18} className="text-primary-600 dark:text-primary-400 mb-2" />
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Simulator</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Translate your own queries</p>
            </button>
            <button
              onClick={() => setActiveTab('practice')}
              className="p-4 bg-violet-50 dark:bg-violet-900/20 rounded-xl border border-violet-200 dark:border-violet-800 hover:border-violet-400 transition-colors"
            >
              <Target size={18} className="text-violet-600 dark:text-violet-400 mb-2" />
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Quiz & Exam Prep</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">GATE and UGC NET questions</p>
            </button>
            <button
              onClick={() => setActiveTab('learn')}
              className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800 hover:border-amber-400 transition-colors"
            >
              <BookOpen size={18} className="text-amber-600 dark:text-amber-400 mb-2" />
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Deep Dive</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Concepts, videos, references</p>
            </button>
          </div>
          {!completed && (
            <Button onClick={handleFinish} className="mt-6">
              <Trophy size={16} className="mr-2" />
              Claim the Graduate badge
            </Button>
          )}
          {completed && (
            <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm font-medium">
              <CheckCircle size={16} />
              Graduate badge unlocked — see it in Practice, Rewards
            </div>
          )}
        </Card>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button variant="secondary" onClick={() => goTo(step - 1)} disabled={step === 0}>
          <ChevronLeft size={16} className="mr-2" />
          Back
        </Button>
        {step < 6 && (
          <Button onClick={() => goTo(step + 1)}>
            Next
            <ChevronRight size={16} className="ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
}
