import { Braces, Info, Variable } from 'lucide-react';

const operators = [
  { symbol: '∧', alt: 'and', name: 'Conjunction', sql: 'AND' },
  { symbol: '∨', alt: 'or', name: 'Disjunction', sql: 'OR' },
  { symbol: '¬', alt: 'not', name: 'Negation', sql: 'NOT' },
  { symbol: '→', alt: 'implies', name: 'Implication', sql: 'NOT ... OR' },
  { symbol: '↔', alt: 'iff', name: 'Biconditional', sql: '=' },
  { symbol: '∀', alt: 'forall', name: 'Universal', sql: 'NOT EXISTS...NOT' },
  { symbol: '∃', alt: 'exists', name: 'Existential', sql: 'EXISTS' },
  { symbol: '∈', alt: 'in / e', name: 'Membership', sql: 'IN / FROM' },
  { symbol: '=', alt: null, name: 'Equality', sql: '=' },
  { symbol: '≠', alt: '!=', name: 'Inequality', sql: '!= or <>' },
  { symbol: '<', alt: null, name: 'Less than', sql: '<' },
  { symbol: '>', alt: null, name: 'Greater than', sql: '>' },
  { symbol: '≤', alt: null, name: 'Less or equal', sql: '<=' },
  { symbol: '≥', alt: null, name: 'Greater or equal', sql: '>=' },
];

export function OperatorReference() {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
        <Braces size={16} />
        Operators
      </div>
      <p className="text-xs text-slate-500 dark:text-slate-400">
        Type the text alternative instead of the symbol. For example: <code className="font-mono">T in Students</code> works the same as <code className="font-mono">T ∈ Students</code>.
      </p>
      <div className="grid grid-cols-2 gap-2">
        {operators.map((op) => (
          <div
            key={op.symbol}
            className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg"
          >
            <span className="text-lg font-bold text-primary-600 dark:text-primary-400 w-8 text-center flex-shrink-0">
              {op.symbol}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-slate-700 dark:text-slate-300">
                {op.name}
              </p>
              <div className="flex items-center gap-1 flex-wrap">
                <code className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                  {op.sql}
                </code>
                {op.alt && (
                  <span className="text-xs text-primary-500 dark:text-primary-400">
                    (or type: {op.alt})
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
