import { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Wrench, Send, Loader2, AlertCircle, CheckCircle, Cpu, Sparkles, Info } from 'lucide-react';
import { parseQuery } from '../../engine/parser';
import { CalculusType } from '../../engine/types';

interface SyntaxCheckerProps {
  query: string;
  calculusType: CalculusType;
}

interface LocalError {
  message: string;
  position?: number;
  line?: number;
  column?: number;
}

function checkSyntaxLocally(query: string, calculusType: CalculusType): { valid: boolean; errors: LocalError[]; ast: unknown | null } {
  const errors: LocalError[] = [];
  const q = query.trim();

  if (!q) {
    errors.push({ message: 'Query is empty. Enter a TRC or DRC query.' });
    return { valid: false, errors, ast: null };
  }

  if (!q.startsWith('{')) {
    errors.push({ message: 'Query must start with { (opening curly brace).' });
  }
  if (!q.endsWith('}')) {
    errors.push({ message: 'Query must end with } (closing curly brace).' });
  }

  const inner = q.slice(1, -1).trim();
  if (!inner.includes('|')) {
    errors.push({ message: 'Missing pipe | separator. Expected format: {variables | condition}' });
  }

  const pipeIndex = inner.indexOf('|');
  if (pipeIndex >= 0) {
    const vars = inner.slice(0, pipeIndex).trim();
    const cond = inner.slice(pipeIndex + 1).trim();

    if (calculusType === 'TRC') {
      if (vars.includes('<') || vars.includes('>')) {
        errors.push({ message: 'TRC uses tuple variables (e.g., T), not angle brackets. Use DRC for <var1, var2> syntax.' });
      }
      if (cond && !vars) {
        errors.push({ message: 'Missing tuple variable before |. Example: {T | T in Students}' });
      }
    }

    if (calculusType === 'DRC') {
      if (!vars.startsWith('<')) {
        errors.push({ message: 'DRC requires angle brackets for domain variables. Example: {<name, age> | ...}' });
      }
      if (vars.startsWith('<') && !vars.endsWith('>')) {
        errors.push({ message: 'Unclosed angle bracket in domain variables. Expected > before the pipe.' });
      }
    }

    const openParens = (q.match(/\(/g) || []).length;
    const closeParens = (q.match(/\)/g) || []).length;
    if (openParens !== closeParens) {
      errors.push({ message: `Mismatched parentheses: ${openParens} opening, ${closeParens} closing.` });
    }

    const openBrackets = (q.match(/</g) || []).length;
    const closeBrackets = (q.match(/>/g) || []).length;
    if (openBrackets !== closeBrackets) {
      errors.push({ message: `Mismatched angle brackets: ${openBrackets} opening, ${closeBrackets} closing.` });
    }

    const badOperators = cond.match(/[∧∨¬→↔∃∀]/g);
    if (badOperators) {
      errors.push({
        message: `Found Unicode symbol(s) "${badOperators.join('')}" — use text alternatives: and, or, not, implies, iff, exists, forall.`
      });
    }

    if (cond.includes("'") && cond.split("'").length % 2 === 0) {
      errors.push({ message: 'Unclosed string literal. Check that all quotes are matched.' });
    }
  }

  // Try parsing
  let ast = null;
  try {
    ast = parseQuery(q);
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Parse error';
    const posMatch = msg.match(/position (\d+)/);
    errors.push({
      message: msg,
      position: posMatch ? parseInt(posMatch[1]) : undefined,
    });
  }

  if (errors.length === 0 && ast) {
    return { valid: true, errors: [], ast };
  }

  return { valid: errors.length === 0, errors, ast };
}

