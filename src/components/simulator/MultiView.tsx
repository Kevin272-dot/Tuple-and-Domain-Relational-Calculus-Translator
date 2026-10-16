import { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Layers, Copy, Check, Braces, Database, Sigma, AlertCircle, ChevronDown, ChevronRight } from 'lucide-react';
import { tokenize } from '../../engine/tokenizer';
import { Parser } from '../../engine/parser';
import { translateToSQL } from '../../engine/translator';
import { trcToDrc, drcToTrc, renderTrc, renderDrc, ConversionResult } from '../../engine/trcDrcConverter';
import { generateRelationalAlgebra } from '../../engine/relationalAlgebra';
import { TranslationResult } from '../../engine/types';

interface Panel {
  title: string;
  icon: React.ReactNode;
  accent: string;
  preClass: string;
  content: string;
  error?: string;
}

const EXAMPLES = [
  "{T.name | T in Students and T.age > 20 and T.dept = 'CS'}",
  "{<n> | exists c(<n, c> in Enrolls and c = 'DBMS')}",
  "{T | T in Students and not exists S(S in Students and S.dept = T.dept and S.gpa > T.gpa)}",
  "{<s> | forall c(<s, c> in Enrolls implies <c> in RequiredCourses)}",
];

export function MultiView() {
  const [query, setQuery] = useState(EXAMPLES[0]);
  const [run, setRun] = useState(false);
  const [panels, setPanels] = useState<Panel[]>([]);
  const [conversion, setConversion] = useState<ConversionResult | null>(null);
  const [raNotes, setRaNotes] = useState<string[]>([]);
  const [showConversion, setShowConversion] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [inputError, setInputError] = useState('');

  const handleShowAll = () => {
    if (!query.trim()) {
      setInputError('Enter a TRC or DRC query first.');
      setPanels([]);
      return;
    }
    setInputError('');
    setRun(true);
    setPanels([]);

    let trcText = '';
    let drcText = '';
    let conv: ConversionResult | null = null;
    let detected = '';

    try {
      const ast = new Parser(tokenize(query.trim())).parse();
      detected = ast.calculusType;
      if (detected === 'TRC') {
        trcText = renderTrc(ast);
        conv = trcToDrc(query.trim());
        drcText = conv.success ? conv.output : '';
      } else {
        drcText = renderDrc(ast);
        conv = drcToTrc(query.trim());
        trcText = conv.success ? conv.output : '';
      }
    } catch (e) {
      setInputError(e instanceof Error ? e.message : 'Could not parse the query.');
      return;
    }

    const sqlResult: TranslationResult = translateToSQL(query.trim());
    const raResult = generateRelationalAlgebra(query.trim());

    const built: Panel[] = [
      {
        title: `TRC${detected === 'TRC' ? ' (input)' : ' (converted)'}`,
        icon: <Braces size={16} />,
        accent: 'text-primary-600 dark:text-primary-400',
        preClass: 'bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-800 text-primary-800 dark:text-primary-200',
        content: trcText,
        error: detected === 'DRC' && conv && !conv.success ? conv.error : undefined,
      },
      {
        title: `DRC${detected === 'DRC' ? ' (input)' : ' (converted)'}`,
        icon: <Braces size={16} />,
        accent: 'text-violet-600 dark:text-violet-400',
        preClass: 'bg-violet-50 dark:bg-violet-900/20 border-violet-200 dark:border-violet-800 text-violet-800 dark:text-violet-200',
        content: drcText,
        error: detected === 'TRC' && conv && !conv.success ? conv.error : undefined,
      },
      {
        title: 'SQL',
        icon: <Database size={16} />,
        accent: 'text-emerald-600 dark:text-emerald-400',
        preClass: 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200',
        content: sqlResult.success ? sqlResult.sql : '',
        error: sqlResult.success ? undefined : sqlResult.error,
      },
      {
        title: 'Relational Algebra',
        icon: <Sigma size={16} />,
        accent: 'text-amber-600 dark:text-amber-400',
        preClass: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200',
        content: raResult.success ? raResult.ra : '',
        error: raResult.success ? undefined : raResult.error,
        // notes rendered below the grid
      },
    ];

    setPanels(built);
    setConversion(conv && conv.success ? conv : null);
    setRaNotes(raResult.success ? raResult.notes : []);
    setShowConversion(false);
  };

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="space-y-4">
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <Layers size={20} className="text-primary-600 dark:text-primary-400" />
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            Multi-View: One Query, Four Languages
          </h3>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
          Enter any TRC or DRC query and see it in all four forms at once — Tuple Relational Calculus,
          Domain Relational Calculus, SQL, and Relational Algebra.
        </p>

        <textarea
          value={query}
          onChange={(e) => { setQuery(e.target.value); setRun(false); setPanels([]); }}
          placeholder="{T.name | T in Students and T.age > 20}"
          className="w-full h-24 p-3 font-mono text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none mb-3"
        />

        <div className="flex flex-wrap gap-2 mb-3">
          {EXAMPLES.map((ex, i) => (
            <button
              key={i}
              onClick={() => { setQuery(ex); setRun(false); setPanels([]); }}
              className="px-2.5 py-1 text-xs font-mono bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-primary-300 dark:hover:border-primary-600 transition-colors truncate max-w-xs"
            >
              {ex.length > 42 ? ex.slice(0, 42) + '...' : ex}
            </button>
          ))}
        </div>

        <Button onClick={handleShowAll} disabled={!query.trim()} className="w-full">
          <Layers size={16} className="mr-2" />
          Show All Representations
        </Button>

        {inputError && (
          <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-2">
            <AlertCircle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700 dark:text-red-400">{inputError}</p>
          </div>
        )}
      </Card>

      {panels.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-slide-up">
          {panels.map((panel, idx) => (
            <Card key={panel.title}>
              <div className="flex items-center justify-between mb-3">
                <div className={`flex items-center gap-2 font-semibold text-sm ${panel.accent}`}>
                  {panel.icon}
                  {panel.title}
                </div>
                {panel.content && (
                  <button
                    onClick={() => handleCopy(panel.content, idx)}
                    className="flex items-center gap-1 text-xs text-slate-500 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400"
                  >
                    {copiedIdx === idx ? <><Check size={12} /> Copied</> : <><Copy size={12} /> Copy</>}
                  </button>
                )}
              </div>
              {panel.content ? (
                <pre className={`p-3 rounded-lg border font-mono text-sm whitespace-pre-wrap break-words ${panel.preClass}`}>
                  {panel.content}
                </pre>
              ) : panel.error ? (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-sm text-red-700 dark:text-red-400">{panel.error}</p>
                </div>
              ) : null}
            </Card>
          ))}
        </div>
      )}

      {conversion && conversion.steps.length > 0 && (
        <Card>
          <button
            onClick={() => setShowConversion(!showConversion)}
            className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 w-full"
          >
            {showConversion ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            How the TRC to DRC conversion works ({conversion.steps.length} steps)
          </button>
          {showConversion && (
            <div className="mt-3 space-y-2">
              {conversion.steps.map((step, i) => (
                <div key={i} className="flex gap-3 p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
                  <div className="flex-shrink-0 w-6 h-6 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 rounded-full flex items-center justify-center text-xs font-bold">
                    {i + 1}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{step.title}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-mono break-words">{step.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {run && raNotes.length > 0 && (
        <Card>
          <div className="flex items-center gap-2 mb-2">
            <Sigma size={16} className="text-amber-600 dark:text-amber-400" />
            <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Relational Algebra Notes
            </h4>
          </div>
          <ul className="space-y-1">
            {raNotes.map((note, i) => (
              <li key={i} className="text-xs text-slate-500 dark:text-slate-400 flex items-start gap-2">
                <span className="text-amber-500 mt-0.5">•</span>
                {note}
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}
