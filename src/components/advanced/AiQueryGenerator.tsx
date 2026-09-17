import { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Wand2, Send, Loader2, AlertCircle, Copy, Check, ArrowRight } from 'lucide-react';

export function AiQueryGenerator() {
  const [description, setDescription] = useState('');
  const [generatedQuery, setGeneratedQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const generateQuery = async () => {
    if (!description.trim()) {
      setError('Describe what you want to find.');
      return;
    }

    setLoading(true);
    setError('');
    setGeneratedQuery('');

    const apiKey = import.meta.env.VITE_GROQ_API_KEY;
    if (!apiKey) {
      setError('No API key found. Add VITE_GROQ_API_KEY to your .env file.');
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
              content: `You are a TRC/DRC query generator. Given a natural language description, generate the equivalent Tuple Relational Calculus (TRC) or Domain Relational Calculus (DRC) query.

Assume the following database schema:
- Students(name, age, dept, gpa)
- Enrollment(student, course, grade)
- Enrolls(s, c)
- RequiredCourses(course, credits)

Rules:
- Use text keywords: and, or, not, exists, forall, implies, in
- TRC format: {T | condition} or {T.attr | condition}
- DRC format: {<var1, var2> | condition}
- Always use "in" for relation membership
- Quantifiers need parentheses: exists E(condition)

Return ONLY the query, no explanation.`,
            },
            {
              role: 'user',
              content: description,
            },
          ],
          temperature: 0.3,
          max_tokens: 300,
        }),
      });

      if (!response.ok) throw new Error(`API returned ${response.status}`);
      const data = await response.json();
      setGeneratedQuery(data.choices[0]?.message?.content?.trim() || 'No query generated.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedQuery);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card>
      <div className="flex items-center gap-2 mb-4">
        <Wand2 size={20} className="text-violet-600 dark:text-violet-400" />
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
          AI Query Generator
        </h3>
      </div>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
        Describe what you want in plain English, and the AI will generate the TRC/DRC query for you.
      </p>

      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="e.g., Find all CS students with GPA above 3.5 who are enrolled in DBMS"
        className="w-full h-20 p-3 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none mb-3"
      />

      <Button onClick={generateQuery} disabled={loading || !description.trim()} className="w-full">
        {loading ? (
          <><Loader2 size={16} className="mr-2 animate-spin" /> Generating...</>
        ) : (
          <><Wand2 size={16} className="mr-2" /> Generate Query</>
        )}
      </Button>

      {error && (
        <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-2">
          <AlertCircle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
        </div>
      )}

      {generatedQuery && (
        <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 animate-slide-up">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Generated Query</span>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 text-xs text-slate-500 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400"
            >
              {copied ? <><Check size={12} /> Copied</> : <><Copy size={12} /> Copy</>}
            </button>
          </div>
          <pre className="text-sm font-mono text-slate-800 dark:text-slate-200 whitespace-pre-wrap">
            {generatedQuery}
          </pre>
        </div>
      )}
    </Card>
  );
}
