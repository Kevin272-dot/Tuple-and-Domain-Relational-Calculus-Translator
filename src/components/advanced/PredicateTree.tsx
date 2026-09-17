import { useState, useMemo } from 'react';
import { Card } from '../ui/Card';
import { GitBranch, ChevronRight, ChevronDown } from 'lucide-react';
import { parseQuery } from '../../engine/parser';
import { ASTNode } from '../../engine/types';
import { generatePredicateTree } from '../../engine/helpers';

interface TreeNode {
  id: number;
  label: string;
  type: string;
  children: TreeNode[];
}

function TreeNodeComponent({ node, depth = 0 }: { node: TreeNode; depth?: number }) {
  const [expanded, setExpanded] = useState(true);
  const hasChildren = node.children.length > 0;

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

  const colorClass = typeColors[node.type] || 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600';

  return (
    <div className="relative">
      <div className="flex items-center gap-1" style={{ paddingLeft: depth * 24 }}>
        {depth > 0 && (
          <div className="absolute left-0 top-0 h-full w-px bg-slate-200 dark:bg-slate-700" style={{ left: (depth - 1) * 24 + 12 }} />
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
            <TreeNodeComponent key={child.id} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export function PredicateTree() {
  const [query, setQuery] = useState('');
  const [tree, setTree] = useState<TreeNode | null>(null);
  const [error, setError] = useState('');

  const buildTree = () => {
    if (!query.trim()) {
      setError('Enter a query to visualize.');
      setTree(null);
      return;
    }
    try {
      const ast = parseQuery(query);
      const root = generatePredicateTree(ast);
      setTree(root);
      setError('');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to parse query');
      setTree(null);
    }
  };

  return (
    <Card>
      <div className="flex items-center gap-2 mb-4">
        <GitBranch size={20} className="text-primary-600 dark:text-primary-400" />
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
          Predicate Tree Diagram
        </h3>
      </div>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
        Visualize the logical structure of your TRC/DRC query as a tree.
      </p>

      <div className="flex gap-2 mb-4">
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="{T | T in Students AND T.age > 20}"
          className="flex-1 h-20 p-3 font-mono text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
        />
      </div>

      <button
        onClick={buildTree}
        disabled={!query.trim()}
        className="w-full px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 rounded-lg transition-colors mb-4"
      >
        <GitBranch size={16} className="inline mr-2" />
        Build Tree
      </button>

      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg mb-4">
          <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
        </div>
      )}

      {tree && (
        <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 overflow-x-auto">
          <TreeNodeComponent node={tree} />
        </div>
      )}
    </Card>
  );
}
