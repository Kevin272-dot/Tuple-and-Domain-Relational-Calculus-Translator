import { useState } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';

interface TreeNode {
  id: number;
  label: string;
  type: string;
  children: TreeNode[];
}

const typeColors: Record<string, string> = {
  Query: 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 border-primary-300 dark:border-primary-700',
  AND: 'bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 border-violet-300 dark:border-violet-700',
  OR: 'bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 border-violet-300 dark:border-violet-700',
  NOT: 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-700',
  IMPLIES: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-700',
  IFF: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-700',
  EXISTS: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700',
  FORALL: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700',
  Comparison: 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 border-cyan-300 dark:border-cyan-700',
  Attribute: 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600',
  Variable: 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600',
  Literal: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 border-orange-300 dark:border-orange-700',
  Relation: 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 border-cyan-300 dark:border-cyan-700',
};

function TreeNodeInner({ node, depth = 0 }: { node: TreeNode; depth?: number }) {
  const [expanded, setExpanded] = useState(true);
  const hasChildren = node.children.length > 0;
  const colorClass = typeColors[node.type] || 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600';

  return (
    <div className="relative">
      <div className="flex items-center gap-1" style={{ paddingLeft: depth * 24 }}>
        {depth > 0 && (
          <div className="absolute top-0 h-full w-px bg-slate-200 dark:bg-slate-700" style={{ left: (depth - 1) * 24 + 12 }} />
        )}
        <button
          onClick={() => hasChildren && setExpanded(!expanded)}
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono rounded-lg border transition-all ${colorClass} ${
            hasChildren ? 'cursor-pointer hover:shadow-sm' : 'cursor-default'
          }`}
        >
          {hasChildren && (
            expanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />
          )}
          <span className="font-semibold">{node.label}</span>
          <span className="text-[10px] opacity-60 ml-1">{node.type}</span>
        </button>
      </div>
      {expanded && hasChildren && (
        <div className="ml-6 mt-1 space-y-1">
          {node.children.map((child) => (
            <TreeNodeInner key={child.id} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export function TreeNodeComponent({ node }: { node: TreeNode }) {
  return (
    <div className="p-2">
      <TreeNodeInner node={node} />
    </div>
  );
}