export function SyntaxChecker({ query, calculusType }: SyntaxCheckerProps) {
  const [mode, setMode] = useState<'local' | 'ai'>('local');
  const [localResult, setLocalResult] = useState<ReturnType<typeof checkSyntaxLocally> | null>(null);
  const [aiResult, setAiResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const runLocalCheck = () => {
    if (!query.trim()) {
      setLocalResult({ valid: false, errors: [{ message: 'Enter a query to check.' }], ast: null });
      return;
    }
    const result = checkSyntaxLocally(query, calculusType);
    setLocalResult(result);
    setAiResult('');
  };

  const runAiCheck = async () => {
    if (!query.trim()) {
      setError('Enter a query above first.');
      return;
    }
    setLoading(true);
    setError('');
    setAiResult('');
    setLocalResult(null);

    const apiKey = import.meta.env.VITE_GROQ_API_KEY;
    if (!apiKey) {
      setError('No API key found. Add VITE_GROQ_API_KEY to your .env file, or use the local syntax checker.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'openai/gpt-oss-120b',
          messages: [
            {
              role: 'system',
              content: `You are a TRC/DRC syntax checker. Check if the relational calculus query is valid.

Common errors:
- Missing curly braces { }
- Missing pipe |
- Wrong operator syntax (use text: and, or, not, exists, forall, implies, iff, in)
- Missing in operator for relation membership
- Incorrect quantifier syntax (quantifiers need parentheses)
- Unclosed parentheses or quotes
- Domain variable format in DRC (should use angle brackets < >)

Format your response as:
STATUS: VALID or INVALID
ERRORS: (list each error, or "None" if valid)
CORRECTED: (corrected query, or "N/A" if already valid)
TIP: (brief helpful tip)`,
            },
            { role: 'user', content: `Check this ${calculusType} query:\n\n${query}` },
          ],
          temperature: 0.3,
          max_tokens: 500,
        }),
      });

      if (!response.ok) throw new Error(`API returned ${response.status}`);
      const data = await response.json();
      setAiResult(data.choices[0]?.message?.content || 'No response generated.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Wrench size={18} className="text-amber-500" />
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            Syntax Checker
          </h3>
        </div>
        <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5">
          <button
            onClick={() => setMode('local')}
            className={`flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              mode === 'local'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <Cpu size={12} />
            Local
          </button>
          <button
            onClick={() => setMode('ai')}
            className={`flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              mode === 'ai'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <Sparkles size={12} />
            AI
          </button>
        </div>
      </div>

      {mode === 'local' && (
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
          Instant syntax check using the built-in parser. No API key needed.
        </p>
      )}
      {mode === 'ai' && (
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
          AI-powered deep analysis with suggestions. Requires API key.
        </p>
      )}

      <Button
        onClick={mode === 'local' ? runLocalCheck : runAiCheck}
        disabled={loading || !query.trim()}
        variant={mode === 'ai' ? 'secondary' : 'primary'}
        className="w-full"
      >
        {loading ? (
          <><Loader2 size={16} className="mr-2 animate-spin" /> Checking...</>
        ) : mode === 'local' ? (
          <><Cpu size={16} className="mr-2" /> Check with Parser</>
        ) : (
          <><Sparkles size={16} className="mr-2" /> Check with AI</>
        )}
      </Button>

      {error && (
        <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-2">
          <AlertCircle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
        </div>
      )}

      {localResult && (
        <div className="mt-4 space-y-2">
          {localResult.valid ? (
            <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-start gap-2">
              <CheckCircle size={16} className="text-green-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-green-700 dark:text-green-400">Syntax is valid</p>
                <p className="text-xs text-green-600 dark:text-green-500 mt-1">The query parsed successfully and can be translated.</p>
              </div>
            </div>
          ) : (
            <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle size={16} className="text-amber-500" />
                <p className="text-sm font-medium text-amber-700 dark:text-amber-400">
                  {localResult.errors.length} issue{localResult.errors.length > 1 ? 's' : ''} found
                </p>
              </div>
              <ul className="space-y-1">
                {localResult.errors.map((err, i) => (
                  <li key={i} className="text-xs text-amber-700 dark:text-amber-300 flex items-start gap-1.5">
                    <span className="text-amber-400 mt-0.5">-</span>
                    {err.message}
                    {err.position !== undefined && (
                      <span className="text-amber-500 dark:text-amber-400 ml-1">(at position {err.position})</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="flex items-start gap-1.5 text-xs text-slate-400 dark:text-slate-500">
            <Info size={12} className="mt-0.5 flex-shrink-0" />
            <span>Local checker catches common syntax issues. For deeper analysis, try the AI mode.</span>
          </div>
        </div>
      )}

      {aiResult && (
        <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 animate-slide-up">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle size={16} className="text-green-500" />
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">AI Analysis</span>
          </div>
          <div className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap font-mono">
            {aiResult}
          </div>
        </div>
      )}
    </Card>
  );
}
