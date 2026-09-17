import { sampleQueries } from '../../engine/examples';
import { Play, BookOpen } from 'lucide-react';
import { CalculusType } from '../../engine/types';

interface SampleQueriesProps {
  onSelect: (query: string) => void;
  calculusType: CalculusType;
}

export function SampleQueries({ onSelect, calculusType }: SampleQueriesProps) {
  const filtered = sampleQueries.filter((q) => q.calculusType === calculusType);

  const difficultyColors = {
    basic: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    intermediate:
      'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    advanced:
      'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
        <BookOpen size={16} />
        Try These
      </div>
      <p className="text-xs text-slate-500 dark:text-slate-400">
        Click any query to load it into the editor. You can modify it after loading.
      </p>
      <div className="grid gap-2">
        {filtered.map((q) => (
          <button
            key={q.id}
            onClick={() => onSelect(q.query)}
            className="group flex items-start gap-3 p-3 text-left bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-primary-300 dark:hover:border-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/10 transition-all duration-200"
          >
            <Play
              size={14}
              className="flex-shrink-0 mt-0.5 text-slate-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium ${difficultyColors[q.difficulty]}`}
                >
                  {q.difficulty}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">
                {q.description}
              </p>
              <code className="text-xs font-mono text-primary-600 dark:text-primary-400 break-all">
                {q.query}
              </code>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
