import { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Undo2, Database, Braces, Copy, Check, AlertCircle, Info } from 'lucide-react';
import { sqlToCalculus } from '../../engine/sqlToCalculus';

const SQL_EXAMPLES = [
  'SELECT * FROM Students WHERE age > 20',
  "SELECT name FROM Students WHERE dept = 'CS' AND gpa >= 3.5",
  "SELECT name FROM Students S WHERE EXISTS (SELECT * FROM Enrollment WHERE student = S.name AND course = 'DBMS')",
  "SELECT name FROM Students WHERE name IN (SELECT student FROM Enrollment WHERE grade = 'A') AND age > 20",
  "SELECT * FROM Students S WHERE NOT EXISTS (SELECT * FROM Enrollment E WHERE E.student = S.name AND E.course = 'OS')",
];

export function SqlToCalculus() {
  const [sql, setSql] = useState(SQL_EXAMPLES[0]);
  const [result, setResult] = useState<ReturnType<typeof sqlToCalculus> | null>(null);
  const [copied, setCopied] = useState<'trc' | 'drc' | null>(null);

  const handleConvert = () => {
    setResult(sqlToCalculus(sql));
  };

  const handleCopy = (text: string, which: 'trc' | 'drc') => {
    navigator.clipboard.writeText(text);
    setCopied(which);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="space-y-4">
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <Undo2 size={20} className="text-emerald-600 dark:text-emerald-400" />
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            Reverse Mode: SQL to TRC / DRC
          </h3>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
          Paste a SQL query and get the equivalent Tuple and Domain Relational Calculus queries —
          the reverse direction of the translator.
        </p>

        <textarea
          value={sql}
          onChange={(e) => { setSql(e.target.value); setResult(null); }}
          placeholder="SELECT name FROM Students WHERE age > 20"
          className="w-full h-24 p-3 font-mono text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none mb-3"
        />

        <div className="flex flex-wrap gap-2 mb-3">
          {SQL_EXAMPLES.map((ex, i) => (
            <button
              key={i}
              onClick={() => { setSql(ex); setResult(null); }}
              className="px-2.5 py-1 text-xs font-mono bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors truncate max-w-xs"
            >
              {ex.length > 46 ? ex.slice(0, 46) + '...' : ex}
            </button>
          ))}
        </div>

        <Button onClick={handleConvert} disabled={!sql.trim()} className="w-full">
          <Undo2 size={16} className="mr-2" />
          Convert to TRC and DRC
        </Button>

        {result && !result.success && result.error && (
          <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-2">
            <AlertCircle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700 dark:text-red-400">{result.error}</p>
          </div>
        )}

        <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 flex items-start gap-2">
          <Info size={14} className="text-slate-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Supported SQL subset: SELECT [DISTINCT] columns FROM table [alias] WHERE ... with
            comparisons, AND/OR/NOT, [NOT] EXISTS and [NOT] IN subqueries. Table aliases can be
            referenced from subqueries (correlated queries).
          </p>
        </div>
      </Card>

      {result && result.success && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-slide-up">
            <Card>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-primary-600 dark:text-primary-400">
                  <Braces size={16} />
                  TRC Query
                </div>
                <button
                  onClick={() => handleCopy(result.trc, 'trc')}
                  className="flex items-center gap-1 text-xs text-slate-500 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400"
                >
                  {copied === 'trc' ? <><Check size={12} /> Copied</> : <><Copy size={12} /> Copy</>}
                </button>
              </div>
              <pre className="p-3 rounded-lg border font-mono text-sm whitespace-pre-wrap break-words bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-800 text-primary-800 dark:text-primary-200">
                {result.trc}
              </pre>
            </Card>

            <Card>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-violet-600 dark:text-violet-400">
                  <Braces size={16} />
                  DRC Query
                </div>
                <button
                  onClick={() => handleCopy(result.drc, 'drc')}
                  className="flex items-center gap-1 text-xs text-slate-500 hover:text-violet-600 dark:text-slate-400 dark:hover:text-violet-400"
                >
                  {copied === 'drc' ? <><Check size={12} /> Copied</> : <><Copy size={12} /> Copy</>}
                </button>
              </div>
              {result.drc.startsWith('DRC conversion unavailable:') ? (
                <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                  <p className="text-sm text-amber-700 dark:text-amber-400">{result.drc}</p>
                  <p className="text-xs text-amber-600 dark:text-amber-500 mt-1">
                    DRC conversion relies on the sample schema (Students, Enrollment, Enrolls, RequiredCourses).
                  </p>
                </div>
              ) : (
                <pre className="p-3 rounded-lg border font-mono text-sm whitespace-pre-wrap break-words bg-violet-50 dark:bg-violet-900/20 border-violet-200 dark:border-violet-800 text-violet-800 dark:text-violet-200">
                  {result.drc}
                </pre>
              )}
            </Card>
          </div>

          {result.steps.length > 0 && (
            <Card>
              <div className="flex items-center gap-2 mb-3">
                <Database size={16} className="text-emerald-600 dark:text-emerald-400" />
                <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  How the reverse translation works
                </h4>
              </div>
              <div className="space-y-2">
                {result.steps.map((step, i) => (
                  <div key={i} className="flex gap-3 p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
                    <div className="flex-shrink-0 w-6 h-6 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-full flex items-center justify-center text-xs font-bold">
                      {i + 1}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{step.title}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{step.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
