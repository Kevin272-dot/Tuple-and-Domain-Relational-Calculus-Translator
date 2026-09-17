import { useState } from 'react';
import { Play, RotateCcw, Copy, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { translateToSQL } from '../../engine/translator';
import { TranslationResult, TranslationStep, CalculusType } from '../../engine/types';
import { useApp } from '../../context/AppContext';

interface QueryInputProps {
  onResult?: (result: TranslationResult | null) => void;
  externalQuery?: string;
  onQueryChange?: (query: string) => void;
}

export function QueryInput({ onResult, externalQuery, onQueryChange }: QueryInputProps) {
  const { selectedCalculus, setSelectedCalculus, addToHistory } = useApp();
  const [internalQuery, setInternalQuery] = useState('');
  const query = externalQuery !== undefined ? externalQuery : internalQuery;
  const setQuery = onQueryChange || setInternalQuery;
  const [result, setResult] = useState<TranslationResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [showSteps, setShowSteps] = useState(true);

  const handleTranslate = () => {
    if (!query.trim()) return;
    const translationResult = translateToSQL(query);
    setResult(translationResult);
    onResult?.(translationResult);

    if (translationResult.success) {
      addToHistory({
        id: Date.now().toString(),
        timestamp: Date.now(),
        calculusType: selectedCalculus,
        inputQuery: query,
        outputSql: translationResult.sql,
        steps: translationResult.steps,
      });
    }
  };

  const handleCopy = () => {
    if (result?.sql) {
      navigator.clipboard.writeText(result.sql);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleClear = () => {
    setQuery('');
    setResult(null);
    onResult?.(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="flex gap-2">
          <button
            onClick={() => setSelectedCalculus('TRC')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
              selectedCalculus === 'TRC'
                ? 'bg-primary-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            TRC
          </button>
          <button
            onClick={() => setSelectedCalculus('DRC')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
              selectedCalculus === 'DRC'
                ? 'bg-primary-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            DRC
          </button>
        </div>
        <span className="text-sm text-slate-500 dark:text-slate-400">
          {selectedCalculus === 'TRC'
            ? 'Tuple Relational Calculus'
            : 'Domain Relational Calculus'}
        </span>
      </div>

      <div className="relative">
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={
            selectedCalculus === 'TRC'
              ? "{T | T in Students AND T.age > 20}"
              : "{<name, age> | <name, age, dept> in Students AND dept = 'CS'}"
          }
          className="w-full h-32 p-4 font-mono text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none transition-all duration-200"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
              handleTranslate();
            }
          }}
        />
        <div className="absolute bottom-3 right-3 text-xs text-slate-400 dark:text-slate-500">
          Ctrl+Enter to translate
        </div>
      </div>

      <p className="text-xs text-slate-400 dark:text-slate-500">
        You can type text instead of symbols: <code className="font-mono">in</code> or <code className="font-mono">e</code> for ∈, <code className="font-mono">and</code> for ∧, <code className="font-mono">or</code> for ∨, <code className="font-mono">not</code> for ¬, <code className="font-mono">exists</code> for ∃, <code className="font-mono">forall</code> for ∀, <code className="font-mono">implies</code> for →.
      </p>

      <div className="flex gap-2">
        <Button onClick={handleTranslate} disabled={!query.trim()}>
          <Play size={16} className="mr-2" />
          Translate
        </Button>
        <Button variant="secondary" onClick={handleClear}>
          <RotateCcw size={16} className="mr-2" />
          Clear
        </Button>
      </div>

      {result && (
        <Card className="animate-slide-up">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
              Generated SQL
            </h3>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 text-sm text-slate-500 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400 transition-colors"
            >
              {copied ? (
                <>
                  <Check size={14} />
                  Copied
                </>
              ) : (
                <>
                  <Copy size={14} />
                  Copy
                </>
              )}
            </button>
          </div>

          {result.success ? (
            <pre className="p-4 font-mono text-sm bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 whitespace-pre-wrap overflow-x-auto">
              {result.sql}
            </pre>
          ) : (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-700 dark:text-red-400 font-medium">
                Translation Error
              </p>
              <p className="text-sm text-red-600 dark:text-red-300 mt-1">
                {result.error}
              </p>
            </div>
          )}

          {result.steps.length > 0 && (
            <div className="mt-4">
              <button
                onClick={() => setShowSteps(!showSteps)}
                className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                {showSteps ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                Translation Steps ({result.steps.length})
              </button>

              {showSteps && (
                <div className="mt-3 space-y-3">
                  {result.steps.map((step: TranslationStep) => (
                    <div
                      key={step.step}
                      className="flex gap-3 p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700"
                    >
                      <div className="flex-shrink-0 w-6 h-6 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full flex items-center justify-center text-xs font-bold">
                        {step.step}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-slate-700 dark:text-slate-300">
                          {step.description}
                        </p>
                        {step.outputFragment && (
                          <code className="block mt-1 text-xs font-mono text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 px-2 py-1 rounded">
                            {step.outputFragment}
                          </code>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
