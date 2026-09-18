import { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { StepByStep } from '../simulator/StepByStep';
import { TreeNodeComponent } from './PredicateTreeInline';
import {
  Wand2, Send, Loader2, AlertCircle, Copy, Check, ArrowRight,
  Code, Database, Filter, Table, GitBranch, FileCode, Braces,
  ChevronDown, ChevronRight, Sparkles
} from 'lucide-react';
import { tokenize } from '../../engine/tokenizer';
import { parseQuery } from '../../engine/parser';
import { translateToSQL } from '../../engine/translator';
import { generatePredicateTree } from '../../engine/helpers';
import { Token, ASTNode, TranslationResult } from '../../engine/types';

interface PipelineStage {
  id: string;
  label: string;
  icon: React.ReactNode;
  status: 'pending' | 'active' | 'done' | 'error';
  input?: string;
  output?: string;
}

export function AiQueryGenerator() {
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  // Pipeline state
  const [generatedQuery, setGeneratedQuery] = useState('');
  const [tokens, setTokens] = useState<Token[]>([]);
  const [translationResult, setTranslationResult] = useState<TranslationResult | null>(null);
  const [predicateTree, setPredicateTree] = useState<ReturnType<typeof generatePredicateTree> | null>(null);
  const [pipelineStages, setPipelineStages] = useState<PipelineStage[]>([]);
  const [expandedStages, setExpandedStages] = useState<Set<string>>(new Set(['nl', 'query']));
  const [calculusDetected, setCalculusDetected] = useState<'TRC' | 'DRC' | ''>('');
  const [pipelineComplete, setPipelineComplete] = useState(false);

  const toggleStage = (id: string) => {
    setExpandedStages(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const runPipeline = async () => {
    if (!description.trim()) {
      setError('Describe what you want to find.');
      return;
    }

    setLoading(true);
    setError('');
    setGeneratedQuery('');
    setTokens([]);
    setTranslationResult(null);
    setPredicateTree(null);
    setPipelineComplete(false);
    setCalculusDetected('');
    setExpandedStages(new Set(['nl', 'query']));

    const stages: PipelineStage[] = [
      { id: 'nl', label: 'Natural Language Input', icon: <Sparkles size={16} />, status: 'active', input: description },
      { id: 'query', label: 'AI-Generated TRC/DRC Query', icon: <Wand2 size={16} />, status: 'pending' },
      { id: 'tokenize', label: 'Tokenizer (Lexer)', icon: <Code size={16} />, status: 'pending' },
      { id: 'parse', label: 'Parser (AST Construction)', icon: <Braces size={16} />, status: 'pending' },
      { id: 'tree', label: 'Predicate Tree Diagram', icon: <GitBranch size={16} />, status: 'pending' },
      { id: 'translate', label: 'SQL Translation Pipeline', icon: <Database size={16} />, status: 'pending' },
      { id: 'result', label: 'Final SQL Output', icon: <Table size={16} />, status: 'pending' },
    ];
    setPipelineStages(stages);

    // Stage 1: NL -> AI generates query
    const apiKey = import.meta.env.VITE_GROQ_API_KEY;
    if (!apiKey) {
      setError('No API key found. Add VITE_GROQ_API_KEY to your .env file.');
      setLoading(false);
      return;
    }

    let query = '';
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
      query = data.choices[0]?.message?.content?.trim() || '';
      if (!query) throw new Error('No query generated.');

      // Clean up: remove markdown code fences if present
      query = query.replace(/^```[\w]*\n?/gm, '').replace(/```$/gm, '').trim();

      setGeneratedQuery(query);
      setPipelineStages(prev => prev.map(s =>
        s.id === 'nl' ? { ...s, status: 'done' } :
        s.id === 'query' ? { ...s, status: 'done', output: query } :
        s
      ));
      setExpandedStages(prev => new Set([...prev, 'tokenize']));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
      setPipelineStages(prev => prev.map(s =>
        s.id === 'nl' ? { ...s, status: 'done' } :
        s.id === 'query' ? { ...s, status: 'error', output: err instanceof Error ? err.message : 'Failed' } :
        s
      ));
      setLoading(false);
      return;
    }

    // Stage 2: Tokenize
    try {
      const toks = tokenize(query);
      setTokens(toks);
      setPipelineStages(prev => prev.map(s =>
        s.id === 'tokenize' ? { ...s, status: 'done', output: `${toks.length} tokens generated` } : s
      ));
      setExpandedStages(prev => new Set([...prev, 'parse']));
    } catch (err) {
      setPipelineStages(prev => prev.map(s =>
        s.id === 'tokenize' ? { ...s, status: 'error', output: err instanceof Error ? err.message : 'Tokenization failed' } : s
      ));
      setLoading(false);
      return;
    }

    // Stage 3: Parse + detect calculus type
    try {
      const ast = parseQuery(query);
      const detected = ast.calculusType;
      setCalculusDetected(detected);
      setPipelineStages(prev => prev.map(s =>
        s.id === 'parse' ? { ...s, status: 'done', output: `Detected: ${detected} | AST built successfully` } : s
      ));
      setExpandedStages(prev => new Set([...prev, 'tree']));
    } catch (err) {
      setPipelineStages(prev => prev.map(s =>
        s.id === 'parse' ? { ...s, status: 'error', output: err instanceof Error ? err.message : 'Parse failed' } : s
      ));
      setLoading(false);
      return;
    }

    // Stage 4: Predicate Tree
    try {
      const ast = parseQuery(query);
      const tree = generatePredicateTree(ast);
      setPredicateTree(tree);
      setPipelineStages(prev => prev.map(s =>
        s.id === 'tree' ? { ...s, status: 'done', output: 'Predicate tree generated' } : s
      ));
      setExpandedStages(prev => new Set([...prev, 'translate']));
    } catch {
      // Tree generation is best-effort
      setPipelineStages(prev => prev.map(s =>
        s.id === 'tree' ? { ...s, status: 'done', output: 'Skipped (parse error upstream)' } : s
      ));
      setExpandedStages(prev => new Set([...prev, 'translate']));
    }

    // Stage 5: Translate to SQL
    try {
      const result = translateToSQL(query);
      setTranslationResult(result);
      if (result.success) {
        setPipelineStages(prev => prev.map(s =>
          s.id === 'translate' ? { ...s, status: 'done', output: `${result.steps.length} translation steps` } :
          s.id === 'result' ? { ...s, status: 'done', output: result.sql } :
          s
        ));
        setPipelineComplete(true);
      } else {
        setPipelineStages(prev => prev.map(s =>
          s.id === 'translate' ? { ...s, status: 'error', output: result.error || 'Translation failed' } : s
        ));
      }
    } catch (err) {
      setPipelineStages(prev => prev.map(s =>
        s.id === 'translate' ? { ...s, status: 'error', output: err instanceof Error ? err.message : 'Translation failed' } : s
      ));
    }

    setLoading(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(translationResult?.sql || generatedQuery);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStageColor = (status: PipelineStage['status']) => {
    switch (status) {
      case 'done': return 'border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/20';
      case 'active': return 'border-primary-300 dark:border-primary-700 bg-primary-50 dark:bg-primary-900/20';
      case 'error': return 'border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/20';
      default: return 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800';
    }
  };

  const getStageIconColor = (status: PipelineStage['status']) => {
    switch (status) {
      case 'done': return 'text-green-600 dark:text-green-400';
      case 'active': return 'text-primary-600 dark:text-primary-400';
      case 'error': return 'text-red-600 dark:text-red-400';
      default: return 'text-slate-400 dark:text-slate-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Input Card */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <Sparkles size={20} className="text-violet-600 dark:text-violet-400" />
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            Natural Language to SQL Pipeline
          </h3>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
          Describe what you want in plain English. The AI converts it to TRC/DRC, then the full parser pipeline
          tokenizes, parses, builds an AST, visualizes the predicate tree, and translates to SQL.
        </p>

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="e.g., Find all CS students with GPA above 3.5 who are enrolled in DBMS"
          className="w-full h-20 p-3 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none mb-3"
        />

        <Button onClick={runPipeline} disabled={loading || !description.trim()} className="w-full">
          {loading ? (
            <><Loader2 size={16} className="mr-2 animate-spin" /> Processing Pipeline...</>
          ) : (
            <><Wand2 size={16} className="mr-2" /> Run Full Pipeline</>
          )}
        </Button>

        {error && (
          <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-2">
            <AlertCircle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
          </div>
        )}
      </Card>

      {/* Pipeline Visualization */}
      {pipelineStages.length > 0 && (
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <ArrowRight size={20} className="text-primary-600 dark:text-primary-400" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              Pipeline Stages
            </h3>
            {pipelineComplete && (
              <span className="ml-auto text-xs font-medium text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded-full">
                Complete
              </span>
            )}
          </div>

          <div className="space-y-3">
            {pipelineStages.map((stage, index) => (
              <div key={stage.id}>
                <button
                  onClick={() => toggleStage(stage.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all ${getStageColor(stage.status)}`}
                >
                  <div className={`flex-shrink-0 ${getStageIconColor(stage.status)}`}>
                    {stage.icon}
                  </div>
                  <span className="text-sm font-medium text-slate-800 dark:text-slate-200 flex-1 text-left">
                    {stage.label}
                  </span>
                  {stage.status === 'done' && (
                    <Check size={14} className="text-green-500 flex-shrink-0" />
                  )}
                  {stage.status === 'error' && (
                    <AlertCircle size={14} className="text-red-500 flex-shrink-0" />
                  )}
                  {stage.status === 'active' && (
                    <Loader2 size={14} className="text-primary-500 animate-spin flex-shrink-0" />
                  )}
                  {expandedStages.has(stage.id) ?
                    <ChevronDown size={14} className="text-slate-400 flex-shrink-0" /> :
                    <ChevronRight size={14} className="text-slate-400 flex-shrink-0" />
                  }
                </button>

                {expandedStages.has(stage.id) && stage.output && (
                  <div className="mt-2 ml-8 p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 animate-slide-up">
                    {stage.id === 'query' && (
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Generated Query</span>
                          <button
                            onClick={() => { navigator.clipboard.writeText(stage.output || ''); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
                            className="flex items-center gap-1 text-xs text-slate-500 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400"
                          >
                            {copied ? <><Check size={12} /> Copied</> : <><Copy size={12} /> Copy</>}
                          </button>
                        </div>
                        <pre className="text-sm font-mono text-slate-800 dark:text-slate-200 whitespace-pre-wrap">{stage.output}</pre>
                      </div>
                    )}
                    {stage.id === 'tokenize' && tokens.length > 0 && (
                      <div>
                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2 block">
                          {tokens.length} Tokens
                        </span>
                        <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto">
                          {tokens.filter(t => t.type !== 'EOF').map((token, i) => (
                            <span
                              key={i}
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-mono border ${
                                token.type === 'IDENTIFIER' ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300' :
                                token.type === 'STRING_LITERAL' ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300' :
                                token.type === 'NUMBER' ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300' :
                                ['AND','OR','NOT','IMPLIES','IFF','FORALL','EXISTS','IN'].includes(token.type) ? 'bg-violet-50 dark:bg-violet-900/20 border-violet-200 dark:border-violet-800 text-violet-700 dark:text-violet-300' :
                                'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                              }`}
                            >
                              <span className="text-[10px] opacity-50">{token.type}</span>
                              <span>{token.value}</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {stage.id === 'parse' && (
                      <div>
                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 block">{stage.output}</span>
                      </div>
                    )}
                    {stage.id === 'tree' && predicateTree && (
                      <div className="overflow-x-auto">
                        <TreeNodeComponent node={predicateTree} />
                      </div>
                    )}
                    {stage.id === 'translate' && translationResult && translationResult.steps.length > 0 && (
                      <StepByStep steps={translationResult.steps} />
                    )}
                    {stage.id === 'result' && translationResult?.success && (
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-medium text-green-600 dark:text-green-400 uppercase tracking-wide">
                            Final SQL
                          </span>
                          <button
                            onClick={handleCopy}
                            className="flex items-center gap-1 text-xs text-slate-500 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400"
                          >
                            {copied ? <><Check size={12} /> Copied</> : <><Copy size={12} /> Copy SQL</>}
                          </button>
                        </div>
                        <pre className="text-sm font-mono text-green-800 dark:text-green-200 whitespace-pre-wrap bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-200 dark:border-green-800">
                          {translationResult.sql}
                        </pre>
                      </div>
                    )}
                    {stage.id === 'result' && translationResult && !translationResult.success && (
                      <div className="text-sm text-red-600 dark:text-red-400">
                        {translationResult.error}
                      </div>
                    )}
                    {stage.id !== 'query' && stage.id !== 'tokenize' && stage.id !== 'parse' &&
                     stage.id !== 'tree' && stage.id !== 'translate' && stage.id !== 'result' && (
                      <span className="text-xs text-slate-600 dark:text-slate-400">{stage.output}</span>
                    )}
                  </div>
                )}

                {index < pipelineStages.length - 1 && (
                  <div className="flex justify-center my-1">
                    <div className="w-0.5 h-3 bg-slate-200 dark:bg-slate-700" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Quick Examples */}
      {pipelineStages.length === 0 && (
        <Card>
          <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
            Try these examples
          </h4>
          <div className="space-y-2">
            {[
              'Find all CS students with GPA above 3.5',
              'Find students who are enrolled in DBMS course',
              'Find students who take all required courses',
              'Find students who do not take any course',
              'Find names of students who got an A grade',
            ].map((ex) => (
              <button
                key={ex}
                onClick={() => setDescription(ex)}
                className="w-full text-left px-3 py-2 text-sm text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-primary-300 dark:hover:border-primary-600 transition-colors"
              >
                {ex}
              </button>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
