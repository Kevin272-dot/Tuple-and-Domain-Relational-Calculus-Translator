import { useState, useMemo } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { ListChecks, CheckCircle, XCircle, Play, ChevronRight, ChevronLeft, AlertCircle } from 'lucide-react';
import { tokenize } from '../../engine/tokenizer';
import { Parser, ParseError } from '../../engine/parser';
import { ASTNode, QueryNode, TupleVariable } from '../../engine/types';
import { evaluateCondition, evaluateQuery, buildDatabase, DatabaseTable, EvaluationResult } from '../../engine/evaluator';
import { useApp } from '../../context/AppContext';

interface LeafCheck {
  expr: string;
  substituted: string;
  passed: boolean;
}

interface TraceRow {
  idx: number;
  row: (string | number)[];
  passed: boolean;
}

interface EvalSuccess {
  ok: true;
  ast: QueryNode;
  table: DatabaseTable;
  tupleVar: string;
  db: Map<string, DatabaseTable>;
  rows: TraceRow[];
  final: EvaluationResult;
}

interface EvalFailure {
  ok: false;
  error: string;
}

type EvalState = EvalSuccess | EvalFailure;

const DEFAULT_QUERY = "{T | T in Students and T.age > 20 and T.dept = 'CS'}";

function findMainRelation(node: ASTNode): string {
  if (node.type === 'Relation') return node.relation;
  if (node.type === 'BinaryOp' || node.type === 'Implication') {
    return findMainRelation(node.left) || findMainRelation(node.right);
  }
  if (node.type === 'UnaryOp') return findMainRelation(node.operand);
  if (node.type === 'Quantifier') return '';
  if (node.type === 'Comparison') {
    return findMainRelation(node.left) || findMainRelation(node.right);
  }
  return '';
}

