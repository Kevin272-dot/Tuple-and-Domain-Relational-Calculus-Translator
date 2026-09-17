import { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Wrench, Send, Loader2, AlertCircle, CheckCircle } from 'lucide-react';

interface AiErrorCorrectorProps {
  query: string;
}

export function AiErrorCorrector({ query }: AiErrorCorrectorProps) {
  const [correction, setCorrection] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fixQuery = async () => {
    if (!query.trim()) {
      setError('Enter a query above first.');
      return;
    }

    setLoading(true);
    setError('');
    setCorrection('');

    const apiKey = import.meta.env.VITE_GROQ_API_KEY;
    if (!apiKey) {
      setError('No API key found. Create a .env file with VITE_GROQ_API_KEY=your_key_here');
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
              content: `You are a TRC/DRC syntax checker. The user will give you a relational calculus query. Your job:

1. Check if the syntax is valid TRC or DRC
2. If there are errors, list each one clearly
3. Provide the corrected query
4. Briefly explain what was wrong

Common errors to look for:
- Missing curly braces { }
- Missing pipe |
- Wrong operator syntax (∧ vs AND, ∨ vs OR)
- Missing ∈ operator for relation membership
- Incorrect quantifier syntax (∃ and ∀ need parentheses)
- Unclosed parentheses or quotes
- Domain variable format in DRC (should use angle brackets)

Be brief. Format your response like:
ERRORS: (list them)
CORRECTED: (the fixed query)
WHY: (short explanation)`,
            },
            {
              role: 'user',
              content: `Check this query:\n\n${query}`,
            },
          ],
          temperature: 0.3,
          max_tokens: 500,
        }),
      });

      if (!response.ok) {
        throw new Error(`API returned ${response.status}`);
      }

      const data = await response.json();
      setCorrection(data.choices[0]?.message?.content || 'No correction generated.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <div className="flex items-center gap-2 mb-3">
        <Wrench size={18} className="text-amber-500" />
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
          Syntax Checker
        </h3>
      </div>

      <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
        Not sure if your query is correct? The AI will check the syntax and suggest fixes.
      </p>

      <Button
        onClick={fixQuery}
        disabled={loading || !query.trim()}
        variant="secondary"
        className="w-full"
      >
        {loading ? (
          <>
            <Loader2 size={16} className="mr-2 animate-spin" />
            Checking...
          </>
        ) : (
          <>
            <Wrench size={16} className="mr-2" />
            Check my syntax
          </>
        )}
      </Button>

      {error && (
        <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-2">
          <AlertCircle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
        </div>
      )}

      {correction && (
        <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 animate-slide-up">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle size={16} className="text-green-500" />
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Analysis Complete
            </span>
          </div>
          <div className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap font-mono">
            {correction}
          </div>
        </div>
      )}
    </Card>
  );
}
