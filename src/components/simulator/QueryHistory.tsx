import { Clock, Play, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { Card } from '../ui/Card';
import { useApp } from '../../context/AppContext';
import { useState } from 'react';

interface QueryHistoryProps {
  onRerun?: (query: string) => void;
}

export function QueryHistory({ onRerun }: QueryHistoryProps) {
  const { queryHistory, clearHistory } = useApp();
  const [expanded, setExpanded] = useState(true);

  if (queryHistory.length === 0) return null;

  const formatTime = (ts: number) => {
    const d = new Date(ts);
    const now = new Date();
    const diff = now.getTime() - d.getTime();

    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return d.toLocaleDateString();
  };

  return (
    <Card padding="sm">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between mb-2"
      >
        <div className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
          <Clock size={16} />
          Recent Queries ({queryHistory.length})
        </div>
        {expanded ? (
          <ChevronUp size={16} className="text-slate-400" />
        ) : (
          <ChevronDown size={16} className="text-slate-400" />
        )}
      </button>

      {expanded && (
        <div className="space-y-2 mt-2">
          {queryHistory.slice(0, 10).map((entry) => (
            <div
              key={entry.id}
              className="flex items-start gap-2 p-2 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 group"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs px-1.5 py-0.5 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded font-medium">
                    {entry.calculusType}
                  </span>
                  <span className="text-xs text-slate-400 dark:text-slate-500">
                    {formatTime(entry.timestamp)}
                  </span>
                </div>
                <code className="text-xs font-mono text-slate-600 dark:text-slate-400 block truncate">
                  {entry.inputQuery}
                </code>
                <code className="text-xs font-mono text-primary-600 dark:text-primary-400 block truncate mt-1">
                  {entry.outputSql}
                </code>
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => onRerun?.(entry.inputQuery)}
                  className="p-1 text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 rounded"
                  title="Re-run query"
                >
                  <Play size={14} />
                </button>
              </div>
            </div>
          ))}

          {queryHistory.length > 0 && (
            <button
              onClick={clearHistory}
              className="flex items-center gap-1 text-xs text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors mt-2"
            >
              <Trash2 size={12} />
              Clear history
            </button>
          )}
        </div>
      )}
    </Card>
  );
}