export function TupleEvaluator() {
  const { userSchema } = useApp();
  const [query, setQuery] = useState(DEFAULT_QUERY);
  const [active, setActive] = useState(false);
  const [error, setError] = useState('');
  const [selectedRow, setSelectedRow] = useState<number | null>(null);
  const [stepMode, setStepMode] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);

  const evaluation = useMemo<EvalState | null>(() => {
    if (!active) return null;
    try {
      const ast: QueryNode = new Parser(tokenize(query.trim())).parse();
      const db = buildDatabase(userSchema);
      const mainRel = findMainRelation(ast.condition);
      const table: DatabaseTable | undefined =
        db.get(mainRel) || db.get(mainRel.toLowerCase()) || db.get(mainRel.toUpperCase());
      if (!table) {
        throw new Error(
          `Main relation "${mainRel}" not found in the schema. Available: ${[...db.keys()].join(', ') || 'none'}.`
        );
      }
      const tupleVar =
        ast.calculusType === 'TRC'
          ? (ast.tupleOrDomain as TupleVariable).name
          : 'T';
      const rows: TraceRow[] = table.rows.map((row, idx) => ({
        idx,
        row,
        passed: evaluateCondition(ast.condition, row, table.columns, db, tupleVar),
      }));
      const final = evaluateQuery(ast, userSchema);
      return { ok: true, ast, table, tupleVar, db, rows, final };
    } catch (e) {
      return {
        ok: false,
        error: e instanceof ParseError
          ? `Parse error at line ${e.line}, column ${e.column}: ${e.message}`
          : e instanceof Error
          ? e.message
          : 'Evaluation failed.',
      };
    }
  }, [active, query, userSchema]);

  const runEvaluate = () => {
    if (!query.trim()) {
      setError('Enter a query first.');
      return;
    }
    setError('');
    setSelectedRow(null);
    setStepMode(false);
    setStepIndex(0);
    setActive(true);
  };

  const leavesFor = (rowIdx: number, ev: EvalSuccess): LeafCheck[] => {
    const { ast, table, tupleVar, db } = ev;
    const row = table.rows[rowIdx];
    const out: LeafCheck[] = [];

    const operandStr = (n: ASTNode, substitute: boolean): string => {
      if (n.type === 'Attribute') {
        if (substitute && n.variable === tupleVar) {
          const i = table.columns.indexOf(n.attribute);
          if (i >= 0) return String(row[i]);
        }
        return `${n.variable}.${n.attribute}`;
      }
      if (n.type === 'Literal') return typeof n.value === 'string' ? `'${n.value}'` : String(n.value);
      if (n.type === 'Variable') {
        if (substitute) {
          const i = table.columns.indexOf(n.name);
          if (i >= 0) return String(row[i]);
        }
        return n.name;
      }
      return '';
    };

    const walk = (n: ASTNode): void => {
      switch (n.type) {
        case 'Comparison':
          out.push({
            expr: `${operandStr(n.left, false)} ${n.operator} ${operandStr(n.right, false)}`,
            substituted: `${operandStr(n.left, true)} ${n.operator} ${operandStr(n.right, true)}`,
            passed: evaluateCondition(n, row, table.columns, db, tupleVar),
          });
          break;
        case 'Quantifier':
          out.push({
            expr: `${n.operator === 'EXISTS' ? 'exists' : 'forall'} ${n.variable}(...)`,
            substituted: `${n.operator === 'EXISTS' ? 'exists' : 'forall'} ${n.variable}(...)`,
            passed: evaluateCondition(n, row, table.columns, db, tupleVar),
          });
          break;
        case 'Implication':
          out.push({
            expr: 'implication (P implies Q)',
            substituted: 'NOT P OR Q',
            passed: evaluateCondition(n, row, table.columns, db, tupleVar),
          });
          break;
        case 'BinaryOp':
          walk(n.left);
          walk(n.right);
          break;
        case 'UnaryOp':
          walk(n.operand);
          break;
        default:
          break;
      }
    };
    walk(ast.condition);
    return out;
  };

  const visibleRows = useMemo(() => {
    if (!evaluation || !evaluation.ok) return [];
    if (!stepMode) return evaluation.rows.map((r) => ({ ...r, state: 'evaluated' as const }));
    return evaluation.rows.map((r, i) => ({
      ...r,
      state: i < stepIndex ? ('evaluated' as const) : i === stepIndex ? ('current' as const) : ('pending' as const),
    }));
  }, [evaluation, stepMode, stepIndex]);

  const ev = evaluation && evaluation.ok ? evaluation : null;
  const failureError = evaluation && !evaluation.ok ? evaluation.error : '';
  const selectedLeaves = selectedRow !== null && ev ? leavesFor(selectedRow, ev) : [];

  return (
    <div className="space-y-4">
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <ListChecks size={20} className="text-emerald-600 dark:text-emerald-400" />
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            Tuple Trace: Watch the Query Test Every Row
          </h3>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
          The query is tested against every tuple of the main relation. Green rows satisfy the
          condition, red rows are rejected. Click any row to see exactly which conditions passed
          or failed for it.
        </p>

        <textarea
          value={query}
          onChange={(e) => { setQuery(e.target.value); setActive(false); setSelectedRow(null); }}
          placeholder="{T | T in Students and T.age > 20}"
          className="w-full h-20 p-3 font-mono text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none mb-3"
        />

        <div className="flex gap-2 flex-wrap">
          <Button onClick={runEvaluate} disabled={!query.trim()}>
            <Play size={16} className="mr-2" />
            Evaluate All Rows
          </Button>
          {ev && (
            <Button
              variant="secondary"
              onClick={() => { setStepMode(!stepMode); setStepIndex(0); setSelectedRow(null); }}
            >
              {stepMode ? 'Show All Rows' : 'Step Through Rows'}
            </Button>
          )}
        </div>

        {(error || failureError) && (
          <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-2">
            <AlertCircle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700 dark:text-red-400">{error || failureError}</p>
          </div>
        )}
      </Card>

      {ev && (
        <>
          <Card>
            <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
              <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Relation: {ev.table.name} ({ev.rows.length} tuples)
              </h4>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {ev.rows.filter((r) => r.passed).length} selected / {ev.rows.length} total
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700">
                    <th className="p-2 text-left text-xs text-slate-400 w-16">Result</th>
                    {ev.table.columns.map((c) => (
                      <th key={c} className="p-2 text-left font-mono text-xs text-slate-500 dark:text-slate-400">
                        {c}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {visibleRows.map(({ idx, row, passed, state }) => {
                    const clickable = state !== 'pending';
                    const isSelected = selectedRow === idx;
                    return (
                      <tr
                        key={idx}
                        onClick={clickable ? () => setSelectedRow(isSelected ? null : idx) : undefined}
                        className={`border-b border-slate-100 dark:border-slate-800 transition-colors ${
                          state === 'pending' ? 'opacity-50 cursor-default' : 'cursor-pointer'
                        } ${
                          isSelected ? 'ring-2 ring-primary-400 dark:ring-primary-600' : ''
                        } ${
                          state !== 'pending' && !isSelected
                            ? passed
                              ? 'bg-green-50 dark:bg-green-900/20'
                              : 'bg-red-50 dark:bg-red-900/20'
                            : ''
                        }`}
                      >
                        <td className="p-2">
                          {state === 'current' && (
                            <span className="text-xs font-medium text-primary-600 dark:text-primary-400">testing...</span>
                          )}
                          {state === 'evaluated' &&
                            (passed ? (
                              <span className="inline-flex items-center gap-1 text-xs text-green-600 dark:text-green-400 font-medium">
                                <CheckCircle size={12} /> selected
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-xs text-red-600 dark:text-red-400 font-medium">
                                <XCircle size={12} /> rejected
                              </span>
                            ))}
                          {state === 'pending' && <span className="text-xs text-slate-400">-</span>}
                        </td>
                        {row.map((cell, i) => (
                          <td key={i} className="p-2 font-mono text-xs text-slate-700 dark:text-slate-300">
                            {String(cell)}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {stepMode && (
              <div className="mt-3 flex items-center gap-2">
                <Button
                  variant="secondary"
                  onClick={() => setStepIndex((i) => Math.max(0, i - 1))}
                  disabled={stepIndex === 0}
                >
                  <ChevronLeft size={16} />
                </Button>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Row {Math.min(stepIndex + 1, ev.rows.length)} of {ev.rows.length}
                </span>
                <Button
                  variant="secondary"
                  onClick={() => setStepIndex((i) => Math.min(ev.rows.length, i + 1))}
                  disabled={stepIndex >= ev.rows.length}
                >
                  <ChevronRight size={16} />
                  Next Row
                </Button>
              </div>
            )}
          </Card>

          {selectedRow !== null && selectedLeaves.length > 0 && (
            <Card className="animate-slide-up">
              <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                Condition breakdown for row {selectedRow + 1}:{' '}
                <span className="font-mono text-xs text-slate-500 dark:text-slate-400">
                  ({ev.table.rows[selectedRow].map((c) => JSON.stringify(c)).join(', ')})
                </span>
              </h4>
              <div className="space-y-2">
                {selectedLeaves.map((leaf, i) => (
                  <div
                    key={i}
                    className={`flex items-center justify-between gap-3 p-3 rounded-lg border text-sm font-mono ${
                      leaf.passed
                        ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                        : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                    }`}
                  >
                    <div className="min-w-0">
                      <span className="text-slate-700 dark:text-slate-300">{leaf.expr}</span>
                      <span className="text-slate-400 dark:text-slate-500"> -&gt; </span>
                      <span className="text-slate-500 dark:text-slate-400">{leaf.substituted}</span>
                    </div>
                    <span
                      className={`flex-shrink-0 text-xs font-bold px-2 py-0.5 rounded-full ${
                        leaf.passed
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
                          : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
                      }`}
                    >
                      {leaf.passed ? 'TRUE' : 'FALSE'}
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-3">
                All conditions are combined with the query's logical operators (and/or/not).
              </p>
            </Card>
          )}

          {ev.final.success && (
            <Card>
              <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                Final Result - {ev.final.rowCount} tuple{ev.final.rowCount === 1 ? '' : 's'}
              </h4>
              {ev.final.rowCount === 0 ? (
                <p className="text-sm text-slate-500 dark:text-slate-400">No tuples match the query.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-700">
                        {ev.final.columns.map((c) => (
                          <th key={c} className="p-2 text-left font-mono text-xs text-slate-500 dark:text-slate-400">
                            {c}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {ev.final.rows.map((row, i) => (
                        <tr key={i} className="border-b border-slate-100 dark:border-slate-800">
                          {row.map((cell, j) => (
                            <td key={j} className="p-2 font-mono text-xs text-slate-700 dark:text-slate-300">
                              {String(cell)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          )}
        </>
      )}
    </div>
  );
}
