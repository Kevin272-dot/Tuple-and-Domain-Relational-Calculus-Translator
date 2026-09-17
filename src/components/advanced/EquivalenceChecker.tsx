import { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Scale, AlertCircle, CheckCircle, ArrowRight } from 'lucide-react';
import { translateToSQL } from '../../engine/translator';

export function EquivalenceChecker() {
  const [query1, setQuery1] = useState('');
  const [query2, setQuery2] = useState('');
  const [result, setResult] = useState<{
    equivalent: boolean;
    sql1: string;
    sql2: string;
    normalized1: string;
    normalized2: string;
    explanation: string;
  } | null>(null);

  const checkEquivalence = () => {
    if (!query1.trim() || !query2.trim()) return;

    const r1 = translateToSQL(query1);
    const r2 = translateToSQL(query2);

    if (!r1.success || !r2.success) {
      setResult({
        equivalent: false,
        sql1: r1.sql || 'Parse error',
        sql2: r2.sql || 'Parse error',
        normalized1: '',
        normalized2: '',
        explanation: 'One or both queries have syntax errors. Fix them before checking equivalence.',
      });
      return;
    }

    const norm1 = normalizeSQL(r1.sql);
    const norm2 = normalizeSQL(r2.sql);
    const equivalent = norm1 === norm2;

    let explanation = '';
    if (equivalent) {
      explanation = 'These two queries are logically equivalent. They produce the same result set.';
    } else {
      explanation = 'These queries produce different SQL. They may not be equivalent. Check the conditions and projections carefully.';
    }

    setResult({
      equivalent,
      sql1: r1.sql,
      sql2: r2.sql,
      normalized1: norm1,
      normalized2: norm2,
      explanation,
    });
  };

  return (
    <Card>
      <div className="flex items-center gap-2 mb-4">
        <Scale size={20} className="text-violet-600 dark:text-violet-400" />
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
          Equivalence Checker
        </h3>
      </div>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
        Input two TRC/DRC queries to check if they are logically equivalent.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
            Query 1
          </label>
          <textarea
            value={query1}
            onChange={(e) => setQuery1(e.target.value)}
            placeholder="{T | T in Students AND T.age > 20}"
            className="w-full h-24 p-3 font-mono text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
            Query 2
          </label>
          <textarea
            value={query2}
            onChange={(e) => setQuery2(e.target.value)}
            placeholder="{T | T in Students AND T.age >= 21}"
            className="w-full h-24 p-3 font-mono text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
          />
        </div>
      </div>

      <Button onClick={checkEquivalence} disabled={!query1.trim() || !query2.trim()} className="w-full">
        <Scale size={16} className="mr-2" />
        Check Equivalence
      </Button>

      {result && (
        <div className="mt-4 space-y-3 animate-slide-up">
          <div className={`p-3 rounded-lg border ${
            result.equivalent
              ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
              : 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800'
          }`}>
            <div className="flex items-center gap-2">
              {result.equivalent ? (
                <CheckCircle size={16} className="text-green-500" />
              ) : (
                <AlertCircle size={16} className="text-amber-500" />
              )}
              <span className={`text-sm font-medium ${
                result.equivalent
                  ? 'text-green-700 dark:text-green-400'
                  : 'text-amber-700 dark:text-amber-400'
              }`}>
                {result.equivalent ? 'Queries are Equivalent' : 'Queries may NOT be Equivalent'}
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{result.explanation}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">SQL 1</p>
              <pre className="text-xs font-mono text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{result.sql1}</pre>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">SQL 2</p>
              <pre className="text-xs font-mono text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{result.sql2}</pre>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}

function normalizeSQL(sql: string): string {
  return sql
    .replace(/;\s*$/, '')
    .replace(/\s+/g, ' ')
    .replace(/\s*,\s*/g, ',')
    .replace(/\s*\(\s*/g, '(')
    .replace(/\s*\)\s*/g, ')')
    .toLowerCase()
    .trim();
}
