import { useState } from 'react';
import { Card } from '../ui/Card';
import { XCircle, CheckCircle, Lightbulb, Play, AlertTriangle } from 'lucide-react';
import { COMMON_MISTAKES } from '../../engine/constants';
import { translateToSQL } from '../../engine/translator';
import { useApp } from '../../context/AppContext';

export function CommonMistakes() {
  const { setSharedQuery, setActiveTab } = useApp();
  const [previewSql, setPreviewSql] = useState<string>('');

  const tryCorrect = (q: string) => {
    const result = translateToSQL(q);
    setPreviewSql(result.success ? result.sql : result.error || 'Translation failed.');
  };

  const loadIntoSimulator = (q: string) => {
    setSharedQuery(q);
    setActiveTab('simulator');
  };

  return (
    <div className="space-y-4">
      <Card>
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle size={20} className="text-amber-500" />
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            Common Mistakes Gallery
          </h3>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          The mistakes students make most often — see the wrong version, understand why it fails,
          and compare it with the corrected one. Every corrected query runs live.
        </p>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {COMMON_MISTAKES.map((m, i) => (
          <Card key={i}>
            <div className="flex items-start gap-2 mb-3">
              <XCircle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
              <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                {m.mistake}
              </h4>
            </div>

            {('wrongQuery' in m) && m.wrongQuery && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800 mb-2">
                <span className="text-[10px] font-semibold text-red-500 uppercase tracking-wide">
                  Wrong
                </span>
                <code className="block mt-1 text-xs font-mono text-red-700 dark:text-red-300 break-words">
                  {m.wrongQuery}
                </code>
              </div>
            )}

            {('correctQuery' in m) && m.correctQuery && (
              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800 mb-3">
                <span className="text-[10px] font-semibold text-green-600 dark:text-green-500 uppercase tracking-wide">
                  Correct
                </span>
                <code className="block mt-1 text-xs font-mono text-green-700 dark:text-green-300 break-words">
                  {m.correctQuery}
                </code>
              </div>
            )}

            <div className="flex items-start gap-2 mb-3">
              <Lightbulb size={14} className="text-amber-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-slate-600 dark:text-slate-400">
                <strong className="text-slate-700 dark:text-slate-300">Why:</strong> {m.explanation}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {('correctQuery' in m) && m.correctQuery && (
                <button
                  onClick={() => tryCorrect(m.correctQuery as string)}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors"
                >
                  <Play size={12} />
                  Run the correct version
                </button>
              )}
              {('correctQuery' in m) && m.correctQuery && (
                <button
                  onClick={() => loadIntoSimulator(m.correctQuery as string)}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-primary-700 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 hover:bg-primary-100 dark:hover:bg-primary-900/30 rounded-lg transition-colors"
                >
                  <CheckCircle size={12} />
                  Open in Simulator
                </button>
              )}
            </div>
          </Card>
        ))}
      </div>

      {previewSql && (
        <Card className="animate-slide-up">
          <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Live translation result
          </h4>
          <pre className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
            {previewSql}
          </pre>
        </Card>
      )}
    </div>
  );
}
