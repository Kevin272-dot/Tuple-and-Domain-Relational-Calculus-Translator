import { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Sparkles, Send, Loader2, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';

interface AiExplainerProps {
  query: string;
}

export function AiExplainer({ query }: AiExplainerProps) {
  const [explanation, setExplanation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [difficulty, setDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [expanded, setExpanded] = useState(true);

  const explainQuery = async () => {
    if (!query.trim()) {
      setError('Enter a query above first, then ask for an explanation.');
      return;
    }

    setLoading(true);
    setError('');
    setExplanation('');

    const apiKey = import.meta.env.VITE_GROQ_API_KEY;
    if (!apiKey) {
      setError(
        'No API key found. Create a .env file with VITE_GROQ_API_KEY=your_key_here'
      );
      setLoading(false);
      return;
    }

    const levelInstructions: Record<string, string> = {
      beginner:
        'Assume the reader has never seen relational calculus before. Use everyday analogies. Compare to things they already know (like Excel filters or SQL WHERE clauses). Avoid jargon or define it immediately.',
      intermediate:
        'Assume the reader knows basic SQL and understands what SELECT/WHERE/FROM do. Focus on mapping each TRC/DRC construct to its SQL equivalent.',
      advanced:
        'Assume the reader is comfortable with formal logic. Discuss operator precedence, the equivalence between universal and existential quantifiers, and edge cases in the translation.',
    };

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
              content: `You are a database professor who explains things clearly and concisely. You write like a human, not like a textbook. ${levelInstructions[difficulty]} 

When explaining a TRC or DRC query:
1. Start with a plain English sentence saying what the query does
2. Break down each part (variables, conditions, quantifiers)
3. Show how it maps to SQL
4. Point out any tricky parts (like double negations for universal quantifiers)

Keep it under 200 words. Use short sentences. Be direct.`,
            },
            {
              role: 'user',
              content: `Explain this query:\n\n${query}`,
            },
          ],
          temperature: 0.7,
          max_tokens: 600,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => null);
        throw new Error(errData?.error?.message || `API returned ${response.status}`);
      }

      const data = await response.json();
      setExplanation(data.choices[0]?.message?.content || 'No explanation generated.');
    } catch (err) {
      if (err instanceof Error) {
        if (err.message.includes('401')) {
          setError('Invalid API key. Check your .env file.');
        } else if (err.message.includes('429')) {
          setError('Too many requests. Wait a moment and try again.');
        } else {
          setError(`Error: ${err.message}`);
        }
      } else {
        setError('Something went wrong. Check your connection and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <Sparkles size={18} className="text-amber-500" />
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            Ask AI to Explain
          </h3>
        </div>
        {expanded ? (
          <ChevronUp size={18} className="text-slate-400" />
        ) : (
          <ChevronDown size={18} className="text-slate-400" />
        )}
      </button>

      {expanded && (
        <div className="mt-4 space-y-3">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Pick a difficulty level and the AI will break down your query in plain language.
          </p>

          <div className="flex gap-2">
            {(['beginner', 'intermediate', 'advanced'] as const).map((level) => (
              <button
                key={level}
                onClick={() => setDifficulty(level)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 ${
                  difficulty === level
                    ? 'bg-primary-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </button>
            ))}
          </div>

          <Button
            onClick={explainQuery}
            disabled={loading || !query.trim()}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="mr-2 animate-spin" />
                Thinking...
              </>
            ) : (
              <>
                <Send size={16} className="mr-2" />
                Explain this query
              </>
            )}
          </Button>

          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-2">
              <AlertCircle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
            </div>
          )}

          {explanation && (
            <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 animate-slide-up">
              <div className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                {explanation}
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
