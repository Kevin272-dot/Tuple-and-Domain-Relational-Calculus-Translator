import { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Play, Table, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { translateToSQL } from '../../engine/translator';
import { evaluateQuery, EvaluationResult } from '../../engine/evaluator';
import { parseQuery } from '../../engine/parser';
import { DataTable } from '../ui/DataTable';

export function ExecutePanel() {
  const { userSchema, selectedCalculus } = useApp();
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<EvaluationResult | null>(null);
  const [sql, setSql] = useState('');
  const [error, setError] = useState('');

  const handleExecute = () => {
    if (!query.trim()) return;
    setError('');
    setResult(null);
    setSql('');

    const translation = translateToSQL(query);
    if (!translation.success) {
      setError(translation.error || 'Translation failed.');
      return;
    }
    setSql(translation.sql);

    try {
      const ast = parseQuery(query);
      const evalResult = evaluateQuery(ast, userSchema);
      setResult(evalResult);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Evaluation failed.');
    }
  };

  return (
    <Card>
      <div className="flex items-center gap-2 mb-4">
        <Play size={20} className="text-emerald-600 dark:text-emerald-400" />
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
          Execute Query
        </h3>
      </div>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
        Run your TRC/DRC query against the schema you defined. Results appear as a table below.
      </p>

      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium">
          {selectedCalculus}
        </span>
        <span className="text-xs text-slate-400">
          {userSchema.length} table{userSchema.length !== 1 ? 's' : ''} defined
        </span>
      </div>

      <textarea
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleExecute();
        }}
        placeholder={selectedCalculus === 'TRC'
          ? '{T | T in Students AND T.age > 20}'
          : "{<name, age> | <name, age, dept> in Students AND dept = 'CS'}"
        }
        className="w-full h-24 p-3 font-mono text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none mb-3"
      />

      <Button onClick={handleExecute} disabled={!query.trim()} className="w-full">
        <Play size={16} className="mr-2" />
        Run Query (Ctrl+Enter)
      </Button>

      {error && (
        <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-2">
          <AlertCircle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
        </div>
      )}

      {sql && (
        <div className="mt-3 p-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg">
          <p className="text-xs font-medium text-emerald-700 dark:text-emerald-400 mb-1">Generated SQL</p>
          <pre className="text-xs font-mono text-emerald-800 dark:text-emerald-300 whitespace-pre-wrap">{sql}</pre>
        </div>
      )}

      {result && (
        <div className="mt-4 animate-slide-up">
          {result.success ? (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Table size={16} className="text-primary-500" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {result.rowCount} row{result.rowCount !== 1 ? 's' : ''} returned
                </span>
              </div>
              {result.rows.length > 0 ? (
                <DataTable columns={result.columns} rows={result.rows} />
              ) : (
                <p className="text-sm text-slate-500 dark:text-slate-400 p-4 text-center bg-slate-50 dark:bg-slate-900 rounded-lg">
                  No tuples match the query.
                </p>
              )}
            </div>
          ) : (
            <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
              <p className="text-sm text-amber-700 dark:text-amber-400">{result.error}</p>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
